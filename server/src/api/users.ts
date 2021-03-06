import { Request, Response, Router } from 'express';
import { CallbackError, HydratedDocument } from 'mongoose';
import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from '../models/User';
import { getUsers } from '../db/UserManagement';
import { assertAuthenticationMiddleware } from './auth';
// import bcrypt from 'bcrypt';

let router = Router();
router.use(assertAuthenticationMiddleware);
router.use((req: any, res: any, next) => {
    if (!req.user?.rights) {
        res.status(403).send("not allowed");
        return;
    }
    if (!req.user.rights.includes("admin")) {
        res.status(403).send("not allowed");
        return;
    }
    next();
});


router.get("/all", async (req, res) => {
    let allUsers = await getUsers();
    // res.statusCode = 200;
    res.send(allUsers);
});

router.patch("/approve", async (req: any, res) => {
    try {
        let dbRes = await User.updateOne(
            { username: req.body.username },
            {
                '$set': {
                    pendingApproval: false
                }
            }
        );
        if (dbRes.modifiedCount == 0) {
            res.status(400).send("nothing updated");
            return;
        }
        res.send("ok");
    } catch (e) {
        console.log(e);
        res.status(500).end();
    }
});

router.patch("/makeAdmin", async (req: Request, res) => {
    User.updateOne(
        { username: req.body.username },
        {
            '$addToSet': { rights: 'admin' }
        }
    ).then(dbRes => {
        if (dbRes.modifiedCount == 0) {
            res.status(400).send("nothing updated");
            return;
        }
        res.send("ok");
    })
});

router.patch("/removeAdmin", async (req: Request, res) => {
    try {
        User.updateOne(
            { username: req.body.username },
            {
                '$pull': { rights: 'admin' }
            }
        ).then(dbRes => {
            if (dbRes.modifiedCount == 0) {
                res.status(400).send("nothing updated");
                return;
            }
            res.send("ok");
        })
    } catch (e) {
        console.log(e)
    }

})

router.delete("/:username", async (req: Request, res: Response) => {
    try {
        let dbRes = await User.deleteOne({ username: req.params.username });
        if (dbRes.deletedCount == 0) {
            res.status(400).send("nothing updated");
            return;
        }
        res.send("ok");
    } catch (e) {
        console.log(e);
        res.status(500).end();
    }
});

export default router;