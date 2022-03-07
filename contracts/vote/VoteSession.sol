pragma solidity ^0.8.0;

contract VoteSession {
    uint public voteId;
    mapping(address => uint) public riceParticipants;
    mapping(string => uint) public voteMap;
    address public voteExchangeAddress;
    
    enum voteState { START, END } 

    constructor (uint _voteId, address _voteExchangeAddress) {
        voteId = _voteId;
        voteExchangeAddress = _voteExchangeAddress;
    }

    function vote(uint _amount, string memory _twitterId) public {

    }

    function endVote() public {
        
    }
}