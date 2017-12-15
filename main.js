const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.hash = this.calculateHash();
    //the nonce is required so that there is a value that can be changed as if none of the contents of the block changed then 
    //the hash would never change! This is essential to avoid the mining while loop going on forever
    // by changing the nonce inside the loop (nonce++) we can change the hash checked.
    this.nonce = 0;
  }

  calculateHash() {
      //remember to take into account all of the properties of the block apart from the hash (including the nonce)
      return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) +this.nonce).toString();
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
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
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

console.log('Mining block 1...');
savjeeCoin.addBlock(new Block(1, "20/07/2017", { amount: 4 }));

console.log('Mining block 2...');
savjeeCoin.addBlock(new Block(2, "20/07/2017", { amount: 8 }));
