pragma solidity ^0.8.0;

import "./VoteExchange.sol";
import "hardhat/console.sol";

contract VoteSession {
    uint public voteId;
    mapping(address => uint) public voteMap;
    mapping(string => uint) public riceParticipants;
    VoteExchange public voteExchange;
    address public owner;
    
    enum voteState { STARTED, ENDED }
    voteState public status;

    constructor (uint _voteId, address _voteExchangeAddress) {
        owner = msg.sender;
        voteId = _voteId;
        status = voteState.STARTED;
        voteExchange = VoteExchange(_voteExchangeAddress);
        voteExchange.closeExchange();
    }

    function vote(uint _amount, string memory _twitterId) public {
        // making a vote that does not exceed the deposited RICE limit (100 votes)
        require(status == voteState.STARTED, "Vote session already ended");
        require(_amount > 0 && _amount <= 100, "Vote must be at least 1 and at most 100");
        require(
            (voteExchange.voteExchange(msg.sender)/10**18) >= _amount+voteMap[msg.sender],
            "Not have enough vote"
        );

        riceParticipants[_twitterId] += _amount;
        voteMap[msg.sender] += _amount;
    }

    function remainingVote(address _voter) public view returns (uint) {
        // return remaining vote
        return voteExchange.voteExchange(_voter)/10**18 - voteMap[_voter];
    }

    function endVote() public {
        // end the vote session for owner or out of time
        require(tx.origin == owner, "Not owner");
        status = voteState.ENDED;
        voteExchange.openExchange();
    }
}