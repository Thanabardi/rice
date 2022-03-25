pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RiceNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    address public owner;

    enum State {OPENED, CLOSED}
    State public status;

    constructor() ERC721("RiceNFT", "RND") {
        // only open when a VoteSession is ended
        status = State.CLOSED;
        owner = msg.sender;
    }

    function award(address _to, string memory tokenURI) public returns (uint) {
        require(status == State.OPENED, "Unable to mint since NFT is closed");
        require(tx.origin == owner, "Not Owner");

        _tokenIds.increment();

        uint newItemId = _tokenIds.current();

        // mint NFT to winner address
        _mint(_to, newItemId);

        // set tokenURI for winner
        _setTokenURI(newItemId, tokenURI);

        status = State.CLOSED;

        return newItemId;
    }

    function openNFT() public {
        require(tx.origin == owner, "Not Owner");
        status = State.OPENED;
    }
}
