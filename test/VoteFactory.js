const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VoteFactory contract", function () {
    let accounts, owner, token, voteExchange, voteSession, voteFactory, twitterIds;
    const zeroExtension = "000000000000000000";
    let initialBalance = "1000" + zeroExtension; // 1000 votes

    beforeEach(async function () {    
        const Token = await ethers.getContractFactory("RICE");
        const VoteExchange = await ethers.getContractFactory("VoteExchange");
        const VoteFactory = await ethers.getContractFactory("VoteFactory");

        twitterIds = [];
        for(let i=0; i<10; i++) {
            twitterIds.push("tester" + i);
        }

        accounts = await ethers.getSigners();
        owner = accounts[0];

        token = await Token.deploy("RICE", "RICE");
        voteExchange = await VoteExchange.deploy(token.address);
        voteFactory = await VoteFactory.deploy(voteExchange.address);

        await voteExchange.openExchange();

        for(let i=0; i<10; i++) {
            await token.transfer(accounts[i].address, initialBalance);
            await token.connect(accounts[i]).approve(voteExchange.address, initialBalance); 
            await voteExchange.connect(accounts[i]).deposit(initialBalance);
        }
    });

    it("return correct latest seession", async function () {
        await voteFactory.createVoteSession();
        let voteSessionAddress = await voteFactory.voteSessions(1);

        expect(await voteFactory.getLatestSession()).to.equal(voteSessionAddress);
    });

    it("create vote session and close vote exchange", async function() {
        await voteFactory.createVoteSession();
        let voteSessionAddress = await voteFactory.voteSessions(1);
        voteSession = await ethers.getContractAt("VoteSession", voteSessionAddress);

        expect(await voteExchange.status()).to.equal(1); // closed
        expect(await voteSession.status()).to.equal(0); // opened;
    });

    it("can't create new vote session if the latest one is active", async function() {
        await voteFactory.createVoteSession();
        
        await expect(voteFactory.createVoteSession()).to.be.revertedWith("Latest vote session is not ended");
    });

    it("has working created vote session", async function() {
        await voteFactory.createVoteSession();
        let voteSessionAddress = await voteFactory.getLatestSession();
        voteSession = await ethers.getContractAt("VoteSession", voteSessionAddress);

        for(let i=0; i<9; i++) {
            await voteSession.connect(accounts[i]).vote(100, twitterIds[i]);
            expect(await voteSession.candidate(twitterIds[i])).to.equal(100);
        }
    });

    it("can create next vote session when the previous one is ended", async function () {
        await voteFactory.createVoteSession();
        let voteSessionAddress1 = await voteFactory.voteSessions(1);

        expect(await voteFactory.getLatestSession()).to.equal(voteSessionAddress1);

        voteSession = await ethers.getContractAt("VoteSession", voteSessionAddress1);
        await voteSession.endVote();

        expect(await voteSession.status()).to.equal(1); // ended

        await voteFactory.createVoteSession();
        let voteSessionAddress2 = await voteFactory.voteSessions(2);

        expect(await voteFactory.getLatestSession()).to.equal(voteSessionAddress2);
    });
});