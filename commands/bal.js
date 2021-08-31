const Discord = require('discord.js');
const Database = require('../Database');

/**
 * 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 * @param {Database} database 
 * @param {Discord.Client} client 
 */
module.exports.run = (message, args, database, client) => {
    database.GetUser(message.author.id).then(data => {
        var msg = "";
        msg += `You have \`${data.Coins}\` coins ${client.itemDb.Coin()}\n`;
        msg += `You have \`${data.Gems}\` gems\n`
        message.reply(msg);
    });
}

module.exports.info = {
    name: "balance",
    alias: ["bal"]
}