import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import styled from "styled-components";
import { RiStockFill, RiVipDiamondFill } from "react-icons/ri";
import { TiChartLine } from "react-icons/ti";
import ModalComponent from "../Modal/Modal";

// STYLED COMPONENTS FOR pricing & plans component in Landing Page ----------------------------------->

const PricingSection = styled(Container)`
  padding-bottom: 2rem;
`;

const PageTitle = styled.h1`
  margin: 5rem 0 0 0;
  text-align: center;
`;

const PageSubtitle = styled.h4`
  margin: 1rem 0 0 0;
  text-align: center;
  font-size: 1rem;
`;

const CardsContainer = styled.div`
  display: flex;
  height: max-content;
  min-height: 550px;
  align-items: center;
  justify-content: center;
  gap: 3rem;

  @media (max-width: 993px) {
    margin: 2rem auto;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3rem;
    margin: 2rem auto;
  }
`;

const StyledCard = styled(Card)`
  width: 22rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    width: 16rem;
  }
`;

const CardHeader = styled.div`
  height: 32rem;
  background-color: var(--main-primary);
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: top;
  border: 2px solid var(--main-secondary);
  box-shadow: -5px 5px 0px var(--main-secondary);

  @media (max-width: 993px) {
    height: 38rem;
  }

  @media (max-width: 768px) {
    height: max-content;
    padding-bottom: 1rem;
  }
`;

const IconDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.6rem 0 0 0;
`;

const CardDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const PlanNameDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 2rem;
`;

const PriceDiv = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const PriceText = styled.span`
  font-size: 2.75rem;
  font-weight: 700;
`;

const CurrencyContainer = styled.span`
  display: flex;
  flex-direction: column;
`;

const CurrencyText = styled.span`
  font-size: 0.8rem;
`;

const BillingPeriod = styled.span`
  font-size: 0.8rem;
`;

const GetStartedDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: var(--main-green);
  margin-bottom: 0.5rem;
  padding: 0.2rem 0;
`;

const ModalDiv = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  width: 100%;

  @media (max-width: 1025px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const BenefitsContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  margin: 0.8rem 1.6rem 0.8rem 1.2rem;
  height: max-content;
`;

const KeyBenefits = styled.li`
  font-size: 0.9rem;
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const Pricing = () => {
  // ProductInfo State
  const [productInfo, setProductInfo] = useState<any[]>([]);

  // On page render, invoke FetchPrices
  useEffect(() => {
    fetchPrices();
  }, []);

  // Make HTTP request to /prices to get product data & pricing, then store in state
  const fetchPrices = async () => {
    const { data: response } = await axios.get(
      "https://tradewise-demo.herokuapp.com/subs/prices"
    );
    setProductInfo(response.data);
  };

  // CUSTOM DESCRIPTION: Object to contain unique descriptions for each Tier
  const customTier: any = {
    Basic: {
      icon: <RiStockFill style={{ fontSize: "2rem" }} />,
      benefit_1: (
        <KeyBenefits>
          Full access to the latest mega cap stock prices
        </KeyBenefits>
      ),
      benefit_2: (
        <KeyBenefits>
          Full access to the latest Cryptocurrency Market Data
        </KeyBenefits>
      ),
    },
    Pro: {
      icon: <TiChartLine style={{ fontSize: "2rem" }} />,
      benefit_1: (
        <KeyBenefits>Includes all Benefits From the Basic Plan</KeyBenefits>
      ),
      benefit_2: (
        <KeyBenefits>
          Real-time Level II market data updates, live sentiment analysis &
          more!
        </KeyBenefits>
      ),
    },
    Premium: {
      icon: <RiVipDiamondFill style={{ fontSize: "2rem" }} />,
      benefit_1: (
        <KeyBenefits>Includes all Benefits From the Pro Plan</KeyBenefits>
      ),
      benefit_2: (
        <KeyBenefits>
          Enterprise Portfolio Tracking Functionality <em>(New!)</em>
        </KeyBenefits>
      ),
    },
  };

  return (
    <PricingSection id="Pricing">
      <PageTitle>Find your edge, invest with confidence</PageTitle>
      <PageSubtitle>
        Keep track of stock prices and maximize your returns
      </PageSubtitle>
      <CardsContainer>
        {productInfo
          .map((product: any, idx) => (
            <StyledCard key={idx}>
              <CardHeader>
                <IconDiv>{customTier[product.nickname].icon}</IconDiv>
                <PlanNameDiv>{product.nickname}</PlanNameDiv>
                <PriceDiv>
                  <PriceText>${product.unit_amount / 100}</PriceText>
                  <CurrencyContainer>
                    <CurrencyText>
                      {product.currency.toUpperCase()}
                    </CurrencyText>
                    <BillingPeriod>/mo</BillingPeriod>
                  </CurrencyContainer>
                </PriceDiv>
                <GetStartedDiv>Begin your journey</GetStartedDiv>
                <ModalDiv>
                  <ModalComponent isSignupFlow={true} text="Signup" />
                  <ModalComponent isSignupFlow={false} text="Login" />
                </ModalDiv>
                <CardDiv>
                  <BenefitsContainer>
                    {customTier[product.nickname].benefit_1}
                    {customTier[product.nickname].benefit_2}
                  </BenefitsContainer>
                </CardDiv>
              </CardHeader>
            </StyledCard>
          ))
          .reverse()}
      </CardsContainer>
    </PricingSection>
  );
};

export default Pricing;
