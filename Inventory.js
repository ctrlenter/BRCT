class Inventory{
    
    constructor(){
        this.Items = new Map();
    }

    AddItem(itemName, count){
        if(!this.Items.has(itemName)){
            this.Items.set(itemName, count);
        }else{
            var currentVal = this.Items.get(itemName);
            currentVal += count;
            this.Items.set(itemName, currentVal);
        }
    }

    TakeItem(itemName, count){
        if(this.Items.has(itemName)){
            var newVal = this.Items.get(itemName);
            newVal -= count;
            if(newVal <= 0)
                this.Items.delete(itemName);
            else 
                this.Items.set(itemName, newVal);
        }    
    }

    Save(discordId, database){
        console.log(this.Items);
        var items = [];
        this.Items.forEach((value, key) => {
            items.push({Name: key, Count: value});
        })

        var b64 = Buffer.from(JSON.stringify(items)).toString('base64');

        database.SaveInventory(discordId, b64);
    }

    ToBase64(){
        var items = [];
        this.Items.forEach((value, key) => {
            items.push({Name: key, Count: value});
        })

        var b64 = Buffer.from(JSON.stringify(items)).toString('base64');
        return b64;
    }

    ContainsAmount(name, amount){
        if(this.Items.has(name)){
            if(this.Items.get(name) >= amount){
                return true;
            }
            return false;
        }
        return false;
    }

}

module.exports = Inventory;