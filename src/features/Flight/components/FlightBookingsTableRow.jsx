import React from "react";
import { TbArrowNarrowRight, TbArrowsExchange2 } from "react-icons/tb";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../utils";

export default function FlightBookingsTableRow({ booking }) {
    const navigate = useNavigate();

    return (
        <tr
            className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9] "
            onClick={() => navigate(`${booking?._id}`)}
        >
            <td className="p-3">{booking?.referenceNumber}</td>
            <td className="p-3">
                <div className="flex items-center gap-[10px]">
                    <span className="font-[500]">{booking?.trips[0]?.flightSegments[0]?.from}</span>
                    {booking?.tripType === "oneway" ? (
                        <span className="text-lg">
                            <TbArrowNarrowRight />
                        </span>
                    ) : (
                        <span className="text-lg">
                            <TbArrowsExchange2 />
                        </span>
                    )}
                    <span className="font-[500]">
                        {
                            booking?.trips[0]?.flightSegments[
                                booking?.trips[0]?.flightSegments?.length - 1
                            ]?.to
                        }
                    </span>
                </div>
            </td>
            <td className="p-3">
                {moment(booking?.trips[0]?.flightSegments[0]?.departureDate).format(
                    "D MMM YYYY HH:mm"
                )}
            </td>
            <td className="p-3 capitalize">{booking?.tripType || "N/A"}</td>
            <td className="p-3">
                <div className="flex items-center">
                    {booking?.trips?.map((trip) => {
                        return trip?.airlines?.map((item, airlineIndex) => {
                            return (
                                <div
                                    key={airlineIndex}
                                    className="w-[30px] h-[30px] rounded-full overflow-hidden border-2 border-white ml-[-10px] first:ml-0"
                                >
                                    <img
                                        src={item?.airlineLogo}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            );
                        });
                    })}
                </div>
            </td>
            <td className="p-3">
                {booking?.noOfAdults} ADT
                {booking?.noOfChildren > 0 && `, ${booking?.noOfChildren} CHD`}
                {booking?.noOfInfants > 0 && `, ${booking?.noOfInfants} INF`}
            </td>
            <td className="p-3">{formatDate(booking?.createdAt)}</td>
            <td className="p-3 capitalize">
                {booking?.reseller?.companyName} ({booking?.reseller?.agentCode})
            </td>
            <td className="p-3">{booking?.netFare} AED</td>
            <td className="p-3">
                <span
                    className={
                        "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                        (booking?.status === "cancelled"
                            ? "bg-[#f065481A] text-[#f06548]"
                            : booking?.status === "completed"
                            ? "text-[#0ab39c] bg-[#0ab39c1A]"
                            : "bg-[#f7b84b1A] text-[#f7b84b]")
                    }
                >
                    {booking?.status}
                </span>
            </td>
        </tr>
    );
}
