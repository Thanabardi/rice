pragma solidity ^0.8.0;

import "../Token.sol";

contract VoteExchange {
    mapping(address => uint256) public voteExchange;
    address public owner;
    RICE public token;

    enum ExchangeState {
        OPENED,
        CLOSED
    }
    ExchangeState public status;

    constructor(address _tokenAddress) {
        owner = msg.sender;
        status = ExchangeState.CLOSED;
        token = RICE(_tokenAddress);
    }

    function deposit(uint256 _amount) public payable {
        // exchange for vote by deposit RICE when exchange is opened
        // require(status == ExchangeState.OPENED, "Not open");
        require(_amount > 0, "You need to deposit at least some token");

        token.transferFrom(msg.sender, address(this), _amount);
        voteExchange[msg.sender] += _amount;
    }

    function withdraw(uint256 _amount) public payable {
        // withdraw deposited RICE when exchage is opened
        require(status == ExchangeState.OPENED, "Not open");
        require(
            voteExchange[msg.sender] >= _amount,
            "Not enough token to withdraw"
        );

        token.transfer(msg.sender, _amount);
        voteExchange[msg.sender] -= _amount;
    }

    function closeExchange() public {
        require(tx.origin == owner, "Not owner");
        status = ExchangeState.CLOSED;
    }

    function openExchange() public {
        require(tx.origin == owner, "Not owner");
        status = ExchangeState.OPENED;
    }
}
