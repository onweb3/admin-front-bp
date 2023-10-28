import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { FiCheck } from "react-icons/fi";
import { useSelector } from "react-redux";

import { formatDate } from "../../../utils";
import { config } from "../../../constants";
import axios from "../../../axios";

export default function B2bWalletDepositRequestsTableRow({ deposit, updateDepositRequestStatus }) {
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);

    const handleDepositRequestApprove = async () => {
        try {
            const isConfirm = window.confirm("Are you sure to approve this deposit request?");
            if (isConfirm) {
                setIsStatusLoading(true);

                const response = await axios.post(
                    `/wallets/deposit-requests/${deposit?._id}/approve`,
                    {},
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                const { requestId, status } = response.data;
                updateDepositRequestStatus(requestId, status);
                setIsStatusLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleDepositRequestCancel = async () => {
        try {
            const isConfirm = window.confirm("Are you sure to cancel this deposit request?");
            if (isConfirm) {
                setIsStatusLoading(true);

                const response = await axios.post(
                    `/wallets/deposit-requests/${deposit?._id}/cancel`,
                    {},
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                const { requestId, status } = response.data;
                updateDepositRequestStatus(requestId, status);
                setIsStatusLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <tr className="border-b border-tableBorderColor ransition-all cursor-pointer hover:bg-[#f3f6f9]">
            <td className="p-3">{deposit?.referenceNumber || "N/A"}</td>
            <td className="p-3">{formatDate(deposit?.createdAt, true)}</td>
            <td className="p-3 capitalize">
                {deposit?.resellerId?.companyName} ({deposit?.resellerId?.agentCode})
            </td>
            <td className="p-3">{deposit?.amount} AED</td>
            <td className="p-3">{deposit?.companyBankId?.bankName}</td>
            <td className="p-3">
                {deposit?.receipt ? (
                    <a
                        href={config.SERVER_URL + deposit.receipt}
                        className="underline text-blue-500 font-medium"
                        target="_blank"
                    >
                        view
                    </a>
                ) : (
                    "N/A"
                )}
            </td>
            <td className="p-3">{deposit?.remark || "N/A"}</td>
            <td className="p-3">
                {isStatusLoading ? (
                    <div>
                        <div className="w-[25px] h-[25px] rounded-full border-4 border-primaryColor border-r-transparent animate-spin"></div>
                    </div>
                ) : deposit.status === "pending" ? (
                    <div className="flex items-center gap-[10px]">
                        <button
                            className="h-[35px] w-[35px] bg-green-500 flex items-center justify-center text-xl"
                            onClick={handleDepositRequestApprove}
                            disabled={isStatusLoading}
                        >
                            <FiCheck />
                        </button>
                        <button
                            className="h-[35px] w-[35px] bg-red-500 flex items-center justify-center text-xl"
                            onClick={handleDepositRequestCancel}
                            disabled={isStatusLoading}
                        >
                            <MdClose />
                        </button>
                    </div>
                ) : (
                    <span
                        className={
                            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                            (deposit?.status === "cancelled"
                                ? "bg-[#f065481A] text-[#f06548]"
                                : deposit?.status === "confirmed"
                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                : "bg-[#f7b84b1A] text-[#f7b84b]")
                        }
                    >
                        {deposit?.status}
                    </span>
                )}
            </td>
        </tr>
    );
}
