pragma solidity ^0.8.0;

import "./VoteExchange.sol";
import "./VoteSession.sol";

contract VoteFactory {
    mapping(uint => address) public voteSessions;
    uint public voteId;
    address public owner;
    VoteExchange public voteExchange;

    constructor(address _voteExchangeAddress) {
        owner = msg.sender;
        voteId = 0;
        voteExchange = VoteExchange(_voteExchangeAddress);
    }

    function createVoteSession() public {
        // create a new vote session
        require(msg.sender == owner, "Not owner");
    }
}