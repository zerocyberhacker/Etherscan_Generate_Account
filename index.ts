import axios from 'axios';
import Web3 from 'web3';
import * as dov from  'dotenv';

dov.config();

//init web3
const web3 = new Web3(Web3.givenProvider);

getData();

async function getData(){
    const privateKey = generatePrivateKey();
    const publicKey = String(web3.eth.accounts.privateKeyToAccount(privateKey).address);
    let result : any = ''; 
    for(let i = 0 ; i < 1 ; i++){
        result = await getWalletData(publicKey,privateKey);
        if(Number(result) == 0){
            console.log();
            getData()
        } else {
            return
        }
    }
}

async function getWalletData(walletAddress: string, privateKey: string) {
    const apiKey = process.env.ETHERSCAN_API_KEY;
    const apiUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${apiKey}`;
    try {
      const response = await axios.get(apiUrl);
      const balanceInWei = response.data.result;
      const balanceInEther = parseFloat(balanceInWei) / 1000000000000000000;
      console.log('Public Key  :',walletAddress);
      console.log('Private Key :',privateKey);
      console.log('Balance     :',balanceInEther.toFixed(2),"ETH");
      return String(balanceInEther);
    } catch (error) {
      console.error(error);
    }
}

function generatePrivateKey(){
    let result = "";
    const characters = "ABCDEFabcdef0123456789";
    for (let i = 0; i < 64; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
