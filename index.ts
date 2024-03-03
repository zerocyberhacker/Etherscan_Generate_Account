/** @format */

import axios from "axios";
import Web3 from "web3";
import * as dov from "dotenv";

dov.config();

//init web3
const web3 = new Web3(Web3.givenProvider);

getData();

async function getData() {
  const privateKey = generatePrivateKey();
  const publicKey = String(
    web3.eth.accounts.privateKeyToAccount(privateKey).address
  );
  let result: any = "";
  for (let i = 0; i < 1; i++) {
    result = await getWalletData(publicKey, privateKey);
    if (Number(result) == 0) {
      console.log();
      getData();
    } else {
      return;
    }
  }
}

function generatePrivateKey() {
  let result = "";
  const characters = "ABCDEFabcdef0123456789";
  for (let i = 0; i < 64; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function getWalletData(walletAddress: string, privateKey: string) {
  try {
    const eth: number = await getEthBalance(walletAddress);
    const matic: number = await getMaticBalance(walletAddress);
    console.log("Public Key  :", walletAddress);
    console.log("Private Key :", privateKey);
    console.log("ETH   :", await getEthBalance(walletAddress));
    console.log("BNB   :", await getMaticBalance(walletAddress));
    console.log("MATIC :", await getBnbBalance(walletAddress));

    if (eth === 0 || matic === 0) {
      return 0;
    }
  } catch (error) {
    console.error(error);
  }
}

async function getEthBalance(walletAddress: string): Promise<any> {
  const eth_apiKey = process.env.ETHERSCAN_API_KEY;
  const eth_apiUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${eth_apiKey}`;
  try {
    const response = await axios.get(eth_apiUrl);
    const balanceInWei = response.data.result;
    const balanceInEther = parseFloat(balanceInWei) / 1000000000000000000;
    const result =
      String(balanceInEther) === "NaN" ? 0 : String(balanceInEther.toFixed(4));
    return Number(result);
  } catch (error) {
    console.error(error);
  }
}

async function getMaticBalance(walletAddress: string): Promise<any> {
  const polygon_apiKey = process.env.POLYGONSCAN_API_KEY;
  const polygon_apiUrl = `https://api.polygonscan.com/api?module=account&action=balance&address=${walletAddress}&apikey=${polygon_apiKey}`;
  try {
    const response = await axios.get(polygon_apiUrl);
    const balanceInWei = response.data.result;
    const balanceInMatic = parseFloat(balanceInWei) / 1000000000000000000;
    const result =
      String(balanceInMatic) === "NaN" ? 0 : String(balanceInMatic.toFixed(4));
    return Number(result);
  } catch (error) {
    console.error(error);
  }
}

async function getBnbBalance(walletAddress: string): Promise<any> {
  const bnb_apiKey = process.env.POLYGONSCAN_API_KEY;
  const bnb_apiUrl = `https://api.bscscan.com/api?module=account&action=balance&address=${walletAddress}&apikey=${bnb_apiKey}`;
  try {
    const response = await axios.get(bnb_apiUrl);
    const balanceInWei = response.data.result;
    const balanceInBnb = parseFloat(balanceInWei) / 1000000000000000000;
    const result =
      String(balanceInBnb) === "NaN" ? 0 : String(balanceInBnb.toFixed(4));
    return Number(result);
  } catch (error) {
    console.error(error);
  }
}
