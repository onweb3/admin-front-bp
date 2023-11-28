import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addTPackageAvailableDateRow,
    handleChangeTPackageAvailableDateData,
    handleTourDataChange,
    removeTPackageAvailableDateRow,
} from "../../../redux/slices/tourPackageFormSlice";

export default function TourPackageDetailsForm({ selectedSection }) {
    const { data, availableDates } = useSelector((state) => state.tourPackageForm);
    const dispatch = useDispatch();

    const handleDataInpChange = (e) => {
        dispatch(handleTourDataChange({ name: e.target.name, value: e.target.value }));
    };

    const handleChkChange = (e) => {
        dispatch(handleTourDataChange({ name: e.target.name, value: e.target.checked }));
    };

    return (
        <div className={selectedSection === "details" ? "block" : "hidden"}>
            <div className="grid grid-cols-4 gap-4">
                <div>
                    <label htmlFor="">Package Name *</label>
                    <input
                        type="text"
                        placeholder="Enter package name"
                        name="packageName"
                        value={data.packageName || ""}
                        onChange={handleDataInpChange}
                    />
                </div>
                <div>
                    <label htmlFor="">No Of Days</label>
                    <input
                        type="number"
                        placeholder="Enter no of days"
                        name="noOfDays"
                        value={data.noOfDays || ""}
                        onChange={handleDataInpChange}
                    />
                </div>
            </div>
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
        </div>
    );
}
