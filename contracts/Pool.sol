//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Pool {
    ERC20 private token0;
    ERC20 private token1;

    uint256 private token0amount;
    uint256 private token1amount;

    constructor(
        address payable _token0,
        address payable _token1,
        uint256 atoken0,
        uint256 atoken1
    ) {
        token0 = ERC20(_token0);
        token1 = ERC20(_token1);

        token0amount = atoken0;
        token1amount = atoken1;
    }

    mapping(address => uint256) public walletToken0;
    mapping(address => uint256) public walletToken1;

    function getStakeAmount(address a)
        external
        view
        returns (uint256 atoken0, uint256 atoken1)
    {
        return (walletToken0[a], walletToken1[a]);
    }

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

    function fillPool(
        uint256 _amountToken0,
        uint256 _amountToken1,
        address guy
    ) public payable {
        token0amount += _amountToken0;
        walletToken0[guy] += _amountToken0;

        token1amount += _amountToken1;
        walletToken1[guy] += _amountToken1;
    }

    function drainPool(uint8 _percent, address guy) public payable {
        uint256 _amountToken0 = (walletToken0[tx.origin] / 100) * _percent;
        uint256 _amountToken1 = (walletToken1[tx.origin] / 100) * _percent;

        token0.transfer(tx.origin, _amountToken0);
        token1.transfer(tx.origin, _amountToken1);

        token0amount -= _amountToken0;
        walletToken0[guy] -= _amountToken0;
        token1amount -= _amountToken1;
        walletToken1[guy] -= _amountToken1;
    }

    function swap0to1(uint256 _amountToken0, uint256 _amountToken1)
        public
        payable
    {
        require(getToken1Amount() > _amountToken1);

        token1.transfer(tx.origin, _amountToken1);

        token0amount += _amountToken0;
        token1amount -= _amountToken1;
    }

    function swap1to0(uint256 _amountToken1, uint256 _amountToken0)
        public
        payable
    {
        require(getToken0Amount() > _amountToken0);

        token0.transfer(tx.origin, _amountToken0);

        token0amount -= _amountToken0;
        token1amount += _amountToken1;
    }
}
