# How I achieved the goals of the project

Sorry this is late! I spent a lot of time learning React, since I've not used it before. Particularly helpful tutorials were [routing](https://www.digitalocean.com/community/tutorials/how-to-handle-routing-in-react-apps-with-react-router), [rendering data](https://blog.logrocket.com/render-large-lists-react-5-methods-examples/), and [conditional content](https://reactjs.org/docs/conditional-rendering.html). Plus `console.log` is my friend, as always. 

# Features

- navigation
  - jump to current block
  - jump to specific block
  - jump to first block
- display block
  - transactions, which can be clicked to view details
  - jump to parent block
  - [Identicon](https://en.wikipedia.org/wiki/Identicon)
- display transaction
  - logs
  - [Identicon](https://en.wikipedia.org/wiki/Identicon)
- account page
  - balance
  - sent & received transactions
  - [Identicon](https://en.wikipedia.org/wiki/Identicon)

## Getting Started

- `npm install`
- `touch .env`
- [Create a unique Alchemy API Mainnet key for your project](https://docs.alchemy.com/reference/api-overview?a=eth-bootcamp)
- Use your editor of choice to put into `.env` this content: `REACT_APP_ALCHEMY_API_KEY=` and then your API key
- `npm start`

