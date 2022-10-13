import { useState } from "react";
import { Modal, InputGroup, FormControl } from "react-bootstrap";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { UserPlan } from "../../context/PlanContext";

interface ModalProps {
  text: string;
  isSignupFlow: boolean;
}

// STYLED COMPONENTS FOR Modal ----------------------------------->

const ErrorMessage = styled.p`
  background-color: var(--main-error);
  color: var(--main-primary);
  padding: 0 0.5rem;
  font-style: italic;
`;

const HeroButton = styled.button`
  font-size: 1.5rem;
  padding: 0 0.5rem 0.2rem 0.5rem;
  background-color: var(--main-secondary);
  color: var(--main-primary);

  &:hover {
    background-color: var(--main-primary);
    color: var(--main-secondary);
  }
`;

const ModalButtonClose = styled.button`
  font-size: 1rem;
  padding: 0 0.5rem 0.2rem 0.5rem;
  background-color: var(--main-primary);
  color: var(--main-secondary);

  &:hover {
    background-color: var(--main-gray);
    color: var(--main-secondary);
  }
`;

const ModalButtonSubmit = styled.button`
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

const ModalComponent = ({ text, isSignupFlow }: ModalProps) => {
  // Modal display state & handlers
  const [display, setDisplay] = useState(false);
  const handleClose = () => setDisplay(false);
  const handleOpen = () => setDisplay(true);

  // Navigate user on login/signup success (& to set user state, so page
  // is updated with protected components without refreshing to trigger middleware auth)
  // Also set state for Plan State
  const navigate = useNavigate();
  const [state, setState] = UserAuth();
  const [currentPlan, setCurrentPlan] = UserPlan();

  // State for email & password, and errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Login/Signup Button onClick to Trigger HTTP Request
  const handleClick = async () => {
    let response;
    if (isSignupFlow) {
      const { data: signUpData } = await axios.post(
        "http://localhost:8080/auth/signup",
        {
          email,
          password,
        }
      );
      response = signUpData;
    } else {
      const { data: loginData } = await axios.post(
        "http://localhost:8080/auth/login",
        {
          email,
          password,
        }
      );
      response = loginData;
    }

    if (response.errors.length) {
      setErrorMsg(response.errors[0].msg);
    }

    // Set User Auth State on successful login/signup
    setState({
      data: {
        id: response.data.user.id,
        email: response.data.user.email,
        customerStripeId: response.data.user.customerStripeId,
      },
      loading: false,
      error: null,
    });

    // Storing JWT in the browser Local Storage
    localStorage.setItem("token", response.data.token);
    // Update axios header with the token, so user is authenticated across all protected routes
    axios.defaults.headers.common[
      "authorization"
    ] = `Bearer ${response.data.token}`;

    // Set Plan State on successful login/signup
    const { data: res } = await axios.get("http://localhost:8080/plan");
    if (res) {
      setCurrentPlan({
        plan: res,
        loading: false,
      });
    }

    // Navigate user on login/signup success
    navigate("/dashboard");
  };

  return (
    <>
      <HeroButton onClick={handleOpen}>{text}</HeroButton>
      <Modal show={display} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{text}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>Email</InputGroup.Text>
            <FormControl
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></FormControl>
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>Password</InputGroup.Text>
            <FormControl
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></FormControl>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          {errorMsg ? <ErrorMessage>{errorMsg}</ErrorMessage> : null}
          <ModalButtonClose onClick={handleClose}>Close</ModalButtonClose>
          <ModalButtonSubmit onClick={handleClick}>{text}</ModalButtonSubmit>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalComponent;
