const Discord = require('discord.js')
const Database = require('../Database')

/**
 * 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 * @param {Database} database 
 */
module.exports.run = (message, args, database) => {
    if(args.length === 0) return message.reply("You need to provide the wanted depth.\nUsage: !changeDepth <wanted depth>");
    
    var depth = parseInt(args[0]);
    console.log(depth);

    


    database.GetUser(message.author.id).then(data => {
        data.Depth = parseInt(depth);
        data.save();
        message.reply(`Changed your depth to ${depth}`)
    })
}