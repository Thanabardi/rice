const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

//   const Token = await hre.ethers.getContractFactory("RICE");
//   const token = await Token.deploy('RICE', 'RICE');

     const PoolFactory = await hre.ethers.getContractFactory("PoolFactory");
     const poolFactory = await PoolFactory.deploy();

     
     await poolFactory.deployed();

//   console.log("Token deployed to:", token.address);
     console.log("PoolFactory deployed to:", poolFactory.address);
     const MoneyBall = await hre.ethers.getContractFactory("MoneyBall");
     const moneyBall = await MoneyBall.deploy(poolFactory.address);

    
     await moneyBall.deployed();

     console.log("MoneyBall deployed to:", moneyBall.address);

     const Stake = await hre.ethers.getContractFactory("Stake");
     const stake = await Stake.deploy(poolFactory.address);
     const Swap = await hre.ethers.getContractFactory("Swap");
     const swap = await Swap.deploy(poolFactory.address,moneyBall.address);

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