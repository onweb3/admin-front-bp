import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import {
    addDiscountRows,
    addRoomTypeToDiscounts,
    deletePromotionItemRow,
    handleDiscountRoomTypeDataChange,
    handlePromotionDataChange,
    handlePromotionRowDataChange,
    removeRoomTypeFromDiscounts,
} from "../../../redux/slices/hotelPromotionsFormSlice";
import { MultipleSelectDropdown } from "../../../components";

export default function PromoDiscountForm() {
    const dispatch = useDispatch();
    const { boardTypes, roomTypes, initialRoomTypes, discounts, data } = useSelector(
        (state) => state.hotelPromotionsForm
    );

    const handleChange = (e, index) => {
        dispatch(
            handlePromotionRowDataChange({
                typeName: "discounts",
                index,
                name: e.target.name,
                value: e.target.value,
            })
        );
    };

    const handleChkBoxChange = (e) => {
        dispatch(
            handlePromotionDataChange({
                name: e.target.name,
                value: e.target.checked,
            })
        );
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between gap-3 mb-6">
                <div className="grid grid-cols-4 gap-3">
                    <div className="flex items-center justify-left gap-3">
                        <input
                            type="checkbox"
                            name="isApplicableForExtraBed"
                            checked={data?.isApplicableForExtraBed || false}
                            onChange={handleChkBoxChange}
                            className="w-[17px] h-[17px] flex item-center justify-center"
                            id="isApplicableForExtraBed"
                        />
                        <label htmlFor="isApplicableForExtraBed" className="mb-0">
                            Applicable On Extra Bed
                        </label>
                    </div>
                    <div className="flex items-center justify-left gap-3">
                        <input
                            type="checkbox"
                            name="isApplicableForSupplement"
                            checked={data?.isApplicableForSupplement || false}
                            onChange={handleChkBoxChange}
                            className="w-[17px] h-[17px] flex item-center justify-center"
                            id="isApplicableForSupplement"
                        />
                        <label htmlFor="isApplicableForSupplement" className="mb-0">
                            Applicable On Supplement
                        </label>
                    </div>
                </div>
                <div className="w-[200px]">
                    <select
                        name=""
                        id=""
                        onChange={(e) => {
                            dispatch(addRoomTypeToDiscounts(e.target.value));
                            e.target.value = "";
                        }}
                    >
                        <option value="" hidden>
                            Select Room Type
                        </option>
                        {roomTypes?.map((item, index) => {
                            if (
                                initialRoomTypes?.some(
                                    (rmType) => rmType?.roomTypeId === item?._id
                                ) ||
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
                            <th colSpan="4" className="font-[500] p-2 border">
                                Code & Validity
                            </th>
                            <th colSpan="5" className="font-[500] p-2 border">
                                Discount Info
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
                                        <span
                                            className="absolute top-[50%] translate-y-[-50%] right-[10px] w-[18px] h-[18px] min-w-[18px] min-h-[18px] bg-gray-500 flex items-center justify-center rounded-full text-white cursor-pointer"
                                            onClick={() =>
                                                dispatch(
                                                    removeRoomTypeFromDiscounts(
                                                        roomType?.roomTypeId
                                                    )
                                                )
                                            }
                                        >
                                            <MdClose />
                                        </span>
                                    </th>
                                );
                            })}
                        </tr>
                        <tr>
                            <th className="p-2 border w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-[25px] h-[25px] rounded-full bg-green-500"
                                        onClick={() => dispatch(addDiscountRows())}
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
                            <th className="font-[500] p-2 border">Min</th>
                            <th className="font-[500] p-2 border">Max</th>
                            <th className="font-[500] p-2 border">Type</th>
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
                        {discounts.map((discount, index) => (
                            <tr key={index} className="border-b border-tableBorderColor">
                                <td className="p-2 border w-[35px] min-w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                                            onClick={() => {
                                                dispatch(
                                                    deletePromotionItemRow({
                                                        name: "discounts",
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
                                        value={discount?.rateCode || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="fromDate"
                                        value={discount?.fromDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="toDate"
                                        value={discount?.toDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2  border-0"
                                    />
                                </td>
                                <td className="border w-[100px] min-w-[100px]">
                                    <input
                                        type="number"
                                        name="bookBefore"
                                        value={discount?.bookBefore}
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
                                            selectedData={discount.boardTypes}
                                            setSelectedData={(selBoardTypes) => {
                                                dispatch(
                                                    handlePromotionRowDataChange({
                                                        typeName: "discounts",
                                                        name: "boardTypes",
                                                        value: selBoardTypes,
                                                        index,
                                                    })
                                                );
                                            }}
                                            randomIndex={index + "promodiscounts"}
                                        />
                                    </div>
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="minimumLengthOfStay"
                                        value={discount?.minimumLengthOfStay}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="maximumLengthOfStay"
                                        value={discount?.maximumLengthOfStay}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <select
                                        name="discountType"
                                        value={discount?.discountType || ""}
                                        onChange={(e) => handleChange(e, index)}
                                    >
                                        <option value="" disabled hidden>
                                            Select Type
                                        </option>
                                        <option value="percentage">Percentage</option>
                                        <option value="flat">Flat</option>
                                    </select>
                                </td>
                                {discount?.roomTypes?.map((roomType, roomTypeIndex) =>
                                    roomType?.roomOccupancies?.map(
                                        (roomOccupancy, occupancyIndex) => {
                                            return (
                                                <td
                                                    key={occupancyIndex}
                                                    className="border min-w-[100px]"
                                                >
                                                    <input
                                                        type="number"
                                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                                        name="discount"
                                                        value={
                                                            !isNaN(roomOccupancy.discount) &&
                                                            roomOccupancy.discount !== null
                                                                ? roomOccupancy.discount
                                                                : ""
                                                        }
                                                        onChange={(e) => {
                                                            dispatch(
                                                                handleDiscountRoomTypeDataChange({
                                                                    index,
                                                                    roomTypeIndex,
                                                                    occupancyIndex,
                                                                    value: e.target.value,
                                                                })
                                                            );
                                                        }}
                                                    />
                                                </td>
                                            );
                                        }
                                    )
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
