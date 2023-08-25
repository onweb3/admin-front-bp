import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addRoomTypeUpgradesRows,
    handlePromotionRowDataChange,
    deletePromotionItemRow,
} from "../../../redux/slices/hotelPromotionsFormSlice";
import { MultipleSelectDropdown } from "../../../components";

export default function PromoRoomTypeUpgradeForm() {
    const dispatch = useDispatch();

    const { roomTypeUpgrades, boardTypes, roomTypes } = useSelector(
        (state) => state.hotelPromotionsForm
    );
    const handleChange = (e, index) => {
        dispatch(
            handlePromotionRowDataChange({
                typeName: "roomTypeUpgrades",
                index,
                name: e.target.name,
                value: e.target.value,
            })
        );
    };

    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            <th className="p-2 border w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-[25px] h-[25px] rounded-full bg-green-500"
                                        onClick={() => dispatch(addRoomTypeUpgradesRows())}
                                    >
                                        +
                                    </button>
                                </div>
                            </th>
                            <th className="font-[500] p-2 border">Rate Code</th>
                            <th className="font-[500] p-2 border">From Date</th>
                            <th className="font-[500] p-2 border">To Date</th>
                            <th className="font-[500] p-2 border">Book Before</th>

                            <th className="font-[500] p-2 border">Board Types</th>

                            <th className="font-[500] p-2 border">Room Type From</th>
                            <th className="font-[500] p-2 border">room Type To</th>

                            <th className="font-[500] p-2 border">Min</th>
                            <th className="font-[500] p-2 border">Max</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {roomTypeUpgrades.map((roomTypeUpgrade, index) => (
                            <tr key={index} className="border-b border-tableBorderColor">
                                <td className="p-2 border w-[35px] min-w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                                            onClick={() => {
                                                dispatch(
                                                    deletePromotionItemRow({
                                                        name: "roomTypeUpgrades",
                                                        index,
                                                    })
                                                );
                                            }}
                                        >
                                            -
                                        </button>
                                    </div>
                                </td>
                                <td className="border w-[100px] min-w-[100px]">
                                    <input
                                        type="text"
                                        name="rateCode"
                                        value={roomTypeUpgrade?.rateCode || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="fromDate"
                                        value={roomTypeUpgrade?.fromDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="toDate"
                                        value={roomTypeUpgrade?.toDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[100px] min-w-[100px]">
                                    <input
                                        type="number"
                                        name="bookBefore"
                                        value={roomTypeUpgrade?.bookBefore}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[180px] min-w-[180px]">
                                    <div>
                                        <MultipleSelectDropdown
                                            data={boardTypes}
                                            displayName={"boardName"}
                                            valueName={"_id"}
                                            selectedData={roomTypeUpgrade.boardTypes}
                                            setSelectedData={(selBoardTypes) => {
                                                dispatch(
                                                    handlePromotionRowDataChange({
                                                        typeName: "roomTypeUpgrades",
                                                        name: "boardTypes",
                                                        value: selBoardTypes,
                                                        index,
                                                    })
                                                );
                                            }}
                                            randomIndex={index + "roomTypeUpgrades"}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <select
                                        name="roomTypeFrom"
                                        value={roomTypeUpgrade?.roomTypeFrom || ""}
                                        onChange={(e) => handleChange(e, index)}
                                    >
                                        <option value="" hidden>
                                            Select Room Type
                                        </option>
                                        {roomTypes?.map((roomType, index) => (
                                            <option key={index} value={roomType?._id}>
                                                {roomType?.roomName}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        name="roomTypeTo"
                                        value={roomTypeUpgrade?.roomTypeTo || ""}
                                        onChange={(e) => handleChange(e, index)}
                                    >
                                        <option value="" hidden>
                                            Select Room Type
                                        </option>
                                        {roomTypes?.map((roomType, index) => (
                                            <option key={index} value={roomType?._id}>
                                                {roomType?.roomName}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="minimumLengthOfStay"
                                        value={roomTypeUpgrade?.minimumLengthOfStay}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="maximumLengthOfStay"
                                        value={roomTypeUpgrade?.maximumLengthOfStay}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
