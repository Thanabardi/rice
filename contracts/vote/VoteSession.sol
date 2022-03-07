pragma solidity ^0.8.0;

contract VoteSession {
    uint public voteId;
    mapping(address => uint) public riceParticipants;
    mapping(string => uint) public voteMap;
    address public voteExchangeAddress;
    address public owner;
    
    enum voteState { START, END } 

    constructor (uint _voteId, address _voteExchangeAddress) {
        owner = msg.sender;
        voteId = _voteId;
        voteExchangeAddress = _voteExchangeAddress;
    }

    function vote(uint _amount, string memory _twitterId) public {
        // making a vote that does not exceed the deposited RICE limit
    }

    function endVote() public {
        // end the vote session for owner
    }
}