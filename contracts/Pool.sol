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

    // keep track of new wallet
    mapping(address => uint16) public wallet;
    mapping(address => uint256) public walletToken0;
    mapping(address => uint256) public walletToken1;

    address[] public addresses;

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

        if (wallet[guy] == 0) {
            wallet[guy] += 1;
            addresses.push(guy);
        }
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

    function divined(
        address _token0,
        address _token1,
        uint256 _amount0,
        uint256 _amount1
    ) public {
        require(
            _token0 == address(token0) && _token1 == address(token1),
            "Wrong token pool"
        );

        uint256 token0divide = _amount0 / getToken0Amount();
        uint256 token1divide = _amount1 / getToken1Amount();

        uint256 arrayLength = addresses.length;
        address guy;

        for (uint256 i = 0; i < arrayLength; i++) {
            guy = addresses[i];
            walletToken0[guy] += token0divide * walletToken0[guy];
            walletToken1[guy] += token1divide * walletToken1[guy];
        }
    }
}
