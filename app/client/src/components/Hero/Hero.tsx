import styled from "styled-components";
import ModalComponent from "../Modal/Modal";

// STYLED COMPONENTS FOR Hero ----------------------------------->

const HeroComponent = styled.header`
  padding: 5rem 0;
  background-image: url("/images/Stock-2.jpg");
  background-size: cover;
  background-position: center;

  @media (max-width: 768px) {
    padding: 0;
    height: 50vh;
  }

  @media (max-width: 431px) {
    padding: 0;
    height: 60vh;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--main-primary);
  border: 2px solid var(--main-secondary);
  box-shadow: -5px 5px 0px var(--main-secondary);
  padding: 3rem;
  margin: 3rem 3rem 3rem 16vw;
  color: var(--main-secondary);
  width: 32.5rem;

  @media (max-width: 768px) {
    width: 22rem;
    margin: 3rem 3rem 0 16vw;
  }

  @media (max-width: 431px) {
    width: 18rem;
    margin: 3rem auto;
  }

  @media (max-height: 601px) {
    width: 18rem;
    margin: 3rem 3rem 3rem 16vw;
  }
`;

const Heading = styled.h1`
  font-size: 4rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-height: 601px) {
    font-size: 2rem;
  }
`;

const SubHeading = styled.h3`
  font-weight: 400;
  margin: 1rem 0;
  font-size: 1.25rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-height: 601px) {
    font-size: 0.9rem;
  }
`;

const ModalContainer = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 431px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const Hero = () => {
  return (
    <HeroComponent>
      <HeaderContainer>
        <Heading>Keep Investing Simple</Heading>
        <SubHeading>
          tradewise portfolio tracker and trading platform is tailor-made for
          the modern investor.
        </SubHeading>
        <ModalContainer>
          <ModalComponent isSignupFlow={true} text="Signup" />
          <ModalComponent isSignupFlow={false} text="Login" />
        </ModalContainer>
      </HeaderContainer>
    </HeroComponent>
  );
};

export default Hero;
