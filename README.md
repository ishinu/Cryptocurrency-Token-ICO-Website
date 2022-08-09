# Cryptocurrency Token ICO Website | First Sample Project 

## Pre-requisites

- Local machine blockchain, Ganache , must be installed in your machine.
- Once you run and start server in Ganache, you may se 10 accounts with 100 ETH each.
- Go to root folder of this project after cloning through `git clone https://github.com/ishinu/Cryptocurrency-Token-ICO-Website` 
- `npm install` 
- `npx truffle migrate`
- `npm run dev` 
- `Open metamask in chrome extension and import one of any accounts from the ones Ganache provided with free ETH.
- Make sure you have Added Ganache RPC network in your metamask otherwise test ETH won't appear. [guide](https://coinsbench.com/connect-to-metamask-from-new-or-existing-web-application-with-truffle-and-ganache-f48aa763c0ac)

Your website must run frmo these commands but to make it functioning you need to transfer some tokens from admin to token sale contract.

Following commands to transfer tokens :

In terminal `npx truffle console` :

```
1. EPICToken.deployed().then(function(instance){i = instance})
2. EPICTokenSale.deployed().then(function(saleinstance){sale = saleinstance})
3. i.transfer(sale.address,25000)
4. i.balanceOf(sale.address)
```

As you can verify from fourth command, token sale address is having 25000 tokens, now you may proceed to test ICO functionality through buying tokens from website. 

