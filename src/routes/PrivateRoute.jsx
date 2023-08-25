import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { hasPermission } from "../utils";

function PrivateRoute({ children, ...rest }) {
    const { isLoggedIn, admin } = useSelector((state) => state.admin);

    if (!isLoggedIn) {
        return <Navigate replace to="/login" />;
    }

    if (
        !hasPermission({
            roles: admin?.roles,
            name: rest?.name,
            permission: rest?.permission,
        })
    ) {
        return <Navigate replace to="/" />;
    }

    return children;
}

export default PrivateRoute;
