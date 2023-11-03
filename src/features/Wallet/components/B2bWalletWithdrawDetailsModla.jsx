import React, { useRef } from "react";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";
import { formatDate } from "../../../utils";

export default function B2bWalletWithdrawDetailsModla({ withdraw, setIsWithdrawDetailsModalOpen }) {
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => {
        setIsWithdrawDetailsModalOpen(false);
    });

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">#{withdraw?.b2bWalletWithdrawRefNo || "N/A"}</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsWithdrawDetailsModalOpen(false);
                        }}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <table className="text-sm">
                        <tbody>
                            <tr>
                                <td className="p-1 pl-0">Withdrawn Amount</td>
                                <td className="p-1">:</td>
                                <td className="p-1">{withdraw?.withdrawAmount || 0} AED</td>
                            </tr>
                            <tr>
                                <td className="p-1 pl-0">Processing Fee</td>
                                <td className="p-1">:</td>
                                <td className="p-1">{withdraw?.fee || 0} AED</td>
                            </tr>
                            <tr>
                                <td className="p-1 pl-0">Payment Processor</td>
                                <td className="p-1">:</td>
                                <td className="p-1 capitalize">{withdraw?.paymentProcessor}</td>
                            </tr>
                            {withdraw?.paymentProcessor === "bank" && (
                                <>
                                    <tr>
                                        <td className="p-1 pl-0">Company Bank</td>
                                        <td className="p-1">:</td>
                                        <td className="p-1 capitalize">
                                            {withdraw?.companyBankId?.bankName || "N/A"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-1 pl-0">Bank Reference Number</td>
                                        <td className="p-1">:</td>
                                        <td className="p-1">{withdraw?.referenceNo || "N/A"}</td>
                                    </tr>
                                </>
                            )}
                            <tr>
                                <td className="p-1 pl-0">Date</td>
                                <td className="p-1">:</td>
                                <td className="p-1">{formatDate(withdraw?.createdAt, true)}</td>
                            </tr>
                            {withdraw?.paymentProcessor !== "bank" && (
                                <tr>
                                    <td className="p-1 pl-0">Reseller</td>
                                    <td className="p-1">:</td>
                                    <td className="p-1 capitalize">
                                        {withdraw?.resellerId?.companyName} (
                                        {withdraw?.resellerId?.agentCode})
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td className="p-1 pl-0">Withdrawn By</td>
                                <td className="p-1">:</td>
                                <td className="p-1 capitalize">{withdraw?.withdrawnAdmin?.name}</td>
                            </tr>
                            <tr>
                                <td className="p-1 pl-0">Status</td>
                                <td className="p-1">:</td>
                                <td className="p-1">
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
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {withdraw?.paymentProcessor === "bank" && (
                        <>
                            <div className="border-t-2 border-dashed my-3"></div>
                            <h3 className="font-medium mb-2">{"->"} B2B Bank Details</h3>
                            <table className="text-sm">
                                <tbody>
                                    <tr>
                                        <td className="p-1 pl-0">Reseller</td>
                                        <td className="p-1">:</td>
                                        <td className="p-1 capitalize">
                                            {withdraw?.resellerId?.companyName} (
                                            {withdraw?.resellerId?.agentCode})
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-1 pl-0">Country</td>
                                        <td className="p-1">:</td>
                                        <td className="p-1 capitalize">
                                            {withdraw?.b2bBankDetails?.isoCode}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-1 pl-0">Bank Name</td>
                                        <td className="p-1">:</td>
                                        <td className="p-1 capitalize">
                                            {withdraw?.b2bBankDetails?.bankName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-1 pl-0">Branch</td>
                                        <td className="p-1">:</td>
                                        <td className="p-1 capitalize">
                                            {withdraw?.b2bBankDetails?.branchName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-1 pl-0">Account Holder Name</td>
                                        <td className="p-1">:</td>
                                        <td className="p-1 capitalize">
                                            {withdraw?.b2bBankDetails?.accountHolderName}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-1 pl-0">Account Number</td>
                                        <td className="p-1">:</td>
                                        <td className="p-1">
                                            {withdraw?.b2bBankDetails?.accountNumber}
                                        </td>
                                    </tr>
                                    {withdraw?.b2bBankDetails?.ifscCode && (
                                        <tr>
                                            <td className="p-1 pl-0">IFSC Code</td>
                                            <td className="p-1">:</td>
                                            <td className="p-1">
                                                {withdraw?.b2bBankDetails?.ifscCode || "N/A"}
                                            </td>
                                        </tr>
                                    )}
                                    {withdraw?.b2bBankDetails?.ibanCode && (
                                        <tr>
                                            <td className="p-1 pl-0">IBAN Number</td>
                                            <td className="p-1">:</td>
                                            <td className="p-1">
                                                {withdraw?.b2bBankDetails?.ibanCode || "N/A"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
