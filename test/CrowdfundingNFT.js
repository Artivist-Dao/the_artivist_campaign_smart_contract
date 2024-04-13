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
    // Get the ContractFactory and Signers here.
    CrowdfundingNFT = await ethers.getContractFactory("CrowdfundingNFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just call CrowdfundingNFT.deploy() and await for it to be deployed(), which happens once its transaction has been mined.
    crowdfundingNFT = await CrowdfundingNFT.deploy("MyToken", "MTK", ethers.utils.parseEther("0.01"));
    await crowdfundingNFT.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your tests.
    // Tests that the contract was deployed with the right owner.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These objects have a lot of utility methods to assert values.
      expect(await crowdfundingNFT.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await crowdfundingNFT.balanceOf(owner.address);
      expect(await crowdfundingNFT.totalSupply()).to.equal(ownerBalance);
    });
  });
});
