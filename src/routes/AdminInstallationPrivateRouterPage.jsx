import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
// import { config } from "../constants";

function AdminInstallationPrivateRouterPage({ children, ...rest }) {
  const { isInstallation } = useSelector((state) => state.admin);

  if (isInstallation === true) {
    return <Navigate replace to="/login" />;
  }
  return children;
}

export default AdminInstallationPrivateRouterPage;
