import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addMealUpgradesRows,
    handlePromotionRowDataChange,
    deletePromotionItemRow,
    handlePromotionDataChange,
} from "../../../redux/slices/hotelPromotionsFormSlice";
import { MultipleSelectDropdown } from "../../../components";

export default function PromoMealUpgradeForm({ isEditPermission = true }) {
    const dispatch = useDispatch();

    const { mealUpgrades, boardTypes, roomTypes, data } = useSelector((state) => state.hotelPromotionsForm);

    const handleInpChange = (e) => {
        dispatch(
            handlePromotionDataChange({
                name: e.target.name,
                value: e.target.value,
            })
        );
    };

    const handleChange = (e, index) => {
        dispatch(
            handlePromotionRowDataChange({
                typeName: "mealUpgrades",
                index,
                name: e.target.name,
                value: e.target.value,
            })
        );
    };

    return (
        <div className="p-4">
            <div className="grid grid-cols-4 gap-3 mb-6">
                <div>
                    <label htmlFor="basePlan">Meal Upgrade On </label>
                    <select
                        id=""
                        name="mealUpgradeOn"
                        value={data.mealUpgradeOn || ""}
                        onChange={handleInpChange}
                        disabled={!isEditPermission}
                    >
                        <option value="" hidden>
                            Select Meal Upgrade On
                        </option>
                        <option value="base-plan">Base Plan</option>
                        <option value="extra-supplement">Extra Supplement</option>
                        <option value="both">Both</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            {isEditPermission && (
                                <th className="p-2 border w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-green-500"
                                            onClick={() => dispatch(addMealUpgradesRows())}
                                        >
                                            +
                                        </button>
                                    </div>
                                </th>
                            )}
                            <th className="font-[500] p-2 border">Rate Code</th>
                            <th className="font-[500] p-2 border">From Date</th>
                            <th className="font-[500] p-2 border">To Date</th>
                            <th className="font-[500] p-2 border">Book Before</th>
                            <th className="font-[500] p-2 border">Room Types</th>
                            <th className="font-[500] p-2 border">Meal From</th>
                            <th className="font-[500] p-2 border">Meal To</th>
                            <th className="font-[500] p-2 border">Min</th>
                            <th className="font-[500] p-2 border">Max</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {mealUpgrades.map((mealUpgrade, index) => (
                            <tr key={index} className="border-b border-tableBorderColor">
                                {isEditPermission && (
                                    <td className="p-2 border w-[35px] min-w-[35px]">
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                onClick={() => {
                                                    dispatch(
                                                        deletePromotionItemRow({
                                                            name: "mealUpgrades",
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
                                <td className="border w-[100px] min-w-[100px]">
                                    <input
                                        type="text"
                                        name="rateCode"
                                        value={mealUpgrade?.rateCode || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="fromDate"
                                        value={mealUpgrade?.fromDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="toDate"
                                        value={mealUpgrade?.toDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[100px] min-w-[100px]">
                                    <input
                                        type="number"
                                        name="bookBefore"
                                        value={mealUpgrade?.bookBefore}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        disabled={!isEditPermission}
                                    />
                                </td>

                                <td className="border w-[180px] min-w-[180px]">
                                    <div>
                                        <MultipleSelectDropdown
                                            data={roomTypes}
                                            displayName={"roomName"}
                                            valueName={"_id"}
                                            selectedData={mealUpgrade.roomTypes}
                                            setSelectedData={(selRoomTypes) => {
                                                dispatch(
                                                    handlePromotionRowDataChange({
                                                        typeName: "mealUpgrades",
                                                        name: "roomTypes",
                                                        value: selRoomTypes,
                                                        index,
                                                    })
                                                );
                                            }}
                                            randomIndex={index + "mealUpgrades"}
                                            disabled={!isEditPermission}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <select
                                        name="mealFrom"
                                        value={mealUpgrade?.mealFrom || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        disabled={!isEditPermission}
                                    >
                                        <option value="" hidden>
                                            Select Meal
                                        </option>
                                        {boardTypes?.map((boardType, indexs) => (
                                            <option key={indexs} value={boardType?._id}>
                                                {boardType?.boardName}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <select
                                        name="mealTo"
                                        value={mealUpgrade?.mealTo || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        disabled={!isEditPermission}
                                    >
                                        <option value="" hidden>
                                            Select Meal
                                        </option>
                                        {boardTypes?.map((boardType, index) => (
                                            <option key={index} value={boardType?._id}>
                                                {boardType?.boardName}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="minimumLengthOfStay"
                                        value={mealUpgrade?.minimumLengthOfStay}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="maximumLengthOfStay"
                                        value={mealUpgrade?.maximumLengthOfStay}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
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
