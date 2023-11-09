import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { hasAnyViewPermission } from "../utils";

function HotelDashboardPrivateRoute({ children, ...rest }) {
    const { admin } = useSelector((state) => state.admin);

    const names = [
        "recent-hotel-reservations",
        "hotel-expiring-paylater-report",
        "next-day-arrival-hotel-reservations",
        "next-day-departure-hotel-reservations",
        "hotel-recent-cancellation-requests",
        "top-hotel-reservation-hotels",
        "top-hotel-reservation-resellers",
    ];

    if (!hasAnyViewPermission({ roles: admin?.roles || [], names })) {
        return <Navigate replace to="/" />;
    }

    return children;
}

export default HotelDashboardPrivateRoute;
