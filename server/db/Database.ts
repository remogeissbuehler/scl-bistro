import mongoose from 'mongoose';
import { config } from '../../config';


export class Database {
    static connectionURI = `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`
    connection: Promise<mongoose.Connection>;

    constructor() {
        this.connection = this.connect();
    }

    async connect(): Promise<mongoose.Connection> {
        // console.log(Database.connectionURI);
        let connPromise = mongoose.connect(Database.connectionURI).then(m => {
            let conn = m.connection;
            conn.on("error", console.error.bind(console, "MongoDB connection error:"));

            return conn;
        });
        
        return connPromise;
    }

    async clientPromise() {
        return await this.connection.then(c => c.getClient());
    }
}

// export default Database;