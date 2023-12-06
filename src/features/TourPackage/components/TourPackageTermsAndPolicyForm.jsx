import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
    addTPackageAvailableDateRow,
    addTPackageExcludedDateRow,
    handleChangeTPackageAvailableDateData,
    handleChangeTPackageExcludedDateData,
    handleTourDataChange,
    removeTPackageAvailableDateRow,
    removeTPackageExcludedDateRow,
} from "../../../redux/slices/tourPackageFormSlice";
import { RichTextEditor } from "../../../components";

export default function TourPackageTermsAndPolicyForm({ selectedSection }) {
    const { data, availableDates, excludedDates } = useSelector((state) => state.tourPackageForm);
    const dispatch = useDispatch();

    const handleChkChange = (e) => {
        dispatch(handleTourDataChange({ name: e.target.name, value: e.target.checked }));
    };

    return (
        <div className={selectedSection === "terms-policy" ? "block" : "hidden"}>
            <div className="mt-4">
                <div className="flex items-center gap-[10px]">
                    <input
                        type="checkbox"
                        name="isCustomDate"
                        checked={data?.isCustomDate || false}
                        onChange={handleChkChange}
                        className="w-[17px] h-[17px]"
                        id="isCustomDate"
                    />
                    <label htmlFor="isCustomDate" className="mb-0">
                        Available On Custom Date
                    </label>
                </div>
                {data?.isCustomDate === true && (
                    <table className="w-full mt-4">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                            <tr>
                                <th className="p-2 border w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-green-500"
                                            onClick={() => dispatch(addTPackageAvailableDateRow())}
                                        >
                                            +
                                        </button>
                                    </div>
                                </th>
                                <th className="font-[500] p-2 border">Start Date</th>
                                <th className="font-[500] p-2 border">End Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {availableDates.map((item, index) => (
                                <tr key={index} className="border-b border-tableBorderColor">
                                    <td className="p-2 border w-[35px] min-w-[35px]">
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                onClick={() => {
                                                    dispatch(removeTPackageAvailableDateRow(index));
                                                }}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </td>
                                    <td className="border">
                                        <input
                                            type="date"
                                            name="fromDate"
                                            value={item?.fromDate || ""}
                                            onChange={(e) =>
                                                dispatch(
                                                    handleChangeTPackageAvailableDateData({
                                                        index,
                                                        name: "fromDate",
                                                        value: e.target.value,
                                                    })
                                                )
                                            }
                                            className="h-[100%]  px-2 border-0"
                                        />
                                    </td>
                                    <td className="border">
                                        <input
                                            type="date"
                                            name="toDate"
                                            value={item?.toDate || ""}
                                            onChange={(e) =>
                                                dispatch(
                                                    handleChangeTPackageAvailableDateData({
                                                        index,
                                                        name: "toDate",
                                                        value: e.target.value,
                                                    })
                                                )
                                            }
                                            className="h-[100%]  px-2 border-0"
                                            placeholder="Ex: Manager"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <div className="mt-4">
                <label htmlFor="">Excluded Dates</label>
                <table className="w-full mt-4">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            <th className="p-2 border w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-[25px] h-[25px] rounded-full bg-green-500"
                                        onClick={() => dispatch(addTPackageExcludedDateRow())}
                                    >
                                        +
                                    </button>
                                </div>
                            </th>
                            <th className="font-[500] p-2 border">Start Date</th>
                            <th className="font-[500] p-2 border">End Date</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {excludedDates.map((item, index) => (
                            <tr key={index} className="border-b border-tableBorderColor">
                                <td className="p-2 border w-[35px] min-w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                                            onClick={() => {
                                                dispatch(removeTPackageExcludedDateRow(index));
                                            }}
                                        >
                                            -
                                        </button>
                                    </div>
                                </td>
                                <td className="border">
                                    <input
                                        type="date"
                                        name="fromDate"
                                        value={item?.fromDate || ""}
                                        onChange={(e) =>
                                            dispatch(
                                                handleChangeTPackageExcludedDateData({
                                                    index,
                                                    name: "fromDate",
                                                    value: e.target.value,
                                                })
                                            )
                                        }
                                        className="h-[100%]  px-2 border-0"
                                    />
                                </td>
                                <td className="border">
                                    <input
                                        type="date"
                                        name="toDate"
                                        value={item?.toDate || ""}
                                        onChange={(e) =>
                                            dispatch(
                                                handleChangeTPackageExcludedDateData({
                                                    index,
                                                    name: "toDate",
                                                    value: e.target.value,
                                                })
                                            )
                                        }
                                        className="h-[100%]  px-2 border-0"
                                        placeholder="Ex: Manager"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
                <label htmlFor="">Inclusions *</label>
                <RichTextEditor
                    initialValue={data?.inclusions || ""}
                    getValue={(val) => {
                        dispatch(handleTourDataChange({ name: "inclusions", value: val }));
                    }}
                />
            </div>
            <div className="mt-4">
                <label htmlFor="">Exclusions *</label>
                <RichTextEditor
                    initialValue={data?.exclusions || ""}
                    getValue={(val) => {
                        dispatch(handleTourDataChange({ name: "exclusions", value: val }));
                    }}
                />
            </div>
            <div className="mt-4">
                <label htmlFor="">Visa Policy *</label>
                <RichTextEditor
                    initialValue={data?.visaPolicy || ""}
                    getValue={(val) => {
                        dispatch(handleTourDataChange({ name: "visaPolicy", value: val }));
                    }}
                />
            </div>
            <div className="mt-4">
                <label htmlFor="">Terms And Condition *</label>
                <RichTextEditor
                    initialValue={data?.termsAndConditions || ""}
                    getValue={(val) => {
                        dispatch(handleTourDataChange({ name: "termsAndConditions", value: val }));
                    }}
                />
            </div>
        </div>
    );
}
