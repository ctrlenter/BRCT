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
    if(args.length === 0) return message.reply("todo: some message to help a person?");

    if(args.length >= 2){
        var item = args[0];
        var amount = parseInt(args[1]);
        database.GetInventory(message.author.id).then(data => {
            console.log(data.Inventory);
            var inv = database.DecodeInventory(data.Inventory);
            if(inv.ContainsAmount(item, amount)){
                //Sell?
                var worth = client.itemDb.GetWorth(item);
                if(worth != -1){
                    //means it was found.
                    //add coins
                    database.AddCoins(message.author.id, worth * amount);
                    inv.TakeItem(item, amount);
                    inv.Save(message.author.id, database);
                    message.reply(`You sold ${amount} Stone ${client.itemDb.AsEmoji(item)} for ${worth * amount}`)
                }
            }
            else {
                message.reply(`You do not have ${amount} of ${item}`);
            }
        });
    }

}