const Discord = require('discord.js');
const Database = require('../Database')

/**
 * 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 * @param {Database} database 
 */
module.exports.run = (message, args, database) => {
    database.GetDiggy(message.author.id).then(data => {
        message.reply(`Level: ${data.Level}\nExp: ${data.Exp}/100\nTimes digged: ${data.TimesDigged}`);
    })
}

module.exports.info = {
    name: "stats",
    alias: ["stat"]
}