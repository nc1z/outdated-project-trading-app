import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import styled from "styled-components";

// STYLED COMPONENTS FOR Ticket ----------------------------------->

const TableContainer = styled(Container)`
  padding: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SubmitButton = styled.button`
  font-size: 1rem;
  padding: 0.1rem 0.5rem 0.2rem 0.5rem;
  margin: 0 auto;
  width: max-content;
  border: 2px solid var(--main-secondary);
  background-color: var(--main-gray);
  color: var(--main-secondary) !important;
  text-decoration: none;

  &:hover {
    color: var(--main-secondary) !important;
    background-color: var(--main-green);
  }

  :disabled {
    background-color: var(--main-gray);
    color: var(--main-midgray) !important;
    border-color: var(--main-midgray);
  }

  :disabled:hover {
    background-color: var(--main-gray);
  }

  :disabled:active {
    cursor: not-allowed;
    transform: scale(1.05);
  }
`;
const ErrorMessage = styled.p`
  background-color: var(--main-error);
  color: var(--main-primary);
  padding: 0 0.5rem;
  font-style: italic;
  width: max-content;

  @media (max-width: 480px) {
    width: 80%;
  }
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const Ticket = () => {
  const [asset, setAsset] = useState("");
  const [order, setOrder] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [success, setSuccess] = useState(false);

  //   POST request to create/update account asset details & ticket
  const SubmitTicket = async () => {
    setSuccess(false);
    setDisabled(true);

    try {
      const { data: response } = await axios.post(
        "http://localhost:8080/track/update",
        {
          asset,
          order,
          amount,
        }
      );

      if (response.data) {
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError(response.errors);
        setDisabled(false);
      }
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
      setDisabled(false);
    }
  };

  //  Form Submit Handler
  const handleSubmit = (e: any) => {
    e.preventDefault();
    SubmitTicket();
  };

  // On page render, invoke HTTP request
  useEffect(() => {
    setError("");
    setAsset("");
    setOrder("");
    setAmount(0);
    setSuccess(false);
    setDisabled(false);
  }, []);

  return (
    <TableContainer fluid>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Form.Group className="mb-3">
          <Form.Label>Ticket Id</Form.Label>
          <Form.Control
            type="text"
            placeholder="auto-generated"
            disabled
            readOnly
            size="sm"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Time & Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="auto-generated"
            disabled
            readOnly
            size="sm"
          />
        </Form.Group>
        <Row>
          <Form.Group as={Col} className="mb-3">
            <Form.Label>Asset</Form.Label>
            <Form.Select
              aria-label="Default select example"
              size="sm"
              onChange={(e) => setAsset(e.target.value)}
              required
            >
              <option value="">Select Asset</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
              <option value="USDT">USDT</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              step=".01"
              min="0"
              placeholder="0.5"
              size="sm"
              onChange={(e) => {
                order === "remove"
                  ? setAmount(Number(e.target.value) * -1)
                  : setAmount(Number(e.target.value));
              }}
              required
            />
          </Form.Group>
        </Row>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>Transaction Type</Form.Label>
          <Form.Select
            aria-label="Default select example"
            size="sm"
            onChange={(e) => setOrder(e.target.value)}
            required
          >
            <option value="">Select Transaction</option>
            <option value="Allocate">Allocate</option>
            <option value="Remove">Remove</option>
          </Form.Select>
        </Form.Group>
        <SubmitButton type="submit" disabled={disabled}>
          {disabled ? "Processing..." : "Submit"}
        </SubmitButton>{" "}
        {success ? <span>Success! Redirecting...</span> : null}
      </Form>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </TableContainer>
  );
};

export default Ticket;
