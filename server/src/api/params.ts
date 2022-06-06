import { Router } from 'express';
import mongoose from 'mongoose';
import { assertAuthenticationMiddleware } from './auth';
import moment from 'moment-timezone';

let router = Router();

// make sure all api calls here are authenticated
router.use(assertAuthenticationMiddleware);

router.get("/:type/:param", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        let params = await db.collection('params').findOne({ 'type': req.params.type });
        if (params === null) {
            res.status(404).end("{}");
            return;
        }
        let param = params[req.params.param];
        if (param === null || param === undefined) {
            res.status(404).end("{}");
            return;
        }
        res.charset = 'UTF-8';
        res.status(200).end(param);
    } catch (e) {
        console.log(e);
        res.status(500).end("ERROR");
        return;
    };
});


export default router;