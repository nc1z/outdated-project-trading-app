import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Nav/Nav";
import { UserAuth } from "./context/AuthContext";
import { PlanProvider } from "./context/PlanContext";
import PaidRoute from "./ProtectedRoute/PaidRoute";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import Account from "./Routes/Account";
import Dashboard from "./Routes/Dashboard";
import LandingPage from "./Routes/LandingPage";
import Plans from "./Routes/Plans";
import Premium from "./Routes/Premium";
import Pro from "./Routes/Pro";

function App() {
  const [state] = UserAuth();

  return (
    <PlanProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={state.data ? <Dashboard /> : <LandingPage />}
          />
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/plans" element={<ProtectedRoute />}>
            <Route path="/plans" element={<Plans />} />
          </Route>
          <Route path="/pro" element={<PaidRoute plan="Pro" />}>
            <Route path="/pro" element={<Pro />} />
          </Route>
          <Route path="/premium" element={<PaidRoute plan="Premium" />}>
            <Route path="/premium" element={<Premium />} />
          </Route>
          <Route path="/account" element={<ProtectedRoute />}>
            <Route path="/account" element={<Account />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlanProvider>
  );
}

export default App;
