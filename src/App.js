import { Alchemy, Network } from 'alchemy-sdk';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import { useEffect, useState } from 'react';

import './App.scss';
import Block from './Block';
import Transaction from './Transaction';
import Account from './Account';

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
              <li><Link to="/block/0">Genesis Block</Link></li>
            </ul>
          </nav>

          <form action="/block" method="get">
            <label>View Block by Hash or Block Number
              <input type="input" name="numberOrHash" placeholder='e.g. 42 or 0xa1b2c3...' />
            </label>
            <input type='submit' value='View' />
          </form>

          <Switch>
            <Route exact path="/">
              <Block />
            </Route>
            <Route path="/account/:accountHash">
              <Account />
            </Route>
            <Route path="/transaction/:transactionHash">
              <Transaction />
            </Route>
            <Route path="/block/:paramBlockNumber">
              <Block />
            </Route>
            <Route path="/block/">
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
