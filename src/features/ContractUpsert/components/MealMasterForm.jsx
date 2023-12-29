import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    handleMealSupplementDataChange,
    addMealRow,
    deleteMealRow,
} from "../../../redux/slices/hotelContractSlice";
import { MultipleSelectDropdown } from "../../../components";

export default function MealMasterForm({ isEditPermission = true }) {
    const dispatch = useDispatch();
    const { mealSupplements, roomTypes, boardTypes } = useSelector((state) => state.hotelContractForm);

    const handleChange = (e, index) => {
        dispatch(
            handleMealSupplementDataChange({
                name: e.target.name,
                value: e.target.value,
                index,
            })
        );
    };

    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            {isEditPermission && (
                                <th className="p-2 border w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-green-500"
                                            onClick={() => dispatch(addMealRow())}
                                        >
                                            +
                                        </button>
                                    </div>
                                </th>
                            )}
                            <th className="font-[500] p-2 border">From Date</th>
                            <th className="font-[500] p-2 border">To Date</th>
                            <th className="font-[500] p-2 border">Meals</th>
                            <th className="font-[500] p-2 border">Room Types</th>
                            <th className="font-[500] p-2 border">Adult</th>
                            <th className="font-[500] p-2 border">Child</th>
                            <th className="font-[500] p-2 border">Infant</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {mealSupplements.map((mealSupplement, index) => (
                            <tr key={index} className="border-b border-tableBorderColor">
                                {isEditPermission && (
                                    <td className="p-2 border w-[35px] min-w-[35px]">
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                onClick={() => {
                                                    dispatch(deleteMealRow({ index }));
                                                }}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </td>
                                )}
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="fromDate"
                                        value={mealSupplement?.fromDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        className="h-[100%]  px-2 border-0"
                                        name="toDate"
                                        value={mealSupplement?.toDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td>
                                    <select
                                        id=""
                                        name="boardType"
                                        value={mealSupplement?.boardType || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        disabled={!isEditPermission}
                                    >
                                        <option value="" hidden>
                                            Select boardType
                                        </option>
                                        {boardTypes.map((boardType, boardIndex) => (
                                            <option value={boardType?._id} key={boardIndex}>
                                                {boardType?.boardName}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border w-[180px] min-w-[180px]">
                                    <MultipleSelectDropdown
                                        data={roomTypes}
                                        displayName={"roomName"}
                                        valueName={"_id"}
                                        selectedData={mealSupplement?.roomTypes}
                                        setSelectedData={(selRoomTypes) => {
                                            dispatch(
                                                handleMealSupplementDataChange({
                                                    name: "roomTypes",
                                                    value: selRoomTypes,
                                                    index,
                                                })
                                            );
                                        }}
                                        randomIndex={index + "mealSupplement"}
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border min-w-[100px]">
                                    <input
                                        type="number"
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        name="adultPrice"
                                        value={mealSupplement?.adultPrice}
                                        onChange={(e) => handleChange(e, index)}
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border min-w-[100px]">
                                    <input
                                        type="number"
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        name="childPrice"
                                        value={mealSupplement?.childPrice}
                                        onChange={(e) => handleChange(e, index)}
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border min-w-[100px]">
                                    <input
                                        type="number"
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        name="infantPrice"
                                        value={mealSupplement?.infantPrice}
                                        onChange={(e) => handleChange(e, index)}
                                        disabled={!isEditPermission}
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
