pragma solidity ^0.8.0;

import "./Pool.sol";

contract PoolFactory {
    // map token0 to token1 to address pool
    mapping(address => mapping(address => Pool)) public pools;

    function createNewPool(address payable _token0, address payable _token1)
        public
    {
        require(
            address(pools[_token0][_token1]) != address(0),
            "Pool already Exist"
        );
        Pool poolAddress = new Pool(_token0, _token1);
        pools[_token0][_token1] = poolAddress;
        pools[_token1][_token0] = poolAddress;
    }

    function getPool(address _token0, address _token1)
        public
        view
        returns (Pool _pool)
    {
        return pools[_token0][_token1];
    }

    function getPoolAddress(address _token0, address _token1)
        public
        view
        returns (address _poolAddress)
    {
        return address(pools[_token0][_token1]);
    }
}
