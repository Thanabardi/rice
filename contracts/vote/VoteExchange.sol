pragma solidity ^0.8.0;

import "../Token.sol";
import "hardhat/console.sol";

contract VoteExchange {
    mapping(address => uint) public voteExchange;
    address public owner;
    RICE public token;
    
    enum ExchangeState {OPENED, CLOSED}
    ExchangeState public status;

    constructor (address _tokenAddress) {
        owner = msg.sender;
        status = ExchangeState.CLOSED;
        token = RICE(_tokenAddress);
    }

    function deposit(uint _amount) payable public {
        // exchange for vote by deposit RICE when exchange is opened
        require(status == ExchangeState.OPENED, "Not open");
        require(_amount > 0, "You need to deposit at least some token");
        
        token.transferFrom(msg.sender, address(this), _amount);
        voteExchange[msg.sender] += _amount;
    }

    function withdraw(uint _amount) payable public {
        // withdraw deposited RICE when exchage is opened
        require(status == ExchangeState.OPENED, "Not open");
        
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