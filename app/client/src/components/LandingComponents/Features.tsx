import { Col, Container, Row } from "react-bootstrap";
import styled from "styled-components";

// STYLED COMPONENTS FOR Features ----------------------------------->

const SectionContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 10rem;
  margin: 1rem auto;
  margin-bottom: 12rem;

  @media (max-width: 1201px) {
    gap: 5rem;
    margin: 0 auto;
  }

  @media (max-height: 601px) {
  }

  @media (max-width: 431px) {
    gap: 5rem;
    margin: 1rem auto;
  }
`;

const ContainerRow = styled(Row)`
  height: max-content;
  align-items: center;

  @media (max-width: 993px) {
    display: flex;
    flex-direction: column-reverse;
    gap: 1rem;
  }
`;

const ContainerRowLeft = styled(Row)`
  height: max-content;
  align-items: center;

  @media (max-width: 993px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const FeatureImg = styled.img`
  width: 36rem;
  height: 24rem;
  border: 2px solid var(--main-secondary);
  box-shadow: 5px 5px 0px var(--main-darkgray);

  @media (max-width: 1201px) {
    width: 22rem;
    height: 15rem;
  }

  @media (max-width: 768px) {
    width: 22rem;
    height: 15rem;
  }

  @media (max-height: 601px) {
    width: 18rem;
    height: 12rem;
  }

  @media (max-width: 431px) {
    width: 18rem;
    height: 12rem;
  }
`;

const FeatureImgLeft = styled.img`
  width: 36rem;
  height: 24rem;
  border: 2px solid var(--main-secondary);
  box-shadow: -5px 5px 0px var(--main-darkgray);

  @media (max-width: 1201px) {
    width: 22rem;
    height: 15rem;
  }

  @media (max-width: 768px) {
    width: 22rem;
    height: 15rem;
  }

  @media (max-height: 601px) {
    width: 18rem;
    height: 12rem;
  }

  @media (max-width: 431px) {
    width: 18rem;
    height: 12rem;
  }
`;

const ImgCol = styled(Col)`
  display: flex;
  justify-content: center;
`;

const TextDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 1rem auto;
  padding: 0 5rem;

  @media (max-width: 1201px) {
    padding 0 1rem;
  }
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const Features = () => {
  return (
    <SectionContainer>
      <ContainerRow>
        <Col lg={6}>
          <TextDiv>
            <h2>Latest prices at your fingertips</h2>
            <p>
              View the latest price changes & market data across stock and
              cryptocurrency assets. Pinpoint investment opportunities with
              ease.
            </p>
          </TextDiv>
        </Col>
        <ImgCol lg={6}>
          <FeatureImg src="/images/Screener.jpg" />
        </ImgCol>
      </ContainerRow>
      <ContainerRowLeft>
        <ImgCol lg={6}>
          <FeatureImgLeft src="/images/LevelTwo.jpg" />
        </ImgCol>
        <Col lg={6}>
          <TextDiv>
            <h2>Live level II market data</h2>
            <p>
              Real-time tracking of multiple major cryptocurrency exchanges'
              orderbooks and time & sales data, all in a single view! Make
              informed trading decisions based on the big picture orderflow.
            </p>
          </TextDiv>
        </Col>
      </ContainerRowLeft>
      <ContainerRow>
        <Col lg={6}>
          <TextDiv>
            <h2>Track your performance</h2>
            <p>
              A powerful asset tracking journal with real-time portfolio value
              updates. Explore enterprise level tracking capabilities and level
              up your investing/trading performance now.
            </p>
          </TextDiv>
        </Col>
        <ImgCol lg={6}>
          <FeatureImg src="/images/Tracker.jpg" />
        </ImgCol>
      </ContainerRow>
    </SectionContainer>
  );
};

export default Features;
