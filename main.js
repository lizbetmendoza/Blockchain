const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    // method to calculate hash to the block, and return the Hash
    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions)+ this.nonce).toString();
    }
    mineBlock(difficulty){
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined:" + this.hash);
    }
}


class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("03/09/2018","Genesis block","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
   
   minePendingTransactions(miningRewardsAddress){
       let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
       block.mineBlock(this.difficulty);

       console.log('Block successfully mined!');
       this.chain.push(block);
       //reset pending transacction is has rewards
       this.pendingTransactions = [
           new Transaction(null, miningRewardsAddress, this.miningReward)
       ];
   }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for (const block of this.chain){
            for (const trans of block.transactions){
                if (trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if (trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        console.log('\n Balance: ' + balance);
        return balance;
    }

    isChainValid(){
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if (currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let myCoin = new BlockChain();
myCoin.createTransaction(new Transaction('address1','address2',100));
myCoin.createTransaction(new Transaction('address2', 'address1',50));

console.log('\n Starting the miner...');
myCoin.minePendingTransactions('liz-address');

console.log('\n Balance of Liz is, ' + myCoin.getBalanceOfAddress('liz-address'));

console.log('\n Starting the miner again...');
myCoin.minePendingTransactions('liz-address');

console.log('\n Balance of Liz is, ' + myCoin.getBalanceOfAddress('liz-address'));
/*
console.log('Mining block 1 ...');
myCoin.addBlock(new Block(1,"03/09/2018","amount:2",));

console.log('Mining block 2 ...');
myCoin.addBlock(new Block(2,"03/12/2018","amount:14",));
*/

//console.log(JSON.stringify(myCoin,null,4));
/*console.log('ChainBlock is valid ? : ' + myCoin.isChainValid());
myCoin.chain[1].data = { amount: 100 };
myCoin.chain[1].hash = myCoin.chain[1].calculateHash();
console.log('ChainBlock is valid ? : ' + myCoin.isChainValid());
*/