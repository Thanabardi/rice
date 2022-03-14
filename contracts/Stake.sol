//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Pool.sol";
import "./PoolFactory.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

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
            poolFactory.getPoolAddress(_token0, _token1) != address(0) ||
                poolFactory.getPoolAddress(_token1, _token0) != address(0),
            "Selected Pools not exist!"
        );

        Pool selectedPool;

        if (poolFactory.getPoolAddress(_token0, _token1) != address(0)) {
            selectedPool = Pool(poolFactory.getPoolAddress(_token0, _token1));
        } else {
            selectedPool = Pool(poolFactory.getPoolAddress(_token1, _token0));
            address t0 = _token0;
            address t1 = _token1;
            _token0 = t1;
            _token1 = t0;
            uint256 temp0 = amountToken0;
            uint256 temp1 = amountToken1;
            amountToken1 = temp0;
            amountToken0 = temp1;
        }

        uint256 token0needed = selectedPool.token0NeedForStake(amountToken1);
        if (token0needed <= amountToken0) {
            ERC20(_token0).transferFrom(
                msg.sender,
                address(selectedPool),
                token0needed
            );
            ERC20(_token1).transferFrom(
                msg.sender,
                address(selectedPool),
                amountToken1
            );
            selectedPool.fillPool(token0needed, amountToken1, msg.sender);
        } else {
            uint256 token1needed = selectedPool.token1NeedForStake(
                amountToken0
            );
            ERC20(_token0).transferFrom(
                msg.sender,
                address(this),
                amountToken0
            );
            ERC20(_token1).transferFrom(
                msg.sender,
                address(this),
                token1needed
            );
            selectedPool.fillPool(amountToken0, token1needed, msg.sender);
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
            poolFactory.getPoolAddress(_token0, _token1) != address(0) ||
                poolFactory.getPoolAddress(_token1, _token0) != address(0),
            "Selected Pools not exist!"
        );

        Pool selectedPool;

        if (poolFactory.getPoolAddress(_token0, _token1) != address(0)) {
            selectedPool = Pool(poolFactory.getPoolAddress(_token0, _token1));
        } else {
            selectedPool = Pool(poolFactory.getPoolAddress(_token1, _token0));
        }
        selectedPool.drainPool(percent, msg.sender);
    }

    function getStakeAmount(address _token0, address _token1)
        public
        view
        returns (uint256 atoken0, uint256 atoken1)
    {
        require(
            poolFactory.getPoolAddress(_token0, _token1) != address(0) ||
                poolFactory.getPoolAddress(_token1, _token0) != address(0),
            "Selected Pools not exist!"
        );

        Pool selectedPool;

        if (poolFactory.getPoolAddress(_token0, _token1) != address(0)) {
            selectedPool = Pool(poolFactory.getPoolAddress(_token0, _token1));
        } else {
            selectedPool = Pool(poolFactory.getPoolAddress(_token1, _token0));
        }
        return selectedPool.getStakeAmount(msg.sender);
    }
}
