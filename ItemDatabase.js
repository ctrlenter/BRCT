const Database = require('./Database')

class ItemDatabase{
    
    constructor(){
        this.Items = new Map();
    }

    AddItem(name, emojiId, emojiName, worth){
        name = name.toLowerCase();
        if(!this.Items.has(name)){
            this.Items.set(name, {EmojiID: emojiId, EmojiName: emojiName, Worth: worth});
        }
    }

    Size(){
        return this.Items.size;
    }

    /**
     * 
     * @param {Database} database 
     */
    reloadList(database){
        
    }

    AsEmoji(name){
        var emoji = "";
        name = name.toLowerCase();
        if(this.Items.has(name)){
            var data = this.Items.get(name);
            emoji = `<:${data.EmojiName}:${data.EmojiID}>`;
        }
        return emoji;
    }

    Coin(){
        var emoji = "";
        var data = this.Items.get('coin');
        emoji = `<:${data.EmojiName}:${data.EmojiID}>`;
        return emoji;
    }

    GetWorth(name){
        if(this.Items.has(name)){
            return this.Items.get(name).Worth;
        }
        return -1;
    }

    
}

module.exports = ItemDatabase;