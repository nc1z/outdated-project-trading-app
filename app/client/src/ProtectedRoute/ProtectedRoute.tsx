import { Navigate, Outlet } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const [state] = UserAuth();

  if (state.loading) {
    return (
      <div className="spinContainer">
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  return state.data ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
