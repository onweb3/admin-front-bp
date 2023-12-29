import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addChildPoliciesPolicyRow,
    addChildPoliciesRow,
    deleteChildPoliciesRow,
    handleChildPolicyDataChange,
    handleChildPolicyPoliciesChange,
    removeChildPoliciesPolicyRow,
    updateCheckBox,
} from "../../../redux/slices/hotelContractSlice";
import { MultipleSelectDropdown } from "../../../components";

export default function ChildPolicyForm({ isEditPermission = true }) {
    const dispatch = useDispatch();
    const { childPolicies, roomTypes } = useSelector((state) => state.hotelContractForm);

    const handleChange = (e, index) => {
        dispatch(
            handleChildPolicyDataChange({
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
                                            onClick={() => dispatch(addChildPoliciesRow())}
                                        >
                                            +
                                        </button>
                                    </div>
                                </th>
                            )}
                            <th className="font-[500] p-2 border">From Date</th>
                            <th className="font-[500] p-2 border">To Date</th>
                            <th className="font-[500] p-2 border">Room Types</th>
                            <th className="font-[500] p-2 border">Age From</th>
                            <th className="font-[500] p-2 border">Age To</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {childPolicies.map((childPolicy, index) => (
                            <React.Fragment key={index}>
                                <tr className="border-b border-tableBorderColor">
                                    {isEditPermission && (
                                        <td className="p-2 border w-[35px] min-w-[35px]">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                    onClick={() => {
                                                        dispatch(
                                                            deleteChildPoliciesRow({
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
                                            value={childPolicy?.fromDate || ""}
                                            onChange={(e) => handleChange(e, index)}
                                            className="h-[100%]  px-2 border-0"
                                            disabled={!isEditPermission}
                                        />
                                    </td>
                                    <td className="border w-[140px] min-w-[140px]">
                                        <input
                                            type="date"
                                            name="toDate"
                                            value={childPolicy?.toDate || ""}
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
                                            selectedData={childPolicy?.roomTypes}
                                            setSelectedData={(selRoomTypes) => {
                                                dispatch(
                                                    handleChildPolicyDataChange({
                                                        name: "roomTypes",
                                                        value: selRoomTypes,
                                                        index,
                                                    })
                                                );
                                            }}
                                            randomIndex={index + "childPolicy"}
                                            disabled={!isEditPermission}
                                        />
                                    </td>
                                    <td className="border min-w-[100px]">
                                        <input
                                            type="number"
                                            name="fromAge"
                                            value={childPolicy?.fromAge}
                                            onChange={(e) => handleChange(e, index)}
                                            className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                            disabled={!isEditPermission}
                                        />
                                    </td>
                                    <td className="border min-w-[100px]">
                                        <input
                                            type="number"
                                            name="toAge"
                                            value={childPolicy?.toAge}
                                            onChange={(e) => handleChange(e, index)}
                                            className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                            disabled={!isEditPermission}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td colSpan={2}>
                                        <table className="w-full">
                                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                                                <tr>
                                                    {isEditPermission && (
                                                        <th className="p-2 border w-[35px]">
                                                            <div className="flex items-center justify-center">
                                                                <button
                                                                    className="w-[25px] h-[25px] rounded-full bg-green-500"
                                                                    onClick={() =>
                                                                        dispatch(
                                                                            addChildPoliciesPolicyRow({
                                                                                index,
                                                                            })
                                                                        )
                                                                    }
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </th>
                                                    )}
                                                    <th className="font-[500] p-2 border">Pax Count</th>
                                                    <th className="font-[500] p-2 border">Bedding Incl</th>
                                                    <th className="font-[500] p-2 border">Bedding Rate</th>
                                                    <th className="font-[500] p-2 border">Meal Incl</th>
                                                    <th className="font-[500] p-2 border">Meal Rate</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {childPolicy?.policies?.map((policy, policyIndex) => {
                                                    return (
                                                        <tr
                                                            key={policyIndex}
                                                            className="border-b border-tableBorderColor"
                                                        >
                                                            {isEditPermission && (
                                                                <td className="p-2 border w-[35px] min-w-[35px]">
                                                                    <div className="flex items-center justify-center">
                                                                        <button
                                                                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                                            onClick={() => {
                                                                                dispatch(
                                                                                    removeChildPoliciesPolicyRow(
                                                                                        {
                                                                                            index,
                                                                                            policyIndex,
                                                                                        }
                                                                                    )
                                                                                );
                                                                            }}
                                                                        >
                                                                            -
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            )}
                                                            <td className="border min-w-[100px] p-2">
                                                                <input
                                                                    type="number"
                                                                    name="paxCount"
                                                                    value={policy?.paxCount}
                                                                    onChange={(e) =>
                                                                        dispatch(
                                                                            handleChildPolicyPoliciesChange({
                                                                                index,
                                                                                policyIndex,
                                                                                name: e.target.name,
                                                                                value: e.target.value,
                                                                            })
                                                                        )
                                                                    }
                                                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                                                    disabled={!isEditPermission}
                                                                />
                                                            </td>
                                                            <td className="border w-[70px] min-w-[70px]">
                                                                <div className="flex items-center justify-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="beddingIclusive"
                                                                        checked={policy?.beddingIclusive}
                                                                        onChange={(e) => {
                                                                            dispatch(
                                                                                handleChildPolicyPoliciesChange(
                                                                                    {
                                                                                        index,
                                                                                        policyIndex,
                                                                                        name: e.target.name,
                                                                                        value: e.target
                                                                                            .checked,
                                                                                    }
                                                                                )
                                                                            );
                                                                        }}
                                                                        className="w-[20px] h-[20px]"
                                                                        disabled={!isEditPermission}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="border min-w-[100px]">
                                                                <input
                                                                    type="number"
                                                                    name="beddingCharge"
                                                                    value={policy?.beddingCharge}
                                                                    onChange={(e) =>
                                                                        dispatch(
                                                                            handleChildPolicyPoliciesChange({
                                                                                index,
                                                                                policyIndex,
                                                                                name: e.target.name,
                                                                                value: e.target.value,
                                                                            })
                                                                        )
                                                                    }
                                                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                                                    disabled={
                                                                        policy?.beddingIclusive === true ||
                                                                        !isEditPermission
                                                                    }
                                                                />
                                                            </td>
                                                            <td className="border w-[70px] min-w-[70px]">
                                                                <div className="flex items-center justify-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="mealInclusive"
                                                                        checked={policy?.mealInclusive}
                                                                        onChange={(e) => {
                                                                            dispatch(
                                                                                handleChildPolicyPoliciesChange(
                                                                                    {
                                                                                        index,
                                                                                        policyIndex,
                                                                                        name: e.target.name,
                                                                                        value: e.target
                                                                                            .checked,
                                                                                    }
                                                                                )
                                                                            );
                                                                        }}
                                                                        className="w-[20px] h-[20px]"
                                                                        disabled={!isEditPermission}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="border min-w-[100px]">
                                                                <input
                                                                    type="number"
                                                                    name="mealCharge"
                                                                    value={policy?.mealCharge}
                                                                    onChange={(e) =>
                                                                        dispatch(
                                                                            handleChildPolicyPoliciesChange({
                                                                                index,
                                                                                policyIndex,
                                                                                name: e.target.name,
                                                                                value: e.target.value,
                                                                            })
                                                                        )
                                                                    }
                                                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                                                    disabled={
                                                                        policy?.mealInclusive === true ||
                                                                        !isEditPermission
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2"></td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
