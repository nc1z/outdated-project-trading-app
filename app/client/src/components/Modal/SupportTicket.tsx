import { useEffect, useState } from "react";
import {
  Modal,
  InputGroup,
  FormControl,
  FloatingLabel,
  Form,
} from "react-bootstrap";
import { RiQuestionLine } from "react-icons/ri";
import styled from "styled-components";
import { UserAuth } from "../../context/AuthContext";

// STYLED COMPONENTS FOR Support Ticket Modal ----------------------------------->

const NavbarModal = styled.a`
  margin: 8px 8px 8px 8px;
  padding: 0 8px;
  color: var(--main-secondary) !important;
  font-size: 1.25rem;

  &:hover {
    background-color: var(--main-secondary);
    color: var(--main-primary) !important;
    cursor: pointer;
  }

  @media (max-width: 993px) {
    margin: 8px 0;
  }

  @media (max-width: 480px) {
    margin: 8px 0;
    font-size: 1.05rem;
  }
`;

const SupportLogo = styled(RiQuestionLine)`
  display: none;

  @media (max-width: 993px) {
    display: inline;
    margin-bottom: 3px;
  }
`;

const SupportText = styled.span`
  @media (max-width: 993px) {
    display: none;
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

const SuccessMessage = styled.p`
  background-color: var(--main-green);
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const SupportTicket = () => {
  // User Details
  const [user] = UserAuth();

  // Modal States & Methods
  const [display, setDisplay] = useState(false);
  const handleClose = () => setDisplay(false);
  const handleOpen = () => setDisplay(true);

  const [status, setStatus] = useState("");
  const handleClick = () => {
    setStatus("Success!");
    setTimeout(() => {
      handleClose();
      setStatus("");
    }, 500);
  };

  useEffect(() => {
    setStatus("");
  }, []);

  return (
    <>
      <NavbarModal onClick={handleOpen} className="nav-link">
        <SupportText>Support</SupportText>
        <SupportLogo />
      </NavbarModal>
      <Modal show={display} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>How can we help you?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel
            controlId="floatingSelect"
            label="Issue Category"
            className="mb-3"
          >
            <Form.Select aria-label="Floating label select example">
              <option>Open this select menu</option>
              <option value="Billing">Billing</option>
              <option value="Bugs">Bugs</option>
              <option value="Data">Data</option>
            </Form.Select>
          </FloatingLabel>
          <InputGroup>
            <FormControl
              as="textarea"
              placeholder="Describe your issue here"
            ></FormControl>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          {status ? <SuccessMessage>{status}</SuccessMessage> : null}
          <ModalButtonClose onClick={handleClose}>Close</ModalButtonClose>
          <ModalButtonSubmit onClick={handleClick}>Submit</ModalButtonSubmit>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SupportTicket;
