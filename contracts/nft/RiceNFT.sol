pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RiceNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public owner;
    address public recentAward;

    mapping(address => uint256[]) public inventory;

    enum State {
        OPENED,
        CLOSED
    }
    State public status;

    constructor() ERC721("RiceNFT", "RND") {
        // only open when a VoteSession is ended
        status = State.CLOSED;
        owner = msg.sender;
    }

    function setAward(address _award) public {
        recentAward = _award;
    }

    function getInventory(address x) public view returns (uint256[] memory) {
        return inventory[x];
    }

    function sendingNFT(
        address from,
        address to,
        uint256 id
    ) public {
        transferFrom(from, to, id);

        for (uint256 i = 0; i <= inventory[from].length; i++) {
            if (inventory[from][i] == id) {
                inventory[from][i] = inventory[from][
                    inventory[from].length - 1
                ];
                inventory[from].pop();
                break;
            }
        }

        inventory[to].push(id);
    }

    function award(string memory tokenURI) public returns (uint256) {
        require(status == State.OPENED, "Unable to mint since NFT is closed");
        require(tx.origin == owner, "Not Owner");
        require(recentAward != address(0), "Award Address not exist!");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        // mint NFT to winner address
        _mint(recentAward, newItemId);
        inventory[recentAward].push(newItemId);

        // set tokenURI for winner
        _setTokenURI(newItemId, tokenURI);

        status = State.CLOSED;

        setAward(address(0));
        return newItemId;
    }

    function handleNFT() public returns (uint256[] memory list) {
        uint256[] memory listId;
        uint256 count = 0;
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (ownerOf(i) == msg.sender) {
                listId[count] = i;
                count++;
            }
        }
        return listId;
    }

    function openNFT() public {
        status = State.OPENED;
    }
}
