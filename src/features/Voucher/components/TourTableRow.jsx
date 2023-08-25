import React, { useRef, useState } from "react";

import { useHandleClickOutside } from "../../../hooks";

export default function TourTableRow({
    tourData,
    index,
    deleteExtraRow,
    handleChange,
    activities,
    handleExtraDataChange,
}) {
    const [isActivitiesDropdownOpen, setIsActivitiesDropdownOpen] =
        useState(false);

    const hotelDropdownRef = useRef(null);
    useHandleClickOutside(hotelDropdownRef, () =>
        setIsActivitiesDropdownOpen(false)
    );

    const filteredActivities = activities?.filter((item) => {
        return item?.activity?.name
            ?.toLowerCase()
            ?.includes(tourData?.tourName?.toLowerCase());
    });

    return (
        <tr className="border-b border-tableBorderColor">
            <td className="p-2 border w-[35px] min-w-[35px]">
                <div className="flex items-center justify-center">
                    <button
                        className="w-[25px] h-[25px] rounded-full bg-red-500"
                        onClick={() => {
                            deleteExtraRow({
                                index,
                            });
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
                        value={tourData?.tourName || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="h-[100%]  px-2 border-0"
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
                                            handleExtraDataChange({
                                                index,
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
            <td className="border w-[140px] min-w-[140px]">
                <input
                    type="date"
                    name="date"
                    value={
                        tourData?.date
                            ? new Date(tourData?.date)
                                  .toISOString()
                                  .substring(0, 10)
                            : ""
                    }
                    onChange={(e) => handleChange(e, index)}
                    className="h-[100%]  px-2 border-0"
                />
            </td>

            <td className="border min-w-[100px]">
                <input
                    type="text"
                    name="pickupFrom"
                    value={tourData?.pickupFrom || ""}
                    onChange={(e) => handleChange(e, index)}
                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                />
            </td>
            <td className="border min-w-[100px]">
                <div className="flex items-center px-2">
                    <input
                        type="time"
                        name="pickupTimeFrom"
                        value={tourData?.pickupTimeFrom || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="h-[100%] arrow-hidden p-0 border-0"
                    />
                    <button
                        className="h-auto w-[15px] min-w-[15px] h-[15px] min-h-[15px] ml-2 bg-gray-500"
                        type="button"
                        onClick={() => {
                            handleExtraDataChange({
                                index,
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
                        value={tourData?.pickupTimeTo || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="h-[100%] arrow-hidden p-0 border-0"
                    />
                    <button
                        className="h-auto w-[15px] min-w-[15px] h-[15px] min-h-[15px] ml-2 bg-gray-500"
                        type="button"
                        onClick={() => {
                            handleExtraDataChange({
                                index,
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
                        value={tourData?.returnTimeFrom || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="h-[100%] arrow-hidden p-0  border-0"
                    />
                    <button
                        className="h-auto w-[15px] min-w-[15px] h-[15px] min-h-[15px] ml-2 bg-gray-500"
                        type="button"
                        onClick={() => {
                            handleExtraDataChange({
                                index,
                                name: "returnTimeFrom",
                                value: "",
                            });
                        }}
                    >
                        x
                    </button>
                </div>
            </td>
        </tr>
    );
}
