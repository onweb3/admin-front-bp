import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addHotelBar,
    handleHotelBarDataChange,
    removeHotelBar,
} from "../../../redux/slices/hotelFormSlice";

export default function HotelBarTable() {
    const { bars } = useSelector((state) => state.hotelForm);
    const dispatch = useDispatch();

    const handleInpChange = (e, index) => {
        dispatch(
            handleHotelBarDataChange({
                index,
                name: e.target?.name,
                value: e.target?.value,
            })
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                    <tr>
                        <th className="p-2 border w-[35px]">
                            <div className="flex items-center justify-center">
                                <button
                                    className="w-[25px] h-[25px] rounded-full bg-green-500"
                                    onClick={() => dispatch(addHotelBar())}
                                >
                                    +
                                </button>
                            </div>
                        </th>
                        <th className="font-[500] p-2 border">Name</th>
                        <th className="font-[500] p-2 border">Bar Type</th>
                        <th className="font-[500] p-2 border">From Time</th>
                        <th className="font-[500] p-2 border">To Time</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {bars.map((item, index) => (
                        <tr key={index} className="border-b border-tableBorderColor">
                            <td className="p-2 border w-[35px] min-w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-[25px] h-[25px] rounded-full bg-red-500"
                                        onClick={() => {
                                            dispatch(removeHotelBar(index));
                                        }}
                                    >
                                        -
                                    </button>
                                </div>
                            </td>
                            <td className="border">
                                <input
                                    type="text"
                                    name="name"
                                    value={item?.name || ""}
                                    onChange={(e) => handleInpChange(e, index)}
                                    className="h-[100%]  px-2 border-0"
                                    placeholder="Ex: Abc Bar"
                                />
                            </td>
                            <td className="border">
                                <select
                                    name="barType"
                                    value={item?.barType || ""}
                                    onChange={(e) => handleInpChange(e, index)}
                                    id=""
                                    className="capitalize"
                                >
                                    <option value="" hidden>
                                        Select Bar Type
                                    </option>
                                    <option value="indoor" className="capitalize">
                                        Indoor Bard
                                    </option>
                                    <option value="outdoor" className="capitalize">
                                        Outdoor Bard
                                    </option>
                                </select>
                            </td>
                            <td className="border">
                                <input
                                    type="time"
                                    name="fromTime"
                                    value={item?.fromTime || ""}
                                    onChange={(e) => handleInpChange(e, index)}
                                    className="h-[100%]  px-2 border-0"
                                />
                            </td>
                            <td className="border">
                                <input
                                    type="time"
                                    name="toTime"
                                    value={item?.toTime || ""}
                                    onChange={(e) => handleInpChange(e, index)}
                                    className="h-[100%]  px-2 border-0"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
