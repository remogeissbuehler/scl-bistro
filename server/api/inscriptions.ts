import { Router } from 'express';
import { CallbackError, HydratedDocument, isValidObjectId, Mongoose, ObjectId } from 'mongoose';
import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from '../models/User';
import { getUsers } from '../db/UserManagement';
import { Inscription } from '../models/Inscription';
import mongoose from 'mongoose';
import { assertAuthenticationMiddleware } from './auth';
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
            })
        let inscriptions = await query;
        res.send(inscriptions);
    } catch (e) {
        console.log(e);
        res.status(400).send("check dates");
    }
});

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

    type LunchOrDinner = "lunch" | "dinner";
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
    console.log(req);
    let delObj: any = {};
    delObj[req.params.meal] = {
        user: { _id: req.user._id }
    };

    await Inscription.updateOne(
        {_id: req.params.dateId },
        {
            '$pull': delObj
        }
    );

    res.send("ok");
})

export default router;