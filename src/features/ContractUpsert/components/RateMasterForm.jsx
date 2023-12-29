import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addRoomRatesRow,
    deleteRoomRatesRow,
    handleRoomRatesChange,
    handleRoomRateRoomTypeDataChange,
    roomRateValidDayChange,
    addRoomTypeToRateMaster,
    removeRoomTypeFromRateMaster,
} from "../../../redux/slices/hotelContractSlice";
import { MdClose } from "react-icons/md";

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export default function RateMasterForm({ isEditPermission = true }) {
    const dispatch = useDispatch();
    const { roomRates, initialRoomTypes, data, roomTypes } = useSelector((state) => state.hotelContractForm);

    const handleAddRow = () => {
        dispatch(addRoomRatesRow());
    };

    const handleChange = (e, index) => {
        dispatch(
            handleRoomRatesChange({
                name: e.target.name,
                value: e.target.value,
                index,
            })
        );
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-end mb-4">
                <div className="w-[200px]">
                    <select
                        name=""
                        id=""
                        onChange={(e) => {
                            dispatch(addRoomTypeToRateMaster(e.target.value));
                            e.target.value = "";
                        }}
                        disabled={!isEditPermission}
                    >
                        <option value="" hidden>
                            Select Room Type
                        </option>
                        {roomTypes?.map((item, index) => {
                            if (
                                initialRoomTypes?.some((rmType) => rmType?.roomTypeId === item?._id) ||
                                item?.roomOccupancies?.length < 1
                            ) {
                                return <React.Fragment key={index}></React.Fragment>;
                            }
                            return (
                                <option value={item?._id} key={index}>
                                    {item?.roomName}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            <th
                                colSpan={data?.isSpecialRate === true ? "5" : "4"}
                                className="font-[500] p-2 border"
                            >
                                Validity
                            </th>
                            <th colSpan="2" className="font-[500] p-2 border">
                                Service By
                            </th>
                            {initialRoomTypes?.map((roomType, index) => {
                                if (roomType?.roomOccupancies?.length < 1) {
                                    return <React.Fragment key={index}></React.Fragment>;
                                }

                                return (
                                    <th
                                        key={index}
                                        colSpan={roomType?.roomOccupancies?.length}
                                        className="relative font-[500] p-2 pr-9 border"
                                    >
                                        <span className="">{roomType?.roomName}</span>
                                        {isEditPermission && (
                                            <span
                                                className="absolute top-[50%] translate-y-[-50%] right-[10px] w-[18px] h-[18px] min-w-[18px] min-h-[18px] bg-gray-500 flex items-center justify-center rounded-full text-white cursor-pointer"
                                                onClick={() =>
                                                    dispatch(
                                                        removeRoomTypeFromRateMaster(roomType?.roomTypeId)
                                                    )
                                                }
                                            >
                                                <MdClose />
                                            </span>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                        <tr>
                            {isEditPermission && (
                                <th className="p-2 border w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-green-500"
                                            onClick={handleAddRow}
                                        >
                                            +
                                        </button>
                                    </div>
                                </th>
                            )}
                            {data?.isSpecialRate === true && (
                                <th className="font-[500] p-2 border">Rate Code</th>
                            )}
                            <th className="font-[500] p-2 border">From Date</th>
                            <th className="font-[500] p-2 border">To Date</th>
                            <th className="font-[500] p-2 border">Valid Days</th>
                            <th className="font-[500] p-2 border">Min</th>
                            <th className="font-[500] p-2 border">Max</th>
                            {initialRoomTypes?.map((roomType) =>
                                roomType?.roomOccupancies?.map((roomOccupancy, index) => {
                                    return (
                                        <th key={index} className="font-[500] p-2 border">
                                            {roomOccupancy.shortName}
                                        </th>
                                    );
                                })
                            )}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {roomRates.map((roomRate, index) => (
                            <tr key={index} className="border-b border-tableBorderColor">
                                {isEditPermission && (
                                    <td className="p-2 border w-[35px] min-w-[35px]">
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                onClick={() => {
                                                    dispatch(
                                                        deleteRoomRatesRow({
                                                            index,
                                                        })
                                                    );
                                                }}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </td>
                                )}
                                {data?.isSpecialRate === true && (
                                    <td className="border w-[140px] min-w-[140px]">
                                        <input
                                            type="text"
                                            className="h-[100%]  px-2 border-0"
                                            name="rateCode"
                                            value={roomRate?.rateCode || ""}
                                            onChange={(e) => handleChange(e, index)}
                                            disabled={!isEditPermission}
                                        />
                                    </td>
                                )}
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        className="h-[100%]  px-2 border-0"
                                        name="fromDate"
                                        value={roomRate?.fromDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        name="toDate"
                                        value={roomRate?.toDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        type="date"
                                        className="h-[100%]  px-2 border-0"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="p-2 border w-[100px] min-w-[100px]">
                                    <div>
                                        <div className="flex items-center gap-[2px]">
                                            {days?.map((day, dayIndex) => {
                                                return (
                                                    <span
                                                        key={dayIndex}
                                                        className={
                                                            "w-[25px] h-[25px] text-white cursor-pointer capitalize rounded flex items-center justify-center " +
                                                            (roomRate?.validDays?.includes(day)
                                                                ? "bg-orange-500"
                                                                : "bg-gray-500")
                                                        }
                                                        name="validDays"
                                                        onClick={() => {
                                                            dispatch(
                                                                roomRateValidDayChange({
                                                                    index,
                                                                    value: day,
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        {day?.slice(0, 1)}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </td>
                                <td className="border w-[55px] min-w-[55px]">
                                    <input
                                        name="minimumLengthOfStay"
                                        value={roomRate?.minimumLengthOfStay}
                                        onChange={(e) => handleChange(e, index)}
                                        type="number"
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[55px] min-w-[55px]">
                                    <input
                                        name="maximumLengthOfStay"
                                        value={roomRate?.maximumLengthOfStay}
                                        onChange={(e) => handleChange(e, index)}
                                        type="number"
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                {roomRate?.roomTypes?.map((roomType, roomTypeIndex) => {
                                    return roomType?.roomOccupancies?.map((roomOccupancy, occupancyIndex) => {
                                        return (
                                            <td key={occupancyIndex} className="border min-w-[100px]">
                                                <input
                                                    type="number"
                                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                                    name="price"
                                                    value={
                                                        !isNaN(roomOccupancy.price) &&
                                                        roomOccupancy.price !== null
                                                            ? roomOccupancy.price
                                                            : ""
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            handleRoomRateRoomTypeDataChange({
                                                                index,
                                                                roomTypeIndex,
                                                                occupancyIndex,
                                                                value: e.target.value,
                                                            })
                                                        );
                                                    }}
                                                    disabled={!isEditPermission}
                                                />
                                            </td>
                                        );
                                    });
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
