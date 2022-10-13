import { Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import styled from "styled-components";
import { UserPlan } from "../../context/PlanContext";
import { TbCrown } from "react-icons/tb";
import SupportTicket from "../Modal/SupportTicket";

// STYLED COMPONENTS FOR Navbar ----------------------------------->

// Div to align certain NavItems right (E.g. Logout)

const StickyNav = styled(Nav)`
  position: fixed;
  top: 0;
  border-bottom: 1px solid rgb(225, 225, 225);
  background-color: rgb(255, 255, 255);
  width: 100%;
  z-index: 10;
`;

const BrandLogo = styled(Link)`
  margin: 8px 8px 8px 8px;
  padding: 0 8px;
  font-family: "Open Sans", sans-serif;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--main-logo);
  text-decoration: none;

  &:hover {
    color: var(--main-secondary) !important;
    cursor: pointer;
  }

  &:focus {
    color: var(--main-logo);
  }

  @media (max-width: 480px) {
    margin: 8px 0;
    font-size: 1.05rem;
  }
`;

const RightNavContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

const NavbarLink = styled(Link)`
  margin: 8px 8px 8px 8px;
  padding: 0 8px;
  color: var(--main-secondary) !important;
  font-size: 1.25rem;

  &:hover {
    background-color: var(--main-secondary);
    color: var(--main-primary) !important;
  }

  @media (max-width: 1008px) {
    display: none;
  }
`;

const NavDropdownMenu = styled(NavDropdown)`
  margin: 8px 8px 8px 8px;
  font-size: 1.25rem;
  display: none;

  a {
    color: var(--main-secondary);
    padding: 0 8px;

    &:hover {
      background-color: var(--main-secondary);
      color: var(--main-primary) !important;
    }

    &:focus {
      color: var(--main-secondary);
    }
  }

  @media (max-width: 1008px) {
    display: block;
  }

  @media (max-width: 480px) {
    display: block;
    font-size: 1.05rem;
  }
`;

const NavbarAnchor = styled.a`
  margin: 8px 8px 8px 8px;
  padding: 0 8px;
  color: var(--main-secondary) !important;
  font-size: 1.25rem;

  &:hover {
    background-color: var(--main-secondary);
    color: var(--main-primary) !important;
  }

  @media (max-width: 480px) {
    margin: 8px 0;
    font-size: 1.05rem;
  }
`;

const NavTier = styled(Link)`
  display: flex
  justify-content: center;
  text-align: center;
  border: 1px solid var(--main-secondary);
  margin: 12px 8px 8px 8px;
  padding: 0 8px;
  color: var(--main-secondary) !important;
  font-size: 1rem;

  &:hover {
    background-color: var(--main-gray);
    color: var(--main-sceondary) !important;
  }

  @media (max-width: 1008px) {
    display: none;
  }
`;

const NavLogOut = styled(Nav.Link)`
  margin: 8px 8px 8px 8px;
  padding: 0 8px;
  color: var(--main-secondary) !important;
  font-size: 1.25rem;

  &:hover {
    background-color: var(--main-secondary);
    color: var(--main-primary) !important;
  }

  @media (max-width: 1008px) {
    display: none;
  }
`;

// FUNCTIONAL COMPONENT ----------------------------------->

const Navigation = () => {
  // User State from AuthContext for protected components in Nav
  const [state, setState] = UserAuth();
  const [currentPlan, setCurrentPlan] = UserPlan();

  // Navigation Uses
  const navigate = useNavigate();

  // Logout Handler To Reset State
  const handleLogout = () => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
    setCurrentPlan({
      plan: "none",
      loading: true,
    });
    localStorage.removeItem("token");
    navigate("/");
  };

  // To update logged in version of navbar + responsive version.

  if (state.data) {
    return (
      <StickyNav>
        {/* Nav Left Elements */}
        <Nav.Item>
          <BrandLogo to="/" className="nav-link">
            tradewise
          </BrandLogo>
        </Nav.Item>
        <Nav.Item>
          <NavbarLink to="/" className="nav-link">
            Dashboard
          </NavbarLink>
        </Nav.Item>
        {(currentPlan.plan === "Pro" || currentPlan.plan === "Premium") && (
          <Nav.Item>
            <NavbarLink to="/pro" className="nav-link">
              Data Feed
            </NavbarLink>
          </Nav.Item>
        )}
        {currentPlan.plan === "Premium" && (
          <Nav.Item>
            <NavbarLink to="/premium" className="nav-link">
              Portfolio
            </NavbarLink>
          </Nav.Item>
        )}
        <Nav.Item>
          <NavbarLink to="/plans" className="nav-link">
            Plans
          </NavbarLink>
        </Nav.Item>
        <Nav.Item>
          <SupportTicket />
        </Nav.Item>

        {/* Nav Right Elements */}
        <RightNavContainer>
          {currentPlan && currentPlan.plan !== "none" ? (
            <Nav.Item>
              <NavTier to="/account" className="nav-link">
                <TbCrown style={{ marginBottom: "0.1rem" }} />{" "}
                {currentPlan.plan}
              </NavTier>
            </Nav.Item>
          ) : (
            <Nav.Item>
              <NavbarLink to="/account" className="nav-link">
                Account
              </NavbarLink>
            </Nav.Item>
          )}
          <Nav.Item>
            <NavLogOut onClick={handleLogout}>Logout</NavLogOut>
          </Nav.Item>

          {/* Dropdown Menu on Smaller Screens */}
          <Nav.Item>
            <NavDropdownMenu title="Menu" menuVariant="light">
              <NavDropdown.Item href="/">Dashboard</NavDropdown.Item>
              {(currentPlan.plan === "Pro" ||
                currentPlan.plan === "Premium") && (
                <NavDropdown.Item href="/pro">Data Feed</NavDropdown.Item>
              )}
              {currentPlan.plan === "Premium" && (
                <NavDropdown.Item href="/premium">Portfolio</NavDropdown.Item>
              )}
              <NavDropdown.Divider />
              {currentPlan && currentPlan.plan !== "none" ? (
                <NavDropdown.Item href="/account">
                  <TbCrown style={{ marginBottom: "0.1rem" }} />{" "}
                  {currentPlan.plan}
                </NavDropdown.Item>
              ) : (
                <NavDropdown.Item href="/account">Account</NavDropdown.Item>
              )}
              <NavDropdown.Item href="/plans">Plans</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdownMenu>
          </Nav.Item>
        </RightNavContainer>
      </StickyNav>
    );
  } else {
    return (
      <StickyNav>
        <Nav.Item>
          <BrandLogo to="/" className="nav-link">
            tradewise
          </BrandLogo>
        </Nav.Item>
        <Nav.Item>
          <NavbarAnchor href="#Pricing" className="nav-link">
            Pricing
          </NavbarAnchor>
        </Nav.Item>
        <Nav.Item>
          <NavbarAnchor href="#ContactUs" className="nav-link">
            Contact
          </NavbarAnchor>
        </Nav.Item>
      </StickyNav>
    );
  }
};

export default Navigation;
