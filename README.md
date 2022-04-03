# Deploy
Building this project on polygon Mumbai testnet for [Ethernals HACKATHON](https://ethernals.devfolio.co/) <br/>
Check ours project's page in [Devfolio](https://devfolio.co/submissions/rice-070f)  <br/>
Deploy on both [Spheron](https://rice-lopwzp.argoapp.io) & [Heroku](https://rice-skdue.herokuapp.com/swap) <br/>


# RICE

A dApp that allows you to support your favorite activist by staking **rice** token on the platform and using **Twitter API** to represent the person/organization you want to support. Rice is also an exchange for swapping **Wrapped Matic** to **rice** token from a pool which you can also stake in the pool to make rice's liquidity higher. The swap system take **0.3%** as a fee which will send to the **Moneyball** contract. After the vote session ended **50%** of money in **Moneyball** will send to the activist's wallet address who won the vote session with the most vote. Another 40% of **Moneyball** was split among all persons who provide the liquidity to the rice protocol and lastly, 10% was kept in the **Moneyball** contract to pay gas for the next transaction.

# NFT

A reward for people who participated in the vote session is to have a chance to get **NFT** minted by protocol and random among all people who participate in the vote session using **chainlink's VRF**


# Tools <br/>
we use lots of tools in this projects which we'll describe briefly what do we use it for.<br/>
**Chainlink VRF** It provide a randomness that can be reliable to give us random person who get nft.<br/>
**ALCHEMY** It is place where we will connect to real chain. In chain it is kinda mess a bit so we will let alchemy handle task in chain for us.<br/>
**ALCHEMY NFT API** It manage data from chain about your NFT which really robust, orderly and faster. We use it to fetch all ours nft that user own.<br/>
**IPFS** to managing and holding our NFT's metadata.<br/>
**Spheron** for deploy ours website.<br/>
[readmore](https://skdue-ethernals.github.io/rice-docs/#/tools)<br/>




# Getting Started
`npm install`  
`npx hardhat compile` 

**skip this step if you dont want to deploy yourself's contracts**
check hardhat.config.js get your API from **ALCHEMY** or **INFURA** and put down your private wallet address (you might wanna use .env)<br/>
`npx hardhat run scripts/deploy.js`<br/>
`npx hardhat run scripts/deploy_vote.js`<br/>
`npx hardhat run test_deploy_swap_stake.js`<br/>
after get those address goto `src/context/AddressContextProvider.jsx` replace all your contracts's address<br/>

**Lastly**<br/>
```yarn start```  
enjoy BUIDL :)

**Read More**<br/>
[doc v1](https://docs.google.com/document/d/1Zgktz3rl3L3etOMBdXSVNMAD0m041fJvvSHRQ0sSNPg/edit?usp=sharing)<br/>
[doc v2](https://skdue-ethernals.github.io/rice-docs/#/)<br/>
