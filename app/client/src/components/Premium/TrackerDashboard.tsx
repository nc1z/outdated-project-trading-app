import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { MdOutlineRefresh } from "react-icons/md";
import styled from "styled-components";
import Chart from "chart.js/auto";
import moment from "moment";
import { Line } from "react-chartjs-2";

import {
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Tooltip,
} from "chart.js";

Chart.register(
  LineElement,
  LineController,
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Tooltip
);

// STYLED COMPONENTS FOR Dashboard ----------------------------------->

const PortfolioValue = styled(Row)`
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
`;

const ContainerRow = styled(Row)`
  margin-bottom: 3rem;
`;

const TotalRow = styled.tr`
  background-color: var(--main-gray);
  font-weight: bold;
`;

const RefreshSymbol = styled(MdOutlineRefresh)`
  font-size: 1.5rem;
  cursor: pointer;
  display: inline;
  color: var(--main-secondary);
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
`;

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

// FUNCTIONAL COMPONENT ----------------------------------->
const TrackerDashboard = () => {
  const [error, setError] = useState("");
  const [portfolio, setPortfolio] = useState<any>({});
  const [priceBTC, setPriceBTC] = useState<any>({});
  const [priceETH, setPriceETH] = useState<any>({});
  const [dataset, setDataset] = useState<any>([]);
  const [timeLabels, setTimeLabels] = useState<any>([]);
  let pricesIntervalRef = useRef<NodeJS.Timer>();

  // Portfolio calculations
  let total: number = 0;
  if (
    Array.isArray(portfolio.currentAssets) &&
    priceBTC.last &&
    priceETH.last
  ) {
    const qtyBTC = portfolio.currentAssets.filter(
      (each: any) => each.name === "BTC"
    )[0].value;
    const qtyETH = portfolio.currentAssets.filter(
      (each: any) => each.name === "ETH"
    )[0].value;
    const qtyUSDT = portfolio.currentAssets.filter(
      (each: any) => each.name === "USDT"
    )[0].value;

    total = qtyBTC * priceBTC.last + qtyETH * priceETH.last + qtyUSDT * 1;
  }

  // Live Portfolio Value Update Line Dataset
  useEffect(() => {
    if (total >= 0) {
      dataset.push(total);
      timeLabels.push(moment().format("LTS"));
    }
  }, [total]);

  while (dataset.length > 7) {
    dataset.shift();
  }

  while (timeLabels.length > 7) {
    timeLabels.shift();
  }

  // ChartJS using Live LINE CHART Dataset
  const data = {
    labels: timeLabels,
    datasets: [
      {
        data: dataset,
        borderColor: ["#499649"],
        backgroundColor: ["#499649"],
      },
    ],
  };

  const options = {
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  //   GET request for portfolio (database)
  const fetchPortfolio = async () => {
    try {
      const { data: response } = await axios.get(
        "http://localhost:8080/track/get"
      );

      if (response.data) {
        setPortfolio(response.data);
      } else {
        setError(response.errors);
      }
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    }
  };

  //   GET request for latest price data (FTX)
  const fetchPrices = async () => {
    try {
      const { data: response } = await axios.get(
        "http://localhost:8080/market-data/ftx/markets"
      );

      if (response.data) {
        setPriceBTC(
          response.data.filter((each: any) => each.name === "BTC-PERP")[0]
        );
        setPriceETH(
          response.data.filter((each: any) => each.name === "ETH-PERP")[0]
        );
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
    fetchPortfolio();
    fetchPrices();
    pricesIntervalRef.current = setInterval(fetchPrices, 5000);

    // Cleanup on unmount
    return () => {
      clearInterval(pricesIntervalRef.current);
    };
  }, []);

  // Stop Interval on Error
  useEffect(() => {
    if (error) {
      clearInterval(pricesIntervalRef.current);
    }
  }, [error]);

  // Refresh Handler
  const handleRefresh = () => {
    setError("");
    fetchPortfolio();
    pricesIntervalRef.current = setInterval(fetchPrices, 5000);
  };

  return (
    <>
      {error ? (
        <ErrorDiv>
          <ErrorMessage>
            {error.length > 35 ? `${error.substring(0, 35)}...` : error}
          </ErrorMessage>
          {error ? <RefreshSymbol onClick={handleRefresh} /> : null}
        </ErrorDiv>
      ) : null}
      {Array.isArray(portfolio.currentAssets) ? (
        <Container fluid>
          <PortfolioValue>
            <span>Portfolio Value</span>
            <h2>{total.toFixed(2)}</h2>
          </PortfolioValue>
          <ContainerRow>
            <Col lg={6}>
              <Line
                data={data}
                height={300}
                width={"max-content"}
                options={options}
              />
            </Col>
            <Col lg={6}></Col>
          </ContainerRow>
          <ContainerRow>
            <Table responsive bordered hover size="sm">
              <thead>
                <tr>
                  <th>Latest Ticket Id</th>
                  <th>Asset</th>
                  <th>Total Quantity</th>
                  <th>Last Price (USD)</th>
                  <th>Notional Value (USD)</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.currentAssets.map((asset: any, idx: any) => (
                  <tr key={idx}>
                    <td style={{ width: "25%", whiteSpace: "nowrap" }}>
                      {portfolio.tickets
                        .filter((each: any) => each.asset === asset.name)
                        .slice(-1)[0]?.ticketid
                        ? portfolio.tickets
                            .filter((each: any) => each.asset === asset.name)
                            .slice(-1)[0].ticketid
                        : "-"}
                    </td>
                    <td style={{ width: "15%" }}>{asset.name}</td>
                    <td style={{ width: "15%" }}>{asset.value}</td>
                    <td style={{ width: "20%" }}>
                      {priceBTC.last && priceETH.last
                        ? asset.name === "BTC"
                          ? priceBTC.last
                          : asset.name === "ETH"
                          ? priceETH.last
                          : 1
                        : "-"}
                    </td>
                    <td style={{ width: "25%" }}>
                      {priceBTC.last && priceETH.last
                        ? asset.name === "BTC"
                          ? (priceBTC.last * asset.value).toFixed(2)
                          : asset.name === "ETH"
                          ? (priceETH.last * asset.value).toFixed(2)
                          : (1 * asset.value).toFixed(2)
                        : "-"}
                    </td>
                  </tr>
                ))}
                <TotalRow>
                  <td colSpan={4}>TOTAL</td>
                  <td>{total.toFixed(2)}</td>
                </TotalRow>
              </tbody>
            </Table>
          </ContainerRow>
        </Container>
      ) : error === "User asset details not found." ? (
        <span>
          User asset details not found. Please submit a transaction ticket.
        </span>
      ) : (
        <LoadingSpinner>
          <div className="spinner-border" role="status"></div>
        </LoadingSpinner>
      )}
    </>
  );
};

export default TrackerDashboard;
