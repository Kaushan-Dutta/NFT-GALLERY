import React,{useEffect,useState} from "react";
import "./MyTokens.css";
import Image from "./P4.png";
import { FaEthereum} from 'react-icons/fa';
import axios from 'axios';


const MyTokens = ({contract,provider,account}) => {

  
  const [nft,setNFT]=useState([]);
  const [nftDetail,setNftDetail]=useState([]);
  const [fetchDetail,setFetchDetail]=useState([]);
  const [price,setPrice]=useState(0);
  

  
  

  useEffect(()=>{
     const loadContent=async()=>{
       const getTokens=await contract.methods.seeSoldTokens().call();
       
   
       let tokenIds=[];
       let tokensDetails=[]
       let fetchDetails=[]
       

       
       for(let i=0;i<getTokens.length;i++){

        

        
        
        tokenIds.push(getTokens[i]);
        
        const {tokenId,seller,price,URL,state}=await contract.methods.soldDisplay(getTokens[i]).call();
        console.log({tokenId,seller,price,URL,state});
        tokensDetails.push({tokenId:tokenId,seller:seller,price:price,URL:URL,state:state});
        
        const get=await axios.get(URL);
        
        const {name,descrip,url,attributes}=get.data;
        fetchDetails.push({name,descrip,url,attributes});

        
       
       setNFT(tokenIds);
       setNftDetail(tokensDetails);
       setFetchDetail(fetchDetails);
     
     
       
       

     }}
     loadContent();
  },[]);

  return (
    <div className="myToken">
      <div className="container px-5 py-5">
        <div className="itemBlock mt-5">
        {
          nft.map((object,id)=>{
            console.log(nftDetail[id])
            if(nftDetail[id].state==1){
              return(
                <>
                   <div className="item px-3 py-3 my-3">

                        <div className="image">
                        <img src={fetchDetail[id].url} />
                        </div>
                        <div className="contents mt-3">

                          <div className="nft-name">
                            <div className="random-image">
                            <img src={fetchDetail[id].url} />
                            </div>

                            <div className="nft-sign px-2">
                              <b>{fetchDetail[id].name}</b>
                              <p>{fetchDetail[id].descrip}</p>
                            </div>
                          </div>

                          <div className="nft-attributes py-1 ">
                          {
                                  (fetchDetail[id].attributes).map((object)=>{
                                    return(<button>{object}</button>)
                                  })
                                }
                              
                          </div>

                          <div className="nft-owner">
                              NFT Owner: <b style={{fontSize:"12px"}}>{nftDetail[id].seller}</b>

                          </div>

                          <div className="nft-auction mt-3">
                            <input type="number" onChange={(event)=>{
                              setPrice(event.target.value)
                            }} value={price}/>&nbsp;&nbsp;<span><button onClick={async()=>{
                                const resell=await contract.methods.resellToken(price,nft[id]).send({from:account});
                                try{
                                  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&& Resell Successful");
                                }
                                catch(err){
                                  console.log(err);
                                }
                            }}>Resell NFT</button></span>
                          </div>
                          
                        </div>
                  </div>
                  
                </>
              )
            }
          })
        }
          
         

        </div>
      </div>
    </div>
  );
};

export default MyTokens;
