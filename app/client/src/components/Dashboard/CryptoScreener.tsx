import { OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { MdOutlineRefresh } from "react-icons/md";
import { UserPlan } from "../../context/PlanContext";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RiQuestionLine } from "react-icons/ri";
import { Sparklines, SparklinesLine } from "react-sparklines";

// STYLED COMPONENTS FOR Crypto Screener ----------------------------------->

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
`;

const RefreshSymbol = styled(MdOutlineRefresh)`
  font-size: 1.5rem;
  cursor: pointer;
  display: inline;
  color: var(--main-secondary);
`;

const TableHeader = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
`;

const Searchbox = styled.form`
  height: 1.5rem;
`;

const SearchboxText = styled.input`
  font-size: 0.8rem;
`;

const ArrowUp = styled(GoTriangleUp)`
  margin: 0 0.5rem;
  color: var(--main-positive);
`;

const ArrowDown = styled(GoTriangleDown)`
  margin: 0 0.5rem;
  color: var(--main-negative);
`;

const ButtonLink = styled(Link)`
  font-size: 1rem;
  padding: 0.1rem 0.5rem 0.2rem 0.5rem;
  margin: 0 auto;
  background-color: var(--main-secondary);
  width: max-content;
  color: var(--main-primary) !important;
  text-decoration: none;
  border: 2px solid var(--main-secondary);

  &:hover {
    color: var(--main-secondary) !important;
    background-color: var(--main-green);
  }
`;

const PaywallDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin: 1rem;
  gap: 0.8rem;
  background-color: var(--main-gray);
  padding: 1rem;
`;

const LoadingSpinnerTd = styled.td`
  display: flex;
  justify-content: center;
  text-align: center;
`;

const HelperSymbolDiv = styled.span`
  margin: 0 0.5rem;
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const CryptoScreener = () => {
  const [coins, setCoins] = useState<any>({});
  const [error, setError] = useState("");
  const [currentPlan] = UserPlan();
  const [searchText, setSearchText] = useState("");

  //   GET request for Coins Snapshot
  const fetchCoins = async () => {
    try {
      const { data: response } = await axios.get(
        "http://localhost:8080/market-data/cg/screener"
      );

      if (response.data) {
        setCoins(response.data);
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
    fetchCoins();
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
      <TableHeader>
        <span>
          Asset Screener
          <OverlayTrigger
            placement="auto"
            overlay={
              <Tooltip>Delayed loading to prevent exceeding rate limit</Tooltip>
            }
          >
            <HelperSymbolDiv>
              <RiQuestionLine />
            </HelperSymbolDiv>
          </OverlayTrigger>
        </span>
        <div>
          <Searchbox>
            <SearchboxText
              onChange={(event) => setSearchText(event.target.value)}
              type="text"
              placeholder="Search assets"
            />
          </Searchbox>
        </div>
      </TableHeader>
      <Table responsive hover size="sm">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price (Intraday)</th>
            <th>Change</th>
            <th>% Change</th>
            <th>Volume</th>
            <th>Market Cap</th>
            <th>Last 7 Days</th>
          </tr>
        </thead>
        {Array.isArray(coins) ? (
          coins
            .filter((coin, idx) =>
              currentPlan.plan !== "none"
                ? idx < 50 && coin.current_price !== 1
                : idx < 10 && coin.current_price !== 1
            )
            .filter((value) => {
              if (searchText === "") {
                return value;
              } else if (
                value.name.toLowerCase().includes(searchText.toLowerCase()) ||
                value.symbol.toLowerCase().includes(searchText.toLowerCase())
              ) {
                return value;
              }
            })
            .map((coin, idx) => (
              <tbody key={idx}>
                <tr>
                  <td>{coin.symbol.toUpperCase()}</td>
                  <td>{coin.name}</td>
                  <td>{coin.current_price}</td>
                  <td
                    className={
                      coin.price_change_24h > 0 ? "positive" : "negative"
                    }
                  >
                    {coin.price_change_24h > 0 ? <ArrowUp /> : <ArrowDown />}
                    {(coin.price_change_24h < 0 &&
                      coin.price_change_24h.toString()[1] !== "0") ||
                    (coin.price_change_24h > 0 &&
                      coin.price_change_24h.toString()[0] !== "0")
                      ? coin.price_change_24h.toFixed(2)
                      : coin.price_change_24h.toFixed(7)}
                  </td>
                  <td
                    className={
                      coin.price_change_percentage_24h > 0
                        ? "positive"
                        : "negative"
                    }
                  >
                    {coin.price_change_percentage_24h > 0 ? (
                      <ArrowUp />
                    ) : (
                      <ArrowDown />
                    )}
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td>{coin.total_volume.toLocaleString()}</td>
                  <td>{coin.market_cap.toLocaleString()}</td>
                  <td>
                    <Sparklines data={coin.sparkline_in_7d.price} height={40}>
                      <SparklinesLine color="DodgerBlue" />
                    </Sparklines>
                  </td>
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
      </Table>
      {currentPlan.plan === "none" ? (
        <PaywallDiv>
          <span>
            <FaLock /> Upgrade To View More Assets
          </span>
          <ButtonLink to="/plans">View Plans</ButtonLink>
        </PaywallDiv>
      ) : null}
    </>
  );
};

export default CryptoScreener;
