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
    var id = message.author.id;
    if(args.length === 0) return message.reply(`Usage: !forge <list:add> <itemname>`);
    if(args.length >= 1){
        var subcommand = args[0];
        console.log(`Length: ${args.length}`);
        console.log(`sub command: ${subcommand}`)
        if(subcommand == "list"){
            //todo: list active forges
        }
        else if(subcommand == "add"){
            database.GetDiggy(id).then(data => {
                database.GetActiveForges(id).then(forgeCount => {
                    if(forgeCount < data.ForgeSlots){
                        //Hooray! We have space
                        var item = args[1];
                        message.reply(`Hooray! We have space for ${item}`);
                    }
                });
            })
        }
    }
}

module.exports.info = {
    name: "forge",
    alias: []
}