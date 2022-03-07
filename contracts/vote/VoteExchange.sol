pragma solidity ^0.8.0;

import "../Token.sol";

contract VoteExchange {
    mapping(address => uint) voteExchange;
    address public owner;
    address public tokenAddress;
    
    enum ExchangeState {OPENED, CLOSED}
    ExchangeState public status;

    constructor (address _tokenAddress) {
        owner = msg.sender;
        status = ExchangeState.CLOSED;
        tokenAddress = _tokenAddress;
    }

    function deposit() payable public {
        // exchange for vote by deposit RICE when exchange is opened
        require(status == ExchangeState.OPENED);
    }

    function withdraw(uint _amount) payable public {
        // withdraw deposited RICE when exchage is opened
        require(status == ExchangeState.OPENED);
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