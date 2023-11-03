import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../utils";
import HotelReservationConfirmModal from "./HotelReservationConfirmModal";
import HotelReservationCancelModal from "./HotelReservationCancelModal";

function HotelReservationSingleRow({ order }) {
    const [orderData, setOrderData] = useState({
        status: order?.status,
    });
    const [isConfirmModalOpen, setIsConfirmModal] = useState(false);
    const [isCancelModalOpen, setIsCancelModal] = useState(false);

    const navigate = useNavigate();

    return (
        <tr
            className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9] "
            onClick={() => navigate(`${order?._id}`)}
        >
            <td className="p-3">{order?.referenceNumber}</td>
            <td className="p-3 whitespace-nowrap">
                {formatDate(order?.createdAt, true)}
            </td>
            <td className="p-3 min-w-[250px]">{order?.hotel?.hotelName}</td>
            <td className="p-3">
                <span className="block whitespace-nowrap">
                    {order?.reseller?.companyName} ({order?.reseller?.agentCode})
                </span>
                <span className="block">{order?.reseller?.name}</span>
            </td>
            <td className="p-3">
                {formatDate(order?.fromDate)} - {formatDate(order?.toDate)}
            </td>
            <td className="p-3 whitespace-nowrap">
                {order?.totalAdults} ADT, {order?.totalChildren} CHD
            </td>
            <td className="p-3 whitespace-nowrap">
                {order?.netPrice?.toFixed(2)} AED
            </td>
            <td className="p-3" onClick={(e) => e.stopPropagation()}>
                {orderData?.status === "booked" ||
                orderData?.status === "cancel-pending" ? (
                    <div onClick={(e) => e.stopPropagation()}>
                        <select
                            className="h-[35px] py-0 w-[90px] capitalize"
                            onChange={(e) => {
                                if (e.target.value === "confirm") {
                                    setIsConfirmModal(true);
                                } else if (e.target.value === "cancel") {
                                    setIsCancelModal(true);
                                }
                            }}
                            value={orderData.status}
                        >
                            <option value="" hidden>
                                {orderData.status}
                            </option>
                            {orderData?.status === "booked" && (
                                <option value="confirm">Confirm</option>
                            )}
                            <option value="cancel">Cancel</option>
                        </select>
                        {isConfirmModalOpen && (
                            <HotelReservationConfirmModal
                                setIsConfirmModal={setIsConfirmModal}
                                orderId={order?._id}
                                setOrderData={setOrderData}
                            />
                        )}
                        {isCancelModalOpen && (
                            <HotelReservationCancelModal
                                setIsCancelModal={setIsCancelModal}
                                orderId={order?._id}
                                setOrderData={setOrderData}
                                netPrice={order?.netPrice}
                                cancellationPolicies={order?.cancellationPolicies || []}
                            />
                        )}
                    </div>
                ) : (
                    <span
                        className={
                            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                            (orderData?.status === "cancelled"
                                ? "bg-[#f065481A] text-[#f06548]"
                                : orderData?.status === "confirmed"
                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                : "bg-[#f7b84b1A] text-[#f7b84b]")
                        }
                    >
                        {orderData?.status}
                    </span>
                )}
            </td>
        </tr>
    );
}

export default HotelReservationSingleRow;
