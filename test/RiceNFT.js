const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RiceNFT contract", function() {
    let accounts, owner, nft;
    
    beforeEach(async function () {
        const RiceNFT = await ethers.getContractFactory("RiceNFT");
        nft = await RiceNFT.deploy();

        accounts = await ethers.getSigners();
        owner = accounts[0];
    });

    it("close when it created", async function() {
        expect(await nft.status()).to.equal(1);
    });

    it("okay?", async function() {
        let metadata = "ipfs://QmVwzBZnWdZYomS1PPxVBtFpSoDdPed8pdVdvxpHXX9E6y";


        await nft.openNFT();

        console.log(await nft.award(accounts[1].address, metadata));

        console.log("added", await nft.tokenURI(1));
        console.log("property", await nft.balanceOf(accounts[1].address));
        console.log("onwer 1", await nft.ownerOf(1));

        await nft.openNFT();
        
        console.log(await nft.award(accounts[1].address, metadata));
        console.log("added", await nft.tokenURI(1));
        console.log("owner 2", await nft.ownerOf(2));
        console.log("property", await nft.balanceOf(accounts[1].address));
    });
});