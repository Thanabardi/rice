pragma solidity ^0.8.0;

import "./Pool.sol";
import "./PoolFactory.sol";

contract Swap {
    PoolFactory poolFactory;

    constructor(address _poolFactory) {
        poolFactory = PoolFactory(_poolFactory);
    }

    function swap(
        address _token0,
        address _token1,
        uint256 _amountToken0
    ) public {
        uint256 _amountToken1 = getTokenOdds(_token0, _token1, _amountToken0);

        Pool selectedPool;
        if (poolFactory.getPoolAddress(_token0, _token1) != address(0)) {
            selectedPool = Pool(poolFactory.getPoolAddress(_token0, _token1));
            selectedPool.swap0to1(_amountToken0, _amountToken1);
        } else {
            selectedPool = Pool(poolFactory.getPoolAddress(_token1, _token0));
            selectedPool.swap1to0(_amountToken0, _amountToken1);
        }
    }

    function getTokenOdds(
        address _token0,
        address _token1,
        uint256 _amountToken0
    ) public view returns (uint256 odds) {
        require(
            poolFactory.getPoolAddress(_token0, _token1) != address(0) ||
                poolFactory.getPoolAddress(_token1, _token0) != address(0),
            "Selected Pools not exist!"
        );

        Pool selectedPool;
        if (poolFactory.getPoolAddress(_token0, _token1) != address(0)) {
            selectedPool = Pool(poolFactory.getPoolAddress(_token0, _token1));
            return
                (selectedPool.getToken1Amount() /
                    (selectedPool.getToken0Amount() + _amountToken0)) *
                _amountToken0;
        }
        selectedPool = Pool(poolFactory.getPoolAddress(_token1, _token0));
        return
            (selectedPool.getToken0Amount() /
                (selectedPool.getToken1Amount() + _amountToken0)) *
            _amountToken0;
    }
}
