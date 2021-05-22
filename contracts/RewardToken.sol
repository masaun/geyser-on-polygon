// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice - This is a mock Reward Token contract 
 */
contract RewardToken is ERC20 {
    uint256 DECIMALS = 18;
    uint256 _totalSupply = 10 * 10**6 * 10**DECIMALS;    // 10 milion

    constructor() public ERC20("Mock Reward Token", "RWT") {
        _setupDecimals(uint8(DECIMALS));
        _mint(msg.sender, _totalSupply);
    }
}
