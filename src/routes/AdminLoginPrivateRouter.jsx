import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
// import { config } from "../constants";

function AdminLoginPrivateRoute({ children, ...rest }) {
  const { isInstallation } = useSelector((state) => state.admin);

  if (isInstallation === false) {
    return <Navigate replace to="/installation" />;
  }
  return children;
}

export default AdminLoginPrivateRoute;
