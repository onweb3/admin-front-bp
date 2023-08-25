import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function SuperAdminPrivateRoute({ children, ...rest }) {
    const { admin, isLoggedIn } = useSelector((state) => state.admin);

    if (!isLoggedIn) {
        return <Navigate replace to="/login" />;
    }

    if (admin?.role !== "super-admin") {
        return <Navigate replace to="/" />;
    }

    return children;
}

export default SuperAdminPrivateRoute;
