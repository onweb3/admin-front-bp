import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addContractExcludedDatesRows,
    deleteContractExcludedDatesRow,
    handleContractExcludedDatesDataChange,
} from "../../../redux/slices/hotelContractSlice";
import { MultipleSelectDropdown } from "../../../components";

export default function ContractExcludedDatesForm() {
    const dispatch = useDispatch();

    const { excludedDates, roomTypes } = useSelector((state) => state.hotelContractForm);

    const handleAddRow = () => {
        dispatch(addContractExcludedDatesRows());
    };

    const handleChange = (e, index) => {
        dispatch(
            handleContractExcludedDatesDataChange({
                index,
                name: e.target.name,
                value: e.target.value,
            })
        );
    };

    return (
        <div className="p-4">
            <span className="text-sm text-grayColor block mb-4">
                * This excluded dates have higher priority. If you add any dates here, then the
                system doesn't add any promotion on certain dates even if any type of promotion
                exists.
            </span>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
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
                            <th className="font-[500] p-2 border">From Date</th>
                            <th className="font-[500] p-2 border">To Date</th>
                            <th className="font-[500] p-2 border">Room Type</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {excludedDates.map((dateRange, index) => (
                            <tr key={index} className="border-b border-tableBorderColor">
                                <td className="p-2 border w-[35px] min-w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                                            onClick={() => {
                                                dispatch(
                                                    deleteContractExcludedDatesRow({
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
                                        value={dateRange?.fromDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[140px] min-w-[140px]">
                                    <input
                                        type="date"
                                        name="toDate"
                                        value={dateRange?.toDate || ""}
                                        onChange={(e) => handleChange(e, index)}
                                        className="h-[100%]  px-2 border-0"
                                    />
                                </td>
                                <td className="border w-[180px] min-w-[180px]">
                                    <MultipleSelectDropdown
                                        data={roomTypes}
                                        displayName={"roomName"}
                                        valueName={"_id"}
                                        selectedData={dateRange?.roomTypes}
                                        setSelectedData={(selRoomTypes) => {
                                            dispatch(
                                                handleContractExcludedDatesDataChange({
                                                    name: "roomTypes",
                                                    value: selRoomTypes,
                                                    index,
                                                })
                                            );
                                        }}
                                        randomIndex={index + "excludedDates"}
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
