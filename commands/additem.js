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

    if(args.length === 0) return message.reply("Not enough arguments passed");

    var name = args[0];
    var emojiId = args[1];
    var emojiName = args[2];
    var worth = parseInt(args[3]);

    client.itemDb.Items.clear();
    database.AddItem(name, emojiId, emojiName, worth);
    database.LoadItemDatabase(client);

    message.reply(`Added Item ${name}, worth ${worth} to the list with emoji <:${name}:${emojiId}>`);

}