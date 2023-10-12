import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import axios from "../../../axios";
import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import AffiliateRedeemRequestModal from "./AfiiliateRedeemRequestModal";
import { HiOutlineTicket } from "react-icons/hi";
import { FiCheck } from "react-icons/fi";

export default function AffiliateRedeemRequestRow({
    index,
    request,
    setIsModal,
    isModal,
    value,
    setRequests,
    changeStatus,
}) {
    const [isDropdownView, setIsDropdownView] = useState(false);

    return (
        <>
            <tr
                key={index}
                className="border-b border-tableBorderColor"
                onClick={() => setIsDropdownView(!isDropdownView)}
            >
                <td className="p-3 capitalize">{index + 1}</td>
                <td className="p-3">{request?.transactionNo}</td>

                <td className="p-3">{request?.user.name}</td>
                <td className="p-3 capitalize">{request?.redeemOption || 0}</td>
                <td className="p-3 capitalize">{request?.points || 0}</td>
                <td className="p-3 capitalize">{request?.currency || 0}</td>
                <td className="p-3 capitalize">{request?.feeDeduction || 0}</td>

                <td className="p-3 capitalize">
                    {request?.amount.toFixed(2) || 0}
                </td>
                <td className="p-3 capitalize">{request?.reason || "N/A"}</td>
                {request?.status === "pending" ? (
                    <td className="p-3">
                        <div className="flex gap-[10px]">
                            <button
                                className="h-auto bg-transparent text-green-500 text-lg"
                                onClick={() =>
                                    changeStatus({
                                        redeemId: request?._id,
                                        value: "approved",
                                    })
                                }
                            >
                                <FiCheck />
                            </button>

                            <button
                                className="h-auto bg-transparent text-red-500 text-lg"
                                onClick={() => {
                                    changeStatus({
                                        redeemId: request?._id,
                                        value: "cancelled",
                                    });
                                }}
                            >
                                <MdClose />
                            </button>

                            {isModal && (
                                <AffiliateRedeemRequestModal
                                    setIsModal={setIsModal}
                                    redeemId={request?._id}
                                    value={value}
                                    setRequests={setRequests}
                                />
                            )}
                        </div>
                    </td>
                ) : (
                    <td className="p-3 capitalize">
                        {request?.status || "N/A"}
                    </td>
                )}
            </tr>
            {isDropdownView && (
                <tr className="border-b border-tableBorderColor">
                    <td colSpan="7" className="p-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <h2 className="font-[500] flex items-center gap-2">
                                    <span className="text-lg">
                                        <HiOutlineTicket />
                                    </span>
                                    <span className="">Reedem Details</span>
                                </h2>
                                {/* <p className="text-gray-600 text-[14px] font-[700]">
                                    A2A Ticket Details
                                </p> */}
                                <div className="grid grid-cols-2 gap-1">
                                    <p className="text-[14px] text-gray-500">
                                        Type
                                    </p>
                                    <p className="text-[15px] capitalize ">
                                        {request?.financialData?.type}
                                    </p>

                                    {request?.financialData?.type ===
                                        "bank" && (
                                        <>
                                            {" "}
                                            <p className="text-[14px] text-gray-500">
                                                Bank Name
                                            </p>
                                            <p className="text-[15px] capitalize ">
                                                {
                                                    request?.financialData
                                                        ?.bankName
                                                }
                                            </p>
                                            <p className="text-[14px] text-gray-500">
                                                Account Holder Name
                                            </p>
                                            <p className="text-[15px] capitalize ">
                                                {
                                                    request?.financialData
                                                        ?.accountHolderName
                                                }
                                            </p>
                                            <p className="text-[14px] text-gray-500">
                                                Account Number
                                            </p>
                                            <p className="text-[15px] capitalize ">
                                                {
                                                    request?.financialData
                                                        ?.accountNumber
                                                }
                                            </p>
                                            <p className="text-[14px] text-gray-500">
                                                Bank Country
                                            </p>
                                            <p className="text-[15px] capitalize ">
                                                {
                                                    request?.financialData
                                                        ?.countryCode
                                                }
                                            </p>
                                        </>
                                    )}
                                    {request?.financialData?.type ===
                                        "crypto" && (
                                        <>
                                            {" "}
                                            <p className="text-[14px] text-gray-500">
                                                Network
                                            </p>
                                            <p className="text-[15px] capitalize ">
                                                {
                                                    request?.financialData
                                                        ?.network
                                                }
                                            </p>
                                            <p className="text-[14px] text-gray-500">
                                                Address
                                            </p>
                                            <p className="text-[15px] capitalize ">
                                                {
                                                    request?.financialData
                                                        ?.address
                                                }
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}
