import _config from './_config.json'

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
export const config = {
    isProduction: _config.isProduction,
    ...(_config.isProduction ? _config.productionConfig : _config.debugConfig),
    ...(_config.commonConfig)
};

// export const config;