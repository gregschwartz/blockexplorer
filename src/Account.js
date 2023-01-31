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

  /*
    Identicon params, use later for theme
    size: (Number) Single number to represent width and height of identicon image. Defaults to 400.
    padding (Number) Padding around blocks. Defaults to 0.
    bg (String) Override color for background blocks. Transparent by default.
    fg (String) Override color for foreground blocks. Generated randomly from hash by default.
    palette (Array) Provide an array of colors to be used as foreground block colors.
  */

  async function getAccount() {
    loading = false;

    const categoriesToRetrieve = ["external", "internal", "erc20", "erc721", "erc1155", "specialnft"];

    const r = await alchemy.core.getAssetTransfers({
      toAddress: accountHash,
      excludeZeroValue: true,
      category: categoriesToRetrieve,
    });
    received = r.transfers;

    const s = await alchemy.core.getAssetTransfers({
      fromAddress: accountHash,
      excludeZeroValue: true,
      category: categoriesToRetrieve,
    });
    sent = s.transfers;

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
    <div className="App">
      <h1>Account</h1>
      <Identicon string={accountHash} />
      <h3>Balance: {balance} eth</h3>
      <table id="sent">
        <thead>
          <tr>
            <th>To</th>
            <th>Amount</th>
            <th>Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          {sent.length === 0 && <tr><td colSpan={3}>None</td></tr>}
          {sent.map((t, index) => (
            <tr key={t.hash} class={t.hash === highlightTransaction ? "highlight" : (index % 2 === 0 ? "even" : "odd")}>
              <td><Link to={`/account/${t.to}?highlightTransaction=${t.hash}`}>{t.to}</Link></td>
              <td>{t.value ? t.value.toString() : "--"}</td>
              <td><Link to={`/transaction/${t.hash}`}>{t.hash}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      <table id="received">
        <thead>
          <tr>
            <th>From</th>
            <th>Amount</th>
            <th>Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          {received.length === 0 && <tr><td colSpan={3}>None</td></tr>}
          {received.map((t, index) => (
            <tr key={t.hash} class={t.hash === highlightTransaction ? "highlight" : (index % 2 === 0 ? "even" : "odd")}>
              <td><Link to={`/account/${t.from}?highlightTransaction=${t.hash}`}>{t.from}</Link></td>
              <td>{t.value ? t.value.toString() : "--"}</td>
              <td><Link to={`/transaction/${t.hash}`}>{t.hash}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Account;
