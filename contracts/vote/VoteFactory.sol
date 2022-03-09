pragma solidity ^0.8.0;

import "./VoteExchange.sol";
import "./VoteSession.sol";

contract VoteFactory {
    mapping(uint => VoteSession) public voteSessions;
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
        require(tx.origin == owner, "Not owner");

        if(voteId != 0) {
            // latest vote session is working
            require(
                VoteSession(voteSessions[voteId]).status() == VoteSession.voteState.ENDED,
                "Latest vote session is not ended"
            );
        }
        
        voteId += 1;
        voteSessions[voteId] = new VoteSession(voteId, address(voteExchange));
    }

    function getLatestSession() public view returns (address) {
        return address(voteSessions[voteId]);
    }
}