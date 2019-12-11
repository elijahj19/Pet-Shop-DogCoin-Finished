# Pet-Shop-DogCoin-Finished

This the code for our pet-shop-project.  We included the code for Adoption.sol, App.sol, and dogCoin.sol.  Downloading this code will not work locally on your machine, it is here for reference.  

We used contract chaining to connect our Adoption.sol and our dogCoin.sol. We made a function buyDogCoin in the Adoption.sol contract, which is handled with a handleBuyDogCoin event in the App.js.  This function sends 0.1 ether to the pet owner and calls a transferFrom in the dogCoin to transfer 100 Dog Coin to the client from the owner.  We assume the owner of the pets also owns the dog coin.  The adoption was deployed with truffle and the ERC20 contract was deployed on Remix.

The contractID for dogCoin is 0x20f25fD3cD08Fd98539579f567636fade7a7bcc2. The contract was deployed with 1000 Dog Coins.   We only support buying dog coins from the owner.  We only support buying DogCoins in increments of 100 coins in our App.js.
