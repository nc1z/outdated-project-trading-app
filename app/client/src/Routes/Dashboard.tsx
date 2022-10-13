import {
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tab,
  Tabs,
  Tooltip,
} from "react-bootstrap";
import { RiQuestionLine } from "react-icons/ri";
import styled from "styled-components";
import CryptoScreener from "../components/Dashboard/CryptoScreener";
import News from "../components/Dashboard/News";
import StockScreener from "../components/Dashboard/StockScreener";
import TopCoins from "../components/Dashboard/TopCoins";
import TopGainers from "../components/Dashboard/TopGainers";
import TopVolume from "../components/Dashboard/TopVolume";

// STYLED COMPONENTS FOR Dashboard ----------------------------------->

const PageTitleDiv = styled.div`
  display: flex;
  justify-content: start;
  text-align: center;
`;

const PageTitle = styled.h1`
  margin-bottom: 2rem;
`;

const PageContainer = styled(Container)`
  margin: 5rem auto;
  padding: 0 5rem;

  @media (max-width: 480px) {
    padding: 0 1rem;
  }
`;

const ContainerRow = styled(Row)`
  margin: 2rem auto;
`;

const TrendingCol = styled(Col)`
  display: flex;
  justify-content: space-around;
  overflow: auto;
  min-height: 8rem;
  gap: 2rem;

  @media (max-width: 1231px) {
    justify-content: start;
  }
`;

const HelperSymbolDiv = styled.span`
  margin: 0 0.5rem;
  height: max-content;
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const Dashboard = () => {
  return (
    <PageContainer fluid>
      <PageTitleDiv>
        <PageTitle>Markets</PageTitle>
        <OverlayTrigger
          placement="auto"
          overlay={
            <Tooltip style={{ pointerEvents: "none" }}>
              Cryptocurrency data from CoinGecko (20s load time)
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
      </PageTitleDiv>
      <Tabs defaultActiveKey="crypto" className="mb-3">
        <Tab eventKey="crypto" title="Crypto" tabClassName="text-black">
          <ContainerRow>
            <TrendingCol>
              <TopCoins />
              <TopGainers />
              <TopVolume />
            </TrendingCol>
          </ContainerRow>
          <ContainerRow>
            <Col>
              <CryptoScreener />
            </Col>
          </ContainerRow>
        </Tab>
        <Tab eventKey="equities" title="Equities" tabClassName="text-black">
          <ContainerRow>
            <Col>
              <StockScreener />
            </Col>
          </ContainerRow>
        </Tab>
        <Tab eventKey="news" title="News" tabClassName="text-black">
          <ContainerRow>
            <News />
          </ContainerRow>
        </Tab>
      </Tabs>
    </PageContainer>
  );
};

export default Dashboard;
