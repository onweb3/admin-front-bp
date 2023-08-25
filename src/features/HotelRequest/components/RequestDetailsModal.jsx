import React, { useRef } from "react";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";
import { formatDate } from "../../../utils";
import { AiOutlineMail, AiOutlinePhone, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function RequestDetailsModal({
    setIsDetailsModalOpen,
    request,
}) {
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsDetailsModalOpen(false));

    return (
        <div
            className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 cursor-default "
            onClick={(e) => e.stopPropagation()}
        >
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Hotel Request Details</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        type="button"
                        onClick={() => setIsDetailsModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <h3 className="font-medium capitalize">
                        {request?.hotel?.hotelName}
                    </h3>
                    <span className="block text-grayColor capitalize">
                        {request?.hotel?.city?.cityName},{" "}
                        {request?.hotel?.state?.stateName},{" "}
                        {request?.hotel?.country?.countryName}
                    </span>
                    <table className="w-full mt-3">
                        <tbody>
                            <tr>
                                <td>CheckIn Date</td>
                                <td className="p-1">:</td>
                                <td>{formatDate(request?.checkInDate)}</td>
                            </tr>
                            <tr>
                                <td>CheckOut Date</td>
                                <td className="p-1">:</td>
                                <td>{formatDate(request?.checkOutDate)}</td>
                            </tr>
                            <tr>
                                <td>Pax</td>
                                <td className="p-1">:</td>
                                <td>
                                    {request?.noOfAdults} ADT,{" "}
                                    {request?.noOfChildren} CHD
                                </td>
                            </tr>
                            <tr>
                                <td>Room Type</td>
                                <td className="p-1">:</td>
                                <td>{request?.roomType?.roomName}</td>
                            </tr>
                            <tr>
                                <td>Board Type</td>
                                <td className="p-1">:</td>
                                <td>
                                    {request?.boardType?.boardName} (
                                    {request?.boardType?.boardShortName})
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="mt-3">
                        <h3 className="font-medium ">User Details</h3>
                        <div className="flex items-center gap-[20px] flex-wrap mt-1">
                            <div className="flex items-center gap-[10px]">
                                <span>
                                    <AiOutlineUser />
                                </span>
                                {request?.name}
                            </div>
                            <div className="flex items-center gap-[10px]">
                                <span>
                                    <AiOutlineMail />
                                </span>
                                {request?.email}
                            </div>
                            <div className="flex items-center gap-[10px]">
                                <span>
                                    <AiOutlinePhone />
                                </span>
                                {request?.country?.phonecode}{" "}
                                {request?.phoneNumber}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <h3 className="font-medium">Remarks</h3>
                        <span className="block text-grayColor mt-1">
                            {request?.remarks || "N/A"}
                        </span>
                    </div>
                    <div className="mt-3 bg-blue-200">
                        <span className="block">
                            Requested By{" "}
                            <Link
                                to={`/b2b/${request?.reseller?._id}/details`}
                                className="underline"
                            >
                                {request?.reseller?.companyName} (
                                {request?.reseller?.agentCode})
                            </Link>{" "}
                            at {formatDate(request?.createdAt, true)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
