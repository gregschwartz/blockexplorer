import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import './App.scss';
import Block from './Block';
import Transaction from './Transaction';
import Account from './Account';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Homepage from './Homepage';

function App() {
    return (
      <Container fluid>
        <a name="top" />
        <BrowserRouter>
          <Row className="d-flex topNav">
            <Col className="d-flex align-items-center" xs={12} sm={3}>
              <img class="mw-logo-icon" src="https://en.wikipedia.org/static/images/icons/wikipedia.png" alt="Wikipedia icon" aria-hidden="true" height="50" width="50" /> <span>Blockpedia</span>
            </Col>
            <Col className="d-flex align-items-center" xs={12} sm={6}>
              <form action="/blocks" method="get">              
                <input type="input" id="searchField" name="numberOrHash" placeholder='Search Blockpedia by block number or hash' />
                <input type='submit' value='Search' />
              </form>
            </Col>
            <Col className="links d-flex align-items-center" xs={12} sm={3}>
              <Link to="/blocks/">Newest Block</Link>
              <Link to="/blocks/0">Genesis Block</Link>
            </Col>
          </Row>

          <Switch>
            <Route exact path="/">
              <Homepage />
            </Route>
            <Route path="/accounts/:accountHash">
              <Account />
            </Route>
            <Route path="/transactions/:transactionHash">
              <Transaction />
            </Route>
            <Route path="/blocks/:paramBlockNumber">
              <Block />
            </Route>
            <Route path="/blocks/">
              <Block />
            </Route>
          </Switch>

        </BrowserRouter>
      </Container>
    );
}

export default App;
