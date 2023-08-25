import React from "react";
import { FiDownload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "../../../axios";
import { formatDate } from "../../../utils";

export default function SingleAttractionTicketTableRow({
    ticket,
    updateTicketStatus,
    deleteTicket,
}) {
    const { jwtToken } = useSelector((state) => state.admin);

    const deleteAttractionTicket = async () => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(
                    `/attractions/tickets/delete/${ticket?._id}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                deleteTicket(ticket?._id);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <tr className="border-b border-tableBorderColor">
            <td className="p-3">{ticket?.ticketNo}</td>
            <td className="p-3">{ticket?.lotNo}</td>
            <td className="p-3">{ticket?.ticketFor}</td>
            <td className="p-3">{ticket?.details || "N/A"}</td>
            <td className="p-3">
                {ticket?.validity ? formatDate(ticket?.validTill) : "N/A"}
            </td>
            <td className="p-3">{ticket?.ticketCost} AED</td>
            <td className="p-3">
                {ticket?.status !== "ok" ? (
                    <div className="flex items-center gap-[10px]">
                        <span className="text-[#0ab39c] bg-[#0ab39c1A] text-[13px] px-3 py-[2px] rounded capitalize">
                            {ticket?.status}
                        </span>
                    </div>
                ) : ticket?.validity === true &&
                  new Date(ticket.validTill) < new Date() ? (
                    <span className="bg-[#f065481A] text-[#f06548] text-[13px] px-3 py-[2px] rounded capitalize">
                        Expired
                    </span>
                ) : (
                    // <div className="flex items-center gap-[10px]">
                    //     <span className="text-[#0a3ab3] bg-[#0a3ab31A] text-[13px] px-3 py-[2px] rounded capitalize">
                    //         {ticket?.status}
                    //     </span>
                    // </div>
                    <div>
                        <select
                            name=""
                            id=""
                            className="w-[100px]"
                            onChange={() => updateTicketStatus(ticket?._id)}
                            value={ticket?.status}
                        >
                            <option value="" hidden>
                                OK
                            </option>
                            <option value="used">Used</option>
                        </select>
                    </div>
                )}
            </td>
            <td className="p-3">
                <div>
                    {ticket.status === "ok" ? (
                        <button
                            className="h-auto bg-transparent text-red-500 text-xl"
                            onClick={() => deleteAttractionTicket()}
                        >
                            <MdDelete />
                        </button>
                    ) : (
                        ticket?.status === "used" && (
                            <Link
                                to={`${ticket?._id}?ticketNo=${ticket?.ticketNo}&ticketFor=${ticket?.ticketFor}`}
                                target="_blank"
                                className="transition-all hover:text-lg"
                            >
                                <FiDownload />
                            </Link>
                        )
                    )}
                </div>
            </td>
        </tr>
    );
}
