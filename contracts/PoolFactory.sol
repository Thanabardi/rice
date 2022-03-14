//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Pool.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PoolFactory {
    // map token0 to token1 to address pool
    mapping(address => mapping(address => Pool)) public pools;

    function createNewPool(
        address _token0,
        address _token1,
        uint256 amountToken0,
        uint256 amountToken1
    ) public payable {
        require(
            address(pools[_token0][_token1]) == address(0) &&
                address(pools[_token1][_token0]) == address(0),
            "Pool already Exist"
        );
        require(
            amountToken0 > 0 && amountToken1 > 0,
            "You have to put some token to start pool"
        );
        require(_token0 != _token1, "Not allow same pair to pool!");

        address payable token0 = payable(_token0);
        address payable token1 = payable(_token1);

        Pool pool = new Pool(token0, token1, amountToken0, amountToken1);

        ERC20(_token0).transferFrom(tx.origin, address(pool), amountToken0);
        ERC20(_token1).transferFrom(tx.origin, address(pool), amountToken1);

        pools[_token0][_token1] = pool;
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

    function getTotalAmountInPool(address _token0, address _token1)
        public
        view
        returns (uint256 amountToken0, uint256 amountToken1)
    {
        require(
            address(pools[_token0][_token1]) != address(0) ||
                address(pools[_token1][_token0]) != address(0),
            "No such pool!"
        );
        Pool pool;
        if (address(pools[_token0][_token1]) != address(0)) {
            pool = Pool(address(pools[_token0][_token1]));
        } else {
            pool = Pool(address(pools[_token1][_token0]));
        }
        return (pool.getToken0Amount(), pool.getToken1Amount());
    }
}
