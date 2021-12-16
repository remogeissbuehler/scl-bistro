import { Handler, Request, Router } from 'express';
import { CallbackError, HydratedDocument } from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';
// import cors from '/';

let router = Router();


passport.serializeUser((user: any, done) => {
    // console.log(user._id);
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err: any, user: any) => done(err, user));
});

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, async (err: CallbackError, user: HydratedDocument<IUser>) => {
        if (err) { return done(err); }
        if (!user) return done(null, false, { message: "Incorrect Username" });

        let cmp = await bcrypt.compare(password, user.hash); 
        // console.log(cmp);
        if (cmp === true) {
            return done(null, user);
        }

        return done(null, false, { message: "Incorrect password" });
        
    });
}));


router.post("/login", passport.authenticate('local', {
    'failureMessage': "invalid login"
}), (req, res) => {
    let _user = req.user as HydratedDocument<IUser>;
    
    let user = {
        _id: _user._id,
        username: _user.username,
        fullname: _user.fullname,

    }
    res.send(user);
});

router.get("/login", (req, res) => {
    res.send( JSON.stringify({ loggedIn: req.isAuthenticated() }) );
});

router.get("/logout", (req, res) => {
    req.logOut();
    res.send("logged out");
})

export default router;