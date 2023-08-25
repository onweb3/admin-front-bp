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
            <td className="p-3">
                <span className="capitalize">{request?.hotel?.hotelName}</span>
                <span className="block text-grayColor capitalize">
                    {request?.hotel?.city?.cityName},{" "}
                    {request?.hotel?.state?.stateName},{" "}
                    {request?.hotel?.country?.countryName}
                </span>
                {isDetailsModalOpen && (
                    <RequestDetailsModal
                        setIsDetailsModalOpen={setIsDetailsModalOpen}
                        request={request}
                    />
                )}
            </td>
            <td className="p-3">{formatDate(request?.checkInDate)}</td>
            <td className="p-3">{formatDate(request?.checkOutDate)}</td>
            <td className="p-3">
                {request?.noOfAdults} ADT, {request?.noOfChildren} CHD
            </td>
            <td className="p-3">
                <span className="whitespace-nowrap block">
                    {request?.reseller?.companyName} (
                    {request?.reseller?.agentCode})
                </span>
                <span className="text-grayColor block mt-1">
                    {formatDate(request?.createdAt, true)}
                </span>
            </td>
            <td className="p-3"></td>
        </tr>
    );
}
