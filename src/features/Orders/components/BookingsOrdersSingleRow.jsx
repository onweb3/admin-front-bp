import React, { useEffect, useState } from "react";
import { FaBus, FaEdit } from "react-icons/fa";
import { MdNoTransfer, MdOutlineEmail } from "react-icons/md";
import { BiPhone, BiUser } from "react-icons/bi";
import { FiMapPin } from "react-icons/fi";
import { useSelector } from "react-redux";

import { formatDate } from "../../../utils";
import BookingConfirmationModal from "./BookingConfirmationModal";
import axios from "../../../axios";
import DriverAssignModal from "./DriverAssignModal";
import { config } from "../../../constants";

export default function BookingsOrdersSingleRow({ order, section }) {
    const [orderData, setOrderData] = useState({
        status: order?.activities?.status,
        bookingConfirmationNumber: order?.activities?.bookingConfirmationNumber,
        drivers: order?.activities?.drivers || [],
        driversRequired: 0,
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isBookingConfirmationModalOpen, setIsBookingConfirmationModalOpen] =
        useState(false);
    const [isDriverAssignModalOpen, setIsDriverAssignModalOpen] =
        useState(false);
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);

    const handleOrderStatusChange = async (e) => {
        try {
            setIsStatusLoading(true);

            await axios.patch(
                `/attractions/orders/bookings/cancel`,
                {
                    orderId: order?._id,
                    bookingId: order?.activities?._id,
                    orderedBy: section,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setOrderData((prev) => {
                return { ...prev, status: "cancelled" };
            });
            
            setIsStatusLoading(false);
        } catch (err) {
            e.target.value = "";
        }
    };

    useEffect(() => {
        if (order.activities.transferType === "shared") {
            setOrderData((prev) => {
                return { ...prev, driversRequired: 1 };
            });
        } else if (order.activities.transferType === "private") {
            const total = order.activities.privateTransfers
                ?.map((item) => item.count)
                .reduce((prev, next) => prev + next);
            setOrderData((prev) => {
                return { ...prev, driversRequired: total || 0 };
            });
        }
    }, [order]);

    return (
        <>
            <tr
                className={
                    "border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9] " +
                    (isDropdownOpen ? "bg-[#f3f6f9]" : "")
                }
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <td className="p-3">{order?.referenceNumber}</td>
                <td className="p-3 min-w-[250px]">
                    {order?.activities?.activity?.name}
                </td>
                {section !== "b2c" && (
                    <td className="p-3 whitespace-nowrap">
                        <span className="block text-sm capitalize">
                            {order?.reseller?.companyName}
                        </span>
                        <span>{order?.reseller?.agentCode}</span>
                    </td>
                )}
                <td className="p-3 whitespace-nowrap">
                    {formatDate(order?.activities?.date)}
                </td>
                <td className="p-3 ">{order?.activities?.adultsCount || 0}</td>
                <td className="p-3">{order?.activities?.childrenCount || 0}</td>
                <td className="p-3">{order?.activities?.infantCount || 0}</td>
                <td className="p-3 whitespace-nowrap">
                    {order?.activities?.grandTotal?.toFixed(2)} AED
                </td>
                <td className="p-3 whitespace-nowrap">
                    {order?.activities?.profit?.toFixed(2) || 0} AED
                </td>
                <td className="p-3">
                    <div>
                        {orderData?.status === "booked" ? (
                            <div onClick={(e) => e.stopPropagation()}>
                                <select
                                    className="h-[35px] py-0 w-[90px]"
                                    onChange={(e) => {
                                        if (e.target.value === "confirm") {
                                            setIsBookingConfirmationModalOpen(
                                                true
                                            );
                                        } else if (
                                            e.target.value === "cancel"
                                        ) {
                                            e.target.value = e.target.value;
                                            handleOrderStatusChange();
                                        }
                                    }}
                                    value={orderData.status}
                                >
                                    <option value="" hidden>
                                        Booked
                                    </option>
                                    <option value="confirm">Confirm</option>
                                    <option value="cancel">Cancel</option>
                                </select>
                                {isBookingConfirmationModalOpen && (
                                    <BookingConfirmationModal
                                        setIsBookingConfirmationModalOpen={
                                            setIsBookingConfirmationModalOpen
                                        }
                                        setOrderData={setOrderData}
                                        orderId={order?._id}
                                        bookingId={order?.activities?._id}
                                        orderedBy={section}
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
                    </div>
                </td>
            </tr>
            {isDropdownOpen && (
                <tr className="border-b border-tableBorderColor">
                    <td colSpan="8" className="p-3">
                        <div className="flex flex-wrap items-start gap-x-[3em] gap-y-[2em]">
                            <div className="flex items-start gap-[1em]">
                                <div className="w-[150px] max-h-[100px] rounded overflow-hidden">
                                    <img
                                        src={
                                            config.SERVER_URL +
                                            order?.attraction?.images[0]
                                        }
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-base font-[600]">
                                        {order?.attraction?.title}
                                    </h2>
                                    <span className="font-medium block mt-1">
                                        {order?.activities?.activity?.name}
                                    </span>
                                    <span className="block mt-2">
                                        <span className="text-grayColor">
                                            Purchase Date -
                                        </span>{" "}
                                        {formatDate(order?.createdAt)}
                                    </span>
                                    <span className="block mt-2">
                                        <span className="text-grayColor">
                                            Booking Date -
                                        </span>{" "}
                                        {formatDate(order?.activities?.date)}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h2 className="font-medium text-grayColor">
                                    Traveller Details
                                </h2>
                                <span className="flex items-center gap-[7px] mt-2">
                                    <BiUser /> {order?.name}
                                </span>
                                <span className="flex items-center gap-[7px] mt-2">
                                    <MdOutlineEmail /> {order?.email}
                                </span>
                                <span className="flex items-center gap-[7px] mt-2">
                                    <FiMapPin /> {order?.country?.countryName}
                                </span>
                                <span className="flex items-center gap-[7px] mt-2">
                                    <BiPhone /> {order?.country?.phonecode}{" "}
                                    {order?.phoneNumber}
                                </span>
                            </div>
                            <div>
                                <h2 className="font-medium text-grayColor">
                                    Transfer Option
                                </h2>
                                {order?.activities?.transferType ===
                                "without" ? (
                                    <span className="flex items-center gap-[7px] mt-2 capitalize">
                                        <MdNoTransfer />{" "}
                                        {order?.activities?.transferType}{" "}
                                        Transfer
                                    </span>
                                ) : (
                                    <div>
                                        <span className="flex items-center gap-[7px] mt-2 capitalize">
                                            <FaBus />{" "}
                                            {order?.activities?.transferType}{" "}
                                            Transfer
                                        </span>
                                        <div>
                                            {order?.activities?.transferType ===
                                                "private" &&
                                                order?.activities?.privateTransfers?.map(
                                                    (transfer, index) => {
                                                        return (
                                                            <span
                                                                key={index}
                                                                className="block mt-[6px]"
                                                            >
                                                                {transfer?.name}{" "}
                                                                x{" "}
                                                                {
                                                                    transfer?.count
                                                                }
                                                            </span>
                                                        );
                                                    }
                                                )}
                                        </div>
                                        {isDriverAssignModalOpen &&
                                            orderData.status ===
                                                "confirmed" && (
                                                <DriverAssignModal
                                                    orderId={order?._id}
                                                    orderItemId={
                                                        order?.activities?._id
                                                    }
                                                    setIsDriverAssignModalOpen={
                                                        setIsDriverAssignModalOpen
                                                    }
                                                    setOrderData={setOrderData}
                                                    orderData={orderData}
                                                />
                                            )}
                                    </div>
                                )}
                                {order?.activities?.transferType !==
                                    "without" &&
                                    order?.activities?.status ===
                                        "confirmed" && (
                                        <div className="block mt-3">
                                            <h2 className="font-medium text-grayColor flex items-center gap-[10px]">
                                                Drivers{" "}
                                                <span
                                                    className="text-green-500 cursor-pointer"
                                                    onClick={() =>
                                                        setIsDriverAssignModalOpen(
                                                            true
                                                        )
                                                    }
                                                >
                                                    <FaEdit />
                                                </span>
                                            </h2>
                                            {orderData?.drivers?.length > 0 ? (
                                                <div className="flex flex-wrap gap-[10px] mt-2">
                                                    {orderData?.drivers?.map(
                                                        (driver, index) => {
                                                            return (
                                                                <span
                                                                    key={index}
                                                                    className="flex items-center gap-[5px] bg-slate-200 rounded py-1 px-2 text-sm cursor-pointer"
                                                                >
                                                                    {
                                                                        driver?.driverName
                                                                    }
                                                                </span>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm font-medium">
                                                    Not Assigned
                                                </span>
                                            )}
                                        </div>
                                    )}
                            </div>
                            <div>
                                <span className="block mt-2">
                                    Booking Confirmation Number:{" "}
                                    <span className="text-sm font-medium">
                                        {orderData?.status !== "confirmed"
                                            ? "N/A"
                                            : orderData?.bookingConfirmationNumber}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
