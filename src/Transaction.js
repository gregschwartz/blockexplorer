import React from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
var transaction = {};

function Transaction() {
  const { transactionHash } = useParams();
  const [blockNumber, setBlockNumber] = useState();

  async function getTransaction() {
    transaction = await alchemy.core.getTransaction(transactionHash);
    console.log(transaction);

    //used to tell React to render, I'm sure there's a better way though.
    setBlockNumber(transaction.blockNumber);
  }

  useEffect(() => {
    getTransaction();
  });
  
  if (transaction.from === undefined) {
    return <h1>Invalid transaction id!</h1>
  }

  return (
    <div className="App">
      <h1>
        Block: 
        <Link to={`/block/${transaction.blockNumber}`}>{blockNumber}</Link>
      </h1>
      <table id="blockParts">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>From</td>
            <td>{transaction.from}</td>
          </tr>
          <tr>
            <td>To</td>
            <td>{transaction.to}</td>
          </tr>
          <tr>
            <td>value</td>
            <td>{transaction.value.toString()}</td>
          </tr>
          <tr>
            <td>accessList</td>
            <td>{transaction.accessList}</td>
          </tr>
          <tr>
            <td>chainId</td>
            <td>{transaction.chainId}</td>
          </tr>
          <tr>
            <td>confirmations</td>
            <td>{transaction.confirmations}</td>
          </tr>
          <tr>
            <td>creates</td>
            <td>{transaction.creates}</td>
          </tr>
          <tr>
            <td>data</td>
            <td>{transaction.data}</td>
          </tr>
          <tr>
            <td>gasLimit</td>
            <td>{transaction.gasLimit.toString()}</td>
          </tr>
          <tr>
            <td>gasPrice</td>
            <td>{transaction.gasPrice.toString()}</td>
          </tr>
          <tr>
            <td>hash</td>
            <td>{transaction.hash}</td>
          </tr>
          <tr>
            <td>nonce</td>
            <td>{transaction.nonce}</td>
          </tr>
          <tr>
            <td>r</td>
            <td>{transaction.r}</td>
          </tr>
          <tr>
            <td>s</td>
            <td>{transaction.s}</td>
          </tr>
          <tr>
            <td>to</td>
            <td>{transaction.to}</td>
          </tr>
          <tr>
            <td>transactionIndex</td>
            <td>{transaction.transactionIndex}</td>
          </tr>
          <tr>
            <td>type</td>
            <td>{transaction.type}</td>
          </tr>
          <tr>
            <td>v</td>
            <td>{transaction.v}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Transaction;
