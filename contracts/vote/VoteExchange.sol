pragma solidity ^0.8.0;

contract VoteExchange {
    mapping(address => uint) voteExchange;
    address public owner;
    
    enum ExchangeState {OPENED, CLOSED}
    ExchangeState public status;

    constructor () {
        owner = msg.sender;
    }

    function deposit(uint _amount) public {
        // exchange for vote by deposit RICE when exchange is opened
    }

    function withdraw(uint _amount) public {
        // withdraw deposited RICE when exchage is opened
    }

    function closeExchange() public {
        require(msg.sender == owner, "Not owner");
        status = ExchangeState.CLOSED;
    }

    function openExchange() public {
        require(msg.sender == owner, "Not owner");
        status = ExchangeState.OPENED;
    }
}