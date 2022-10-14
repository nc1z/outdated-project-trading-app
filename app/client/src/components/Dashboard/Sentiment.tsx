import axios from "axios";
import { useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { Col, Container, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { RiQuestionLine } from "react-icons/ri";

// STYLED COMPONENTS FOR Sentiment ----------------------------------->

const ContainerCol = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: start;
  text-align: center;
`;

const ContainerRow = styled(Row)`
  margin: 5rem auto;
`;

const SectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SentimentButton = styled.button`
  font-size: 1rem;
  padding: 0.1rem 0.5rem 0.2rem 0.5rem;
  margin: 0 auto;
  background-color: var(--main-gray);
  width: max-content;
  color: var(--main-secondary) !important;
  text-decoration: none;
  border: 2px solid var(--main-secondary);

  &:hover {
    color: var(--main-secondary) !important;
    background-color: var(--main-green);
  }

  :disabled {
    background-color: var(--main-gray);
    color: var(--main-midgray) !important;
    border-color: var(--main-midgray);
  }

  :disabled:hover {
    background-color: var(--main-gray);
  }

  :disabled:active {
    cursor: not-allowed;
    transform: scale(1.05);
  }

  @media (max-width: 480px) {
    max-width: 70vw;
  }
`;

const ResultsDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  text-align: center;
`;

const ResultsImg = styled.img`
  height: 12rem;
  width: 12rem;

  &:active {
    cursor: not-allowed;
    transform: scale(1.05);
  }

  @media (max-width: 993px) {
    margin: 1rem auto;
  }
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

const SectionHeader = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: start;
`;

const HelperSymbolDiv = styled.span`
  margin: 0 0.5rem;
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const Sentiment = () => {
  const [subStocks, setSubStocks] = useState<any>({});
  const [subInvesting, setSubInvesting] = useState<any>({});
  const [subCryptoMarkets, setSubCryptoMarkets] = useState<any>({});
  const [error, setError] = useState("");
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [loadingInvesting, setLoadingInvesting] = useState(false);
  const [loadingCrypto, setLoadingCrypto] = useState(false);
  const [executionTime] = useState({
    stocks: "-",
    investing: "-",
    cryptomarkets: "-",
  });

  //   GET request for Scraped Sentiment Data
  const fetchSentiment = async (subreddit: string) => {
    if (subreddit === "stocks") {
      setLoadingStocks(true);
      setSubStocks({});
    }
    if (subreddit === "investing") {
      setLoadingInvesting(true);
      setSubInvesting({});
    }
    if (subreddit === "cryptomarkets") {
      setLoadingCrypto(true);
      setSubCryptoMarkets({});
    }

    try {
      const { data: response } = await axios.get(
        `https://tradewise-demo.herokuapp.com/analysis/r/${subreddit}`
      );

      if (response.data) {
        if (subreddit === "stocks") {
          setSubStocks(response.data);
          setLoadingStocks(false);
          executionTime.stocks = moment().format("MMMM Do YYYY, h:mm:ss a");
        } else if (subreddit === "investing") {
          setSubInvesting(response.data);
          setLoadingInvesting(false);
          executionTime.investing = moment().format("MMMM Do YYYY, h:mm:ss a");
        } else if (subreddit === "cryptomarkets") {
          setSubCryptoMarkets(response.data);
          setLoadingCrypto(false);
          executionTime.cryptomarkets = moment().format(
            "MMMM Do YYYY, h:mm:ss a"
          );
        }
      } else {
        setError(response.errors);
        setLoadingStocks(false);
        setLoadingInvesting(false);
        setLoadingCrypto(false);
      }
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
      setLoadingStocks(false);
      setLoadingInvesting(false);
      setLoadingCrypto(false);
    }
  };

  return (
    <Container fluid>
      {error ? (
        <ErrorDiv>
          <ErrorMessage>
            {error.length > 20 ? `${error.substring(0, 20)}...` : error}
          </ErrorMessage>
        </ErrorDiv>
      ) : null}
      <SectionHeader>
        Live Reddit Sentiment Analysis
        <OverlayTrigger
          placement="auto"
          overlay={
            <Tooltip style={{ pointerEvents: "none" }}>
              via Puppeteer & Sentiment
            </Tooltip>
          }
          popperConfig={{
            modifiers: [
              {
                name: "preventOverflow",
                options: {
                  rootBoundary: "document",
                },
              },
            ],
          }}
        >
          <HelperSymbolDiv>
            <RiQuestionLine />
          </HelperSymbolDiv>
        </OverlayTrigger>
      </SectionHeader>

      {/* r/Stocks */}

      <ContainerRow>
        <ContainerCol lg={6}>
          <SectionDiv>
            <SentimentButton
              onClick={() => fetchSentiment("stocks")}
              disabled={loadingStocks || loadingInvesting || loadingCrypto}
            >
              {loadingStocks
                ? "...Crawling the web"
                : "Get r/stocks sentiment now"}
            </SentimentButton>
            {Array.isArray(subStocks) ? (
              <ResultsDiv>
                <span>
                  Sentiment:{" "}
                  {subStocks[0].score < 0
                    ? subStocks[0].score > -10
                      ? "Neutral"
                      : "Bearish"
                    : subStocks[0].score < 10
                    ? "Neutral"
                    : "Bullish"}
                </span>
                <span>Score: {subStocks[0].score}</span>
                <span>
                  Comparative: {(subStocks[0].comparative * 100).toFixed(4)}%
                </span>
                <span>Total AFINN Word Count: {subStocks[0].AFINN}</span>
                <span>Total Words Scraped: {subStocks[0].tokens}</span>
                <span>Executed on: {executionTime.stocks}</span>
              </ResultsDiv>
            ) : (
              <ResultsDiv>
                <span>Sentiment: -</span>
                <span>Score: -</span>
                <span>Comparative: -%</span>
                <span>Total AFINN Word Count: -</span>
                <span>Total Words Scraped: -</span>
                <span>Executed on: -</span>
              </ResultsDiv>
            )}
            {loadingStocks ? (
              <LoadingSpinner>
                <div className="spinner-border" role="status"></div>
              </LoadingSpinner>
            ) : null}
          </SectionDiv>
        </ContainerCol>
        <ContainerCol lg={6}>
          {Array.isArray(subStocks) && (
            <ResultsImg
              src={
                subStocks[0].score < 0
                  ? subStocks[0].score > -10
                    ? "/images/Neutral.jpg"
                    : "/images/Bearish.jpeg"
                  : subStocks[0].score < 10
                  ? "/images/Neutral.jpg"
                  : "/images/Bullish.jpeg"
              }
            />
          )}
        </ContainerCol>
      </ContainerRow>

      {/* r/Investing */}

      <ContainerRow>
        <ContainerCol lg={6}>
          <SectionDiv>
            <SentimentButton
              onClick={() => fetchSentiment("investing")}
              disabled={loadingStocks || loadingInvesting || loadingCrypto}
            >
              {loadingInvesting
                ? "...Crawling the web"
                : "Get r/investing sentiment now"}
            </SentimentButton>
            {Array.isArray(subInvesting) ? (
              <ResultsDiv>
                <span>
                  Sentiment:{" "}
                  {subInvesting[0].score < 0
                    ? subInvesting[0].score > -10
                      ? "Neutral"
                      : "Bearish"
                    : subInvesting[0].score < 10
                    ? "Neutral"
                    : "Bullish"}
                </span>
                <span>Score: {subInvesting[0].score}</span>
                <span>
                  Comparative: {(subInvesting[0].comparative * 100).toFixed(4)}%
                </span>
                <span>Total AFINN Word Count: {subInvesting[0].AFINN}</span>
                <span>Total Words Scraped: {subInvesting[0].tokens}</span>
                <span>Executed on: {executionTime.investing}</span>
              </ResultsDiv>
            ) : (
              <ResultsDiv>
                <span>Sentiment: -</span>
                <span>Score: -</span>
                <span>Comparative: -%</span>
                <span>Total AFINN Word Count: -</span>
                <span>Total Words Scraped: -</span>
                <span>Executed on: -</span>
              </ResultsDiv>
            )}
            {loadingInvesting ? (
              <LoadingSpinner>
                <div className="spinner-border" role="status"></div>
              </LoadingSpinner>
            ) : null}
          </SectionDiv>
        </ContainerCol>
        <ContainerCol lg={6}>
          {Array.isArray(subInvesting) && (
            <ResultsImg
              src={
                subInvesting[0].score < 0
                  ? subInvesting[0].score > -10
                    ? "/images/Neutral.jpg"
                    : "/images/Bearish.jpeg"
                  : subInvesting[0].score < 10
                  ? "/images/Neutral.jpg"
                  : "/images/Bullish.jpeg"
              }
            />
          )}
        </ContainerCol>
      </ContainerRow>

      {/* r/CryptoMarkets */}

      <ContainerRow>
        <ContainerCol lg={6}>
          <SectionDiv>
            <SentimentButton
              onClick={() => fetchSentiment("cryptomarkets")}
              disabled={loadingStocks || loadingInvesting || loadingCrypto}
            >
              {loadingCrypto
                ? "...Crawling the web"
                : "Get r/cryptomarkets sentiment now"}
            </SentimentButton>
            {Array.isArray(subCryptoMarkets) ? (
              <ResultsDiv>
                <span>
                  Sentiment:{" "}
                  {subCryptoMarkets[0].score < 0
                    ? subCryptoMarkets[0].score > -10
                      ? "Neutral"
                      : "Bearish"
                    : subCryptoMarkets[0].score < 10
                    ? "Neutral"
                    : "Bullish"}
                </span>
                <span>Score: {subCryptoMarkets[0].score}</span>
                <span>
                  Comparative:{" "}
                  {(subCryptoMarkets[0].comparative * 100).toFixed(4)}%
                </span>
                <span>Total AFINN Word Count: {subCryptoMarkets[0].AFINN}</span>
                <span>Total Words Scraped: {subCryptoMarkets[0].tokens}</span>
                <span>Executed on: {executionTime.cryptomarkets}</span>
              </ResultsDiv>
            ) : (
              <ResultsDiv>
                <span>Sentiment: -</span>
                <span>Score: -</span>
                <span>Comparative: -%</span>
                <span>Total AFINN Word Count: -</span>
                <span>Total Words Scraped: -</span>
                <span>Executed on: -</span>
              </ResultsDiv>
            )}
            {loadingCrypto ? (
              <LoadingSpinner>
                <div className="spinner-border" role="status"></div>
              </LoadingSpinner>
            ) : null}
          </SectionDiv>
        </ContainerCol>
        <ContainerCol lg={6}>
          {Array.isArray(subCryptoMarkets) && (
            <ResultsImg
              src={
                subCryptoMarkets[0].score < 0
                  ? subCryptoMarkets[0].score > -10
                    ? "/images/Neutral.jpg"
                    : "/images/Bearish.jpeg"
                  : subCryptoMarkets[0].score < 10
                  ? "/images/Neutral.jpg"
                  : "/images/Bullish.jpeg"
              }
            />
          )}
        </ContainerCol>
      </ContainerRow>
    </Container>
  );
};

export default Sentiment;
