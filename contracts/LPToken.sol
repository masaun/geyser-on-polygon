// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice - This is a mock UNI-V2 LP Token contract 
 */
contract LPToken is ERC20 {
    uint256 DECIMALS = 18;
    uint256 _totalSupply = 10 * 10**6 * 10**DECIMALS;

    constructor() public ERC20("Mock UNI-V2 LP Token", "UNI-V2") {
        _setupDecimals(uint8(DECIMALS));
        _mint(msg.sender, _totalSupply);
    }
}
