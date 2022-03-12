pragma solidity ^0.8.0;

import "./Pool.sol";
import "./PoolFactory.sol";

contract Stake {
    PoolFactory poolFactory;

    constructor(address _poolFactory) {
        poolFactory = PoolFactory(_poolFactory);
    }

    function stake(
        address _token0,
        address _token1,
        uint256 amountToken0,
        uint256 amountToken1
    ) public {
        require(
            amountToken0 > 0 && amountToken1 > 0,
            "Put some amount to stake"
        );
        require(
            poolFactory.getPoolAddress(_token0, _token1) != address(0),
            "Selected Pools not exist!"
        );

        Pool selectedPool = Pool(poolFactory.getPoolAddress(_token0, _token1));

        uint256 token0needed = selectedPool.token0NeedForStake(amountToken1);
        if (token0needed <= amountToken0) {
            selectedPool.fillPool(token0needed, amountToken1);
        } else {
            uint256 token1needed = selectedPool.token1NeedForStake(
                amountToken0
            );
            selectedPool.fillPool(amountToken0, token1needed);
        }
    }

    function unstake(
        address _token0,
        address _token1,
        uint8 percent
    ) public {
        require(
            percent > 0 && percent <= 100,
            "Percent must in between 1-100!!"
        );
        require(
            poolFactory.getPoolAddress(_token0, _token1) != address(0),
            "Selected Pools not exist!"
        );

        Pool selectedPool = Pool(poolFactory.getPoolAddress(_token0, _token1));

        selectedPool.drainPool(percent);
    }
}
