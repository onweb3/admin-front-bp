import React, { useRef } from "react";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";
import { formatDate } from "../../../utils";

export default function B2bWalletDepositDetailsModal({ deposit, setIsDepositDetailsModalOpen }) {
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => {
        setIsDepositDetailsModalOpen(false);
    });

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">#{deposit?.b2bWalletDepositRefNumber}</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDepositDetailsModalOpen(false);
                        }}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <table className="text-sm">
                        <tbody>
                            <tr>
                                <td className="p-1 pl-0">Deposited Amount</td>
                                <td className="p-1">:</td>
                                <td className="p-1">{deposit?.depositAmount} AED</td>
                            </tr>
                            <tr>
                                <td className="p-1 pl-0">Credited Amount</td>
                                <td className="p-1">:</td>
                                <td className="p-1">{deposit?.creditAmount} AED</td>
                            </tr>
                            <tr>
                                <td className="p-1 pl-0">Processing Fee</td>
                                <td className="p-1">:</td>
                                <td className="p-1">{deposit?.fee} AED</td>
                            </tr>
                            <tr>
                                <td className="p-1 pl-0">Payment Processor</td>
                                <td className="p-1">:</td>
                                <td className="p-1 capitalize">{deposit?.paymentProcessor}</td>
                            </tr>
                            {deposit?.paymentProcessor === "bank" && (
                                <>
                                    <tr>
                                        <td className="p-1 pl-0">Bank</td>
                                        <td className="p-1">:</td>
                                        <td className="p-1 capitalize">
                                            {deposit?.companyBankId?.bankName || "N/A"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-1 pl-0">Bank Reference Number</td>
                                        <td className="p-1">:</td>
                                        <td className="p-1">{deposit?.referenceNo || "N/A"}</td>
                                    </tr>
                                </>
                            )}
                            <tr>
                                <td className="p-1 pl-0">Date</td>
                                <td className="p-1">:</td>
                                <td className="p-1">{formatDate(deposit?.createdAt, true)}</td>
                            </tr>
                            <tr>
                                <td className="p-1 pl-0">Reseller</td>
                                <td className="p-1">:</td>
                                <td className="p-1 capitalize">
                                    {deposit?.reseller?.companyName} ({deposit?.reseller?.agentCode}
                                    )
                                </td>
                            </tr>
                            <tr>
                                <td className="p-1 pl-0">Deposited By</td>
                                <td className="p-1">:</td>
                                <td className="p-1">
                                    {deposit?.isDepositedByAdmin === true
                                        ? "(Admin) " + deposit?.adminDepositor?.name
                                        : deposit?.reseller?.companyName}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-1 pl-0">Status</td>
                                <td className="p-1">:</td>
                                <td className="p-1">
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
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
