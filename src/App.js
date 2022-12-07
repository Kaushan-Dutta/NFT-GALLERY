import React,{useState,useEffect} from 'react';
import {Route,Routes} from 'react-router-dom';
import Home from './components/Home.js';
import MyTokens from './components/MyTokens.js';
import Contract from './artifacts/contracts/Lock.sol/Lock.json';

import Web3 from 'web3';
import {NavLink} from 'react-router-dom';
import './App.css';



const App = () => {
  const defaultAcc="0x000000000000000000000000000000000000000"
  const [account, setAccount] = useState(defaultAcc);
  const [contract, setContract] = useState(null);
  const [provider,setProvider]=useState(null);

  const [fetch,setFetch]=useState(true);

  const setPath=async()=>{

      let provider=null;
       if(window.ethereum){
        provider=window.ethereum;
        try{
           await provider.enable();
        }
        catch(err){
          console.log(err);
        }
       }
       const web3=new Web3(provider);
       const account=await web3.eth.getAccounts();
       try{
        if(account.length){
                const contract=new web3.eth.Contract(Contract.abi,process.env.REACT_APP_CONTRACT);
              console.log(contract.methods);
              
              setFetch(false);
              setContract(contract);
              setAccount(account.toString());
              setProvider(web3);
         }
        }
       catch(err){
        console.log(err);
       }
       


  }

  return (
    <>
         <div className='navbar'>
            <div className='container'>
                <div className='links'>
                  <ul>
                    <li><NavLink to="" style={{color:"white",letterSpacing:"3px",fontSize:"20px"}}>MAKERS</NavLink></li>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/sold-art">Sold NFTs</NavLink></li>
                  </ul>
                </div>
                <div className='address'>
                    {account}
                </div>
            </div>
         </div>
        {
          fetch?<>
          <div className='connectWallet'>
            <div className='container px-5 py-5 '>
              <div className='content'>
              <p><b>Connect your Metamask Wallet, to fetch the gallery</b></p>
                <button className='px-3 py-3' onClick={setPath}>Connect Wallet</button>
              </div>
            </div>
          </div>
          </>:<>
            <Routes>
              <Route path="/" element={<Home contract={contract} provider={provider} account={account}/>}/>
              <Route path="/sold-art" element={<MyTokens contract={contract} provider={provider} account={account}/>}/>
              
             {/*  <Route path="/" element={
                <Home contract={contract} />
              } />
              <Route path="/my-tokens" element={
                <MyTokens contract={contract} />
              } />
              <Route path="/my-resales" element={
                <MyResales contract={contract} account={account} />
              } /> */}
          </Routes>
          </>
        }

       
    </>
  )
}

export default App

/* import "./App.css";
import Web3 from 'web3';
import { useEffect, useState } from "react";
import contractABI from "./artifacts/contracts/Lock.sol/Lock.json";

import { createAvatar } from '@dicebear/avatars';
//import * as style from '@dicebear/avatars-identicon-sprites';
//import * as style from '@dicebear/avatars-avataaars-sprites';
import * as style from '@dicebear/avatars-pixel-art-sprites';


let svg = createAvatar(style, {
  seed: '0x3859083dfd',
  dataUri: true,
  // ... and other options
});
 
const contractAddress = process.env.REACT_APP_CONTRACT;
 
function App() {
 
  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState({});
  // state for whether app is minting or not.
  const [isMinting, setIsMinting] = useState(false);
 
  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);
 
  useEffect(() => {
      async function initNFTContract() {
        /* const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setNFTContract(new Contract(contractAddress,contractABI.abi,signer));
        const web3=new Web3(window.ethereum);
        const contract=new web3.eth.Contract(contractABI.abi,contractAddress);
        setNFTContract(contract);
      }
      initNFTContract();
  }, [account]);
 
 
  async function connectWallet() {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts) => {
        setAccount(accounts[0]);
      })
      .catch((error) => {
        alert("Something went wrong");
      });
  }

  const data = [
    {
      url: "https://ipfs.io/ipfs/QmZTzaqzboFEGDx9quw7E6X1RoFPN5krgpcMEgoA5RVorH/1.jpg",
      param: "handleMint('https://ipfs.io/ipfs/QmZTzaqzboFEGDx9quw7E6X1RoFPN5krgpcMEgoA5RVorH/1.json')",
    },
    {
      url: "https://ipfs.io/ipfs/QmZTzaqzboFEGDx9quw7E6X1RoFPN5krgpcMEgoA5RVorH/2.jpg",
      param: "handleMint('https://ipfs.io/ipfs/QmZTzaqzboFEGDx9quw7E6X1RoFPN5krgpcMEgoA5RVorH/2.json')",
    },
    {
      url: "https://ipfs.io/ipfs/QmZTzaqzboFEGDx9quw7E6X1RoFPN5krgpcMEgoA5RVorH/3.jpg",
      param: "handleMint('https://ipfs.io/ipfs/QmZTzaqzboFEGDx9quw7E6X1RoFPN5krgpcMEgoA5RVorH/3.json')",
    },
    {
      url: "https://ipfs.io/ipfs/QmZTzaqzboFEGDx9quw7E6X1RoFPN5krgpcMEgoA5RVorH/4.jpg",
      param: "handleMint('https://ipfs.io/ipfs/QmZTzaqzboFEGDx9quw7E6X1RoFPN5krgpcMEgoA5RVorH/4.json')",
    },
    
  ];
 
  async function withdrawMoney(){
    try {
      const response = await NFTContract.methods.withdrawMoney().call();
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }
  }
 
  async function handleMint(tokenURI) {
    setIsMinting(true);
      try {
        //const options = {value: ether.utils.parseEther("0.01")};
        const response = await NFTContract.methods.mintNFT(tokenURI).send({from:account});
        console.log("Received: ", response);
      } catch (err) {
        alert(err);
      }
      finally {
        setIsMinting(false);
      }
  }
 
  if (account === null) {
    return (
      <>
        <div className="container">
          <br/>
          <h1>🔮 metaschool</h1>
          <h2>NFT Marketplace</h2>
          <p>Buy an NFT from our marketplace.</p>

          {isWalletInstalled ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <p>Install Metamask wallet</p>
          )}
        </div>
      </>
    );
  }
 
  return (
    <>
      <div className="container">
        <br/>
        <h1>🔮 metaschool</h1>
      
        <h2>NFT Marketplace</h2>
          {data.map((item, index) => (
            <div className="imgDiv">
              <img
                src={item.url}
                key={index}
                alt="images"
                width={250}
                height={250}
              />
              <button isLoading={isMinting}
                onClick={() => {
                  eval(item.param);
                }}
              >
                Mint - 0.01 eth
              </button>
            </div>
          ))}
            <button 
              onClick={() => {
                withdrawMoney();
              }}
            >
              Withdraw Money from Contract
            </button>
            <img src={svg}/>
      </div>
    </>
  );
}
 
export default App; */
//0xC4daC87eEDd74B2CC8446a2B1B393f36074B4dd6