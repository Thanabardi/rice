//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./PoolFactory.sol";
import "./Pool.sol";

contract MoneyBall {
    address MATIC = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;
    address RICE = 0x87C2EBffe6C50eE034b4D05D2d3c2EC7b325e346;

    PoolFactory poolFactory;

    constructor(address _poolFactory) {
        poolFactory = PoolFactory(_poolFactory);
    }

    function getTotal(address tokenAddress)
        public
        view
        returns (uint256 amount)
    {
        return ERC20(tokenAddress).balanceOf(address(this));
    }

    function sendMoney(address to) public {
        uint256 totalMatic = getTotal(MATIC);
        uint256 totalRice = getTotal(RICE);

        ERC20(MATIC).transfer(to, totalMatic / 2);
        ERC20(RICE).transfer(to, totalRice / 2);

        Pool pool;
        if (poolFactory.getPoolAddress(MATIC, RICE) != address(0)) {
            pool = Pool(poolFactory.getPoolAddress(MATIC, RICE));
            pool.divined(
                RICE,
                MATIC,
                (totalMatic * 4) / 10,
                (totalRice * 4) / 10
            );
        } else {
            pool = Pool(poolFactory.getPoolAddress(RICE, MATIC));
            pool.divined(
                RICE,
                MATIC,
                (totalRice * 4) / 10,
                (totalMatic * 4) / 10
            );
        }

        ERC20(MATIC).transfer(address(pool), (totalMatic * 4) / 10);
        ERC20(RICE).transfer(address(pool), (totalRice * 4) / 10);
    }
}
