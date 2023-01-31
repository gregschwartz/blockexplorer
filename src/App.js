import { Alchemy, Network } from 'alchemy-sdk';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './App.scss';
import Block from './Block';
import Transaction from './Transaction';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();

  useEffect(() => {
    async function getBlockNumber() {
      // setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  });

    return (
      <div className="wrapper">
        <h1>Blockchain Browser</h1>
        <BrowserRouter>
          <nav>
            <ul>
              <li><Link to="/">Newest Block</Link></li>
              <li><Link to="/block/1">Block 1</Link></li>
            </ul>
          </nav>

          <Switch>
            <Route exact path="/">
              <Block />
            </Route>
            <Route path="/transaction/:transactionHash">
              <Transaction />
            </Route>
            <Route path="/block/:paramBlockNumber">
              <Block />
            </Route>
            <Route path="/address/:paramAddress">
              <Block />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
}

export default App;
