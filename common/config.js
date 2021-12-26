"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const _config_json_1 = __importDefault(require("./_config.json"));
// import dotenv from 'dotenv'
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.config = Object.assign(Object.assign({ isProduction: _config_json_1.default.isProduction }, (_config_json_1.default.isProduction ? _config_json_1.default.productionConfig : _config_json_1.default.debugConfig)), { 
    // ...(_config.commonConfig),
    db: Object.assign(Object.assign({}, (_config_json_1.default.commonConfig.db)), { connectionString: fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "server", "crypto", "dbConnString.txt")).toString() }), misc: Object.assign(Object.assign({}, (_config_json_1.default.commonConfig.misc)), { cookieSecret: fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "server", "crypto", "cookieSecret.txt")).toString() }), deadlines: _config_json_1.default.commonConfig.deadlines });
// export const config;
