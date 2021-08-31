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
    database.GetDiggy(message.author.id).then(data => {
        message.reply(`Level: ${data.Level}\nExp: ${data.Exp}`);
    });
}

module.exports.info = {
    name: "level",
    alias: ["lvl"]
}