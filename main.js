const SHA256 = require("crypto-js/sha256");

class Transaction{
    //a transaction always comes from someone, goes to someone and has a certain amount of coins
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.hash = this.calculateHash();
    //the nonce is required so that there is a value that can be changed as if none of the contents of the block changed then 
    //the hash would never change! This is essential to avoid the mining while loop going on forever
    // by changing the nonce inside the loop (nonce++) we can change the hash checked.
    this.nonce = 0;
  }

  calculateHash() {
      //remember to take into account all of the properties of the block apart from the hash (including the nonce)
      return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) +this.nonce).toString();
  }

  mineBlock(difficulty){
      /*This loop checks that keeps running until the hash starts with enough 0s 
      to do this it takes a substring of the block's hash (The substring starts at character 0 and goes up to "difficulty")
      so if difficulty is 5 it checks the first 5 characters. and this keeps running until the hash has the correct 
      amount of starting 0s. 
      To do that we create a new Array of length (difficulty +1) and you .join the character zero to check that the array is 
      just a string of zeroes of the length of difficulty. So we need the starting substring to be equal to that array to break
      from the while loop. */
      while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")){
          this.nonce++; //the nonce increments every time the hash doesnt start with enough 0s so that a new hash is generated.
          this.hash = this.calculateHash();
      }

      console.log("Block mined: " + this.hash);
  }
}


class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        //create an empty array that will store pending transactions (transactions between block creation intervals)
        this.pendingTransactions = []; 
        //reward for mining a block.
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.parse("01/01/2017"), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /* this method is deleted and replaced by the minePendingTransactions() method*/
    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty); //mines the new block 
    //     this.chain.push(newBlock);
    // }

    //accepts a wallet address of the miner as a param so that coins can be sent to that address
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        //you need this method to reset the pending transactions as they would be no longer pending.
        //but it also includes the transaction to send the reward to the miner in the new array of pending txs
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    //a method to add new transactions to the pendingTransactions array.
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    //like bitcoin, there is no "balance" per se, it needs to be calculated by examining the transactions history for the address
    getBalanceofAddress(address){
        //just define a balance and set it to 0 initially
        let balance = 0;

        //loop over all of the blocks in the blockchain
        for(const block of this.chain){
            //because each block contains multiple transactions we loop over each transaction in the block
            for(const trans of block.transactions){
                //if you are from address, you sent so balance must be reduced.
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                //if you are to address, you receive so balance must be increased.
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance; 
    }

    isChainValid(){ //a series of checks to validate the blocks.
        
        for(let i=1; i < this.chain.length; i++){ //remember it is this.CHAIN.length
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            //check that the hash property matches with the actual calculated hash of the block for the current block.
            //if not then the chain is invalid. something has gone wrong.
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            //check that the previousHash property of the current block points correctly to the hash property of the previous block
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true; //If it loops through the whole chain with no invalidities in the checks, then the chain is valid.
    }
}

let savjeeCoin = new Blockchain();

//the 'address1' and 'address2' are just for demo, these would be public keys of a wallet address in a real version.
savjeeCoin.createTransaction(new Transaction('address1', 'address2', 100));
savjeeCoin.createTransaction(new Transaction('address1', 'address2', 50));

console.log('\n Starting the miner.');
savjeeCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', savjeeCoin.getBalanceofAddress('xaviers-address'));

console.log('\n Starting the miner.');
savjeeCoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', savjeeCoin.getBalanceofAddress('xaviers-address'));