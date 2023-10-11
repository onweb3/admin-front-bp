import React, { useState } from "react";

import { formatDate } from "../../../utils";
import RequestDetailsModal from "./RequestDetailsModal";

export default function HotelRequestTableRow({ request }) {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    return (
        <tr
            className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
            onClick={() => setIsDetailsModalOpen(true)}
        >
            <td className="p-3">{request?.b2bHotelRequestId || "N/A"}</td>
            <td className="p-3">
                <span className="capitalize">{request?.hotel?.hotelName}</span>
                <span className="block text-grayColor capitalize">
                    {request?.hotel?.city?.cityName}, {request?.hotel?.state?.stateName},{" "}
                    {request?.hotel?.country?.countryName}
                </span>
                {isDetailsModalOpen && (
                    <RequestDetailsModal
                        setIsDetailsModalOpen={setIsDetailsModalOpen}
                        request={request}
                    />
                )}
            </td>
            <td className="p-3">{formatDate(request?.fromDate)}</td>
            <td className="p-3">{formatDate(request?.toDate)}</td>
            <td className="p-3 capitalize">{request?.roomType?.roomName}</td>
            <td className="p-3 capitalize">{request?.boardType?.boardName}</td>
            <td className="p-3">
                {request?.roomsCount} Rooms, {request?.totalAdults} ADT, {request?.totalChildren}{" "}
                CHD
            </td>
        </tr>
    );
}
