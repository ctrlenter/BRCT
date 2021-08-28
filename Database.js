const { Sequelize, DataTypes, Op, INTEGER } = require('sequelize');
const Inventory = require('./Inventory');
const ItemDatabase = require('./ItemDatabase');

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: "localhost",
    username: "root",
    password: "",
    database: "brct"
})

module.exports.User = sequelize.define('User', {
    DiscordID: {
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    Depth: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    Coins: {
        type: INTEGER,
        defaultValue: 100
    }
});

module.exports.Diggy = sequelize.define('Diggy', {
    DiscordID: {
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    LastDig: {
        type: DataTypes.BIGINT
    },
    Level: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    Exp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    TimesDigged: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    Inventory: {
        type: DataTypes.TEXT
    }

},
{
    tableName: "Diggy"
});

module.exports.Forge = sequelize.define('Forge', {
    DiscordID: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    Slot1: {
        type: DataTypes.BIGINT,
    },
    Slot1DoneTime: {
        type: DataTypes.BIGINT,
    }
})

module.exports.ItemDatabase = sequelize.define('ItemDatabase', {
    Name: {
        type: DataTypes.TEXT
    },
    EmojiID: {
        type: DataTypes.BIGINT
    },
    EmojiName: {
        type: DataTypes.TEXT
    },
    Worth: {
        type: DataTypes.INTEGER
    }
},
{
    tableName: 'ItemDatabase',
    createdAt: false,
    updatedAt: false
})

module.exports.LoadItemDatabase = (client) =>{
    this.ItemDatabase.findAll({
        where: {
            Name: {
                [Op.not]: null
            }
        }
    }).then(data => {
        var itemDb = new ItemDatabase();
        data.forEach(model => {
            itemDb.AddItem(model.Name, model.EmojiID, model.EmojiName, model.Worth);
        })
        client.itemDb = itemDb;
    });
}

module.exports.GetInventory = (discordId) => {
    return this.Diggy.findOne({
        attributes: ['Inventory'],
        where: {
            DiscordID: discordId
        }
    });
}

module.exports.GetMaxDepth = (discordId) => {
    return 10; //TODO: figure out best way to get max depth
}

module.exports.AddCoins = (discordId, amount) => {
    this.User.findOne({
        where: {
            DiscordID: discordId
        }
    }).then(data => {
        data.Coins += amount;
        data.save();
    })
}

module.exports.InitDataModels = (sequelize, Sequelize) => {
    this.User.sync({
        alter: true
    });
    this.Diggy.sync({
        alter: true
    });
    this.ItemDatabase.sync({
        alter: true
    })
}

module.exports.CreateDeepUser = (discordId) => {
    this.CreateUser(discordId);
    this.CreateDiggy(discordId);
}

module.exports.CreateUser = (discordId) => {
    this.User.create({DiscordID: discordId});
}

module.exports.AddItem = (itemName, emojiId, emojiName) => {
    //todo: ADD
    this.ItemDatabase.create({Name: itemName, EmojiID: emojiId, EmojiName: emojiName});

}

module.exports.InventoryToBase64 = (inventory) => {
    var json = JSON.stringify(inventory);
    var b64 = Buffer.from(json).toString('base64');
    return b64;
}

module.exports.DecodeInventory = (inventory) => {

    var inv = new Inventory();
    var decoded = Buffer.from(inventory, 'base64').toString('ascii');
    
    decoded = JSON.parse(decoded);

    // console.log(decoded);

    for(var i = 0; i < decoded.length; i++){
        // console.log(decoded[i]);
        inv.AddItem(decoded[i].Name, decoded[i].Count);
    }

    return inv;
}

/**
 * 
 * @param {Number} discordId 
 * @param {String} inventory 
 */
module.exports.SaveInventory = (discordId, inventory) => {
    this.GetDiggy(discordId).then(data => {
        data.Inventory = inventory;
        data.save();
    });
}

module.exports.CreateDiggy = (discordId) => {
    this.Diggy.create({DiscordID: discordId, LastDig: Date.now(), Level: 1,Exp: 0, Inventory: ""});
}

/**
 * 
 * @param {*} discordId 
 * @returns {Diggy}
 */
module.exports.GetDiggy = (discordId) => {

    this.Diggy.count({where: {DiscordID: discordId}}).then(value => {
        if(value === 0) this.CreateDiggy(discordId);
    })

    return this.Diggy.findOne({
        where: {
            DiscordID: discordId
        }
    })
}

module.exports.GetUser = (discordId) => {
    this.PerformUserCheck(discordId).then(value => {
        if(value === 0) this.CreateUser(discordId);
    })

    return this.User.findOne({
        where: {
            DiscordID: discordId
        }
    })
}

module.exports.PerformUserCheck = (discordId) => {
    return this.User.count({
        where: {
            DiscordID: discordId
        }
    })
}
