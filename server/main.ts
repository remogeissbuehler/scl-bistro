import express, { NextFunction, Request, Response } from 'express';
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

// const httpsServer = createServer({
//     key: fs.readFileSync(path.join(__dirname, config.crypto.key)),
//     cert: fs.readFileSync(path.join(__dirname, config.crypto.cert)),
//     ca: config.crypto.ca == null ? undefined : fs.readFileSync(path.join(__dirname, config.crypto.ca))
// }, app);

app.use((req, res, next) => {
    console.log(`${req.method}: ${req.url} from ${req.socket.remoteAddress}`);
    next();
});


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
app.use('/users', users);
app.use('/inscriptions', inscriptions)

// httpsServer.listen(config.server.port, () => {
//     console.log(`https listening on port ${config.server.port}`);
// });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

// if (config.isProduction) {
//     // redirect to https
//     let redirect = express();
//     redirect.use((req, res, next) => {
//     	console.log("Got request to redirect");
//         let splitHost = req.headers.host?.split(':');
//         let host: string | undefined = undefined;
//         if (splitHost && splitHost.length > 1) {
//             host = splitHost.slice(0, splitHost.length-1).join("");
//         } else if (splitHost) {
//             host = splitHost?.join("");
//         }
//         res.redirect('https://' + host + req.url);
//     });
//     redirect.listen(config.server.httpPort, () => {
//         console.log(`App also listening on port ${config.server.httpPort} for redirection`);
//     });
// }
