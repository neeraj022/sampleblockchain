const SHA256 = require('crypto-js/sha256')

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash () {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString()
    }
}


class Blockchain {
    constructor () {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock () {
        return new Block (0, "01/01/2017", "Genesis block", "0")
    }

    getLatestBlock () {
        return this.chain[this.chain.length - 1]
    }

    addBlock (newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock)
    }

    // checking if its a valid block chain
    isValid () {

        //we'll leave genesis block for checking
        for (let i=1; i < this.chain.length-1 ; i++) {
            let currentBlock = this.chain[i];
            let previousBlock  = this.chain[i-1];

            //check if block's parameter has been tempered with
            if (currentBlock.hash != currentBlock.calculateHash()) {
                return false
            }

            //check if previous hash address is invalid
            if (currentBlock.previousHash != previousBlock.hash) {
                return false
            }

        }

        return true
    }
}


//testing my block chain

let myCoin = new Blockchain ();
myCoin.addBlock(new Block(1, "10/01/2017", {amount: 10}));
myCoin.addBlock(new Block(2, "12/01/2017", {amount: 4}));

console.log(JSON.stringify(myCoin,null,4));

console.log (myCoin.isValid())


//tampering with my block chain
myCoin.chain[1].data = {amount: 11}

//checking again if block chain is valid or not
console.log(myCoin.isValid())

myCoin.chain[1].calculateHash()

//checking again if block chain is valid or not
console.log(myCoin.isValid())

