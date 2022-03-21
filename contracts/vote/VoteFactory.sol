pragma solidity ^0.8.0;

import "./VoteExchange.sol";
import "./VoteSession.sol";

contract VoteFactory {
    mapping(uint256 => VoteSession) public voteSessions;
    uint256 public voteId;
    address public owner;
    VoteExchange public voteExchange;

    //random
    address coordinator;
    address link;
    uint256 public fee;
    bytes32 public keyhash;

    constructor(
        address _voteExchangeAddress,
        address _coordinator,
        address _link,
        uint256 _fee,
        bytes32 _keyhash
    ) {
        owner = msg.sender;
        voteId = 0;
        voteExchange = VoteExchange(_voteExchangeAddress);

        //random
        coordinator = _coordinator;
        link = _link;
        fee = _fee;
        keyhash = _keyhash;
    }

    function createVoteSession() public {
        // create a new vote session
        require(tx.origin == owner, "Not owner");

        if (voteId != 0) {
            // latest vote session is working
            require(
                VoteSession(voteSessions[voteId]).status() ==
                    VoteSession.voteState.ENDED,
                "Latest vote session is not ended"
            );
        }

        voteId += 1;
        voteSessions[voteId] = new VoteSession(
            voteId,
            address(voteExchange),
            coordinator,
            link,
            keyhash,
            fee
        );
    }

    function getLatestSession() public view returns (address) {
        return address(voteSessions[voteId]);
    }
}
