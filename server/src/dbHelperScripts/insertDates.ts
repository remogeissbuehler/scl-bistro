import { Database } from '../db/Database'
import { Inscription } from '../models/Inscription'
import process from 'process';

let db = new Database();

let proms: Promise<any>[] = []

const startDate = "2022-06-20"

const isWeekend = (day: Number) => day == 0 || day == 6

db.clientPromise().then(() => {
    for (let i = 0; i < 1000; i++) {
        let date = new Date(startDate);
        date.setDate(date.getDate() + i);
        date.setHours(12);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        let newIns = new Inscription({
            date: date,
            lunch: [],
            dinner: [],
            noLunch: !isWeekend(date.getDay())
        });
        proms.push(newIns.save().catch(_ => {}).then(_ => {
            console.log(date.toString() + " " + !isWeekend(date.getDay()));
        }
            ));
        // date.setDate(date.getDate() + 1);    
    }

    Promise.all(proms).then(_ => {
        console.log("all done");
        process.exit();
    });
});

// 0 Sunday
// 1 Mon
// 2 Tues
// 3 Wed
// 4 Thurs
// 5 Fri
// 6 Sat
