// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IHangoutMetaverse {
    function LaaLaa() external view returns(bool);
}

contract Spacecraft {

    IHangoutMetaverse public hangout;

    function beforeWork() private {
        while(!hangout.LaaLaa()) {
            console.log("This is Major Tom to Ground Control!");
        }
    }

}
