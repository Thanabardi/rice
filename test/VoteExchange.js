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
        expect(await voteExchange.tokenAddress()).to.equal(token.address);
        expect(await voteExchange.owner()).to.equal(owner.address);
    });

    it("update correctly when deposit token", async function () {
        
    });

    it("update correctly when withdraw token", async function () {

    });

    it("can be opened by owner and when opened everyone can deposit or withdraw", async function() {

    });

    it("can be closed by owner and when closed no one can deposit or withdraw", async function () {

    });

    it("can't be opened or closed by someone not owner", async function() {
        await expect(voteExchange.connect(accounts[1]).openExchange()).to.be.revertedWith("Not owner");
        await expect(voteExchange.connect(accounts[1]).closeExchange()).to.be.revertedWith("Not owner");
    });
});