const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("VoteExchange contract", function () {
    let accounts, owner, token, voteExchange;

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
        // TODO: fix ERC20 insufficient bug

        const initialBalance = 10000;
        const depositAmount = 3000;

        await token.transfer(accounts[1].address, initialBalance);
        expect(await token.balanceOf(accounts[1].address)).to.equal(initialBalance);

        await voteExchange.openExchange();
        
        await voteExchange.connect(accounts[1]).deposit(depositAmount);
        console.log(await voteExchange.voteExchange(accounts[1].address));
    });

    it("update correctly when withdraw token", async function () {
        // TODO: add test case
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