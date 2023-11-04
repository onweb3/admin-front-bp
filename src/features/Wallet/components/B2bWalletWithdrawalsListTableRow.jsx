import React, { useState } from "react";

import { formatDate } from "../../../utils";
import B2bWalletWithdrawDetailsModla from "./B2bWalletWithdrawDetailsModla";

export default function B2bWalletWithdrawalsListTableRow({ withdraw }) {
    const [isWithdrawDetailsModalOpen, setIsWithdrawDetailsModalOpen] = useState(false);

    return (
        <tr
            className="border-b border-tableBorderColor ransition-all cursor-pointer hover:bg-[#f3f6f9]"
            onClick={() => {
                setIsWithdrawDetailsModalOpen(true);
            }}
        >
            <td className="p-3">{withdraw?.b2bWalletWithdrawRefNo || "N/A"}</td>
            <td className="p-3 capitalize">
                {withdraw?.resellerId?.companyName} ({withdraw?.resellerId?.agentCode})
            </td>
            <td className="p-3">{withdraw?.withdrawAmount || 0} AED</td>
            <td className="p-3">{withdraw?.fee || 0} AED</td>
            <td className="p-3 capitalize">{withdraw?.paymentProcessor}</td>
            <td className="p-3 capitalize">{withdraw?.companyBankId?.bankName || "N/A"}</td>
            <td className="p-3">{formatDate(withdraw?.createdAt, true)}</td>
            <td className="p-3">
                <span
                    className={
                        "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                        (withdraw?.status === "failed"
                            ? "bg-[#f065481A] text-[#f06548]"
                            : withdraw?.status === "completed"
                            ? "text-[#0ab39c] bg-[#0ab39c1A]"
                            : "bg-[#f7b84b1A] text-[#f7b84b]")
                    }
                >
                    {withdraw?.status}
                </span>

                {isWithdrawDetailsModalOpen && (
                    <B2bWalletWithdrawDetailsModla
                        withdraw={withdraw}
                        setIsWithdrawDetailsModalOpen={setIsWithdrawDetailsModalOpen}
                    />
                )}
            </td>
        </tr>
    );
}
