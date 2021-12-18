import _config from './_config.json'
// import dotenv from 'dotenv'
import fs from 'fs';
import path from 'path';

// if (!_config.isProduction) {
//     dotenv.config();
// }

// interface Config {
//     isProduction: boolean,
//     server: { host: string, port: number },
//     client: { host: string, port: number },
//     db: {
//         host: string,
//         port: number, 
//         database: string,
//         user: bistro
//     }
// }

// fs.writeFileSync(path.join(__dirname, "dbCert.pem"), process.env.DB_CERT as string, {});

export const config = {
    isProduction: _config.isProduction,
    ...(_config.isProduction ? _config.productionConfig : _config.debugConfig),
    // ...(_config.commonConfig),
    db: {
        ...(_config.commonConfig.db),
        connectionString: process.env.DB_CONNECTION_STRING as string,
        // cert: path.join(__dirname, "dbCert.pem")
    },
    misc: {
        ...(_config.commonConfig.misc),
        cookieSecret: process.env.COOKIE_SECRET as string
    }
};



// export const config;