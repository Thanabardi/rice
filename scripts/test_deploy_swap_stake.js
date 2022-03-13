const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const MONEYBALL = 
  '0x97dD004De376C47d230d15811bE5A2F88093Cb46';

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

//   const Token = await hre.ethers.getContractFactory("RICE");
//   const token = await Token.deploy('RICE', 'RICE');

     const PoolFactory = await hre.ethers.getContractFactory("PoolFactory");
     const poolFactory = await PoolFactory.deploy();


//   await token.deployed();
     await poolFactory.deployed();

//   console.log("Token deployed to:", token.address);
     console.log("PoolFactory deployed to:", poolFactory.address);

     const Stake = await hre.ethers.getContractFactory("Stake");
     const stake = await Stake.deploy(poolFactory.address);
     const Swap = await hre.ethers.getContractFactory("Swap");
     const swap = await Swap.deploy(poolFactory.address,MONEYBALL);

     await stake.deployed();
     await swap.deployed();

     console.log("Swap deployed to:", swap.address);
     console.log("Stake deployed to:", stake.address);



}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });