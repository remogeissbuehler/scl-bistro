import { Database } from '../db/Database'
import { Inscription } from '../models/Inscription'

let db = new Database();

let proms: Promise<any>[] = []

db.clientPromise().then(() => {
    
    Inscription.find({}).then((inscriptions) => {
        inscriptions.forEach(insc => {
            proms.push(insc.updateOne({
                '$set': { lunch: [] }
            }).then(_ => console.log(`added lunch`)));
            if (insc.date.getDay() == 0 || insc.date.getDay() == 6) {
               proms.push(insc.updateOne({
                   '$set': { noLunch: false }
               }).then(_ => console.log("WE removed lunch"))) 
            } else {
                proms.push(insc.updateOne({
                    '$set': { noLunch: true }
                }).then(_ => console.log("removed on weekdays")))
            }
        })
    })

    Promise.all(proms).then(_ => console.log("all done"));
});
