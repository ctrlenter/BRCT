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
    //get forge count for the current user
    if(args.length === 0) return message.reply(`Usage: !forge <itemname>`);
    if(args.length >= 1){
        var subcommand = args[1];
        if(subcommand == "list"){
            //todo: list active forges
        }
        else if(subcommand == "add"){
            if(args.length >= 2){
                database.GetDiggy(message.author.id).then(data =>{
                    database.GetActiveForges(message.author.id).then(count => {
                        if(count < data.ForgeSlots){
                            //means there's a space. lets create it!
                            var item = args[2];
                            message.reply(item);
                        }
                    });
                })
            }
        }
    }
}

module.exports.info = {
    name: "forge",
    alias: []
}