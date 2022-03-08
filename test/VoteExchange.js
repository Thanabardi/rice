const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VoteExchange contract", function () {
    let accounts, owner, token, voteExchange;
    const zeroExtension = "000000000000000000";

    beforeEach(async function () {
        accounts = await ethers.getSigners();
        owner = accounts[0];
        
        const Token = await ethers.getContractFactory("RICE");
        token = await Token.deploy("RICE", "RICE");

        const VoteExchange = await ethers.getContractFactory("VoteExchange");
        voteExchange = await VoteExchange.deploy(token.address);
    });

    it("has correct initialized attributes", async function () {
        expect(await voteExchange.token()).to.equal(token.address);
        expect(await voteExchange.owner()).to.equal(owner.address);
    });

    it("update correctly when deposit token", async function () {
        const initialBalance = "10000" + zeroExtension;
        const depositAmount = "3000" + zeroExtension;
        const remainBalance = "7000" + zeroExtension;

        await token.transfer(accounts[1].address, initialBalance);
        expect(await token.balanceOf(accounts[1].address)).to.equal(initialBalance);

        await voteExchange.openExchange();
        
        // note: this line refers to maximum token we can use to specified contract
        await token.connect(accounts[1]).approve(voteExchange.address, depositAmount);

        await voteExchange.connect(accounts[1]).deposit(depositAmount);
        
        expect(await token.balanceOf(accounts[1].address)).to.equal(remainBalance);
        expect(await token.balanceOf(voteExchange.address)).to.equal(depositAmount);
        expect(await voteExchange.voteExchange(accounts[1].address)).to.equal(depositAmount);
    });

    it("update correctly when withdraw token", async function () {
        const initialBalance = "10000" + zeroExtension;
        const withdrawAmount = "3000" + zeroExtension;
        const remainBalance = "7000" + zeroExtension;
        
        await voteExchange.openExchange();
        await token.transfer(accounts[1].address, initialBalance);
        await token.connect(accounts[1]).approve(voteExchange.address, initialBalance);
        await voteExchange.connect(accounts[1]).deposit(initialBalance);

        await voteExchange.connect(accounts[1]).withdraw(withdrawAmount);
        expect(await token.balanceOf(accounts[1].address)).to.equal(withdrawAmount);
        expect(await token.balanceOf(voteExchange.address)).to.equal(remainBalance);
        expect(await voteExchange.voteExchange(accounts[1].address)).to.equal(remainBalance);
    });

    it("can't withdraw when there is not enough token", async function () {
        const initialBalance = "10000" + zeroExtension;
        const withdrawAmount = "10001" + zeroExtension;
        
        await voteExchange.openExchange();
        await token.transfer(accounts[1].address, initialBalance);
        await token.connect(accounts[1]).approve(voteExchange.address, initialBalance);
        await voteExchange.connect(accounts[1]).deposit(initialBalance);

        await expect(voteExchange.connect(accounts[1]).withdraw(withdrawAmount)).to.be.revertedWith("Not enough token to withdraw");
    });

    it("can be opened and closed by owner", async function() {
        // 0 means opened
        await voteExchange.openExchange();
        expect(await voteExchange.status()).to.equal(0);
        // 1 means closed
        await voteExchange.closeExchange();
        expect(await voteExchange.status()).to.equal(1);
    });

    it("can't be opened or closed by someone not owner", async function() {
        await expect(voteExchange.connect(accounts[1]).openExchange()).to.be.revertedWith("Not owner");
        await expect(voteExchange.connect(accounts[1]).closeExchange()).to.be.revertedWith("Not owner");
    });
});