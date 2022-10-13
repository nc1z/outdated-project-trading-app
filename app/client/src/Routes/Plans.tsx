import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Container, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { RiStockFill, RiVipDiamondFill } from "react-icons/ri";
import { TiChartLine } from "react-icons/ti";
import { UserPlan } from "../context/PlanContext";

// STYLED COMPONENTS FOR /plans ----------------------------------->
// To-do: Add flex direction column for cardsContainer in @media

const PageTitle = styled.h1`
  margin: 8rem 0 0 0;
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

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 3rem;
    margin: 2rem auto;
  }
`;

const StyledCard = styled(Card)`
  width: 22rem;

  @media (max-width: 991px) {
    margin-top: 1rem;
  }
  @media (max-width: 768px) {
    width: 16rem;
    height: max-content;
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

  @media (max-width: 991px) {
    height: 35rem;
  }
  @media (max-width: 768px) {
    height: max-content;
  }
`;

const LoadingDiv = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  text-align: center;
  margin-top: 2rem;
`;

const SubLoadingText = styled.span`
  padding-top: 4px;
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

const UpgradeButton = styled.button`
  margin: 12px auto;
  font-size: 1.25rem;
  width: 80%;
  padding: 0 0.5rem 0.2rem 0.5rem;
  background-color: var(--main-secondary);
  color: var(--main-primary);

  &:hover {
    background-color: var(--main-primary);
    color: var(--main-secondary);
  }
`;

const DisabledButton = styled.button`
  margin: 12px auto;
  font-size: 1.25rem;
  width: 80%;
  padding: 0 0.5rem 0.2rem 0.5rem;
  background-color: var(--main-primary);
  color: var(--main-secondary);

  &:hover {
    cursor: default;
  }

  &:active {
    cursor: not-allowed;
  }
`;

const ResubscribeText = styled.span`
  font-size: 0.8rem;
  background-color: var(--main-green);
  text-align: center;
  cursor: pointer;
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

const Plans = () => {
  // Price State
  const [prices, setPrices] = useState<any[]>([]);
  const [currentPlan] = UserPlan();
  const [loading, setLoading] = useState(false);

  // On page render, invoke FetchPrices
  useEffect(() => {
    setLoading(false);
    fetchPrices();
  }, []);

  // Make HTTP request to /prices to get product data & pricing, then store in state
  const fetchPrices = async () => {
    const { data: response } = await axios.get(
      "http://localhost:8080/subs/prices"
    );
    setPrices(response.data);
  };

  // Make HTTP request to /sessions to create Stripe session for checkout process
  // We have to supply priceId in the body of the HTTP request
  const createSession = async (priceId: string) => {
    setLoading(true);
    const { data: response } = await axios.post(
      "http://localhost:8080/subs/session",
      {
        priceId,
      }
    );

    window.location.href = response.url;
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
    <Container>
      <PageTitle>Find your edge, invest with confidence</PageTitle>
      <PageSubtitle>
        Keep track of stock prices and maximize your returns
      </PageSubtitle>
      {loading ? (
        <LoadingDiv>
          <Spinner animation="border" role="status"></Spinner>
          <SubLoadingText>Subscribing...</SubLoadingText>
        </LoadingDiv>
      ) : null}
      <CardsContainer>
        {prices
          .map((price: any, idx) => (
            <StyledCard key={idx}>
              <CardHeader>
                <IconDiv>{customTier[price.nickname].icon}</IconDiv>
                <PlanNameDiv>{price.nickname}</PlanNameDiv>
                <PriceDiv>
                  <PriceText>${price.unit_amount / 100}</PriceText>
                  <CurrencyContainer>
                    <CurrencyText>{price.currency.toUpperCase()}</CurrencyText>
                    <BillingPeriod>/mo</BillingPeriod>
                  </CurrencyContainer>
                </PriceDiv>
                <CardDiv>
                  {currentPlan.plan === price.nickname ? (
                    <DisabledButton>Current Plan</DisabledButton>
                  ) : currentPlan.plan === "Pro" &&
                    price.nickname === "Basic" ? (
                    <UpgradeButton onClick={() => createSession(price.id)}>
                      Downgrade
                    </UpgradeButton>
                  ) : currentPlan.plan === "Premium" &&
                    (price.nickname === "Basic" || price.nickname === "Pro") ? (
                    <UpgradeButton onClick={() => createSession(price.id)}>
                      Downgrade
                    </UpgradeButton>
                  ) : (
                    <UpgradeButton onClick={() => createSession(price.id)}>
                      Upgrade
                    </UpgradeButton>
                  )}
                </CardDiv>
                <CardDiv>
                  {currentPlan.plan === price.nickname ? (
                    <ResubscribeText onClick={() => createSession(price.id)}>
                      Click here to resubscribe if canceled.
                    </ResubscribeText>
                  ) : null}
                </CardDiv>
                <CardDiv>
                  <BenefitsContainer>
                    {customTier[price.nickname].benefit_1}
                    {customTier[price.nickname].benefit_2}
                  </BenefitsContainer>
                </CardDiv>
              </CardHeader>
            </StyledCard>
          ))
          .reverse()}
      </CardsContainer>
    </Container>
  );
};

export default Plans;
