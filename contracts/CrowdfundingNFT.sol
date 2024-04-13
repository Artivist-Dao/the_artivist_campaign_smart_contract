// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract CrowdfundingNFT is ERC721Enumerable {
    uint256 public nextTokenId;
    uint256 public price;
    uint256 public raisedAmount;
    string private _tokenName;
    string private _tokenSymbol;
    address public owner;

    struct Campaign {
        string name;
        string description;
        uint256 goalAmount;
        bool active;
    }

    Campaign[] public campaigns;

    // Event for new campaign creation
    event CampaignCreated(uint256 indexed campaignId, string name, uint256 goalAmount);

    // Event for NFT purchase
    event NFTBought(uint256 indexed tokenId, uint256 indexed campaignId, address buyer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(string memory name_, string memory symbol_, uint256 _price) ERC721(name_, symbol_) {
        _tokenName = name_;
        _tokenSymbol = symbol_;
        price = _price;
        owner = msg.sender; // Set the contract deployer as the initial owner
    }

    function createCampaign(string memory _name, string memory _description, uint256 _goalAmount) public onlyOwner {
        campaigns.push(Campaign({
            name: _name,
            description: _description,
            goalAmount: _goalAmount,
            active: true
        }));
        emit CampaignCreated(campaigns.length - 1, _name, _goalAmount);
    }

    function buyNFT(uint256 campaignId) public payable {
        require(campaignId < campaigns.length, "Campaign does not exist");
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.active, "Campaign is not active");
        require(msg.value == price, "Ether sent is not correct");
        require(raisedAmount + msg.value <= campaign.goalAmount, "Goal reached or exceeded");

        _mint(msg.sender, nextTokenId);
        emit NFTBought(nextTokenId, campaignId, msg.sender);
        
        nextTokenId++;
        raisedAmount += msg.value;

        if (raisedAmount >= campaign.goalAmount) {
            campaign.active = false;
        }
    }

    function withdrawFunds() public onlyOwner {
        require(address(this).balance > 0, "No funds available");
        payable(owner).transfer(address(this).balance);
    }

    function getCampaignCount() public view returns (uint256) {
        return campaigns.length;
    }

    function getCampaign(uint256 campaignId) public view returns (Campaign memory) {
        require(campaignId < campaigns.length, "Campaign does not exist");
        return campaigns[campaignId];
    }

    function getRaisedAmountForCampaign(uint256 campaignId) public view returns (uint256) {
        require(campaignId < campaigns.length, "Campaign does not exist");
        return campaigns[campaignId].goalAmount;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        owner = newOwner;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
