const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VoteSession contract", function () {
    let accounts, owner, token, voteExchange, voteSession, twitterId;
    let voteId = 1;
    const zeroExtension = "000000000000000000";
    let initialBalance = "1000" + zeroExtension; // 1000 votes

    beforeEach(async function () {
        twitterId = "tester";

        accounts = await ethers.getSigners();
        owner = accounts[0];

        const Token = await ethers.getContractFactory("RICE");
        token = await Token.deploy("RICE", "RICE");

        const VoteExchange = await ethers.getContractFactory("VoteExchange");
        voteExchange = await VoteExchange.deploy(token.address);

        await token.transfer(accounts[1].address, initialBalance);
        await token.connect(accounts[1]).approve(voteExchange.address, initialBalance);
    
        await voteExchange.openExchange();
        await voteExchange.connect(accounts[1]).deposit(initialBalance);
    
        const VoteSession = await ethers.getContractFactory("VoteSession");
        voteSession = await VoteSession.deploy(voteId, voteExchange.address);
    });

    it("close exchange when it started", async function () {        
        const VoteSession = await ethers.getContractFactory("VoteSession");
        const newVoteSession = await VoteSession.deploy(voteId, voteExchange.address);

        expect(await newVoteSession.status()).to.equal(0); // started
        expect(await voteExchange.status()).to.equal(1); // closed
    });

    it("open exchange again when it ended", async function () {
        await voteSession.endVote();

        expect(await voteSession.status()).to.equal(1) // ended
        expect(await voteExchange.status()).to.equal(0) // opened
    });

    it("can't vote with zero amount", async function () {
        await expect(voteSession.connect(accounts[1]).vote(0, twitterId)).to.be.revertedWith("Vote must be at least 1 and at most 100");

        expect(await voteSession.voteMap(accounts[1].address)).to.equal(0);
        expect(await voteSession.candidate(twitterId)).to.equal(0);
    });

    it("can't vote using more than 100 votes", async function () {
        await expect(voteSession.connect(accounts[1]).vote(101, twitterId)).to.be.revertedWith("Vote must be at least 1 and at most 100");

        expect(await voteSession.voteMap(accounts[1].address)).to.equal(0);
        expect(await voteSession.candidate(twitterId)).to.equal(0); 
    });

    it("can't vote when vote session is ended", async function () {
        await voteSession.endVote();

        await expect(voteSession.connect(accounts[1]).vote(100, twitterId)).to.be.revertedWith("Vote session already ended");

        expect(await voteSession.voteMap(accounts[1].address)).to.equal(0);
        expect(await voteSession.candidate(twitterId)).to.equal(0); 
    });

    it("update vote correctly", async function () {
        await voteSession.connect(accounts[1]).vote(100, twitterId);
        expect(await voteSession.voteMap(accounts[1].address)).to.equal(100);
        expect(await voteSession.candidate(twitterId)).to.equal(100); 
    });

    it("can't vote with not enough vote", async function () {
        const balance = "50" + zeroExtension;
        await token.transfer(accounts[2].address, balance);

        const VoteExchange = await ethers.getContractFactory("VoteExchange");
        const newVoteExchange = await VoteExchange.deploy(token.address);
        
        await newVoteExchange.openExchange();
        await token.connect(accounts[2]).approve(newVoteExchange.address, balance);
        await newVoteExchange.connect(accounts[2]).deposit(balance);

        const VoteSession = await ethers.getContractFactory("VoteSession");
        const newVoteSession = await VoteSession.deploy(voteId, newVoteExchange.address);

        await expect(newVoteSession.connect(accounts[2]).vote(51, twitterId)).to.be.revertedWith("Not have enough vote");
        
        expect(await newVoteSession.voteMap(accounts[2].address)).to.equal(0);
        expect(await newVoteSession.candidate(twitterId)).to.equal(0); 
    });

    it("show right remaining vote", async function () {
        const initialVote = 1000;
        const voteAmount = 50;

        expect(await voteSession.remainingVote(accounts[1].address)).to.equal(initialVote);
       
        await voteSession.connect(accounts[1]).vote(voteAmount, twitterId);

        expect(await voteSession.remainingVote(accounts[1].address)).to.equal(initialVote - voteAmount);
    });

    it("end the vote only by owner", async function () {
        await expect(voteSession.connect(accounts[1]).endVote()).to.be.revertedWith("Not owner");
    });

    it("add candidate name when new name is voted", async function() {
        const voteAmount = 50;
        const cadidates = ["a", "b"];
        let recordedCandidates;

        // vote for a
        await voteSession.connect(accounts[1]).vote(voteAmount, cadidates[0]);
        recordedCandidates = await voteSession.getCandidateName();
        expect(JSON.stringify(cadidates.slice(0, 1))).to.equal(JSON.stringify(recordedCandidates));

        // vote for b
        await voteSession.connect(accounts[1]).vote(voteAmount, cadidates[1]);
        recordedCandidates = await voteSession.getCandidateName();
        expect(JSON.stringify(cadidates)).to.equal(JSON.stringify(recordedCandidates));

        // vote for a again, shouldn't add a in candidate name again
        await voteSession.connect(accounts[1]).vote(voteAmount, cadidates[0]);
        recordedCandidates = await voteSession.getCandidateName();
        expect(JSON.stringify(cadidates)).to.equal(JSON.stringify(recordedCandidates));
    });
});