// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NFTReceipt
 * @dev NFT Receipt contract for expense tracking
 */
contract NFTReceipt is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct ReceiptMetadata {
        uint256 amount;
        string category;
        string description;
        uint256 timestamp;
        string merchant;
        string transactionHash;
    }

    mapping(uint256 => ReceiptMetadata) private receiptData;

    event ReceiptMinted(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 amount,
        string category,
        uint256 timestamp
    );

    constructor() ERC721("Expense Receipt NFT", "RECEIPT") {}

    /**
     * @dev Mint a new receipt NFT
     */
    function mintReceipt(
        address _to,
        uint256 _amount,
        string memory _category,
        string memory _description,
        string memory _merchant,
        string memory _transactionHash,
        string memory _tokenURI
    ) external returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        receiptData[tokenId] = ReceiptMetadata({
            amount: _amount,
            category: _category,
            description: _description,
            timestamp: block.timestamp,
            merchant: _merchant,
            transactionHash: _transactionHash
        });

        emit ReceiptMinted(tokenId, _to, _amount, _category, block.timestamp);

        return tokenId;
    }

    /**
     * @dev Get receipt metadata
     */
    function getReceiptData(uint256 _tokenId) 
        external 
        view 
        returns (ReceiptMetadata memory) 
    {
        require(_exists(_tokenId), "Receipt does not exist");
        return receiptData[_tokenId];
    }

    /**
     * @dev Override required functions
     */
    function _burn(uint256 tokenId) 
        internal 
        override(ERC721, ERC721URIStorage) 
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
