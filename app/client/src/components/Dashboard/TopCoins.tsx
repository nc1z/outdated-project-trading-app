import axios from "axios";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { AiFillTrophy } from "react-icons/ai";
import { MdOutlineRefresh } from "react-icons/md";

// STYLED COMPONENTS FOR TopCoins ----------------------------------->

const ErrorDiv = styled.div`
  display: flex;
  justify-content: start;
  text-align: center;
  gap: 0.8rem;
  margin: 0;
  padding: 0;
`;
const ErrorMessage = styled.p`
  background-color: var(--main-error);
  color: var(--main-primary);
  padding: 0 0.5rem;
  font-style: italic;
  width: max-content;
  height: max-content;
`;

const RefreshSymbol = styled(MdOutlineRefresh)`
  font-size: 1.5rem;
  cursor: pointer;
  display: inline;
  color: var(--main-secondary);
`;

const TableData = styled.td`
  justify-content: center;
  padding: 0.2rem 1rem 0.2rem 0;
`;

const CoinThumb = styled.img`
  margin: 0 0.5rem;
  margin-bottom: 2px;
  width: 25px;
  height: 25px;

  @media (max-width: 1581px) {
    margin: 0;
  }
`;

const TrophyIcon = styled(AiFillTrophy)`
  margin-bottom: 4px;
`;

const TableHeader = styled.th`
  padding: 4px 0;
  border-bottom: 2px solid var(--main-gray);
`;

const LoadingSpinnerTd = styled.td`
  display: flex;
  justify-content: center;
  text-align: center;
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const TopCoins = () => {
  const [coins, setCoins] = useState<any>({});
  const [error, setError] = useState("");

  //   GET request for Coins Snapshot
  const fetchCoins = async () => {
    try {
      const { data: response } = await axios.get(
        "https://tradewise-demo.herokuapp.com/market-data/cg/trend"
      );

      if (response.data) {
        setCoins(response.data.coins);
      } else {
        setError(response.errors);
      }
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    }
  };

  // On page render, invoke HTTP request
  useEffect(() => {
    setError("");
    setTimeout(() => {
      fetchCoins();
    }, 6000);
  }, []);

  // Refresh Handler
  const handleRefresh = () => {
    setError("");
    fetchCoins();
  };

  return (
    <>
      {error ? (
        <ErrorDiv>
          <ErrorMessage>
            {error.length > 20 ? `${error.substring(0, 20)}...` : error}
          </ErrorMessage>
          {error ? <RefreshSymbol onClick={handleRefresh} /> : null}
        </ErrorDiv>
      ) : null}
      <table>
        <thead>
          <tr>
            <TableHeader colSpan={3}>Top Trending</TableHeader>
          </tr>
        </thead>
        {Array.isArray(coins) ? (
          coins
            .filter((coin, idx) => idx < 3)
            .map((coin, idx) => (
              <tbody key={idx}>
                <tr>
                  <TableData>
                    <CoinThumb src={coin.item.thumb} />
                    {coin.item.symbol}
                  </TableData>
                  <TableData>
                    <TrophyIcon /> {coin.item.market_cap_rank}
                  </TableData>
                  <TableData>
                    <CoinThumb src="https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png?1547033579" />
                    {coin.item.price_btc.toFixed(7)}
                  </TableData>
                </tr>
              </tbody>
            ))
        ) : error === "Request failed with status code 429" ? (
          <td>Too many requests, please wait ~5 minutes before refreshing.</td>
        ) : (
          <tbody>
            <tr>
              <LoadingSpinnerTd>
                <div className="spinner-border" role="status"></div>
              </LoadingSpinnerTd>
            </tr>
          </tbody>
        )}
      </table>
    </>
  );
};

export default TopCoins;
