import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    deleteExtraSupplementsRow,
    addExtraSupplementsRow,
    handleExtraSupplementDataChange,
} from "../../../redux/slices/hotelContractSlice";
import { MultipleSelectDropdown } from "../../../components";

export default function OtherSupplementForm() {
    const dispatch = useDispatch();
    const { extraSupplements, roomTypes } = useSelector((state) => state.hotelContractForm);

    const handleChange = (e, index) => {
        dispatch(
            handleExtraSupplementDataChange({
                name: e.target.name,
                value: e.target.value,
                index,
            })
        );
    };

    const handleChangeChk = (e, index) => {
        dispatch(
            handleExtraSupplementDataChange({
                name: e.target.name,
                value: e.target.checked,
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
                            <th className="p-2 border w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-[25px] h-[25px] rounded-full bg-green-500"
                                        onClick={() => dispatch(addExtraSupplementsRow())}
                                    >
                                        +
                                    </button>
                                </div>
                            </th>
                            <th className="font-[500] p-2 border">From Date</th>
                            <th className="font-[500] p-2 border">To Date</th>
                            <th className="font-[500] p-2 border">Room Type</th>
                            <th className="font-[500] p-2 border">Extra Bed (Adult)</th>
                            <th className="font-[500] p-2 border">Extra Bed (Child)</th>
                            <th className="font-[500] p-2 border">Meal Included</th>
                            <th className="font-[500] p-2 border">Ex Bed Meal (Adult)</th>
                            <th className="font-[500] p-2 border">Ex Bed Meal (Child)</th>
                            {/* <th className="font-[500] p-2 border">
                                Child Supplement
                            </th>
                            <th className="font-[500] p-2 border">
                                Infant Supplement
                            </th> */}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {extraSupplements.map((extraSupplement, index) => (
                            <tr key={index} className="border-b border-tableBorderColor">
                                <td className="p-2 border w-[35px] min-w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                                            onClick={(e) => {
                                                dispatch(
                                                    deleteExtraSupplementsRow({
                                                        index,
                                                    })
                                                );
                                            }}
                                        >
                                            -
                                        </button>
                                    </div>
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="fromDate"
                                        value={extraSupplement?.fromDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="toDate"
                                        value={extraSupplement?.toDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[180px] min-w-[180px]">
                                    <MultipleSelectDropdown
                                        data={roomTypes}
                                        displayName={"roomName"}
                                        valueName={"_id"}
                                        selectedData={extraSupplement?.roomTypes}
                                        setSelectedData={(selRoomTypes) => {
                                            dispatch(
                                                handleExtraSupplementDataChange({
                                                    name: "roomTypes",
                                                    value: selRoomTypes,
                                                    index,
                                                })
                                            );
                                        }}
                                        randomIndex={index + "extraSupplement"}
                                    />
                                </td>
                                <td className="border min-w-[100px]">
                                    <input
                                        type="number"
                                        name="extraBedAdultPrice"
                                        value={extraSupplement?.extraBedAdultPrice}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border min-w-[100px]">
                                    <input
                                        type="number"
                                        name="extraBedChildPrice"
                                        value={extraSupplement?.extraBedChildPrice}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td>
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="w-[18px] h-[18px]"
                                            defaultChecked={extraSupplement.isMealIncluded === true}
                                            name="isMealIncluded"
                                            onChange={(e) => {
                                                if (e.target.checked === true) {
                                                    dispatch(
                                                        handleExtraSupplementDataChange({
                                                            name: "exbMealPriceAdult",
                                                            value: "",
                                                            index,
                                                        })
                                                    );
                                                    dispatch(
                                                        handleExtraSupplementDataChange({
                                                            name: "exbMealPriceChild",
                                                            value: "",
                                                            index,
                                                        })
                                                    );
                                                }
                                                handleChangeChk(e, index);
                                            }}
                                        />
                                    </div>
                                </td>
                                <td className="border min-w-[100px]">
                                    <input
                                        type="number"
                                        name="exbMealPriceAdult"
                                        value={extraSupplement?.exbMealPriceAdult}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        disabled={extraSupplement.isMealIncluded === true}
                                    />
                                </td>
                                <td className="border min-w-[100px]">
                                    <input
                                        type="number"
                                        name="exbMealPriceChild"
                                        value={extraSupplement?.exbMealPriceChild}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        disabled={extraSupplement.isMealIncluded === true}
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
