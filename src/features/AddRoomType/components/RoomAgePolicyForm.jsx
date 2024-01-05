import React from "react";

export default function RoomAgePolicyForm({ data, handleChange, isEditPermission = true }) {
    return (
        <div className="mt-7">
            <h1 className="font-[600] underline">Age Policy</h1>

            <div className="overflow-x-auto mt-4">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            <th className="font-[500] p-2 border" colSpan="2">
                                Infant
                            </th>
                            <th className="font-[500] p-2 border" colSpan="2">
                                Child
                            </th>
                            <th className="font-[500] p-2 border" colSpan="2">
                                Adult
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-b border-tableBorderColor">
                            <td className="border py-2 text-center">From</td>
                            <td className="border text-center">To</td>
                            <td className="border text-center">From</td>
                            <td className="border text-center">To</td>
                            <td className="border text-center">From</td>
                            <td className="border text-center">To</td>
                        </tr>
                        <tr className="border-b border-tableBorderColor">
                            <td className="border">
                                <input
                                    type="number"
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    value={data?.infantAgeFrom}
                                    name="infantAgeFrom"
                                    onChange={handleChange}
                                    placeholder="0"
                                    disabled={!isEditPermission}
                                />
                            </td>
                            <td className="border">
                                <input
                                    type="number"
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    value={data?.infantAgeTo}
                                    name="infantAgeTo"
                                    onChange={handleChange}
                                    placeholder="0"
                                    disabled={!isEditPermission}
                                />
                            </td>
                            <td className="border">
                                <input
                                    type="number"
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    value={data?.childAgeFrom}
                                    name="childAgeFrom"
                                    onChange={handleChange}
                                    placeholder="0"
                                    disabled={!isEditPermission}
                                />
                            </td>
                            <td className="border">
                                <input
                                    type="number"
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    value={data?.childAgeTo}
                                    name="childAgeTo"
                                    onChange={handleChange}
                                    placeholder="0"
                                    disabled={!isEditPermission}
                                />
                            </td>
                            <td className="border py-2">
                                <input
                                    type="number"
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    value={data?.adultAgeFrom}
                                    name="adultAgeFrom"
                                    onChange={handleChange}
                                    placeholder="0"
                                    disabled={!isEditPermission}
                                />
                            </td>
                            <td className="border">
                                <input
                                    type="number"
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    value={data?.adultAgeTo}
                                    name="adultAgeTo"
                                    onChange={handleChange}
                                    placeholder="0"
                                    disabled={!isEditPermission}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
