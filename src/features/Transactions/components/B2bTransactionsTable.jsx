import React from "react";

import { Pagination } from "../../../components";
import { formatDate } from "../../../utils";

export default function B2bTransactionsTable({ transactions, filters, setFilters }) {
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Txn No</th>
                            <th className="font-[500] p-3">Reseller</th>
                            <th className="font-[500] p-3">Product</th>
                            <th className="font-[500] p-3">Payment Processor</th>
                            <th className="font-[500] p-3">Date & Time</th>
                            <th className="font-[500] p-3">Description</th>
                            <th className="font-[500] p-3">Debit</th>
                            <th className="font-[500] p-3">Credit</th>
                            <th className="font-[500] p-3">Direct</th>
                            <th className="font-[500] p-3">Closing Balance</th>
                            <th className="font-[500] p-3">Due Amount</th>
                            <th className="font-[500] p-3">Remark</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {transactions?.map((transaction, index) => {
                            return (
                                <tr key={index} className="border-b border-tableBorderColor">
                                    <td className="p-3">
                                        {transaction?.b2bTransactionNo || "N/A"}
                                    </td>
                                    <td className="p-3 capitalize">
                                        <span>
                                            {transaction?.reseller?.companyName} (
                                            {transaction?.reseller?.agentCode})
                                        </span>
                                    </td>
                                    <td className="p-3 capitalize">
                                        {transaction?.product || "N/A"}
                                    </td>
                                    <td className="p-3 capitalize">
                                        {transaction?.paymentProcessor}
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {transaction.dateTime
                                            ? formatDate(transaction.dateTime, true)
                                            : "N/A"}
                                    </td>
                                    <td className="p-3">{transaction?.description || "N/A"}</td>
                                    <td className="p-3 whitespace-nowrap">
                                        {transaction?.debitAmount?.toFixed(2) || 0.0} AED
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {transaction?.creditAmount?.toFixed(2) || 0.0} AED
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {transaction?.directAmount?.toFixed(2) || 0.0} AED
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {transaction?.closingBalance?.toFixed(2) || 0.0} AED
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {transaction?.dueAmount?.toFixed(2) || 0.0} AED
                                    </td>
                                    <td className="p-3">{transaction?.remark || "N/A"}</td>
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
