
import React ,{useState,useEffect} from 'react';
import './Home.css';
import axios from 'axios';
import { TiMediaPlayReverse} from 'react-icons/ti';
import { TiMediaPlay } from 'react-icons/ti';
import { HiPlay } from 'react-icons/hi';
import { CgPlayStopO } from 'react-icons/cg';
import Image from './P4.png';
import { FaEthereum} from 'react-icons/fa';


const Home = ({contract,provider,account}) => {
  
  const [data,setData]=useState({url:"",price:""});
  const [nft,setNFT]=useState([]);
  const [nftDetail,setNftDetail]=useState([]);
  const [fetchDetail,setFetchDetail]=useState([]);
  

  
  

  useEffect(()=>{
     const loadContent=async()=>{
       const getTokens=await contract.methods.seeTokens().call();
       
      
       /* const get=await axios.get("https://gateway.pinata.cloud/ipfs/QmYinmJnbCyEHTECdWDnL2wDtHnFNNWtVaXPbAW5LfBisM/A2.json");
       const {name,descrip,url,attributes}=get.data;

       console.log("-------------------------------->",attributes); */
       let tokenIds=[];
       let tokensDetails=[]
       let fetchDetails=[]
       

       
       for(let i=0;i<getTokens.length;i++){
        
        
        tokenIds.push(getTokens[i]);
        const {tokenId,seller,price,URL,state,extPay}=await contract.methods.marketDisplay(getTokens[i]).call();
        tokensDetails.push({tokenId:tokenId,seller:seller,price:price,URL:URL,state:state,extPay:extPay});
        const get=await axios.get(URL);
        const {name,descrip,url,attributes}=get.data;
        fetchDetails.push({name,descrip,url,attributes});

        
       }
       setNFT(tokenIds);
       setNftDetail(tokensDetails);
       setFetchDetail(fetchDetails);

       
       

     }
     loadContent();
  },[]);

  let Name="",Value="";
  async function getData(event){
      event.preventDefault();
      Name=event.target.name;
      Value=event.target.value;
      
      setData({...data,[Name]:Value});
  }
  
  return (
    <><div className='home px-5'>
      <div className='container px-5 py-5'>

        <div className='inputField px-1 pt-1 pb-2'>
          <input type="text" className=' mt-2' placeholder="Enter the url" onChange={getData} value={data.url} name="url"/>&nbsp;&nbsp;<span>
          
          <input type="number" name="price" className=' mt-2' placeholder="Enter the price" onChange={getData} value={data.price}/></span><br></br>

          <button className='px-2 py-1 mt-2' onClick={async()=>{
              const Url=data.url;
              const Price=parseInt(data.price);
              const sendTokens=await contract.methods.mintNFT(Url,Price).send({from:account});
              try{
                console.log(sendTokens);
              }
              catch(err){
                console.log("Error while miniting",err);
              }
              
               
          }}>Mint NFT</button>
        </div>

       <div className='itemBlock mt-5'>

         { 
          nft.map((object,id)=>{
           if(nftDetail[id].state==1){

          
            return(
              <>
                    <div className='item px-3 py-3 my-3 mx-3'>
                        
                        <div className='image'>
                            <img src={fetchDetail[id].url} />
                        </div>

                        <div className='contents mt-3'>

                          <div className='nft-name'>
                            <div className='random-image'>
                                <img src={fetchDetail[id].url} />
                            </div>
                            <div className='nft-sign px-2'>
                              <b>{fetchDetail[id].name}</b>
                              <p>{fetchDetail[id].descrip}</p>
                             
                            </div>
                          </div>

                          <div className='nft-attributes py-1 '>
                              
                                {
                                  (fetchDetail[id].attributes).map((object)=>{
                                    return(<button>{object}</button>)
                                  })
                                }
                              
                          </div>

                          <div className='nft-owner'>
                            NFT Owner: <b style={{fontSize:"12px"}}>{nftDetail[id].seller}</b>
                          </div>

                          <div className='nft-sell mt-2'>
                              <p><b style={{fontSize:"18px",position:"relative",top:"5px"}}><FaEthereum/>&nbsp;&nbsp;{nftDetail[id].price.toString()+"+"+nftDetail[id].extPay.toString()}</b></p>
                              <button style={{fontFamily: 'Raleway, sans-serif'}} onClick={async()=>{
                                      const buyToken=await contract.methods.buyToken(parseInt(nft[id])).send({from:account, value:nftDetail[id].price.toString() });
                                      try{
                                        console.log(buyToken);
                                      }
                                      catch(err){
                                        console.log(err);
                                      }
                                      
                              }}>Buy NFT</button>
                          </div> 

                        </div>
                      
                    </div>

              </>
            )
             

          
          




           
           
        /* 
           const solidity=async(object)=>{
             
             const {tokenId,seller,price,URL,state,extPay}=await contract.methods.marketDisplay(object).call();
           
             

             try{
              console.log("Got data from smart contract",URL,price,state);
              return(tokenId);

             }
            catch(err){
              console.log("Error while fetching data from bloackchain",err);
            }
           }

           const axiosData=async(object,URL)=>{

            const get=await axios.get(URL);
            const {name,descrip,url,attributes}=get.data;
            return({name,descrip,url,attributes});
           }
           
           const get=solidity(object);
           console.log("+++++++++++++//////////////////",get);
           const {name,descrip,url,attributes}=axiosData(object,URL); */

           

            
           /* if(state==1){
            return(
              <>
                    <div className='item px-3 py-3'>
                        
                        <div className='image'>
                            <img src={url} />
                        </div>

                        <div className='contents mt-3'>

                          <div className='nft-name'>
                            <div className='random-image'>
                                <img src={url} />
                            </div>
                            <div className='nft-sign px-2'>
                              <b>{name}</b>
                              <p>{descrip}</p>
                            </div>
                          </div>

                          <div className='nft-attributes py-1 '>
                              
                                {
                                  attributes.map((object)=>{
                                    return(<button>{object}</button>)
                                  })
                                }
                              
                          </div>

                          <dv className='nft-owner'>
                            NFT Owner: <b style={{fontSize:"12px"}}>{seller}</b>
                          </dv>

                          <div className='nft-sell mt-2'>
                              <p><b style={{fontSize:"18px",position:"relative",top:"5px"}}><FaEthereum/>&nbsp;&nbsp;{price.toString()+"+"+extPay.toString()}</b></p>
                              <button style={{fontFamily: 'Raleway, sans-serif'}}>Buy NFT</button>
                          </div>

                        </div>
                      
                    </div>

              </>
            )
          }        
            

 */
           
}})}

 
 
        





       
        
      </div>
      </div></div>
    </>
  )
}

export default Home