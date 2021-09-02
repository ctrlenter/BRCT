const Discord = require('discord.js');
const Database = require('../Database');
/*
possible recipes:
- forge

*/

/**
 * 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 * @param {Database} database 
 * @param {Discord.Client} client 
 */
module.exports.run = (message, args, database, client) => {
    if(args.length === 0)
        return message.reply(`Wrong length of arguments.\nUsage: !addrecipe <type> [...args]`);
    
    if(args.length >= 4){
        let recipeType = args[0];
        if(recipeType === 'forge'){
            var item = args[1]; // in json
            var cost = args[2]; // in json
            var forgeTime = args[3]; // the seconds it takes to forge something
            database.AddForceRecipe(item, cost, forgeTime);
            message.reply('Should have added recipe?');
        }
    }

}

module.exports.info = {
    name: "addrecipe",
    ownerOnly: true,
    alias: []
}