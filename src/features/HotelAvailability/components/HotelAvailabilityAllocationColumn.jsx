import React, { useState } from "react";
import HotelAvailabilityDetailsModal from "./HotelAvailabilityDetailsModal";

export default function HotelAvailabilityAllocationColumn({
    allocation,
    roomType,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <td
            className={
                "relative border text-center text-white " +
                (allocation?.allocationType === "static"
                    ? "bg-blue-500"
                    : allocation?.allocationType === "free-sale"
                    ? "bg-green-500"
                    : allocation?.allocationType === "stop-sale"
                    ? "bg-red-500"
                    : allocation?.allocationType === "on-request"
                    ? "bg-yellow-500"
                    : "bg-orange-500")
            }
            onClick={() => {
                setIsModalOpen(true);
            }}
        >
            {allocation?.allocationType === "static"
                ? (allocation?.unitWise === "room" ? "R-" : "P-") +
                  allocation?.allocation
                : ""}
            {allocation?.allocationType === "static"
                ? (allocation?.unitWise === "room" ? " / R-" : " / P-") +
                  allocation?.bookedAllocation
                : ""}
            {isModalOpen && (
                <HotelAvailabilityDetailsModal
                    setIsModalOpen={setIsModalOpen}
                    allocation={allocation}
                    roomType={roomType}
                />
            )}
        </td>
    );
}
