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
    
    let recipeType = args[0];
    if(recipeType === 'forge'){
        //get 
    }

}

module.exports.info = {
    name: "addrecipe",
    ownerOnly: true,
    alias: []
}