const hre = require("hardhat")
const { ethers } = require("hardhat");

var deployer = null

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}
 
const sendTokens = async () => {
  // Definindo as contas
  const senderAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const recipientAddress = "0x17eDfB8a794ec4f13190401EF7aF1c17f3cc90c5";

  // Obtendo o signer para a conta do remetente
  const sender = await ethers.provider.getSigner(senderAddress);

  // Definindo a quantidade a ser enviada (por exemplo, 1 ETH)
  const amount = ethers.utils.parseEther("1"); // Altere "1" para a quantidade desejada

  // Enviando os tokens
  const tx = await sender.sendTransaction({
      to: recipientAddress,
      value: amount
  });

  console.log(`Transaction hash: ${tx.hash}`);

  await tx.wait(); // Aguardando a transação ser confirmada

  console.log(`Tokens enviados com sucesso para ${recipientAddress}!`);
}

const deploySmartContract = async (name, args = []) => {
  
  const Contract = await ethers.getContractFactory(name)
  const contract = await Contract.deploy(...args)
  await contract.deployed()

  console.log(`Deployed ${name} Contract at: ${contract.address}\n`)

  return contract
}

async function main() {
  // Setup accounts
  [deployer] = await ethers.getSigners()
  await sendTokens();

  // Deploy
  const campaignSmartContract = await deploySmartContract("Campaign") 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
