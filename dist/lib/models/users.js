"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordUser = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const guilds_1 = require("./guilds");
let DiscordUser = class DiscordUser extends sequelize_typescript_1.Model {
    user_id;
    global_name;
    avatar;
    number_of_looses;
    discordGuilds;
};
exports.DiscordUser = DiscordUser;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], DiscordUser.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DiscordUser.prototype, "global_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DiscordUser.prototype, "avatar", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        defaultValue: 0,
    }),
    __metadata("design:type", Number)
], DiscordUser.prototype, "number_of_looses", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => guilds_1.DiscordGuild, 'guild_user', 'user_id', 'guild_id'),
    __metadata("design:type", Array)
], DiscordUser.prototype, "discordGuilds", void 0);
exports.DiscordUser = DiscordUser = __decorate([
    sequelize_typescript_1.Table
], DiscordUser);
