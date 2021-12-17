import express from 'express';
import fs from 'fs';
import { createServer } from 'https';
import http from 'http';
import { config } from '../config';
import { Database } from './db/Database'
import { User } from './models/User'
import { Inscription } from './models/Inscription'
import { addUser } from './db/UserManagement';
import path from 'path';
import auth from './api/auth';
import users from './api/users';
import inscriptions from './api/inscriptions';
import cors from 'cors';
import passport from 'passport';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();
const db = new Database();

const httpsServer = createServer({
    key: fs.readFileSync(path.join(__dirname, config.crypto.key)),
    cert: fs.readFileSync(path.join(__dirname, config.crypto.cert))
}, app);

if (config.isProduction) {
    // redirect to https
    app.enable('trust proxy')
    app.use((req, res, next) => {
        req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
    });
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// app.use(cookieParser(config.misc.cookieSecret));
let cookieStore = MongoStore.create({
    clientPromise: db.clientPromise(),
    dbName: config.db.database
})

app.use(session({
    store: cookieStore,
    secret: config.misc.cookieSecret,
    resave: true,
    saveUninitialized: true,
    
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/app", express.static("../client/build"));
// app.use("/static", express.static("../client/build/static"));

app.get('/', (req, res) => {
    res.redirect("/app");
});

app.use('/auth', auth);

/* assert authentication from here on */
// app.use(passport.authenticate());
app.use((req, res, next) => {
    console.log(req.isAuthenticated());
    if (!req.isAuthenticated()) {
        res.status(403).send("you must be logged in;")
        return;
        // console.log(res);
        // res.send("j'pense pas");
        // res.setHeader()
        // res.statusCode = 403;
        // res.send("Must authenticate first");
        // res.end();
    }
    next();
});

app.use('/users', users);
app.use('/inscriptions', inscriptions)



httpsServer.listen(config.server.port);