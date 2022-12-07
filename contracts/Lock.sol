// SPDX-License-Identifier: MIT
//0--- sold,resell out 1---not sold,not resell
pragma solidity >=0.6.0 <0.9.0;



import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Lock is Ownable,ERC721URIStorage{
    

    uint256 public tokenId;

    
    uint256 public royaltyFee;


    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        string URL;
        uint256 state;
        uint256 extPay;
    }
    
    struct SoldItem {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        string URL;
        uint256 state;
       
    }


    uint256[] public marketItems;
    mapping(uint256=>MarketItem) public marketDisplay;

    uint256[] public soldItems;
    mapping(uint256=>SoldItem) public soldDisplay;

    constructor()ERC721("DAppFi", "MANTIC"){
        tokenId=1746;
    }

    function mintNFT(string memory uri,uint256 _price)external payable returns(uint256){
        
        uint256 newId=tokenId+1;
        _mint(msg.sender,newId);
        _setTokenURI(newId,uri);
        marketItems.push(newId);
        uint256 extPay=(_price*3)/100;

        marketDisplay[newId]=MarketItem({tokenId:newId,seller:payable(msg.sender), price:_price,URL:uri,state:1,extPay:extPay});
        tokenId=newId;

        return newId;

        
        
        
    }

    function seeTokens()external view returns( uint256[] memory){
        return (marketItems);
    }
    function seeSoldTokens()external view returns( uint256[] memory){
        return (soldItems);
    }


     function buyToken(uint256 _tokenId) external payable {
        uint256 price = marketDisplay[_tokenId].price;
        

        
        require(
            msg.value == price,
            "Please send the asking price in order to complete the purchase"
        );
        (marketDisplay[_tokenId].seller).transfer(price);
        marketDisplay[_tokenId].seller=payable(msg.sender);
        marketDisplay[_tokenId].state=0; 
        soldItems.push(_tokenId);

        soldDisplay[ _tokenId]=SoldItem({tokenId:_tokenId,seller:payable(msg.sender), price:price,URL:marketDisplay[_tokenId].URL,state:1});


    }

    function resellToken(uint256 _price,uint256 _tokenId)external{
        require(msg.sender==soldDisplay[_tokenId].seller,"You are not the owner");
        uint256 extPay=_price*3/100;

        SoldItem storage newItem=soldDisplay[ _tokenId];
        
        
        newItem.price=_price;
        newItem.URL=marketDisplay[_tokenId].URL;
        newItem.state=0;

        MarketItem storage Item=marketDisplay[ _tokenId];
        
        Item.seller=payable(msg.sender);
        Item.price=_price;
        Item.extPay=extPay;
        
        Item.state=1;
    }


         
}
//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)

// pragma solidity >=0.6.0 <0.9.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// contract Lock is ERC721URIStorage, Ownable {

//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenIds;
//     Counters.Counter private _totalMinted;
    
//     mapping(address => uint8) private mintedAddress;
//     mapping(string => uint8) private URIMapping;
    
//     uint256 public PRICE_PER_TOKEN = 0.01 ether;
//     uint256 public LIMIT_PER_ADDRESS = 2;
//     uint256 public MAX_SUPPLY  = 5;

//     constructor() ERC721("Collection", "NFT") {}
    
//     function setPrice(uint256 price) external onlyOwner{
//         PRICE_PER_TOKEN = price;
//     }
    
//     function setLimit(uint256 limit) external onlyOwner{
//         LIMIT_PER_ADDRESS = limit;
//     }
    
//     function setMaxSupply(uint256 max_supply) external onlyOwner{
//         MAX_SUPPLY = max_supply;
//     }
    
//     function mintNFT(string memory tokenURI)
//         payable
//         external
//         returns (uint256)
//     {
//         require(PRICE_PER_TOKEN <= msg.value, "Ether paid is incorrect");
//         require(mintedAddress[msg.sender] < LIMIT_PER_ADDRESS, "You have exceeded minting limit");
//         require(_totalMinted.current() + 1 <= MAX_SUPPLY, "You have exceeded Max Supply");
//         require(URIMapping[tokenURI] == 0, "This NFT has already been minted");
//         URIMapping[tokenURI] += 1;
//         mintedAddress[msg.sender] += 1;
//         _tokenIds.increment();
//         _totalMinted.increment();

//         uint256 newItemId = _tokenIds.current();
//         _mint(msg.sender, newItemId);
//         _setTokenURI(newItemId, tokenURI);

//         return newItemId;
//     }
    
//     function withdrawMoney() external onlyOwner{
//         address payable to = payable(msg.sender);
//         to.transfer(address(this).balance);
//     }
// }
//PRIVATE_KEY=0x8b1eb2a57c12241feef83537f8e38c2ec5a26d7438d82f3babff2f7f460bb64b
//REACT_APP_CONTRACT=0xeB1Bd2bE1a226FE9493849fd2da818EB4B9925ba