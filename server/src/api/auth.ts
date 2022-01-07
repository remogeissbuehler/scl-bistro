import { Handler, NextFunction, Request, Response, Router } from 'express';
import { CallbackError, HydratedDocument } from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';
import path from 'path';
import { addUser, updatePassword } from '../db/UserManagement';
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
        // console.log(err, user);
        if (err) { return done(err); }
        if (!user) return done(null, false, { message: "Incorrect Username" });

        // if (user.pendingApproval) return done(null, false, { message: "pending approval" });

        let cmp = await bcrypt.compare(password, user.hash); 
        // console.log(cmp);
        if (cmp === true) {
            return done(null, user);
        }

        return done(null, false, { message: "Incorrect password" });
        
    });
}));

router.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        // console.log(info);
        if (err) { return next(err); }
        if (!user) { return res.status(401).end(); }
        if (user.pendingApproval) {
            req.logOut();
            return res.status(403).send("pending approval") ;
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return next();
        });
      })(req, res, next);
})


router.post("/login", passport.authenticate('local', {
    'failureMessage': "invalid login"
}), (req, res) => {
    let _user = req.user as HydratedDocument<IUser>;
    let isAdmin = _user.rights?.includes("admin");
    
    let user = {
        _id: _user._id,
        username: _user.username,
        fullname: _user.fullname,
        admin: isAdmin
    }
    res.send(user);
});

router.get("/login", (req, res) => {
    res.send( JSON.stringify({ loggedIn: req.isAuthenticated() }) );
});

router.get("/logout", (req, res) => {
    req.logOut();
    res.send("logged out");
});

// router.get("/signup", (req, res) => {
//     res.sendFile(path.join(__dirname, "signup.html"));
// });

function notAuthorized(req: any, res: any) {
    res.status(403);
    res.send("not allowed");
    return;
}

router.post("/signup", async (req: any, res) => {
    try {
        await addUser(req.body.username, req.body.password, req.body.name, true);
    } catch (e) {
        console.log(e);
        res.status(400).end();
        return;
    }
    
    res.send("ok");
});

router.use("/chpwd", assertAuthenticationMiddleware);
router.post("/chpwd", async (req: any, res) => {
    
    if (req.user.username != req.body.username) {
        res.status(403).send("not allowed");
    }
    try {
        updatePassword(req.body.username, req.body.password);
        res.send("ok");
    } catch (e: any) {
        if (e.message && e.message == "no update")
            res.status(400).end();
        res.status(500).end();
    }
});

export function assertAuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
        res.status(403).send("you must be logged in;")
        return;
    }
    next();
}

export default router;