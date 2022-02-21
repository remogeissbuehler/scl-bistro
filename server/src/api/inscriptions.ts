import { Router } from 'express';
import { CallbackError, HydratedDocument, isValidObjectId, Mongoose, ObjectId } from 'mongoose';
import { config } from 'common/config';
import { Inscription } from '../models/Inscription';
import { assertAuthenticationMiddleware } from './auth';
import moment from 'moment-timezone';
// import bcrypt from 'bcrypt';

let router = Router();

// make sure all api calls here are authenticated
router.use(assertAuthenticationMiddleware);

router.get("/:from/:to", async (req, res) => {
    // console.log(req.params.from, req.params.to);
    let from = new Date(req.params.from);
    let to = new Date(req.params.to);

    // console.log([from, to]);

    try {
        let query = Inscription.find({ date: { $gte: from, $lte: to } })
            .populate({
                path: 'lunch.user',
                select: "_id fullname username"
            })
            .populate({
                path: 'dinner.user',
                select: "_id fullname username" 
            });
        let inscriptions = await query;
        res.send(inscriptions);
    } catch (e) {
        console.log(e);
        res.status(400).send("check dates");
    }
});

type LunchOrDinner = "lunch" | "dinner";
type LOrDDel = "lunch_del" | "dinner_del";
type AddOrDelete = "add" | "delete";

const DEBUG_DATE = true;
const debug_date_log = (...args: any[]) => {
    if (DEBUG_DATE)
        console.log(...args);
}


async function checkDeadlines(type: AddOrDelete, meal: LunchOrDinner, dateId: string): Promise<boolean> {
    debug_date_log(`Checking deadlines (${type}, ${meal}, ${dateId}`);
    // if (meal === "lunch") {
    //     return true;
    // }

    let today = moment().tz("Europe/Zurich");
    let inscription = await Inscription.findOne( {_id: dateId} );
    if (inscription != null) {
        let deadline = moment.tz(inscription.date, "Europe/Zurich");
        // let deadline = new Date(inscription.date);
        let [h, m] = (type == "add") ? config.deadlines[meal] : config.deadlines[meal + "_del" as LOrDDel];
        deadline.hours(h);
        deadline.minutes(m);
        // deadline.setHours(h);
        // deadline.setMinutes(m);

        debug_date_log(`\tCurrent Date / Time: ${today}`);
        debug_date_log(`\tDeadline: ${deadline}`);
        debug_date_log(`\tcurrent <= deadline?: ${today <= deadline}`);

        return today <= deadline;
    }

    return false;
}

interface AddObj {
    lunch?: { user: ObjectId, time: string }
    dinner?: { user: ObjectId, time: string }
}

router.post("/add", async (req: any, res) => {
    let body = req.body;
    // console.log(req);

    let user_id = req.user._id;

    if (body.meal != "lunch" && body.meal != "dinner") {
        res.status(400).send("bad formatting");
        return;
    }

    let allowed = await checkDeadlines("add", body.meal, body.date_id);

    if (!allowed) {
        console.log(`Too late to add ${body.meal} on ${body.date_id}`);
        res.status(400).send("too late");
        return;
    }

    let meal = body.meal as LunchOrDinner;

    let addObj: AddObj = {}
    addObj[meal] = { user: user_id, time: body.time };

    let delObj: any = {};
    delObj[meal] = {'user': {_id: user_id } };

    await Inscription.updateOne(
        { _id: body.date_id },
        {'$pull': delObj, }
    );
    await Inscription.updateOne(
        { _id: body.date_id },
        { '$push': addObj }
    )

    res.send("ok");
});

router.delete("/:dateId/:meal", async (req: any, res) => {
    // console.log(req);
    let delObj: any = {};
    delObj[req.params.meal] = {
        user: { _id: req.user._id }
    };

    let allowed = await checkDeadlines("delete", req.params.meal, req.params.dateId);

    if (!allowed) {
        console.log(`Too late to delete ${req.params.meal} on ${req.params.dateId}`);
        res.status(400).send("too late");
        return;
    }

    await Inscription.updateOne(
        {_id: req.params.dateId },
        {
            '$pull': delObj
        }
    );

    res.send("ok");
})

export default router;