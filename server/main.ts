import express from 'express';
import { config } from '../config';
import { Database } from './db/Database'
import auth from './api/auth';
import users from './api/users';
import inscriptions from './api/inscriptions';
import passport from 'passport';
import * as bodyParser from 'body-parser';
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
// app.use(bodyParser.urlencoded({ extended: false}));
// app.use(cookieParser(config.misc.cookieSecret));
let cookieStore = MongoStore.create({
    clientPromise: db.clientPromise(),
    dbName: config.db.database
});

app.use(session({
    store: cookieStore,
    secret: config.misc.cookieSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 
        secure: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/app", express.static("../client/build"));
app.get('/', (req, res) => {
    res.redirect("/app");
});

app.use('/auth', auth);
app.use('/users', users);
app.use('/inscriptions', inscriptions);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
