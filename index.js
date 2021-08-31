const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        "GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", 
        "GUILD_VOICE_STATES", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS"
    ]
});
const config = require('./config.json');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: "localhost",
    username: "root",
    password: "",
    database: "brct"
})
const fs = require('fs');

const Database = require('./Database');

try{
    sequelize.authenticate();
    console.log('connected to db i think?');
}catch(error){
    console.error(error);
}

Database.InitDataModels(sequelize, Sequelize);

Database.LoadItemDatabase(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
    if(err) return console.error(err);
    files.forEach(file => {
        if(!file.endsWith('.js')) return;
        let props = require(`./commands/${file}`);
        client.commands.set(props.info.name, props);
        props.info.alias.forEach(alias => {
            client.aliases.set(alias, props.info.name)
        })
    })
})


client.once('ready', (client) => {
    console.log('Bot started i think?');
    console.log(`Loaded ${client.itemDb.Size()} items`);
    console.log(client.itemDb.Items);
})

client.on('messageCreate', (message) => {

    if(message.author.bot || message.author.id == client.user.id) return;

    Database.PerformUserCheck(message.author.id).then(value => {
        if(value === 0){
            console.log(value);
            Database.CreateDeepUser(message.author.id);
        }
    })

    if(message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    let cmd;

    if(client.commands.has(command)) cmd = client.commands.get(command);

    else if(client.aliases.has(command)) cmd = client.commands.get(client.aliases.get(command));

    if(!cmd) return;

    if(cmd.run){
        if(cmd.info.ownerOnly){
            console.log('owner only command');
            if(message.author.id !== config.ownerId){
                console.log('not owner!');
                return;
            } 
        }

        cmd.run(message, args, Database, client);
    }

});

client.login(config.token);