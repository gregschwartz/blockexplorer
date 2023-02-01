import React from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Identicon from 'react-identicons';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
  const [isNewestBlock, setIsNewestBlock] = useState(false);

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

    //figure out newest block number
    if(number === undefined) {
      setIsNewestBlock(true);
    } else {
      const newestBlock = await alchemy.core.getBlockWithTransactions();
      setIsNewestBlock(block.number === newestBlock.number);
    }
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
    <>
    <Row>
      <Col>
        <div class='title'>
          <span>Ethereum</span>
          <h1>Block #{blockNumber}</h1>
        </div>
      </Col>
    </Row>
    <Row>
      <Col sm={9} xs={12}>
        <table id="blockParts">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hash</td>
              <td>{block.hash}</td>
            </tr>
            <tr>
              <td>Parent Hash</td>
              <td><Link to={`/blocks/${block.parentHash}`}>{block.parentHash}</Link></td>
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
        </Col>
        <Col sm={3} xs={12} id="rightColumn">
          <div class="wrapper">
            <p>Block #{blockNumber}</p>
            <Identicon string={blockNumber} size={200} fg="#ccccff" />
            <div>Identicon for block's hash</div>
          </div>
        </Col>
    </Row>
    <Row>
      <Col>
        <div class='title'>
          <h2>Transactions</h2>
        </div>
        <Table striped id="transactions">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>
                Transaction Hash
                {block.transactions.length > 0 && <a id="scrollToTop" href="#top">^ top</a>}
              </th>
            </tr>
          </thead>
          <tbody>
            {block.transactions.length === 0 && <tr><td colSpan={4} class='noResults'>None</td></tr>}
            {block.transactions.map((t,index) => (
              <tr key={t.transactionIndex} class={t.hash === highlightTransaction ? "highlight" : (index % 2 === 0 ? "even" : "odd")}>
                <td><Link to={`/accounts/${t.from}?highlightTransaction=${t.hash}`}>{t.from}</Link></td>
                <td><Link to={`/accounts/${t.to}?highlightTransaction=${t.hash}`}>{t.to}</Link></td>
                <td>{t.value ? t.value.toString() : "--"}</td>
                <td><Link to={`/transactions/${t.hash}`}>{t.hash}</Link></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
    <Row>
      <Col>
        <div class='title'>
          <h2>Links</h2>
        </div>
      </Col>
    </Row>
    <Row className='beforeAndAfterTitle'>
      <Col xs={12} md={{ offset: 2, span: 8 }}>
        Block History
      </Col>
    </Row>
    <Row className='beforeAndAfter'>
      <Col className='cell' xs={6} md={{ offset: 2, span: 4 }}>
        Preceded by<br />
        {blockNumber > 0 && <Link to={`/blocks/${blockNumber-1}`}>Block {blockNumber-1}</Link>}
        {blockNumber === 0 && <i>Nothing!</i>}
      </Col>
      <Col className='cell' xs={6} md={4}>
        Succeeded by<br />
        {!isNewestBlock && <Link to={`/blocks/${blockNumber+1}`}>Block {blockNumber+1}</Link>}
        {isNewestBlock && <i>Nothing... yet!</i>}
      </Col>
    </Row>
    </>
  );
}

export default Block;
