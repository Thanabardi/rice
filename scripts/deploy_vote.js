const { ethers } = require("hardhat");

async function main() {
    const [ deployer ] = await ethers.getSigners();
    const VRFCoordinator = "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255";
    const LINK = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
    const FEE = "100000000000000";
    const KEYHASH = "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4";
    const riceToken = "0x87C2EBffe6C50eE034b4D05D2d3c2EC7b325e346";

    console.log("Deploying contracts with the account:", deployer.address);

    const VoteExchange = await ethers.getContractFactory("VoteExchange");
    const voteExchange = await VoteExchange.deploy(riceToken);
    await voteExchange.deployed();
    console.log("VoteExchange deployed to:", voteExchange.address);

    const NFT = await ethers.getContractFactory("RiceNFT");
    const nft = await NFT.deploy();
    await nft.deployed();
    console.log("NFT deployed to:", nft.address);

    const VoteFactory = await ethers.getContractFactory("VoteFactory");
    const voteFactory = await VoteFactory.deploy(voteExchange.address,VRFCoordinator,LINK,FEE,KEYHASH,nft.address);
    await voteFactory.deployed();
    console.log("VoteFactory deployed to:", voteFactory.address);

    console.log("Note: VoteSession will be deploy by VoteFactory");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });