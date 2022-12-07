const {expect}=require('chai');
const { ethers } = require('hardhat');
/* describe("Test",()=>{
  it("Calling Function",async()=>{
      //create an account
      const [owner]=await ethers.getSigners();
      console.log(owner.address);
      //creating instance of contract
      const contract=await ethers.getContractFactory("Lock");
      //deploy the contract
      const deploy=await contract.deploy();
      console.log(deploy);
      //interact with the contract
      const setGreet=await deploy.setGreeting("hello kaushan");
      const greet=await deploy.greeting();
      console.log(greet);
      expect(await deploy.greeting()).to.equal("Hello from Hardhat")
  })
}) */
describe("Using Hooks",()=>{
  let owner,contract,deploy;
  beforeEach(async()=>{
    [owner]=await ethers.getSigners();
    contract=await ethers.getContractFactory("Lock");
    deploy=await contract.deploy();
  });
  describe("Test Hooks",()=>{
    it("CALL FUNCTION",async()=>{
      const check=await deploy.greet();
      console.log(check);
    })
  })
})