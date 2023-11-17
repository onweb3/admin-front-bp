import React from "react";
import { FiDownload } from "react-icons/fi";
import { useSelector } from "react-redux";
import axios from "../../../axios";

import { Pagination } from "../../../components";
import { formatDate } from "../../../utils";

export default function AttractionTransactionsTable({
    transactions,
    filters,
    setFilters,
    data,
}) {
    const { jwtToken } = useSelector((state) => state.admin);

    const handleDownloadTicket = async (orderId, activityId) => {
        try {
            const pdfBuffer = await axios.get(
                `/orders/attraction/single/ticket/${orderId}/${activityId}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                    responseType: "arraybuffer",
                }
            );

            console.log(pdfBuffer, "pdfBuffer");
            const blob = new Blob([pdfBuffer.data], {
                type: "application/pdf",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "tickets.pdf";
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            {" "}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Txn No</th>
                            <th className="font-[500] p-3">Ref No</th>
                            <th className="font-[500] p-3">Reseller</th>
                            <th className="font-[500] p-3">Product</th>
                            <th className="font-[500] p-3">Admin</th>
                            <th className="font-[500] p-3 w-[10px]">
                                Date & Time
                            </th>
                            <th className="font-[500] p-3">Description</th>
                            <th className="font-[500] p-3">Cost</th>
                            <th className="font-[500] p-3">Price</th>
                            <th className="font-[500] p-3">Profit</th>
                            <th className="font-[500] p-3">
                                Closing Balance
                            </th>{" "}
                            <th className="font-[500] p-3">Download</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {transactions?.map((transaction, index) => {
                            return (
                                <tr
                                    key={index}
                                    className="border-b border-tableBorderColor"
                                >
                                    {" "}
                                    <td className="p-3">
                                        {transaction?.attractionTransactionNo ||
                                            "N/A"}
                                    </td>
                                    <td className="p-3">
                                        {transaction?.referenceNumber || "N/A"}
                                    </td>
                                    <td className="p-3 capitalize">
                                        <span>
                                            {transaction?.reseller?.companyName}{" "}
                                            ({transaction?.reseller?.agentCode})
                                        </span>
                                    </td>
                                    <td className="p-3 capitalize">
                                        <span className="block">
                                            {transaction?.activityName}
                                        </span>
                                        <span className="text-grayColor block">
                                            {transaction?.attractionName}
                                        </span>{" "}
                                    </td>
                                    <td className="p-3 capitalize">
                                        {transaction?.admin?.name}
                                    </td>
                                    <td className="p-3  whitespace-nowrap">
                                        {transaction.dateTime
                                            ? formatDate(
                                                  transaction.dateTime,
                                                  true
                                              )
                                            : "N/A"}
                                    </td>
                                    <td className="p-3">
                                        {transaction?.description || "N/A"}
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {transaction?.cost?.toFixed(2) || 0.0}{" "}
                                        AED
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {transaction?.price?.toFixed(2) || 0.0}{" "}
                                        AED
                                    </td>{" "}
                                    <td className="p-3 whitespace-nowrap">
                                        {transaction?.profit?.toFixed(2) || 0.0}{" "}
                                        AED
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {transaction?.closingBalance?.toFixed(
                                            2
                                        ) || 0.0}{" "}
                                        AED
                                    </td>
                                    <td className="p-3">
                                        <button
                                            className="h-auto bg-transparent font-[500] text-xl underline text-blue-500 flex items-center justify-center gap-1"
                                            onClick={() =>
                                                handleDownloadTicket(
                                                    transaction.processId,
                                                    transaction.activityId
                                                )
                                            }
                                            title="Download Ticket "
                                        >
                                            <FiDownload />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="p-4">
                <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={filters?.totalTransactions}
                    incOrDecSkip={(number) =>
                        setFilters((prev) => {
                            return {
                                ...prev,
                                skip: prev.skip + number,
                            };
                        })
                    }
                    updateSkip={(skip) =>
                        setFilters((prev) => {
                            return { ...prev, skip };
                        })
                    }
                />
            </div>
        </div>
    );
}
