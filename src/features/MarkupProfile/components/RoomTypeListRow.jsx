import React, { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

import { Pagination } from "../../../components";
import ActivityProfileRow from "./ActivityProfileRow";
import AttracitonMarkupModal from "./AttractionMarkupModal";
import HotelRoomTypeRow from "./HotelRoomTypeRow";
import RoomTypeRow from "./RoomTypeRow";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function RoomTypeListRow({
    hotelId,
    roomTypes,
    setRoomTypes,
    type,
}) {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <div>
            <div className="overflow-x-auto ">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Index</th>

                            <th className="font-[500] p-3">Room Type</th>
                            <th className="font-[500] p-3">Markup Type(API)</th>
                            <th className="font-[500] p-3">Markup (API)</th>
                            <th className="font-[500] p-3">Markup Type</th>
                            <th className="font-[500] p-3">Markup </th>

                            <th className="font-[500] p-3">Edit</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm ">
                        {roomTypes?.map((roomType, index) => {
                            return (
                                // <div>category</div>
                                <RoomTypeRow
                                    index={index}
                                    hotelId={hotelId}
                                    roomType={roomType}
                                    setRoomTypes={setRoomTypes}
                                    type={type}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* <div className="p-4">
            <Pagination
                limit={filters?.limit}
                skip={filters?.skip}
                total={filters?.totalOrders}
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
        </div> */}
        </div>
    );
}
