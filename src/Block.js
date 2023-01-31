import React from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Identicon from 'react-identicons';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
var block = {};
var error = false;

function Block() {
  const { paramBlockNumber } = useParams();

  //for highlighting a transaction
  const { search } = useLocation();
  const searchMatch = search.match(/highlightTransaction=(.*)/);
  const highlightTransaction = searchMatch?.[1];

  const [blockNumber, setBlockNumber] = useState();

  /*
    Identicon params, use later for theme
    size: (Number) Single number to represent width and height of identicon image. Defaults to 400.
    padding (Number) Padding around blocks. Defaults to 0.
    bg (String) Override color for background blocks. Transparent by default.
    fg (String) Override color for foreground blocks. Generated randomly from hash by default.
    palette (Array) Provide an array of colors to be used as foreground block colors.
  */

  async function getBlock() {
    var number = undefined;

    //alternative place to look for the block number or hash
    const formInputMatch = search.match(/numberOrHash=(.*)/);

    if (paramBlockNumber) {
      if (paramBlockNumber.slice(0,2) === "0x") {
        number = paramBlockNumber;
      // eslint-disable-next-line eqeqeq
      } else if (parseInt(paramBlockNumber) >= 0 && parseInt(paramBlockNumber) == paramBlockNumber) { 
        //second part intentionally uses == not ===, because that prevents giberish from pulling out the first number, e.g. "3c9" parsing into 3
        number = parseInt(paramBlockNumber);
      } else {
        error = true;
      }
    } else if (formInputMatch && parseInt(formInputMatch?.[1]) > 0) {
      number = parseInt(formInputMatch?.[1]);
    }

    if (!error) {
      block = await alchemy.core.getBlockWithTransactions(number);
    }

    //used to tell React to render, I'm sure there's a better way though.
    setBlockNumber(block.number);
  }

  useEffect(() => {
    getBlock();
  });
  
  if (error) {
    return <h1>😢 That's not a block number we can find!</h1>
  }

  if (block.number === undefined) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="App">
      <h1>Block</h1>
      <Identicon string={blockNumber} />
      <table id="blockParts">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Block Number</td>
            <td>{blockNumber}</td>
          </tr>
          <tr>
            <td>Hash</td>
            <td>{block.hash}</td>
          </tr>
          <tr>
            <td>Parent Hash</td>
            <td><Link to={`/block/${block.parentHash}`}>{block.parentHash}</Link></td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>{new Date(block.timestamp * 1000).toLocaleString()}</td>
          </tr>
          <tr>
            <td>Nonce</td>
            <td>{block.nonce}</td>
          </tr>
          <tr>
            <td>Miner</td>
            <td>{block.miner}</td>
          </tr>
          <tr>
            <th colSpan="2">Gas</th>
          </tr>
          <tr>
            <td>Base Fee Per Gas</td>
            <td>{block.baseFeePerGas ? block.baseFeePerGas.toString() : "n/a"}</td>
          </tr>
          <tr>
            <td>Gas Used</td>
            <td>{block.gasUsed.toString()} ({Math.round(block.gasUsed / block.gasLimit * 100)}% of {block.gasLimit.toString()} max)</td>
          </tr>
          <tr>
            <th colSpan="2">Misc</th>
          </tr>
          <tr>
            <td>Difficulty</td>
            <td>{block.difficulty}</td>
          </tr>
          <tr>
            <td>Extra Data</td>
            <td>{block.extraData}</td>
          </tr>
        </tbody>
      </table>
      <table id="transactions">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          {block.transactions.length === 0 && <tr><td colSpan={4} class='noResults'>None</td></tr>}
          {block.transactions.map((t,index) => (
            <tr key={t.transactionIndex} class={t.hash === highlightTransaction ? "highlight" : (index % 2 === 0 ? "even" : "odd")}>
              <td><Link to={`/account/${t.from}?highlightTransaction=${t.hash}`}>{t.from}</Link></td>
              <td><Link to={`/account/${t.to}?highlightTransaction=${t.hash}`}>{t.to}</Link></td>
              <td>{t.value ? t.value.toString() : "--"}</td>
              <td><Link to={`/transaction/${t.hash}`}>{t.hash}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Block;
