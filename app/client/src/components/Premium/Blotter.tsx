import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Spinner, Table } from "react-bootstrap";
import { MdOutlineRefresh } from "react-icons/md";
import styled from "styled-components";

// STYLED COMPONENTS FOR Blotter ----------------------------------->

const TableContainer = styled(Container)`
  padding: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorDiv = styled.div`
  display: flex;
  justify-content: start;
  text-align: center;
  gap: 0.8rem;
  margin: 0;
  padding: 0;
`;
const ErrorMessage = styled.p`
  background-color: var(--main-error);
  color: var(--main-primary);
  padding: 0 0.5rem;
  font-style: italic;
  width: max-content;
`;

const RefreshSpan = styled.span`
  cursor: pointer;
  width: max-content;
`;

const RefreshSymbol = styled(MdOutlineRefresh)`
  font-size: 1.5rem;
  cursor: pointer;
  display: inline;
  color: var(--main-secondary);
`;

const LoadingSpinnerTd = styled.td`
  display: flex;
  justify-content: center;
  text-align: center;
`;

const Searchbox = styled.form`
  height: 1.5rem;
`;

const SearchboxText = styled.input`
  font-size: 0.8rem;
`;

const RefreshSearchDiv = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 673px) {
    flex-direction: column;
  }
`;

// FUNCTIONAL COMPONENTS ----------------------------------->

const Blotter = () => {
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  //   GET request for ticket history
  const fetchDetails = async () => {
    try {
      const { data: response } = await axios.get(
        "https://tradewise-demo.herokuapp.com/track/get"
      );

      if (response.data) {
        setTickets(response.data.tickets);
        setLoading(false);
      } else {
        setError(response.errors);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  // On page render, invoke HTTP request
  useEffect(() => {
    setError("");
    fetchDetails();
  }, []);

  // Refresh Handler
  const handleRefresh = () => {
    setError("");
    setLoading(true);
    fetchDetails();
  };

  return (
    <TableContainer fluid>
      <RefreshSearchDiv>
        {error ? (
          <ErrorDiv>
            <ErrorMessage>
              {error.length > 20 ? `${error.substring(0, 20)}...` : error}
            </ErrorMessage>
            {error ? <RefreshSymbol onClick={handleRefresh} /> : null}
          </ErrorDiv>
        ) : loading ? (
          <Spinner animation="grow" size="sm" />
        ) : (
          <RefreshSpan onClick={handleRefresh}>
            Refresh
            <RefreshSymbol />
          </RefreshSpan>
        )}

        <Searchbox>
          <SearchboxText
            onChange={(event) => setSearchText(event.target.value)}
            type="text"
            placeholder="Search ticket"
          />
        </Searchbox>
      </RefreshSearchDiv>
      <Table responsive bordered hover size="sm">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Quantity</th>
            <th>Type</th>
            <th>Executed On</th>
            <th>Ticket Id</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tickets) ? (
            tickets
              .filter((value) => {
                if (searchText === "") {
                  return value;
                } else if (
                  value.asset
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                  value.order
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                  value.datetime
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                  value.ticketid
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                ) {
                  return value;
                }
              })
              .map((ticket, idx) => (
                <tr key={idx}>
                  <td style={{ width: "15%" }}>{ticket.asset}</td>
                  <td style={{ width: "15%" }}>{ticket.amount}</td>
                  <td style={{ width: "20%" }}>{ticket.order}</td>
                  <td style={{ width: "25%", whiteSpace: "nowrap" }}>
                    {ticket.datetime}
                  </td>
                  <td style={{ width: "25%", whiteSpace: "nowrap" }}>
                    {ticket.ticketid}
                  </td>
                </tr>
              ))
              .reverse()
          ) : error === "User asset details not found." ? (
            <tr>
              <td colSpan={5}>
                User asset details not found. Please submit a transaction
                ticket.
              </td>
            </tr>
          ) : (
            <tr>
              <LoadingSpinnerTd>
                <div className="spinner-border" role="status"></div>
              </LoadingSpinnerTd>
            </tr>
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default Blotter;
