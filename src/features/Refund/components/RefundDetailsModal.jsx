import React, { useRef } from "react";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";

export default function RefundDetailsModal({
    setWithdrawDetailsModalOpen,
    request,
}) {
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setWithdrawDetailsModalOpen(false));

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Withdraw Request</h2>
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
                            <td className="pr-2 py-2 text-gray-500">
                                User Name
                            </td>
                            <td className="p-2">:</td>
                            <td className="pl-2 py-2">
                                {request.user?.name}
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2 py-2 text-gray-500">
                                Holder Name
                            </td>
                            <td className="p-2">:</td>
                            <td className="pl-2 py-2">
                                {request.bankDetails?.accountHolderName}
                            </td>
                        </tr>
                        
                        <tr>
                            {request.bankDetails?.bankCountry == "IN" ? (
                                <>
                                    <td className="pr-2 py-2 text-gray-500">
                                        IFSC Number
                                    </td>
                                    <td className="p-2">:</td>
                                    <td className="pl-2 py-2">
                                        {request.bankDetails?.ifscCode}
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="pr-2 py-2 text-gray-500">
                                        IBAN Number
                                    </td>
                                    <td className="p-2">:</td>
                                    <td className="pl-2 py-2">
                                        {request.bankDetails?.ibanCode}
                                    </td>
                                </>
                            )}
                        </tr>
                        <tr>
                            <td className="pr-2 py-2 text-gray-500">
                                Bank Account Number
                            </td>
                            <td className="p-2">:</td>
                            <td className="pl-2 py-2">
                                {request.bankDetails?.accountNumber}
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2 py-2 text-gray-500">Country</td>
                            <td className="p-2">:</td>
                            <td className="pl-2 py-2">
                                {request.bankDetails?.bankCountry}
                            </td>
                        </tr>
                        <tr>
                            <td className="pr-2 py-2 text-gray-500">Amount</td>
                            <td className="p-2">:</td>
                            <td className="pl-2 py-2">{request?.amount}</td>
                        </tr>
                        <tr>
                            <td className="pr-2 py-2 text-gray-500">Status</td>
                            <td className="p-2">:</td>
                            <td className="pl-2 py-2">
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
                    </table>
                </div>
            </div>
        </div>
    );
}
