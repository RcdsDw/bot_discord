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
exports.DiscordGuild = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const users_1 = require("./users");
let DiscordGuild = class DiscordGuild extends sequelize_typescript_1.Model {
    guild_id;
    name;
    avatar;
    discordUsers;
};
exports.DiscordGuild = DiscordGuild;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], DiscordGuild.prototype, "guild_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DiscordGuild.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.STRING),
    __metadata("design:type", String)
], DiscordGuild.prototype, "avatar", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => users_1.DiscordUser, 'guild_user', 'guild_id', 'user_id'),
    __metadata("design:type", Array)
], DiscordGuild.prototype, "discordUsers", void 0);
exports.DiscordGuild = DiscordGuild = __decorate([
    sequelize_typescript_1.Table
], DiscordGuild);
