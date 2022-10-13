import { Form } from "react-bootstrap";
import styled from "styled-components";

// STYLED COMPONENTS FOR Hero ----------------------------------->

const FormSection = styled.div`
  display: flex;
  justify-content: center;
`;

const FormContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 12rem 0;
  gap: 1rem;

  @media (max-width: 786px) {
    padding: 4rem;
  }
`;

const FormTitle = styled.h1`
  text-align: center;
`;

const FormDiv = styled.div`
  border: 2px solid var(--main-secondary);
  box-shadow: -5px 5px 0px var(--main-secondary);
  padding: 2rem;
  width: 60vw;
  max-width: 60rem;
`;

const FormSubmitButton = styled.button`
  font-size: 1rem;
  padding: 0 0.5rem 0.2rem 0.5rem;
  background-color: var(--main-secondary);
  color: var(--main-primary);

  &:hover {
    background-color: var(--main-green);
    color: var(--main-secondary);
  }
`;

// FUNCTIONAL COMPONENT ----------------------------------->
// Bootstrap form
const ContactUs = () => {
  return (
    <FormSection id="ContactUs">
      <FormContainer>
        <FormTitle>Contact Us</FormTitle>
        <FormDiv>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Comments</Form.Label>
            <Form.Control type="input" placeholder="Type your questions here" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Join our newsletter" />
          </Form.Group>
          <FormSubmitButton type="submit">Submit</FormSubmitButton>
        </FormDiv>
      </FormContainer>
    </FormSection>
  );
};

export default ContactUs;
