const Discord = require('discord.js');
const Database = require('../Database');

/**
 * 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 * @param {Database} database 
 */
module.exports.run = (message, args, database, client) => {
    database.GetDiggy(message.author.id).then(data => {
        var inventory = database.DecodeInventory(data.Inventory);
 
        var msg = "";
        inventory.Items.forEach((count, name) => {
            msg += `${name} x${count} ${client.itemDb.AsEmoji(name)}\n`;
        });

        message.reply(`Your inventory:\n${msg}`);
    })
}

module.exports.info = {
    name: "inventory",
    alias: ["inv"]
}