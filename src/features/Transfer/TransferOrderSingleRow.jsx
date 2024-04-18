import React, { useEffect, useState } from "react";
import { FaBus, FaEdit } from "react-icons/fa";
import {
    MdNoTransfer,
    MdOutlineEmail,
    MdTransferWithinAStation,
} from "react-icons/md";
import { BiPhone, BiUser } from "react-icons/bi";
import { FiMapPin } from "react-icons/fi";
import { useSelector } from "react-redux";

import { formatDate } from "../../utils";

import { config } from "../../constants";
import axios from "../../axios";

export default function TransferOrdersSingleRow({ order, section }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [orderData, setOrderData] = useState({
        status: order?.activities?.status,
        drivers: order?.activities?.drivers || [],
        driversRequired: 0,
    });
    const [isDriverAssignModalOpen, setIsDriverAssignModalOpen] =
        useState(false);

    const { jwtToken } = useSelector((state) => state.admin);

    const handleMouseDownOnTicketNumber = async ({ loggedFrom, ticketNo }) => {
        try {
            await axios.post(
                "/attractions/tickets/log",
                {
                    ticketNumber: ticketNo,
                    attraction: order?.attraction?._id,
                    activity: order?.activities?.activity?._id,
                    loggedFrom,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

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
                    {order?.transferType?.toUpperCase()}
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
                    {formatDate(order?.createdAt)}
                </td>
                <td className="p-3 ">{order?.noOfAdults || 0}</td>
                <td className="p-3">{order?.noOfChildrens || 0}</td>
                <td className="p-3 whitespace-nowrap">
                    {order?.netFare?.toFixed(2)} AED
                </td>
                <td className="p-3 whitespace-nowrap">
                    {order?.profit?.toFixed(2) || 0} AED
                </td>
                <td className="p-3">
                    <span
                        className={
                            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                            (order?.status === "cancelled"
                                ? "bg-[#f065481A] text-[#f06548]"
                                : order?.status === "completed"
                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                : "bg-[#f7b84b1A] text-[#f7b84b]")
                        }
                    >
                        {order?.status}
                    </span>
                </td>
            </tr>
            {isDropdownOpen && (
                <tr className="border-b border-tableBorderColor">
                    <td colSpan="8" className="p-3">
                        <div className="flex flex-wrap items-start gap-x-[3em] gap-y-[1.5em]">
                            <div className="flex items-start gap-[1em]">
                                {/* <div className="w-[150px] max-h-[100px] rounded overflow-hidden">
                                            <img
                                                src={
                                                    import.meta.env.VITE_SERVER_URL +
                                                    order?.attraction?.images[0]
                                                }
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div> */}
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
                                    Transfer Type
                                </h2>

                                <span className="flex items-center gap-[7px] mt-2 capitalize">
                                    <MdTransferWithinAStation />{" "}
                                    {order?.transferType} Transfer
                                </span>
                            </div>
                            {order?.trips.map((trip, index) => {
                                return (
                                    <div>
                                        <h2 className="font-medium text-grayColor">
                                            Trip -{" "}
                                            {index === 0 ? "oneway" : "return"}
                                        </h2>

                                        <span className="block mt-2">
                                            <span className="text-grayColor">
                                                Suggestion -
                                            </span>{" "}
                                            {trip?.suggestionType}
                                        </span>
                                        <span className="block mt-2">
                                            <span className="text-grayColor">
                                                Pickup Location -
                                            </span>{" "}
                                            {trip?.suggestionType.split(
                                                "-"
                                            )[0] === "AIRPORT"
                                                ? trip?.transferFrom.airportName
                                                : trip?.transferFrom.name}
                                        </span>

                                        <span className="block mt-2">
                                            <span className="text-grayColor">
                                                Drop Off Location - -
                                            </span>{" "}
                                            {trip?.suggestionType.split(
                                                "-"
                                            )[1] === "AIRPORT"
                                                ? trip?.transferTo.airportName
                                                : trip?.transferTo.name}{" "}
                                        </span>
                                        <span className="block mt-2">
                                            <span className="text-grayColor">
                                                Pickup Date -
                                            </span>{" "}
                                            {formatDate(trip?.pickupDate)}
                                        </span>
                                        <span className="block mt-2">
                                            <span className="text-grayColor">
                                                Pickup Time - -
                                            </span>{" "}
                                            {trip?.pickupTime}
                                        </span>
                                        <span className="block mt-2">
                                            <span className="text-grayColor">
                                                Vehicle Type - -
                                            </span>{" "}
                                            {trip?.vehicleType?.name}
                                        </span>
                                        <span className="block mt-2">
                                            <span className="text-grayColor">
                                                Occupancy - -
                                            </span>{" "}
                                            {trip?.occupancy}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
