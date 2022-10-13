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
import { CgArrowsExchangeAlt } from "react-icons/cg";

// STYLED COMPONENTS FOR Stock Screener ----------------------------------->

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

const Range = styled(CgArrowsExchangeAlt)`
  margin: 0 0.5rem;
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

const StockScreener = () => {
  const [stocks, setStocks] = useState<any>({});
  const [error, setError] = useState("");
  const [currentPlan] = UserPlan();
  const [searchText, setSearchText] = useState("");

  //   GET request for Alpaca Markets Equities Snapshot
  const fetchStocks = async () => {
    try {
      const { data: response } = await axios.get(
        "http://localhost:8080/market-data/alp/screener"
      );

      if (response.data) {
        setStocks(response.data);
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
    fetchStocks();
  }, []);

  // Refresh Handler
  const handleRefresh = () => {
    setError("");
    fetchStocks();
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
            overlay={<Tooltip>Limited Data from Alpaca Markets (IEX)</Tooltip>}
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
            <th>1D Volume</th>
            <th>24h Range</th>
          </tr>
        </thead>
        {Object.keys(stocks).length ? (
          Object.keys(stocks)
            .map((key) => stocks[key])
            .sort((a, b) => b.volume - a.volume)
            .filter((stock, idx) =>
              currentPlan.plan !== "none"
                ? idx < 50 && stock.lastPrice
                : idx < 10 && stock.lastPrice
            )
            .filter((value) => {
              if (searchText === "") {
                return value;
              } else if (
                value.name.toLowerCase().includes(searchText.toLowerCase()) ||
                value.full.toLowerCase().includes(searchText.toLowerCase())
              ) {
                return value;
              }
            })
            .map((stock, idx) => (
              <tbody key={idx}>
                <tr>
                  <td>{stock.name}</td>
                  <td>{stock.full}</td>
                  <td>{stock.lastPrice}</td>
                  <td
                    className={stock.priceChange > 0 ? "positive" : "negative"}
                  >
                    {stock.priceChange > 0 ? <ArrowUp /> : <ArrowDown />}
                    {(stock.priceChange < 0 &&
                      stock.priceChange.toString()[1] !== "0") ||
                    (stock.priceChange > 0 &&
                      stock.priceChange.toString()[0] !== "0")
                      ? Number(stock.priceChange).toFixed(2)
                      : Number(stock.priceChange).toFixed(4)}
                  </td>
                  <td
                    className={
                      stock.percentChange > 0 ? "positive" : "negative"
                    }
                  >
                    {stock.percentChange > 0 ? <ArrowUp /> : <ArrowDown />}
                    {Number(stock.percentChange).toFixed(2)}%
                  </td>
                  <td>{stock.volume.toLocaleString()}</td>
                  <td>
                    {stock.dailyLow}
                    <Range />
                    {stock.dailyHigh}
                  </td>
                </tr>
              </tbody>
            ))
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

export default StockScreener;
