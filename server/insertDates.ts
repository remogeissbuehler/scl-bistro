import { Database } from './db/Database'
import { Inscription } from './models/Inscription'

let db = new Database();

let proms: Promise<any>[] = []

db.clientPromise().then(() => {
    for (let i = 0; i < 1000; i++) {
        let date = new Date();
        date.setDate(date.getDate() + i);
        date.setHours(1);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        let newIns = new Inscription({
            date: date,
            lunch: [],
            dinner: []
        });
        proms.push(newIns.save().catch(_ => {}).then(_ => console.log(date)));
        // date.setDate(date.getDate() + 1);    
    }

    Promise.all(proms).then(_ => console.log("all done"));
});
