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
    },
    Gems: {
        type: DataTypes.INTEGER,
        defaultValue: 0
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
    },
    ForgeSlots: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    }
},
{
    tableName: "Diggy"
});

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

module.exports.Forge = sequelize.define('Forge', {
    DiscordID: {
        type: DataTypes.BIGINT,
    },
    StartDate: {
        type: DataTypes.BIGINT,
        defaultValue: Date.now()
    },
    EndDate: {
        type: DataTypes.BIGINT
    },
    Item: {
        type: DataTypes.TEXT
    },
    Cost: {
        type: DataTypes.TEXT
    }
},
{
    updatedAt: false,
    tableName: 'Forge'
})

module.exports.ForgeRecipes = sequelize.define('ForgeRecipe', {
    Item: {
        type: DataTypes.TEXT
    },
    Cost: {
        type: DataTypes.TEXT
    },
    ForgeTime: {
        type: DataTypes.BIGINT
    }
},{
    createdAt: false,
    updatedAt: false
})

module.exports.InitDataModels = (sequelize, Sequelize) => {
    this.User.sync({
        alter: true
    });
    this.Diggy.sync({
        alter: true
    });
    this.ItemDatabase.sync({
        alter: true
    }),
    this.Forge.sync({
        alter: true
    })
    this.ForgeRecipes.sync({
        alter: true
    })
}

module.exports.LoadItemDatabase = (client) =>{
    var itemDb = new ItemDatabase();
    this.ItemDatabase.findAll({
        where: {
            Name: {
                [Op.not]: null
            }
        }
    }).then(data => {
        data.forEach(model => {
            itemDb.AddItem(model.Name, model.EmojiID, model.EmojiName, model.Worth);
        })
    });

    this.ForgeRecipes.findAll({
        where: {
            Item: {
                [Op.not]: null
            }
        }
    }).then(data => {
        data.forEach(model => {
            //TODO: Add and decode the json. Add to the itemdb  
        })
    })
    client.itemDb = itemDb;
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

module.exports.CreateDeepUser = (discordId) => {
    this.CreateUser(discordId);
    this.CreateDiggy(discordId);
}

module.exports.BeginForge = (discordId, item) => {

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

module.exports.AddForceRecipe = (item, cost, forgeTime) => {
    this.ForgeRecipes.create({Item: item, Cost: cost, ForgeTime: forgeTime});
};

module.exports.GetActiveForges = (discordId) => {
    return this.Forge.count({
        where: {
            DiscordID: discordId
        }
    })
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
