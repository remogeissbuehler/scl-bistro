import _config from './_config.json'
// import dotenv from 'dotenv'
import fs from 'fs';
import path from 'path';

export const config = {
    isProduction: _config.isProduction,
    ...(_config.isProduction ? _config.productionConfig : _config.debugConfig),
    // ...(_config.commonConfig),
    db: {
        ...(_config.commonConfig.db),
        connectionString: fs.readFileSync(path.join(__dirname, "server", "crypto", "dbConnString.txt")).toString()
        // cert: path.join(__dirname, "dbCert.pem")
    },
    misc: {
        ...(_config.commonConfig.misc),
        cookieSecret: fs.readFileSync(path.join(__dirname, "server", "crypto", "cookieSecret.txt")).toString()
    },
    deadlines: _config.commonConfig.deadlines
};



// export const config;