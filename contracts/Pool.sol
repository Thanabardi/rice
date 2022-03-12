pragma solidity ^0.8.0;

contract Pool {
    address private token0;
    address private token1;

    constructor(address payable _token0, address payable _token1) {
        token0 = _token0;
        token1 = _token1;
    }

    uint256 private token0amount;
    uint256 private token1amount;

    function getToken0Amount() public view returns (uint256 amountOfToken0) {
        return token0amount;
    }

    function getToken1Amount() public view returns (uint256 amountOfToken1) {
        return token1amount;
    }

    function getToken0() public view returns (address token0address) {
        return token0;
    }

    function getToken1() public view returns (address token1address) {
        return token1;
    }
}
