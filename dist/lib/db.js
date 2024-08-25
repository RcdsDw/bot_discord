"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv = __importStar(require("dotenv"));
const guilds_1 = require("./models/guilds");
const users_1 = require("./models/users");
dotenv.config();
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    throw new Error('DATABASE_URL not set');
}
exports.sequelize = new sequelize_typescript_1.Sequelize(dbUrl, {
    models: [guilds_1.DiscordGuild, users_1.DiscordUser],
});
const connectDb = async () => {
    try {
        await exports.sequelize.authenticate();
        console.log('Authentifié avec la base de données');
        await exports.sequelize.sync({ alter: true });
        console.log('Base de données synchronisée');
    }
    catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
        throw error;
    }
};
exports.connectDb = connectDb;
