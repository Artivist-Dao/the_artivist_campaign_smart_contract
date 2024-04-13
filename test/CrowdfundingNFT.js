const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdfundingNFT", function () {
  let CrowdfundingNFT;
  let crowdfundingNFT;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    CrowdfundingNFT = await ethers.getContractFactory("CrowdfundingNFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    crowdfundingNFT = await CrowdfundingNFT.deploy("MyToken", "MTK", ethers.utils.parseEther("0.01"));
    await crowdfundingNFT.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await crowdfundingNFT.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await crowdfundingNFT.balanceOf(owner.address);
      expect(await crowdfundingNFT.totalSupply()).to.equal(ownerBalance);
    });
  });
});
