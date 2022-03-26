const { ethers } = require("hardhat");

async function main() {
    const [ deployer ] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    // you can remove this part if you're already deploy token
    // but you have to specify address of the token instead
    const Token = await ethers.getContractFactory("RICE");
    const token = await Token.deploy("RICE", "RICE");
    await token.deployed();
    console.log("Token deployed to:", token.address);

    const VoteExchange = await ethers.getContractFactory("VoteExchange");
    const voteExchange = await VoteExchange.deploy(token.address);
    await voteExchange.deployed();
    console.log("VoteExchange deployed to:", voteExchange.address);

    const VoteFactory = await ethers.getContractFactory("VoteFactory");
    const voteFactory = await VoteFactory.deploy(voteExchange.address);
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