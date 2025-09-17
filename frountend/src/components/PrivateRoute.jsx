
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
