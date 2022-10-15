<a name="readme-top"></a>

<!-- PROJECT LOGO -->
![tradewisebanner](https://user-images.githubusercontent.com/111836326/195963686-30870b98-6022-4fe4-a6d6-f5966585b5a4.png)
<br />

<div align="center">
  <a href="https://github.com/nc1z/tradewise-mern-demo/">
  <img src="https://user-images.githubusercontent.com/111836326/195963831-76301651-ac10-4aea-b9db-b2164e945e77.png" alt="Logo" width="80" height="80">
  </a>
<h3 align="center">tradewise</h3>

  <p align="center">
    Investment Portfolio Tracker Web App
    <br />
    <a href="https://github.com/nc1z/tradewise-mern-demo/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/nc1z/tradewise-mern-demo/">View Demo</a>
    ·
    <a href="https://github.com/nc1z/tradewise-mern-demo//issues">Report Bug</a>
    ·
    <a href="https://github.com/nc1z/tradewise-mern-demo//issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

![image](https://user-images.githubusercontent.com/111836326/195963475-2ff0d3c5-9ebe-42f4-a4fa-675132cc7b73.png)

There are many aggregated market data services out there, but many either lack certain data I required, or they are held behind a massive paywall. This inspired me to re-create a trading/investment subscription service, but with consolidated information from both the equities & cryptocurrency markets.

<h4>Features are conditionally rendered & route protected based on subscription tiers:</h4>

- Free
  - Cryptocurrency Screener (max 10 assets displayed)
  - Stock Screener (max 10 assets displayed)
- Basic ($9/month)
  - Cryptocurrency Screener
  - Stock Screener
  - Latest market news
- Pro ($29/month)
  - All features in Basic
  - Live Level II market data for cryptocurrencies (Orderbooks, Time & sales)
  - Sentiment Analysis
- Premium ($79/month)
  - All features in Pro
  - Portfolio Tracking Functionality (WIP - Currently supports 3 assets: BTC, ETH, USDT)
  
<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- BUILT WITH -->
### Built With

* ![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge)
* ![Express Badge](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=for-the-badge)
* ![Node.js Badge](https://img.shields.io/badge/Node.js-393?logo=nodedotjs&logoColor=fff&style=for-the-badge)
* ![MongoDB Badge](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff&style=for-the-badge)
* ![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=for-the-badge)
* ![HTML5 Badge](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=fff&style=for-the-badge)
* ![CSS3 Badge](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=fff&style=for-the-badge)
* ![styled-components Badge](https://img.shields.io/badge/styled--components-DB7093?logo=styledcomponents&logoColor=fff&style=for-the-badge)
* ![Bootstrap Badge](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=fff&style=for-the-badge)
* ![Heroku Badge](https://img.shields.io/badge/Heroku-430098?logo=heroku&logoColor=fff&style=for-the-badge)
* ![Netlify Badge](https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=fff&style=for-the-badge)


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [X] Deploy Server on Heroku
- [X] Deploy Client on Netlify
- [ ] Improve Code / Refactor
    - [ ] Work on TS declarations

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

nc1zdev@gmail.com

Project Link: https://github.com/nc1z/tradewise-mern-demo

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* <a href="https://www.coingecko.com/en/api/documentation">CoinGecko API</a>
* <a href="https://alpaca.markets/docs/introduction/n">Alpaca Markets API</a>
* <a href="https://binance-docs.github.io/apidocs/spot/en/#change-log">Binance API</a>
* <a href="https://docs.ftx.com/#overview">FTX API</a>
* <a href="https://bybit-exchange.github.io/docs/futuresV2/inverse/#t-introduction">Bybit API</a>
* <a href="https://stripe.com/docs/api">Stripe API</a>


<p align="right">(<a href="#readme-top">back to top</a>)</p>


