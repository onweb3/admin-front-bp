import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminPrivateRoute({ children, ...rest }) {
    const { isLoggedIn } = useSelector((state) => state.admin);

    if (!isLoggedIn) {
        return <Navigate replace to="/login" />;
    }

    console.log(children);

    return children;
}

export default AdminPrivateRoute;
