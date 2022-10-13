import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import styled from "styled-components";
import BybitLevelTwo from "../components/Pro/BybitLevelTwo";
import BnLevelTwo from "../components/Pro/BnLevelTwo";
import FtxLevelTwo from "../components/Pro/FtxLevelTwo";
import Sentiment from "../components/Dashboard/Sentiment";

// STYLED COMPONENTS FOR PRO dashboard ----------------------------------->

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

// FUNCTIONAL COMPONENT ----------------------------------->

const Pro = () => {
  return (
    <PageContainer fluid>
      <PageTitle>Live Asset Data</PageTitle>
      <Tabs defaultActiveKey="Level 2" className="mb-3">
        <Tab
          eventKey="Level 2"
          title="Crypto Level II"
          tabClassName="text-black"
        >
          <Row>
            <Col>
              <BnLevelTwo />
            </Col>
            <Col>
              <FtxLevelTwo />
            </Col>
            <Col>
              <BybitLevelTwo />
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="sentiment" title="Sentiment" tabClassName="text-black">
          <Sentiment />
        </Tab>
        <Tab eventKey="NFTs" title="NFTs" tabClassName="text-black">
          <div>Coming soon</div>
        </Tab>
      </Tabs>
    </PageContainer>
  );
};

export default Pro;
