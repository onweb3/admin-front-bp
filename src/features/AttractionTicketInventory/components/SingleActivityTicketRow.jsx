import React, { useState } from "react";
import UploadTicketModal from "../../Attractions/components/UploadTicketModal";

export default function SingleActivityTicketRow({ activity }) {
    const [isUploadTicketModalOpen, setIsUploadTicketModalOpen] =
        useState(false);

    return (
        <tr className="border-b border-tableBorderColor">
            <td className="p-3">
                {activity?.attraction?.title}
                <span className="block text-sm mt-1 text-grayColor">
                    {activity?.name}
                </span>
            </td>
            <td className="p-3">{activity?.totalTickets || 0}</td>
            <td className="p-3">{activity?.soldTickets || 0}</td>
            <td className="p-3">{activity?.expiredTickets || 0}</td>
            <td className="p-3">{activity?.availableTickets || 0}</td>
            <td className="p-3">
                <button
                    className="px-3 bg-green-500 h-[30px] text-[13px] font-medium"
                    onClick={() => setIsUploadTicketModalOpen(true)}
                >
                    Upload
                </button>
                {isUploadTicketModalOpen && (
                    <UploadTicketModal
                        activityId={activity?._id}
                        attractionId={activity?.attraction?._id}
                        isNavigation={true}
                        setIsUploadTicketModalOpen={setIsUploadTicketModalOpen}
                        activityName={activity?.name}
                    />
                )}
            </td>
        </tr>
    );
}
