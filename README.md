# SavjeeCoin
A very simple blockchain created using Javascript based on the 3 part tutorial by "Savjee" on youtube at 
https://www.youtube.com/watch?v=zVqczFZr124&amp;feature=youtu.be

This shows what is behind a blockchain by using simple code. 
It's not a complete implementation, but enough to understand how blockchains work and how they guarantee that blocks can never be changed.

After creating the  blockchain try and tamper with it by changing the property of one of the blocks (i.e. amount) 
and even attempting to recalculate that block's new hash after tampering.

This will demonstrate the blockchain's ability to detect fraud. 

This blockchain includes a proof of work mechanism based on a set difficulty value for the number of 0s which a hash for a new block must 
begin with. 
The nonce value is changed with each mining attempt to generate a new hash. 
This mining attempt (in the while loop) stops when an acceptable hash (with correct number of starting 0s) is generated
and that valid block is added to the chain.

There is a miner reward system implemented to award coins to miner address and return the "balance" of the miner.

