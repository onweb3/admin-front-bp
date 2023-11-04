import React, { useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { FiCheck } from "react-icons/fi";
import { MdClose } from "react-icons/md";

import { formatDate } from "../../../utils";
import AddApproveWalletWithdrawModal from "./WithdrawAcceptModal";
import AddCancelWalletWithdrawModal from "./WithdrawCancelModal";
import WithdrawRequestDetailsModal from "./WithdrawDetailsModal";

export default function WithdrawRequestSingleRow({ request, banks }) {
    const [isWithdrawDetailsModalOpen, setWithdrawDetailsModalOpen] = useState(false);
    const [status, setStatus] = useState(request.status);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleApprove = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsCancelModalOpen(true);
    };

    return (
        <>
            <tr className="border-b border-tableBorderColor">
                <td className="p-3">{request.b2bWalletWithdrawRequestRefNo || "N/A"}</td>
                <td className="p-3 whitespace-nowrap">
                    {request.reseller?.name} ({request?.reseller?.agentCode})
                </td>
                <td className="p-3 ">{request?.amount} AED</td>
                <td className="p-3">{formatDate(request?.createdAt, true)}</td>

                <td className="p-3">
                    <div className="">
                        <button
                            className="h-auto bg-transparent text-gray-500 text-lg"
                            onClick={() => setWithdrawDetailsModalOpen(true)}
                        >
                            <AiFillEye />
                        </button>
                        {isWithdrawDetailsModalOpen && (
                            <WithdrawRequestDetailsModal
                                request={request}
                                setWithdrawDetailsModalOpen={setWithdrawDetailsModalOpen}
                            />
                        )}
                    </div>
                </td>
                <td className="p-3">
                    {status === "pending" ? (
                        <div className="flex items-center gap-[10px]">
                            <button
                                className="h-[35px] w-[35px] bg-green-500 flex items-center justify-center text-xl"
                                onClick={handleApprove}
                            >
                                <FiCheck />
                            </button>
                            <button
                                className="h-[35px] w-[35px] bg-red-500 flex items-center justify-center text-xl"
                                onClick={handleCancel}
                            >
                                <MdClose />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <span
                                className={
                                    "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                    (status === "cancelled"
                                        ? "bg-[#f065481A] text-[#f06548]"
                                        : status === "confirmed"
                                        ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                        : "bg-[#f7b84b1A] text-[#f7b84b]")
                                }
                            >
                                {status}
                            </span>
                        </div>
                    )}
                </td>
            </tr>
            {isModalOpen ? (
                <AddApproveWalletWithdrawModal
                    setStatus={setStatus}
                    resellerId={request._id}
                    setIsModalOpen={setIsModalOpen}
                    banks={banks}
                />
            ) : null}

            {isCancelModalOpen ? (
                <AddCancelWalletWithdrawModal
                    setStatus={setStatus}
                    resellerId={request._id}
                    setIsModalOpen={setIsCancelModalOpen}
                />
            ) : null}
        </>
    );
}
