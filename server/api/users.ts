import { Router } from 'express';
import { CallbackError, HydratedDocument } from 'mongoose';
import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from '../models/User';
import { getUsers }from '../db/UserManagement';
// import bcrypt from 'bcrypt';

let router = Router()


router.get("/all", async (req, res) => {
    let allUsers = await getUsers();
    // res.statusCode = 200;
    res.send(allUsers);
});

export default router;