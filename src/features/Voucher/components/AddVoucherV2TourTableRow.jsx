import React, { useRef, useState } from "react";

import { useHandleClickOutside } from "../../../hooks";

export default function AddVoucherV2TourTableRow({
    tourItem,
    handleChange,
    tourDayIndex,
    tourItemIndex,
    deleteExtraRow,
    handleChangeByName,
    initialData,
}) {
    const [isActivitiesDropdownOpen, setIsActivitiesDropdownOpen] = useState(false);

    const hotelDropdownRef = useRef(null);
    useHandleClickOutside(hotelDropdownRef, () => setIsActivitiesDropdownOpen(false));

    const filteredActivities = tourItem?.tourName
        ? initialData?.activities?.filter((item) => {
              return item?.activity?.name
                  ?.toLowerCase()
                  ?.includes(tourItem?.tourName?.toLowerCase());
          })
        : initialData?.activities;

    return (
        <React.Fragment>
            <td className="p-2 border w-[35px] min-w-[35px]">
                <div className="flex items-center justify-center">
                    <button
                        className="w-[25px] h-[25px] rounded-full bg-red-500"
                        onClick={() => {
                            deleteExtraRow(tourDayIndex, tourItemIndex);
                        }}
                        type="button"
                    >
                        -
                    </button>
                </div>
            </td>
            <td className="border w-[400px] min-w-[400px]">
                <div className="relative" ref={hotelDropdownRef}>
                    <input
                        type="text"
                        name="tourName"
                        value={tourItem?.tourName || ""}
                        onChange={(e) => {
                            if (isActivitiesDropdownOpen === false)
                                setIsActivitiesDropdownOpen(true);
                            handleChange(e, tourDayIndex, tourItemIndex);
                        }}
                        onFocus={() => setIsActivitiesDropdownOpen(true)}
                    />
                    {isActivitiesDropdownOpen && (
                        <div className="absolute top-[100%] left-0 w-full bg-white shadow rounded overflow-y-auto max-h-[250px] z-10">
                            {filteredActivities?.map((activity, ind) => {
                                return (
                                    <div
                                        key={ind}
                                        className="py-[6px] px-4 text-[15px] cursor-pointer hover:bg-[#f3f6f9]"
                                        onClick={() => {
                                            handleChangeByName({
                                                tourDayIndex,
                                                tourItemIndex,
                                                name: "tourName",
                                                value: activity?.activity?.name,
                                            });
                                            setIsActivitiesDropdownOpen(false);
                                        }}
                                    >
                                        <span>{activity?.activity?.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </td>
            <td>
                <select
                    name="tourType"
                    id=""
                    value={tourItem?.tourType || ""}
                    onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                >
                    <option value="" hidden>
                        Select
                    </option>
                    <option value="regular">Regular</option>
                    <option value="arrival">Arrival</option>
                    <option value="departure">Departure</option>
                    <option value="ticket-only">Ticket Only</option>
                    <option value="half-day">Half Day</option>
                </select>
            </td>

            <td className="border min-w-[100px]">
                <input
                    type="text"
                    name="pickupFrom"
                    value={tourItem?.pickupFrom || ""}
                    onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                />
            </td>
            <td className="border min-w-[100px]">
                <div className="flex items-center px-2">
                    <input
                        type="time"
                        name="pickupTimeFrom"
                        value={tourItem?.pickupTimeFrom || ""}
                        onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                        className="h-[100%] arrow-hidden p-0 border-0"
                    />
                    <button
                        className="w-[15px] min-w-[15px] h-[15px] min-h-[15px] ml-2 bg-gray-500 p-0 flex items-center justify-center"
                        type="button"
                        onClick={() => {
                            handleChangeByName({
                                tourDayIndex,
                                tourItemIndex,
                                name: "pickupTimeFrom",
                                value: "",
                            });
                        }}
                    >
                        x
                    </button>
                </div>
            </td>
            <td className="border min-w-[100px]">
                <div className="flex items-center px-2">
                    <input
                        type="time"
                        name="pickupTimeTo"
                        value={tourItem?.pickupTimeTo || ""}
                        onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                        className="h-[100%] arrow-hidden p-0 border-0"
                    />
                    <button
                        className="w-[15px] min-w-[15px] h-[15px] min-h-[15px] ml-2 bg-gray-500 p-0 flex items-center justify-center"
                        type="button"
                        onClick={() => {
                            handleChangeByName({
                                tourDayIndex,
                                tourItemIndex,
                                name: "pickupTimeTo",
                                value: "",
                            });
                        }}
                    >
                        x
                    </button>
                </div>
            </td>
            <td className="border min-w-[100px]">
                <div className="flex items-center px-2">
                    <input
                        type="time"
                        name="returnTimeFrom"
                        value={tourItem?.returnTimeFrom || ""}
                        onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                        className="h-[100%] arrow-hidden p-0  border-0"
                    />
                    <button
                        className="w-[15px] min-w-[15px] h-[15px] min-h-[15px] ml-2 bg-gray-500 p-0 flex items-center justify-center"
                        type="button"
                        onClick={() => {
                            handleChangeByName({
                                tourDayIndex,
                                tourItemIndex,
                                name: "returnTimeFrom",
                                value: "",
                            });
                        }}
                    >
                        x
                    </button>
                </div>
            </td>
        </React.Fragment>
    );
}
