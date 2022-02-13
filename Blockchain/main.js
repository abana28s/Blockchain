const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index,timestamp,data,prevhash= ''){
        this.index= index;
        this.timestamp = timestamp;
        this.data = data;
        this.prevhash = prevhash;
        this.hash = this.calculatehash();
        this.nonce= 0;  // number used only once
    }
    calculatehash(){
        return SHA256(this.index + this.prevhash +this.timestamp +JSON.stringify(this.data + this.nonce)).toString();
    }
    // proof of work
    mineBlock(difficulty){
      while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
      this.nonce++;
      this.hash = this.calculatehash();
      }
      console.log("Block mined : " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5; // hash stats with 5 zeroes
    }

    createGenesisBlock(){
        return new Block(0,"13/02/2022","Genesis Block",'0');
    }
    
    getlatestblock(){
        return this.chain[this.chain.length-1];
    }
   
    addBlock(newBlock){
        newBlock.prevhash = this.getlatestblock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    //to check the integrity of all the blocks in the chain
    isChainValid(){
        for(let i=1;i < this.chain.length; i++){
          const currBlock = this.chain[i];
          const prevBlock = this.chain[i-1];

          if(currBlock.hash !== currBlock.calculatehash()){
              return false;
          }
          if(currBlock.prevhash !== prevBlock.hash){
              return false;
          }
        }
        return true;
    }

}

let dreamzcoin = new Blockchain();
console.log('Mining Block 1');
dreamzcoin.addBlock(new Block(1,"11/03/2022",{Abana_amount:5}));

console.log('Mining Block 2');
dreamzcoin.addBlock(new Block(2,"21/03/2022",{Abana_amount:10}));

console.log("Is blockchain valid: " + dreamzcoin.isChainValid());

// Show Blockchain
console.log(JSON.stringify(dreamzcoin,null,5));

// tamper with data
//dreamzcoin.chain[1].data = {Abana_amount:100};
//dreamzcoin.chain[1].hash = dreamzcoin.chain[1].calculatehash();
//console.log("Is blockchain valid: " + dreamzcoin.isChainValid());
