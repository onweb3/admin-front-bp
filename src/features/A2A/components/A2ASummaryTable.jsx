import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { formatDate, priceConversion } from "../../../utils";
import axios from "../../../axios";
import { FiCheck } from "react-icons/fi";
import { MdChildFriendly, MdClose } from "react-icons/md";

function A2ASummaryTable({ order, index }) {
    const { jwtToken } = useSelector((state) => state.admin);
    const { selectedCurrency } = useSelector((state) => state.general);
    const [status, setStatus] = useState(order?.passengerDetails?.status);

    const confirmA2A = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to confirm?");
            if (isConfirm) {
                await axios.patch(
                    `/a2a/orders/${order._id}/confirm`,
                    { passengerId: id },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                setStatus("confirmed");
            }
        } catch (err) {
            console.log(err);
        }
    };

    const cancelA2A = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to cancel?");
            if (isConfirm) {
                await axios.patch(
                    `/a2a/orders/${order._id}/cancel`,
                    { passengerId: id },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                setStatus("cancelled");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <tr className="border-b border-tableBorderColor text-textColor">
            <td className="p-3">{index + 1}</td>
            <td className="p-3 ">{order?.referenceNumber}</td>
            <td className="p-3 capitalize">
                <p className="">
                    {order?.passengerDetails?.title +
                        " " +
                        order?.passengerDetails?.firstName +
                        " " +
                        order?.passengerDetails?.lastName}
                </p>
                {order?.passengerDetails?.isInfant && (
                    <div className="flex gap-1 items-center">
                        <p className="text-xs font-[500] text-stone-500 underline">
                            <MdChildFriendly />
                        </p>
                        <p className="text-sm">
                            {order?.passengerDetails?.infantDetails?.title +
                                " " +
                                order?.passengerDetails?.infantDetails
                                    ?.firstName +
                                " " +
                                order?.passengerDetails?.infantDetails
                                    ?.lastName}
                        </p>
                    </div>
                )}
            </td>
            <td className="p-3">{order?.a2aTicket?.pnrNo}</td>
            <td className="p-3">{formatDate(order?.createdAt)}</td>
            <td className="p-3">
                <div className="">
                    <p className="">{`${order?.a2aTicket?.airportFromIata} - ${order?.a2aTicket?.airportToIata} - ${order?.a2aTicket?.airportFromIata}`}</p>
                    <p className="text-gray-500">{`(${order?.a2aTicket?.onwardDate?.slice(
                        0,
                        10
                    )}) - (${order?.a2aTicket?.returnDate?.slice(0, 10)})`}</p>
                </div>
            </td>
            <td className="p-3">
                {priceConversion(
                    order?.passengerDetails?.amount,
                    selectedCurrency,
                    true
                )}
            </td>
            <td className="p-3">
                <div className="flex items-center gap-[10px]">
                    {status === "booked" && order?.isCancellationAvailable ? (
                        <>
                            <button
                                className="h-auto bg-transparent bg-green-500 text-[12px] text-white p-1 text-2xl"
                                onClick={() =>
                                    confirmA2A(order?.passengerDetails?._id)
                                }
                            >
                                <FiCheck />
                            </button>
                            <button
                                className="h-auto bg-transparent bg-red-500 text-[12px] text-white p-1 text-2xl"
                                onClick={() =>
                                    cancelA2A(order?.passengerDetails?._id)
                                }
                            >
                                <MdClose />
                            </button>
                        </>
                    ) : status === "confirmed" ? (
                        <p className="text-green-500 bg-green-100 p-1 text-[11px] rounded">
                            {status}
                        </p>
                    ) : (
                        <p className="text-green-500 bg-green-100 p-1 text-[11px] rounded">
                            {status}
                        </p>
                    )}
                </div>
            </td>
        </tr>
    );
}

export default A2ASummaryTable;
