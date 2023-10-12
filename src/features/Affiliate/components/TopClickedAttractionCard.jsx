import React from "react";
import { Link } from "react-router-dom";
import { config } from "../../../constants";

export default function TopClickedAttractionCard({ data }) {
    return (
        <div className="bg-white rounded shadow-sm h-max">
            <div className="p-4 border-b border-b-dashed">
                <h1 className="font-[600]">Top Clicked Attraction</h1>
            </div>
            <div>
                {data?.length < 1 ? (
                    <div className="p-6 flex flex-col items-center">
                        <span className="text-sm text-grayColor block mt-[6px]">
                            Oops.. No Items Found
                        </span>
                    </div>
                ) : (
                    <div>
                        <table className="w-full">
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                <tr>
                                    <th className="font-[500] p-3">#</th>
                                    <th className="font-[500] p-3">
                                        Attraction Name{" "}
                                    </th>
                                    <th className="font-[500] p-3">
                                        Total Clicks
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {data?.map((item, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="border-b border-tableBorderColor"
                                        >
                                            <td className="p-3">
                                                #{index + 1}
                                            </td>

                                            <td className="p-3">
                                                {item?.attractionInfo}
                                            </td>
                                            <td className="p-3">
                                                {item?.count?.toFixed(2)}{" "}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
