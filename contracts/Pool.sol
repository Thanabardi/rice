pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Pool {
    ERC20 private token0;
    ERC20 private token1;

    constructor(address payable _token0, address payable _token1) {
        token0 = ERC20(_token0);
        token1 = ERC20(_token1);
    }

    mapping(address => uint256) walletToken0;
    mapping(address => uint256) walletToken1;

    uint256 private token0amount;
    uint256 private token1amount;

    function getToken0Amount() public view returns (uint256 amountOfToken0) {
        return token0amount;
    }

    function getToken1Amount() public view returns (uint256 amountOfToken1) {
        return token1amount;
    }

    function getToken0() public view returns (ERC20 _token0) {
        return token0;
    }

    function getToken1() public view returns (ERC20 _token1) {
        return token1;
    }

    // if you got token1 that amount how many token0 need to stake
    function token0NeedForStake(uint256 _amountToken1)
        public
        view
        returns (uint256 _amountToken0)
    {
        return (getToken0Amount() / getToken1Amount()) * _amountToken1;
    }

    // if you got token0 that amount how many token1 need to stake
    function token1NeedForStake(uint256 _amountToken0)
        public
        view
        returns (uint256 _amountToken1)
    {
        return (getToken1Amount() / getToken0Amount()) * _amountToken0;
    }

    function fillPool(uint256 _amountToken0, uint256 _amountToken1)
        public
        payable
    {
        token0.transferFrom(msg.sender, address(this), _amountToken0);
        token1.transferFrom(msg.sender, address(this), _amountToken1);

        token0amount += _amountToken0;
        walletToken0[msg.sender] += _amountToken0;

        token1amount += _amountToken1;
        walletToken1[msg.sender] += _amountToken1;
    }

    function drainPool(uint8 _percent) public payable {
        uint256 _amountToken0 = (walletToken0[msg.sender] / 100) * _percent;
        uint256 _amountToken1 = (walletToken1[msg.sender] / 100) * _percent;

        token0.transfer(msg.sender, _amountToken0);
        token1.transfer(msg.sender, _amountToken1);

        token0amount -= _amountToken0;
        walletToken0[msg.sender] -= _amountToken0;
        token1amount -= _amountToken1;
        walletToken1[msg.sender] -= _amountToken1;
    }

    function swap0to1(uint256 _amountToken0, uint256 _amountToken1)
        public
        payable
    {
        require(getToken1Amount() > _amountToken1);

        token0.transferFrom(msg.sender, address(this), _amountToken0);
        token1.transfer(msg.sender, _amountToken1);

        token0amount += _amountToken0;
        token1amount -= _amountToken1;
    }

    function swap1to0(uint256 _amountToken1, uint256 _amountToken0)
        public
        payable
    {
        require(getToken0Amount() > _amountToken0);

        token1.transferFrom(msg.sender, address(this), _amountToken1);
        token0.transfer(msg.sender, _amountToken0);

        token0amount -= _amountToken0;
        token1amount += _amountToken1;
    }
}
