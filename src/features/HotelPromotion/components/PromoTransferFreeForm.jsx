import React from "react";

export default function PromoTransferFreeForm() {
    return (
        <div className="p-4">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            <th className="p-2 border w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button className="w-[25px] h-[25px] rounded-full bg-green-500">
                                        +
                                    </button>
                                </div>
                            </th>
                            <th className="font-[500] p-2 border">From Date</th>
                            <th className="font-[500] p-2 border">To Date</th>
                            <th className="font-[500] p-2 border">
                                Book Before
                            </th>
                            <th className="font-[500] p-2 border">
                                Room Types
                            </th>
                            <th className="font-[500] p-2 border">Way</th>
                            <th className="font-[500] p-2 border">Min</th>
                            <th className="font-[500] p-2 border">Max</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-b border-tableBorderColor">
                            <td className="p-2 border w-[35px] min-w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button className="w-[25px] h-[25px] rounded-full bg-red-500">
                                        -
                                    </button>
                                </div>
                            </td>
                            <td className="border w-[140px] min-w-[140px]">
                                <input
                                    type="date"
                                    className="h-[100%]  px-2 border-0"
                                />
                            </td>
                            <td className="border w-[140px] min-w-[140px]">
                                <input
                                    type="date"
                                    className="h-[100%]  px-2 border-0"
                                />
                            </td>
                            <td className="border w-[100px] min-w-[100px]">
                                <input
                                    type="number"
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                />
                            </td>
                            <td>
                                <select name="" id="">
                                    <option value="">Select Room Types</option>
                                </select>
                            </td>
                            <td>
                                <div>
                                    <span>OneWay</span>
                                    <span>TwoWay</span>
                                </div>
                            </td>
                            <td className="border w-[70px] min-w-[70px]">
                                <input
                                    type="number"
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                />
                            </td>
                            <td className="border w-[70px] min-w-[70px]">
                                <input
                                    type="number"
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
