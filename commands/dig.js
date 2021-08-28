const Discord = require('discord.js');
const Database = require('../Database');
const cooldown = 1*1000;//a minute in milliseconds
const DepthData = [
    {
        MinDepth: 1, MaxDepth: 9, 
        Blocks: [
            {min: 0, max: 74, block: "Stone"}, 
            {min: 75, max: 100, block: "IronOre"}
        ]
    },
    {
        MinDepth: 10, MaxDepth: 19, 
        Blocks: [
            {min: 0, max: 50, block: "Stone"},
            {min: 51, max: 75, block: "IronOre"},
            {min: 76, max: 100, block: "GoldOre"}
        ]
    }
]

function generateItem(depth){
    var data;
    for(var i = 0; i < DepthData.length; i++){
        var currDepth = DepthData[i];
        var ltCheck = depth <= currDepth.MaxDepth;
        var gtCheck = depth >= currDepth.MinDepth;
        // console.log(`lt: ${ltCheck}`);
        // console.log(`gt: ${gtCheck}`);
        if(ltCheck && gtCheck){
            data = currDepth;
            break;
        }
    }
    var randNum = Math.floor(Math.random() * 100);
    
    for(var i = 0; i < data.Blocks.length; i++){
        var curr = data.Blocks[i];
        if(randNum <= curr.max && randNum >= curr.min){
            console.log(curr.block);
            return curr.block;
        }
    }
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {Array<String>} args 
 * @param {Database} database 
 */
module.exports.run = (message, args, database, client) => {
    database.GetDiggy(message.author.id).then(data => {
        const now = Date.now();
        let millis = now - data.LastDig;
        let seconds = Math.floor(millis / 1000);
        console.log(`Seconds: ${seconds}`);
        console.log(`Milliseconds: ${millis}`);
        if(millis >= cooldown) {
            //TODO: Figure out what depth they're on and eventually generate ores from that
            var inv = database.DecodeInventory(data.Inventory);

            //generate item
            database.GetUser(message.author.id).then(userData => {
                var depth = userData.Depth;
                var item = generateItem(depth);
                console.log(item);

                //generate a 15% change for doubling
                var rand = Math.floor(Math.random() * 100);
                var amount = 1;
                if(rand <= 15){
                    amount = 2;
                }

                inv.AddItem(item, amount);
    
                data.LastDig = Date.now();
                data.increment('TimesDigged', {
                    by: 1,
                })
                data.Inventory = inv.ToBase64();
    
                data.save();
                message.reply(`You dug and found ${amount} piece(s) of ${item} ${client.itemDb.AsEmoji(item)}\nYou got 1 Exp`);
            })

        }else{
            message.reply(`This command is on cooldown.\nPlease wait ${Math.floor(cooldown/1000) - seconds} seconds`);
        }
    })
}