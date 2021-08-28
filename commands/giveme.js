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
    database.GetInventory(message.author.id).then(data => {
        var decoded = database.DecodeInventory(data.Inventory);
        message.reply(`Something: ${decoded}`);
    });
}