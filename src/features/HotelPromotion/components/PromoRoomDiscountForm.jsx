import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addRoomDiscountsRows,
    handlePromotionRowDataChange,
    deletePromotionItemRow,
} from "../../../redux/slices/hotelPromotionsFormSlice";
import { MultipleSelectDropdown } from "../../../components";

export default function PromoRoomDiscountForm() {
    const dispatch = useDispatch();

    const { roomDiscounts, boardTypes, roomTypes } = useSelector(
        (state) => state.hotelPromotionsForm
    );

    const handleChange = (e, index) => {
        dispatch(
            handlePromotionRowDataChange({
                typeName: "roomDiscounts",
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
                                        onClick={() => dispatch(addRoomDiscountsRows())}
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
                            <th className="font-[500] p-2 border">Room Types</th>
                            <th className="font-[500] p-2 border">Room Count</th>
                            <th className="font-[500] p-2 border">Applicable Till</th>
                            <th className="font-[500] p-2 border">Discount Type</th>
                            <th className="font-[500] p-2 border">Discount</th>
                            <th className="font-[500] p-2 border">Min</th>
                            <th className="font-[500] p-2 border">Max</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {roomDiscounts.map((roomDiscount, index) => (
                            <tr key={index} className="border-b border-tableBorderColor">
                                <td className="p-2 border w-[35px] min-w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                                            onClick={() => {
                                                dispatch(
                                                    deletePromotionItemRow({
                                                        name: "roomDiscounts",
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
                                        value={roomDiscount?.rateCode || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="fromDate"
                                        value={roomDiscount?.fromDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] p-0 px-2  border-0"
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="toDate"
                                        value={roomDiscount?.toDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[100px] min-w-[100px]">
                                    <input
                                        type="number"
                                        name="bookBefore"
                                        value={roomDiscount?.bookBefore}
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
                                            selectedData={roomDiscount.boardTypes}
                                            setSelectedData={(selBoardTypes) => {
                                                dispatch(
                                                    handlePromotionRowDataChange({
                                                        typeName: "roomDiscounts",
                                                        name: "boardTypes",
                                                        value: selBoardTypes,
                                                        index,
                                                    })
                                                );
                                            }}
                                            randomIndex={index + "roomDiscounts"}
                                        />
                                    </div>
                                </td>
                                <td className="border w-[180px] min-w-[180px]">
                                    <div>
                                        <MultipleSelectDropdown
                                            data={roomTypes}
                                            displayName={"roomName"}
                                            valueName={"_id"}
                                            selectedData={roomDiscount.roomTypes}
                                            setSelectedData={(selBoardTypes) => {
                                                dispatch(
                                                    handlePromotionRowDataChange({
                                                        typeName: "roomDiscounts",
                                                        name: "roomTypes",
                                                        value: selBoardTypes,
                                                        index,
                                                    })
                                                );
                                            }}
                                            randomIndex={index + "roomDiscounts"}
                                        />
                                    </div>
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="roomCount"
                                        value={roomDiscount?.roomCount}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="applicableTill"
                                        value={roomDiscount?.applicableTill}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td>
                                    <select
                                        name="discountType"
                                        value={roomDiscount?.discountType || ""}
                                        onChange={(e) => handleChange(e, index)}
                                    >
                                        {" "}
                                        <option value="" disabled hidden>
                                            Choose...
                                        </option>
                                        <option value="percentage">Percentage</option>
                                        <option value="flat">Flat</option>
                                    </select>
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="discount"
                                        value={roomDiscount?.discount}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="minimumLengthOfStay"
                                        value={roomDiscount?.minimumLengthOfStay}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="maximumLengthOfStay"
                                        value={roomDiscount?.maximumLengthOfStay}
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
