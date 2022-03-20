pragma solidity ^0.8.0;

import "./VoteExchange.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract VoteSession is VRFConsumerBase {
    uint256 public voteId;
    mapping(address => uint256) public voteMap;
    mapping(string => uint256) public riceParticipants;
    VoteExchange public voteExchange;
    address public owner;

    //random
    address[] public votePool;
    uint256 public fee;
    bytes32 public keyhash;
    address public winner;

    enum voteState {
        STARTED,
        ENDED
    }
    voteState public status;

    constructor(
        uint256 _voteId,
        address _voteExchangeAddress,
        address _coordinator,
        address _link,
        bytes32 _hash,
        uint256 _fee
    ) public VRFConsumerBase(_coordinator, _link) {
        //random
        keyhash = _hash;
        fee = _fee;
        owner = tx.origin;
        voteId = _voteId;
        status = voteState.STARTED;
        voteExchange = VoteExchange(_voteExchangeAddress);
        voteExchange.closeExchange();
        fee = _fee;
        keyhash = _hash;
    }

    function vote(uint256 _amount, string memory _twitterId) public {
        // making a vote that does not exceed the deposited RICE limit (100 votes)
        require(status == voteState.STARTED, "Vote session already ended");
        require(
            _amount > 0 && _amount <= 100,
            "Vote must be at least 1 and at most 100"
        );
        require(
            (voteExchange.voteExchange(msg.sender) / 10**18) >=
                _amount + voteMap[msg.sender],
            "Not have enough vote"
        );

        riceParticipants[_twitterId] += _amount;
        voteMap[msg.sender] += _amount;
        //random
        for (uint256 i = 0; i < _amount; i++) {
            votePool.push(msg.sender);
        }
    }

    function remainingVote(address _voter) public view returns (uint256) {
        // return remaining vote
        return voteExchange.voteExchange(_voter) / 10**18 - voteMap[_voter];
    }

    function endVote() public {
        // end the vote session for owner or out of time
        require(tx.origin == owner, "Not owner");
        status = voteState.ENDED;

        //random winner
        bytes32 requestID = requestRandomness(keyhash, fee);

        voteExchange.openExchange();
    }

    function fulfillRandomness(bytes32 requestId, uint256 _randomness)
        internal
        override
    {
        require(status == voteState.ENDED, "vote not end yet!!");
        require(_randomness > 0, "not found");

        uint256 indexOfWinner = _randomness % votePool.length;
        winner = votePool[indexOfWinner];
    }
}
