import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addCancellationPoliciesRows,
    deletePromotionItemRow,
    handlePromotionRowDataChange,
} from "../../../redux/slices/hotelPromotionsFormSlice";
import { MultipleSelectDropdown } from "../../../components";

export default function PromoCancellationForm({ isEditPermission = true }) {
    const dispatch = useDispatch();

    const { cancellationPolicies, roomTypes } = useSelector((state) => state.hotelPromotionsForm);

    const handleAddRow = () => {
        dispatch(addCancellationPoliciesRows());
    };

    const handleChange = (e, index) => {
        dispatch(
            handlePromotionRowDataChange({
                typeName: "cancellationPolicies",
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
                            <th className="font-[500] p-2 border">From Date</th>
                            <th className="font-[500] p-2 border">To Date</th>
                            <th className="font-[500] p-2 border">Room Types</th>
                            <th className="font-[500] p-2 border">Cancellation Type</th>
                            <th className="font-[500] p-2 border">Deduction Type</th>
                            <th className="font-[500] p-2 border">Cancel Before</th>
                            <th className="font-[500] p-2 border">Value</th>
                            <th className="font-[500] p-2 border">Cancel Booking Before</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {cancellationPolicies.map((cancellationPolicie, index) => (
                            <tr key={index} className="border-b border-tableBorderColor">
                                {isEditPermission && (
                                    <td className="p-2 border w-[35px] min-w-[35px]">
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                onClick={() => {
                                                    dispatch(
                                                        deletePromotionItemRow({
                                                            name: "cancellationPolicies",
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
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="fromDate"
                                        value={cancellationPolicie?.fromDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="toDate"
                                        value={cancellationPolicie?.toDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[180px] min-w-[180px]">
                                    <MultipleSelectDropdown
                                        data={roomTypes}
                                        displayName={"roomName"}
                                        valueName={"_id"}
                                        selectedData={cancellationPolicie?.roomTypes}
                                        setSelectedData={(selRoomTypes) => {
                                            dispatch(
                                                handlePromotionRowDataChange({
                                                    typeName: "cancellationPolicies",
                                                    index,
                                                    name: "roomTypes",
                                                    value: selRoomTypes,
                                                })
                                            );
                                        }}
                                        randomIndex={index + "cancellationPolicy"}
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[100px] min-w-[100px]">
                                    <select
                                        name="cancellationType"
                                        value={cancellationPolicie?.cancellationType || ""}
                                        onChange={(e) => {
                                            if (e.target.value === "non-refundable") {
                                                dispatch(
                                                    handlePromotionRowDataChange({
                                                        typeName: "cancellationPolicies",
                                                        index,
                                                        name: "daysBefore",
                                                        value: "",
                                                    })
                                                );
                                                dispatch(
                                                    handlePromotionRowDataChange({
                                                        typeName: "cancellationPolicies",
                                                        index,
                                                        name: "cancellationCharge",
                                                        value: "",
                                                    })
                                                );
                                                dispatch(
                                                    handlePromotionRowDataChange({
                                                        typeName: "cancellationPolicies",
                                                        index,
                                                        name: "requestCancelDaysBefore",
                                                        value: "",
                                                    })
                                                );
                                            }
                                            handleChange(e, index);
                                        }}
                                        disabled={!isEditPermission}
                                    >
                                        <option value="refundable">Refundable</option>
                                        <option value="non-refundable">Non Refundable</option>
                                    </select>
                                </td>
                                <td className="border w-[100px] min-w-[100px]">
                                    <select
                                        name="cancellationChargeType"
                                        value={cancellationPolicie?.cancellationChargeType || ""}
                                        onChange={(e) => {
                                            if (e.target.value === "non-refundable") {
                                                dispatch(
                                                    handlePromotionRowDataChange({
                                                        typeName: "cancellationPolicies",
                                                        index,
                                                        name: "daysBefore",
                                                        value: "",
                                                    })
                                                );
                                                dispatch(
                                                    handlePromotionRowDataChange({
                                                        typeName: "cancellationPolicies",
                                                        index,
                                                        name: "cancellationCharge",
                                                        value: "",
                                                    })
                                                );
                                                dispatch(
                                                    handlePromotionRowDataChange({
                                                        typeName: "cancellationPolicies",
                                                        index,
                                                        name: "requestCancelDaysBefore",
                                                        value: "",
                                                    })
                                                );
                                            }
                                            handleChange(e, index);
                                        }}
                                        disabled={!isEditPermission}
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="flat">Flat</option>
                                        <option value="night">Night</option>
                                    </select>
                                </td>
                                <td className="border w-[100px] min-w-[100px]">
                                    <input
                                        type="number"
                                        name="daysBefore"
                                        value={cancellationPolicie?.daysBefore}
                                        onChange={(e) => {
                                            handleChange(e, index);
                                            dispatch(
                                                handlePromotionRowDataChange({
                                                    typeName: "cancellationPolicies",
                                                    index,
                                                    name: "requestCancelDaysBefore",
                                                    value: e.target.value,
                                                })
                                            );
                                        }}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        disabled={
                                            cancellationPolicie?.cancellationType === "non-refundable" ||
                                            !isEditPermission
                                        }
                                    />
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <input
                                        type="number"
                                        name="cancellationCharge"
                                        value={cancellationPolicie?.cancellationCharge}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        disabled={
                                            cancellationPolicie?.cancellationType === "non-refundable" ||
                                            !isEditPermission
                                        }
                                    />
                                </td>
                                <td className="border min-w-[100px]">
                                    <input
                                        type="number"
                                        name="requestCancelDaysBefore"
                                        value={cancellationPolicie?.requestCancelDaysBefore}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        disabled={
                                            cancellationPolicie?.cancellationType === "non-refundable" ||
                                            !isEditPermission
                                        }
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
