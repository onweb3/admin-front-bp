import React, { useRef } from "react";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";

export default function WithdrawRequestDetailsModal({ setWithdrawDetailsModalOpen, request }) {
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setWithdrawDetailsModalOpen(false));

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Withdraw Request Details</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setWithdrawDetailsModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <table>
                        <tr>
                            <td className="pr-2 py-[5px] text-gray-500">Company Name</td>
                            <td className="px-1">:</td>
                            <td className="pl-2">{request.reseller?.companyName}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 py-[5px] text-gray-500">Reseller Name</td>
                            <td className="px-1">:</td>
                            <td className="pl-2">
                                {request.reseller?.name} ({request.reseller?.agentCode})
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2 py-[5px] text-gray-500">Country</td>
                            <td className="px-1">:</td>
                            <td className="pl-2">{request.b2bBankDetails?.isoCode}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 py-[5px] text-gray-500">Bank Name</td>
                            <td className="px-1">:</td>
                            <td className="pl-2">{request.b2bBankDetails?.bankName}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 py-[5px] text-gray-500">Branch Name</td>
                            <td className="px-1">:</td>
                            <td className="pl-2">{request.b2bBankDetails?.branchName}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 py-[5px] text-gray-500">Holder Name</td>
                            <td className="px-1">:</td>
                            <td className="pl-2">{request.b2bBankDetails?.accountHolderName}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 py-[5px] text-gray-500">Bank Account Number</td>
                            <td className="px-1">:</td>
                            <td className="pl-2">{request.b2bBankDetails?.accountNumber}</td>
                        </tr>
                        <tr>
                            {request.b2bBankDetails?.isoCode == "IN" ? (
                                <>
                                    <td className="pr-2 py-[5px] text-gray-500">IFSC Code</td>
                                    <td className="px-1">:</td>
                                    <td className="pl-2">{request.b2bBankDetails?.ifscCode}</td>
                                </>
                            ) : (
                                <>
                                    <td className="pr-2 py-[5px] text-gray-500">IBAN Number</td>
                                    <td className="px-1">:</td>
                                    <td className="pl-2">{request.b2bBankDetails?.ibanCode}</td>
                                </>
                            )}
                        </tr>
                        <tr>
                            <td className="pr-2 py-[5px] text-gray-500">Amount</td>
                            <td className="px-1">:</td>
                            <td className="pl-2">{request?.amount} AED</td>
                        </tr>
                        <tr>
                            <td className="pr-2 py-[5px] text-gray-500">Status</td>
                            <td className="px-1">:</td>
                            <td className="pl-2">
                                <span
                                    className={
                                        "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                        (request?.status === "cancelled"
                                            ? "bg-[#f065481A] text-[#f06548]"
                                            : request?.status === "confirmed"
                                            ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                            : "bg-[#f7b84b1A] text-[#f7b84b]")
                                    }
                                >
                                    {request?.status}
                                </span>
                            </td>
                        </tr>
                        {request?.status === "cancelled" && (
                            <tr>
                                <td className="pr-2 py-[5px] text-gray-500">Cancellation Reason</td>
                                <td className="px-1">:</td>
                                <td className="pl-2">{request?.cancellationReason || "N/A"}</td>
                            </tr>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
}
