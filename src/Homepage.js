import React from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Identicon from 'react-identicons';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
var blocks = [];
var transactions = [];

function Homepage() {
  //for highlighting a transaction
  const [newestBlockNumber, setNewestBlockNumber] = useState();

  async function getBlocks() {
    const numToShow = 7;

    const newest = await alchemy.core.getBlockWithTransactions();
    blocks.push(newest);
    transactions = newest.transactions.slice(0,numToShow);

    for(var i=1; i<numToShow; i++) {
      blocks.push(await alchemy.core.getBlockWithTransactions(newest.number - i));
    }

    //used to tell React to render, I'm sure there's a better way though.
    setNewestBlockNumber(newest.number);
  }

  useEffect(() => {
    getBlocks();
  });
  
  return (
    <>
    <Row>
      <Col className='HomepageTopBox'>
        <h1>Welcome to Blockpedia,</h1>
        <div>the free block explorer that anyone can see.</div>
        <div>{newestBlockNumber?.toLocaleString()} blocks in Ethereum (so far)</div>
      </Col>
    </Row>
    <Row>
      <Col className='leftCol' sm={6} xs={12}>
        <h2>From the newest blocks</h2>
        
        {blocks.map((block,index) => (
          <Row key={block.hash} className="block">
            {index > 0 && <hr />}
            <Col xs={4}><Identicon string={block.hash} size={200} fg="#ccccff" /></Col>
            <Col xs={8}>
              Block #<Link to={`/blocks/${block.number}`}>{block.number}</Link><br />
              <Link to={`/blocks/${block.hash}`}>{block.hash}</Link><br />
              {new Date(block.timestamp * 1000).toLocaleString()}<br />
              {block.transactions.length} transactions<br />
            </Col>
          </Row>
        ))}
      </Col>
      <Col className='rightCol' sm={6} xs={12}>
        <h2>In the newest block</h2>
        {transactions.map((transaction,index) => (
          <Row key={transaction.hash} className="transaction">
            {index > 0 && <hr />}
            <Col xs={4}><Identicon string={transaction.hash} size={200} bg="#ccccff" fg="#CF9C65" /></Col>
            <Col xs={8}>
              Transaction <Link to={`/transactions/${transaction.hash}`}>{transaction.hash}</Link><br />
              <Row>
                <Col xs='3'>
                  From<br />
                  {transaction.from.slice(0,7)}...<br />
                  <Identicon string={transaction.from} size={75} fg="#70ff70" />
                </Col>
                <Col xs='3'>
                  To<br />
                  {transaction.to.slice(0,7)}...<br />
                  <Identicon string={transaction.to} size={75} fg="#70ff70" />
                </Col>
                <Col xs='6'>
                  Amount<br />
                  <div class="hugeNumber">{transaction.value?.toString()}</div>
                </Col>
              </Row>
            </Col>
          </Row>
        ))}
      </Col>
    </Row>

    </>
  );
}

export default Homepage;
