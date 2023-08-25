import React, { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

import { Pagination } from "../../../components";
import ActivityProfileRow from "./ActivityProfileRow";
import AttracitonMarkupModal from "./AttractionMarkupModal";
import HotelRoomTypeRow from "./HotelRoomTypeRow";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function HotelListRow({ hotel, roomType, setRoomType }) {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <>
            <tr
                className={
                    "border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9] shadow-sm w-full" +
                    (dropdownVisible ? "bg-[#f3f6f9]" : "")
                }
                onClick={() => setDropdownVisible(!dropdownVisible)}
            >
                <td
                    className="p-3 font-[600] "
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                >
                    {dropdownVisible === true ? (
                        <div className="flex items-center">
                            <MdKeyboardArrowDown className="font-md" />
                            <span className="ml-1">{hotel.hotelName}</span>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <MdKeyboardArrowRight className="font-md" />
                            <span className="ml-1">{hotel.hotelName}</span>
                        </div>
                    )}
                </td>
            </tr>
            <div className="w-full">
                <table
                    className={`w-full border shadow-lg
                     ${dropdownVisible ? "" : " hidden "}
                    `}
                >
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Index</th>
                            <th className="font-[500] p-3">Room Type</th>

                            <th className="font-[500] p-3">Api Markup Type</th>
                            <th className="font-[500] p-3">Api Markup </th>
                            <th className="font-[500] p-3">
                                Contract Markup Type
                            </th>
                            <th className="font-[500] p-3">
                                {" "}
                                Contract Markup{" "}
                            </th>

                            <th className="font-[500] p-3">Edit</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {hotel.roomType.map((room, index) => {
                            return (
                                <HotelRoomTypeRow
                                    key={index}
                                    index={index + 1}
                                    room={room}
                                    roomType={roomType}
                                    setRoomType={setRoomType}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}
