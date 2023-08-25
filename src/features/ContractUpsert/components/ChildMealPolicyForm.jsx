import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addChildMealPoliciesRow,
    deleteChildMealPoliciesRow,
    handleChildMealPolicyDataChange,
} from "../../../redux/slices/hotelContractSlice";
import { MultipleSelectDropdown } from "../../../components";

export default function ChildMealPolicyForm() {
    const dispatch = useDispatch();
    const { childMealPolicies, roomTypes, boardTypes } = useSelector(
        (state) => state.hotelContractForm
    );

    const handleChange = (e, index) => {
        dispatch(
            handleChildMealPolicyDataChange({
                name: e.target.name,
                value: e.target.value,
                index,
            })
        );
    };

    const handleChkChange = (e, index) => {
        dispatch(
            handleChildMealPolicyDataChange({
                name: e.target.name,
                value: e.target.checked,
                index,
            })
        );
    };

    return (
        <div className="p-4">
            <div className="">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            <th className="p-2 border w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-[25px] h-[25px] rounded-full bg-green-500"
                                        onClick={() =>
                                            dispatch(addChildMealPoliciesRow())
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                            </th>
                            <th className="font-[500] p-2 border">From Date</th>
                            <th className="font-[500] p-2 border">To Date</th>
                            <th className="font-[500] p-2 border">
                                Room Types
                            </th>
                            <th className="font-[500] p-2 border">
                                Board Types
                            </th>
                            {/* <th className="font-[500] p-2 border">Selected</th> */}
                            <th className="font-[500] p-2 border">Age From</th>
                            <th className="font-[500] p-2 border">Age To</th>
                            <th className="font-[500] p-2 border">Child Free</th>
                            <th className="font-[500] p-2 border">Free Pax</th>
                            <th className="font-[500] p-2 border">Payable</th>
                            <th className="font-[500] p-2 border">Rate</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {childMealPolicies.map((childPolicy, index) => (
                            <tr
                                key={index}
                                className="border-b border-tableBorderColor"
                            >
                                <td className="p-2 border w-[35px] min-w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                                            onClick={() => {
                                                dispatch(
                                                    deleteChildMealPoliciesRow({
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
                                        value={childPolicy?.fromDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="toDate"
                                        value={childPolicy?.toDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[180px] min-w-[180px]">
                                    <MultipleSelectDropdown
                                        data={roomTypes}
                                        displayName={"roomName"}
                                        valueName={"_id"}
                                        selectedData={childPolicy?.roomTypes}
                                        setSelectedData={(selRoomTypes) => {
                                            dispatch(
                                                handleChildMealPolicyDataChange(
                                                    {
                                                        name: "roomTypes",
                                                        value: selRoomTypes,
                                                        index,
                                                    }
                                                )
                                            );
                                        }}
                                        randomIndex={index + "childPolicy"}
                                    />
                                </td>
                                <td className="border w-[180px] min-w-[180px]">
                                    <MultipleSelectDropdown
                                        data={boardTypes}
                                        displayName={"boardName"}
                                        valueName={"_id"}
                                        selectedData={childPolicy?.boardTypes}
                                        setSelectedData={(selBoardTypes) => {
                                            dispatch(
                                                handleChildMealPolicyDataChange(
                                                    {
                                                        name: "boardTypes",
                                                        value: selBoardTypes,
                                                        index,
                                                    }
                                                )
                                            );
                                        }}
                                        randomIndex={
                                            index + "childMealPolicies"
                                        }
                                    />
                                </td>
                                <td className="border min-w-[100px]">
                                    <input
                                        type="number"
                                        name="fromAge"
                                        value={childPolicy?.fromAge || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border min-w-[100px]">
                                    <input
                                        type="number"
                                        name="toAge"
                                        value={childPolicy?.toAge || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            name="isFree"
                                            checked={childPolicy?.isFree}
                                            onChange={(e) => handleChkChange(e, index)}
                                            className="w-[20px] h-[20px]"
                                        />
                                    </div>
                                </td>
                                <td className="border min-w-[100px]">
                                    <input
                                        type="number"
                                        name="totalFreePax"
                                        value={childPolicy?.totalFreePax || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            name="isManualRate"
                                            checked={childPolicy?.isManualRate}
                                            onChange={(e) => handleChkChange(e, index)}
                                            className="w-[20px] h-[20px]"
                                        />
                                    </div>
                                </td>

                                <td className="border min-w-[100px]">
                                    <input
                                        type="number"
                                        name="rate"
                                        value={childPolicy?.rate || ""}
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
