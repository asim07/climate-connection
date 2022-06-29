import "./App.css";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import Web3 from "web3";
import contractData from "./constants/contract";
const CoinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  appName: "Web3-react Demo",
  supportedChainIds: [1, 3, 4, 5, 42],
});

const WalletConnect = new WalletConnectConnector({
  rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});
function App() {
  const [nftId, setNftid] = useState('');

const mintingAddress =   contractData.contractAddress
  const SelectiveMint = async () => {
    const provider = await Injected.activate();
    // console.log(provider.provider);
    const web3 = new Web3(provider.provider);
    const contract = new web3.eth.Contract(contractData.abi, mintingAddress);
    const address = await web3.eth.getAccounts();
    let price = await contract.methods.purchasePrice().call();
    price = web3.utils.fromWei(`${price}`,'ether');
    price =  Web3.utils.toWei(`${price}`,'ether')
    console.log("price : ", price );
    const tx = {
      to: contractData.contractAddress,
      from: address[0],
      value: price,
    };
    let gasfee = await contract.methods
      .safeMint(address[0])
      .estimateGas(tx);
    tx.gas = web3.utils.toHex(gasfee);
    const mint = await contract.methods.safeMint(address[0]).send(tx);
    const data = mint.events.Transfer.returnValues.tokenId;
    console.log(mint);
    console.log("Minted Id is ", data);
    setNftid(`Minted Token : ${data}`);
  };
  const { active, chainId, account } = useWeb3React();

  console.log(
    "active : ",
    active,
    "chainID : ",
    chainId,
    "Account : ",
    account
  );

  const { activate, deactivate } = useWeb3React();

  return (
    <div className="App">
      <button
        onClick={() => {
          activate(CoinbaseWallet);
        }}
      >
        Coinbase Wallet
      </button>
      <button
        onClick={() => {
          activate(WalletConnect);
        }}
      >
        Wallet Connect
      </button>
      <button
        onClick={() => {
          activate(Injected);
        }}
      >
        Metamask
      </button>
      <button onClick={deactivate}>Disconnect</button>
      <div>{`Connection Status: ${active}`}</div>
      <div>{`Account: ${account}`}</div>
      <div>{`Network ID: ${chainId}`}</div>
      <div style={{ display: "flex", marginTop: "100px", marginLeft: "100px" }}>
      <a
          href={`https://testnets.opensea.io/assets/${mintingAddress}/${nftId}`}
        >
          view {nftId} of contract {mintingAddress}
        </a>
        <button onClick={SelectiveMint}>Mint</button>
      </div>
      <div>
        <h1>{nftId}</h1>
      </div>
      <div style={{ display: "flex", marginTop: "100px" }}>
        
      </div>
    </div>
  );
}

export default App;
