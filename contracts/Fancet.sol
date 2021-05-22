// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import { LPToken } from "./LPToken.sol";
import { RewardToken } from "./RewardToken.sol";
import { GeyserToken } from "./geyser/GeyserToken.sol";
/**
 * @notice - This is the Fancet contract
 */
contract Fancet {

    LPToken public lpToken;
    RewardToken public rewardToken;
    GeyserToken public geyserToken;

    constructor(LPToken _lpToken, RewardToken _rewardToken, GeyserToken _geyserToken) public {
        lpToken = _lpToken;
        rewardToken = _rewardToken;
        geyserToken = _geyserToken;
    }

    function transferLPToken() public returns (bool) {
        uint amount = 1e3 * 1e18;  // 1000
        lpToken.transferFrom(msg.sender, address(this), amount);
    }

    function transferRewardToken() public returns (bool) {
        uint amount = 1e3 * 1e18;  // 1000
        rewardToken.transferFrom(msg.sender, address(this), amount);
    }

    function transferGeyserToken() public returns (bool) {
        uint amount = 1e3 * 1e18;  // 1000
        geyserToken.transferFrom(msg.sender, address(this), amount);
    }

}
