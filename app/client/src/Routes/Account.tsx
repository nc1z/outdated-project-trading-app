import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserAuth } from "../context/AuthContext";

// STYLED COMPONENTS FOR Account Page ----------------------------------->

const TableContainer = styled(Container)`
  margin: 5rem auto;
  padding: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorMessage = styled.p`
  background-color: var(--main-error);
  color: var(--main-primary);
  padding: 0 0.5rem;
  font-style: italic;
  width: max-content;
`;

const SubscribeButton = styled.button`
  padding: 0 0.5rem;
  background-color: var(--main-primary);
  color: var(--main-secondary);

  &:hover {
    background-color: var(--main-green);
    color: var(--main-secondary);
  }
`;

const SubscribeNow = styled(Link)`
  text-decoration: none;
  color: var(--main-secondary);

  &:hover {
    color: var(--main-secondary);
  }
`;

const CancelSub = styled.a`
  color: var(--main-secondary);
  text-decoration: none;

  &:hover {
    color: var(--main-error);
    cursor: pointer;
  }
`;

const ConfirmationDiv = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`;

const WarningButton = styled.button`
  padding: 0 0.5rem;
  margin-left: auto;
  background-color: var(--main-error);
  color: var(--main-primary);
  width: max-content;
  justify-content: end;

  &:hover {
    background-color: var(--main-maroon);
  }
`;

const CancelButton = styled.button`
  display: block;
  padding: 0 0.5rem;
  margin-left: auto;
  color: var(--main-secondary);
  width: max-content;
  justify-content: end;

  &:hover {
    background-color: var(--main-green);
  }
`;

const LoadingDiv = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`;

const UnsubLoadingText = styled.span`
  padding-top: 4px;
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const Account = () => {
  // Local State
  const [user] = UserAuth();
  const [account, setAccount] = useState<any>({});
  const [error, setError] = useState("");
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Fetch user account subscription details
  const fetchAccount = async () => {
    const { data: response } = await axios.get(
      "http://localhost:8080/accounts"
    );
    if (response.data && response.data.sub_status) {
      setAccount({
        current_plan: response.data.current_plan,
        sub_status: response.data.sub_status,
        sub_expiry: response.data.sub_expiry,
        canceled_at: response.data.canceled_at,
      });
    } else if (response.errors) {
      setError(response.errors);
    }
  };

  // Reset state and fetchAccount on page load
  useEffect(() => {
    setErr("");
    setError("");
    setAccount({});
    setWarning(false);
    setLoading(false);
    fetchAccount();
  }, []);

  // Unsubscribe Handler
  const handleUnsubscribe = async () => {
    setWarning(false);
    setLoading(true);
    const { data: res } = await axios.post("http://localhost:8080/unsub", {
      email: user.data?.email,
    });

    if (!Array.isArray(res.errors)) {
      setLoading(false);
      setErr(res.errors);
    }

    window.location.href = res.url;
  };

  return (
    <TableContainer>
      <h1>My Account</h1>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Current Plan</th>
            <th>Status</th>
            {!Array.isArray(account.canceled_at) ? <th>Canceled On</th> : null}
            <th>
              {account.sub_status === "canceled"
                ? "Subscription Ends On"
                : "Next Billing Cycle"}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{user.data?.email}</td>
            <td>{account.current_plan}</td>
            <td>{account.sub_status}</td>
            {!Array.isArray(account.canceled_at) ? (
              <td>{account.canceled_at}</td>
            ) : null}
            <td>{account.sub_expiry}</td>
            {account.sub_status && account.sub_status !== "canceled" ? (
              <td>
                <CancelSub
                  onClick={() => {
                    setWarning(!warning);
                  }}
                >
                  Cancel Subscription
                </CancelSub>
              </td>
            ) : (
              <td>
                <SubscribeButton>
                  <SubscribeNow to="/plans">Subscribe Now</SubscribeNow>
                </SubscribeButton>
              </td>
            )}
          </tr>
        </tbody>
      </Table>
      {warning ? (
        <ConfirmationDiv>
          <WarningButton onClick={handleUnsubscribe}>
            Confirm Unsubscribe?
          </WarningButton>
          <CancelButton
            onClick={() => {
              setWarning(!warning);
            }}
          >
            X
          </CancelButton>
        </ConfirmationDiv>
      ) : null}
      {loading ? (
        <LoadingDiv
          onClick={() => {
            setLoading(!loading);
          }}
        >
          <Spinner animation="border" role="status"></Spinner>
          <UnsubLoadingText>Unsubscribing...</UnsubLoadingText>
        </LoadingDiv>
      ) : null}
      {!Array.isArray(err) ? <ErrorMessage>{err}</ErrorMessage> : null}
    </TableContainer>
  );
};

export default Account;
