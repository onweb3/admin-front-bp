import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { config } from "../constants";

function AdminPrivateRoute({ children, ...rest }) {
    const { isLoggedIn, isInstallation } = useSelector((state) => state.admin);

    if (isInstallation === false) {
        return <Navigate replace to="/installation" />;
    } else if (!isLoggedIn) {
        return <Navigate replace to="/login" />;
    }

    console.log(children);

    return children;
}

export default AdminPrivateRoute;
