import { privateEncrypt } from 'crypto';
import mongoose from 'mongoose';
import { config } from '../../config';


export class Database {
    // static connectionURI = `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`
    static connectionURI = config.db.connectionString;
    static credentials = config.db.cert;
    connection: Promise<mongoose.Connection>;

    constructor() {
        this.connection = this.connect();
    }

    async connect(): Promise<mongoose.Connection> {
        // console.log(Database.connectionURI);
        let connPromise = mongoose.connect(Database.connectionURI, {
            sslKey: Database.credentials,
            sslCert: Database.credentials,
            
        }).then(m => {
            let conn = m.connection;
            conn.on("error", console.error.bind(console, "MongoDB connection error:"));

            // conn.getClient().db("bistro").collections().then(console.log);

            return conn;
        });
        
        return connPromise;
    }

    async clientPromise() {
        return await this.connection.then(c => c.getClient());
    }
}

// export default Database;