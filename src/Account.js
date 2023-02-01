import React from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Identicon from 'react-identicons';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
var received = [];
var sent = [];
var loading = true;

function Account() {
  const { accountHash } = useParams();

  //for highlighting a transaction
  const { search } = useLocation();
  const searchMatch = search.match(/highlightTransaction=(.*)/);
  const highlightTransaction = searchMatch?.[1];

  const [balance, setBalance] = useState();

  async function getAccount() {
    loading = false;

    const categoriesToRetrieve = ["external", "internal", "erc20", "erc721", "erc1155", "specialnft"];

    const r = await alchemy.core.getAssetTransfers({
      toAddress: accountHash,
      excludeZeroValue: true,
      category: categoriesToRetrieve,
    });
    received = r.transfers;
    // console.log("received", received);

    const s = await alchemy.core.getAssetTransfers({
      fromAddress: accountHash,
      excludeZeroValue: true,
      category: categoriesToRetrieve,
    });
    sent = s.transfers;
    // console.log("sent", sent);

    const bal = await alchemy.core.getBalance(accountHash);
    setBalance(bal?.toString());
  }

  useEffect(() => {
    getAccount();
  });
  

  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <>
    <Row>
      <Col>
        <div class='title'>
          <span>Ethereum</span>
          <h1>Account <abbr title={accountHash}>#{accountHash.slice(0,20)}...</abbr></h1>
        </div>
      </Col>
    </Row>
    <Row>
      <Col xs={9}>
        <p>Balance: {balance} eth</p>
        
        <div class='title'>
          <h2>Transactions</h2>
        </div>

        <Tabs defaultActiveKey="sent" transition={false} fill justify>

          <Tab eventKey="sent" title="Sent">
            <Table striped>
              <thead>
                <tr>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Transaction Hash</th>
                </tr>
              </thead>
              <tbody>
                {sent.length === 0 && <tr><td colSpan={3} class='noResults'>None</td></tr>}
                {sent.map((t, index) => (
                  <tr key={t.hash} class={t.hash === highlightTransaction ? "highlight" : (index % 2 === 0 ? "even" : "odd")}>
                    <td><Link to={`/accounts/${t.to}?highlightTransaction=${t.hash}`}>{t.to}</Link></td>
                    <td>{t.value ? t.value.toString() : "--"}</td>
                    <td><Link to={`/transactions/${t.hash}`}>{t.hash}</Link></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>

          <Tab eventKey="received" title="Received">
            <Table striped>
              <thead>
                <tr>
                  <th>From</th>
                  <th>Amount</th>
                  <th>Transaction Hash</th>
                </tr>
              </thead>
              <tbody>
                {received.length === 0 && <tr><td colSpan={3} class='noResults'>None</td></tr>}
                {received.map((t, index) => (
                  <tr key={t.hash} class={t.hash === highlightTransaction ? "highlight" : (index % 2 === 0 ? "even" : "odd")}>
                    <td><Link to={`/accounts/${t.from}?highlightTransaction=${t.hash}`}>{t.from}</Link></td>
                    <td>{t.value ? t.value.toString() : "--"}</td>
                    <td><Link to={`/transactions/${t.hash}`}>{t.hash}</Link></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>

        </Tabs>
        
      </Col>
      <Col xs={3} id="rightColumn">
          <div class="wrapper">
            <p>Account #{accountHash.slice(0,7)}...</p>
            <Identicon string={accountHash} size={200} fg="#70ff70" />
            <div>Identicon for account's hash</div>
          </div>
        </Col>
    </Row>
    </>
  );
}

export default Account;
