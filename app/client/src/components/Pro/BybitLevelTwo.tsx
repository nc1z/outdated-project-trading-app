import axios from "axios";
import { useState, useEffect, useRef } from "react";
import {
  Col,
  Container,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import styled from "styled-components";
import { RiQuestionLine } from "react-icons/ri";
import { MdOutlineRefresh } from "react-icons/md";

// STYLED COMPONENTS FOR Orderbook ----------------------------------->
// Data table width styles managed inline
// Data table row conditional color managed inline/global stylesheet

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

const TableHeader = styled.p`
  margin-bottom: 1rem;
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

const BybitLevelTwo = () => {
  const [snapshot, setSnapshot] = useState<any>({});
  const [tape, setTape] = useState<any>({});
  const [error, setError] = useState("");
  let snapshotIntervalRef = useRef<NodeJS.Timer>();
  let tapeIntervalRef = useRef<NodeJS.Timer>();

  //   GET request for Orderbook depth snapshot
  const fetchSnapshot = async () => {
    try {
      const { data: response } = await axios.get(
        "https://tradewise-demo.herokuapp.com/market-data/bybit/depth"
      );

      if (response.data) {
        setSnapshot(response.data.result);
      } else {
        setError(response.errors);
      }
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    }
  };

  //   GET request for Tape with snapshot
  const fetchTape = async () => {
    try {
      const { data: response } = await axios.get(
        "https://tradewise-demo.herokuapp.com/market-data/bybit/tape"
      );

      if (response.data) {
        setTape(response.data.result);
      } else {
        setError(response.errors);
      }
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
    }
  };

  // On page render, invoke HTTP request and keep it looping
  useEffect(() => {
    snapshotIntervalRef.current = setInterval(fetchSnapshot, 5000);
    tapeIntervalRef.current = setInterval(fetchTape, 5000);

    // Cleanup on unmount
    return () => {
      clearInterval(snapshotIntervalRef.current);
      clearInterval(tapeIntervalRef.current);
    };
  }, []);

  // Stop Interval on Error
  useEffect(() => {
    if (error) {
      clearInterval(snapshotIntervalRef.current);
      clearInterval(tapeIntervalRef.current);
    }
  }, [error]);

  // Refresh Handler
  const handleRefresh = () => {
    setError("");
    snapshotIntervalRef.current = setInterval(fetchSnapshot, 5000);
    tapeIntervalRef.current = setInterval(fetchTape, 5000);
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <TableHeader>
            Bybit BTCUSD Inv.Perp (Depth)
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>(5s) Throttled to keep within rate limit</Tooltip>
              }
            >
              <HelperSymbolDiv>
                <RiQuestionLine />
              </HelperSymbolDiv>
            </OverlayTrigger>
          </TableHeader>
          {error ? (
            <ErrorDiv>
              <ErrorMessage>
                {error.length > 35 ? `${error.substring(0, 35)}...` : error}
              </ErrorMessage>
              {error ? <RefreshSymbol onClick={handleRefresh} /> : null}
            </ErrorDiv>
          ) : null}
          <Table responsive bordered hover size="sm">
            {Array.isArray(snapshot) ? (
              snapshot
                .filter((each: any) => each.side === "Sell")
                .slice(0, 10)
                .map((each: any, idx: any) => (
                  <tbody key={idx}>
                    <tr>
                      <td style={{ width: "50%" }}>
                        {parseInt(each.price).toFixed(0)}
                      </td>
                      <td style={{ width: "50%" }}>
                        {Number(each.size / each.price).toFixed(4)}
                      </td>
                    </tr>
                  </tbody>
                ))
                .reverse()
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
          <Table responsive bordered hover size="sm">
            {Array.isArray(snapshot) &&
              snapshot
                .filter((each: any) => each.side === "Buy")
                .slice(0, 10)
                .map((each: any, idx: any) => (
                  <tbody key={idx}>
                    <tr>
                      <td style={{ width: "50%" }}>
                        {parseInt(each.price).toFixed(0)}
                      </td>
                      <td style={{ width: "50%" }}>
                        {Number(each.size / each.price).toFixed(4)}
                      </td>
                    </tr>
                  </tbody>
                ))}
          </Table>
          <TableHeader>Time & Sales</TableHeader>
          <Table responsive bordered hover size="sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
                <th>Qty</th>
                <th>USD</th>
              </tr>
            </thead>
            {Array.isArray(tape) ? (
              tape.map((each: any, idx: any) => {
                const date = new Date(each.time);
                const newDate = `${date.getDate()}-${date.getMonth() + 1}`;
                const newTime = `${
                  date.getHours() < 10
                    ? `0${date.getHours()}`
                    : `${date.getHours()}`
                }:${
                  date.getMinutes() < 10
                    ? `0${date.getMinutes()}`
                    : `${date.getMinutes()}`
                }:${
                  date.getSeconds() < 10
                    ? `0${date.getSeconds()}`
                    : `${date.getSeconds()}`
                }`;
                return (
                  <tbody key={idx}>
                    <tr
                      className={each.side === "Sell" ? "bg-red" : "bg-green"}
                    >
                      <td style={{ width: "15%" }}>{newDate}</td>
                      <td style={{ width: "20%" }}>{newTime}</td>
                      <td style={{ width: "20%" }}>{each.price.toFixed(0)}</td>
                      <td style={{ width: "25%" }}>
                        {(each.qty / each.price).toFixed(4)}
                      </td>
                      <td style={{ width: "20%" }}>{each.qty.toFixed(0)}</td>
                    </tr>
                  </tbody>
                );
              })
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
        </Col>
      </Row>
    </Container>
  );
};

export default BybitLevelTwo;
