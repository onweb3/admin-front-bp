import React, { useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { FiCheck } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { formatDate } from "../../../utils";
import AddApproveRefundModal from "./AddApproveRefundModal";
import AddCancelRefundModal from "./AddCancelRefundModal";
import RefundDetailsModal from "./RefundDetailsModal";

export default function RefundRequestSingleRow({ request }) {
    const [isWithdrawDetailsModalOpen, setWithdrawDetailsModalOpen] =
        useState(false);
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
                <td className="p-3">{request.user?.name}</td>
                <td className="p-3 ">{request?.amount}</td>
                <td className="p-3">
                    <span className="">
                        {request?.order.referenceNumber}
                    </span>
                    <span className="text-grayColor block ">
                        {request?.order.activities.attraction.title}
                    </span>
                </td>

                <td className="p-3">{formatDate(request?.createdAt)}</td>

                <td className="p-3">
                    <div className="">
                        <button
                            className="h-auto bg-transparent text-gray-500 text-lg"
                            onClick={() => setWithdrawDetailsModalOpen(true)}
                        >
                            <AiFillEye />
                        </button>
                        {isWithdrawDetailsModalOpen && (
                            <RefundDetailsModal
                                request={request}
                                setWithdrawDetailsModalOpen={
                                    setWithdrawDetailsModalOpen
                                }
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
                    ) : status === "cancelled" ? (
                        <div>
                            <span className="py-1 px-2 text-[12px] font-medium rounded text-[#ff0000] bg-[#f065481a]">
                                Cancelled
                            </span>
                        </div>
                    ) : status === "success" ? (
                        <div>
                            <span className="py-1 px-2 text-[12px] font-medium rounded text-[#008000] bg-[#f065481a]">
                                Approved
                            </span>
                        </div>
                    ) : null}
                </td>
            </tr>
            {isModalOpen ? (
                <AddApproveRefundModal
                    setStatus={setStatus}
                    requestId={request._id}
                    setIsModalOpen={setIsModalOpen}
                />
            ) : null}

            {isCancelModalOpen ? (
                <AddCancelRefundModal
                    setStatus={setStatus}
                    requestId={request._id}
                    setIsModalOpen={setIsCancelModalOpen}
                />
            ) : null}
        </>
    );
}
