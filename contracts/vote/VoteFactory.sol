pragma solidity ^0.8.0;

contract VoteFactory {
    mapping(uint => address) public voteSessions;
    uint public voteId;
    address public owner;
    address public voteExchangeAddress;

    constructor(address _voteExchangeAddress) {
        owner = msg.sender;
        voteId = 0;
        voteExchangeAddress = _voteExchangeAddress;
    }

    function createVoteSession() public {
        // create a new vote session
    }
}