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
import Blotter from "../components/Premium/Blotter";
import Ticket from "../components/Premium/Ticket";
import TrackerDashboard from "../components/Premium/TrackerDashboard";

// STYLED COMPONENTS FOR PRO dashboard ----------------------------------->

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

const HelperSymbolDiv = styled.span`
  margin: 0 0.5rem;
  height: max-content;
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const Premium = () => {
  return (
    <PageContainer fluid>
      <PageTitleDiv>
        <PageTitle>Tracker</PageTitle>
        <OverlayTrigger
          placement="auto"
          overlay={
            <Tooltip style={{ pointerEvents: "none" }}>
              (5s) Last price from FTX perpetual futures
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
      <Tabs defaultActiveKey="dashboard" className="mb-3">
        <Tab eventKey="dashboard" title="Dashboard" tabClassName="text-black">
          <ContainerRow>
            <Col>
              <TrackerDashboard />
            </Col>
          </ContainerRow>
        </Tab>
        <Tab eventKey="blotter" title="Blotter" tabClassName="text-black">
          <ContainerRow>
            <Col>
              <Blotter />
            </Col>
          </ContainerRow>
        </Tab>
        <Tab eventKey="ticket" title="Ticket" tabClassName="text-black">
          <ContainerRow>
            <Col>
              <Ticket />
            </Col>
          </ContainerRow>
        </Tab>
      </Tabs>
    </PageContainer>
  );
};

export default Premium;
