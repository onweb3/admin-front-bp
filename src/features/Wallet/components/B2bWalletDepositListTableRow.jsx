import React, { useState } from "react";
import { formatDate } from "../../../utils";
import B2bWalletDepositDetailsModal from "./B2bWalletDepositDetailsModal";

export default function B2bWalletDepositListTableRow({ deposit }) {
    const [isDepositDetailsModalOpen, setIsDepositDetailsModalOpen] = useState(false);

    return (
        <tr
            className="border-b border-tableBorderColor ransition-all cursor-pointer hover:bg-[#f3f6f9]"
            onClick={() => {
                setIsDepositDetailsModalOpen(true);
            }}
        >
            <td className="p-3">{deposit?.b2bWalletDepositRefNumber || "N/A"}</td>
            <td className="p-3 capitalize">
                {deposit?.reseller?.companyName} ({deposit?.reseller?.agentCode})
            </td>
            <td className="p-3">{deposit?.depositAmount} AED</td>
            <td className="p-3">{deposit?.creditAmount} AED</td>
            <td className="p-3">{deposit?.fee} AED</td>
            <td className="p-3 capitalize">{deposit?.paymentProcessor}</td>
            <td className="p-3">{formatDate(deposit?.createdAt, true)}</td>
            <td className="p-3">
                <span
                    className={
                        "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                        (deposit?.status === "failed"
                            ? "bg-[#f065481A] text-[#f06548]"
                            : deposit?.status === "completed"
                            ? "text-[#0ab39c] bg-[#0ab39c1A]"
                            : "bg-[#f7b84b1A] text-[#f7b84b]")
                    }
                >
                    {deposit?.status}
                </span>

                {isDepositDetailsModalOpen && (
                    <B2bWalletDepositDetailsModal
                        deposit={deposit}
                        setIsDepositDetailsModalOpen={setIsDepositDetailsModalOpen}
                    />
                )}
            </td>
        </tr>
    );
}
