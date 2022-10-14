import { Navigate, Outlet } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { UserPlan } from "../context/PlanContext";

interface PlanProps {
  plan: string;
}

const PaidRoute = ({ plan }: PlanProps) => {
  const [state] = UserAuth();
  const [currentPlan] = UserPlan();

  if (state.loading || currentPlan.loading) {
    return (
      <div className="spinContainer">
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  // ProtectedRoutes Depending on Current Plan

  if (plan === "Premium" && currentPlan.plan === "Premium") {
    return state.data ? <Outlet /> : <Navigate to="/" />;
  } else if (
    plan === "Pro" &&
    (currentPlan.plan === "Pro" || currentPlan.plan === "Premium")
  ) {
    return state.data ? <Outlet /> : <Navigate to="/" />;
  } else {
    return state.data ? <Navigate to="/account" /> : <Navigate to="/" />;
  }
};

export default PaidRoute;
