"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLoose = AddLoose;
exports.CountLooses = CountLooses;
const db_1 = require("../../lib/db");
const users_1 = require("../../lib/models/users");
async function AddLoose(id) {
    await (0, db_1.connectDb)();
    try {
        const user = await users_1.DiscordUser.findOne({
            where: {
                user_id: id,
            },
        });
        if (user) {
            await user.update({
                number_of_looses: user.number_of_looses + 1,
            });
        }
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de la table users:', error);
    }
}
async function CountLooses(id) {
    await (0, db_1.connectDb)();
    try {
        const res = await users_1.DiscordUser.findOne({
            where: {
                user_id: id,
            },
        });
        return res ? res.number_of_looses : 0;
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la table users:', error);
    }
}
