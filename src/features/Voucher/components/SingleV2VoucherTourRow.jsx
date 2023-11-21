import React, { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

import { formatDate } from "../../../utils";
import axios from "../../../axios";

export default function SingleV2VoucherTourRow({ tour, index, voucherAmendId }) {
    const [tourStatus, setTourStatus] = useState(tour?.status || "");
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);

    const handleTourStatusUpdate = async ({ status }) => {
        try {
            const isConfirm = window.confirm("Are you sure to update status?");
            if (isConfirm) {
                setIsLoading(true);
                await axios.patch(
                    `/v2/vouchers/tour-status/update`,
                    {
                        voucherAmendId,
                        status: status,
                        tourId: tour?._id,
                    },
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                setTourStatus(status);
                setIsLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <tr className="border-b border-tableBorderColor">
            <td className="p-3">{index + 1}</td>
            <td className="p-3">{tour?.tourName}</td>
            <td className="p-3 capitalize">{tour?.tourType || "N/A"}</td>
            <td className="p-3">{formatDate(tour?.date)}</td>
            <td className="p-3">{tour?.pickupFrom || "N/A"}</td>
            <td className="p-3">
                {tour?.pickupISODateTime
                    ? moment(tour?.pickupISODateTime).utcOffset(tour?.utcOffset).format("HH:mm")
                    : "N/A"}
            </td>
            <td className="p-3">
                {tour?.pickupISOToDateTime
                    ? moment(tour?.pickupISOToDateTime).utcOffset(tour?.utcOffset).format("HH:mm")
                    : "N/A"}
            </td>
            <td className="p-3">
                {tour?.returnISODateTime
                    ? moment(tour?.returnISODateTime).utcOffset(tour?.utcOffset).format("HH:mm")
                    : "N/A"}
            </td>
            <td>
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="w-[25px] h-[25px] rounded-full border-4 border-primaryColor border-r-transparent animate-spin"></div>
                    </div>
                ) : tourStatus === "booked" ? (
                    <span
                        className={
                            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                            (tourStatus === "booked"
                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                : "bg-[#f7b84b1A] text-[#f7b84b]")
                        }
                    >
                        {tourStatus}
                    </span>
                ) : (
                    <div>
                        <select
                            name=""
                            id=""
                            onChange={(e) => {
                                if (e.target.value === "booked") {
                                    handleTourStatusUpdate({
                                        status: e.target.value,
                                    });
                                }
                            }}
                        >
                            <option value="" hidden>
                                Not Booked
                            </option>
                            <option value="booked">Booked</option>
                        </select>
                    </div>
                )}
            </td>
        </tr>
    );
}
