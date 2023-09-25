import React, { useState } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { BiArrowFromBottom, BiArrowFromTop } from "react-icons/bi";

import { formatDate } from "../../../utils";

export default function PointHistoryRow({ order, index }) {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    return (
        <tr className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]">
            <td className="p-3">{index + 1}</td>
            <td className="p-3">{order?.transactionType}</td>
            <td className="p-3">{order?.points}</td>
            <td className="p-3">{order?.previousPoints}</td>

            {order?.transactionType === "withdraw" ? (
                <td className="p-3  text-red-500">
                    <span className="flex items-center">
                        {"Deduct"}
                        <span>
                            {" "}
                            <AiOutlineArrowDown />{" "}
                        </span>
                    </span>
                </td>
            ) : (
                <td className="p-3 text-green-500">
                    <span className="flex items-center">
                        {" Deposit"}{" "}
                        <span>
                            <AiOutlineArrowUp />{" "}
                        </span>
                    </span>
                </td>
            )}

            <td className="p-3">{order?.status}</td>
            <td className="p-3">{formatDate(order?.createdAt)}</td>
        </tr>
    );
}
