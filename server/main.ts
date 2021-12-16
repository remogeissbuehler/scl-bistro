import express from 'express';
import fs from 'fs';
import { createServer } from 'https';
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

app.use(bodyParser.json());
// app.use(cookieParser(config.misc.cookieSecret));
let cookieStore = MongoStore.create({
    clientPromise: db.clientPromise(),
    dbName: config.db.database
})

app.use(session({
    store: cookieStore,
    secret: config.misc.cookieSecret,
    resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

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

app.get('/', (req, res) => {
    res.send("hello world")
})

httpsServer.listen(config.server.port);