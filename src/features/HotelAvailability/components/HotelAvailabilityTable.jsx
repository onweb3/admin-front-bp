import React from "react";
import { AiFillStar } from "react-icons/ai";

import { formatDate } from "../../../utils";
import HotelAvailabilityTableRow from "./HotelAvailabilityTableRow";

export default function HotelAvailabilityTable({ data }) {
    return (
        <div>
            <div className="flex items-center gap-5 justify-between p-4 pb-0">
                <div className="max-w-[500px]">
                    <div className="flex items-center gap-[10px]">
                        <span className="font-medium">{data?.hotel?.hotelName}</span>
                        <span className="flex gap-1 items-center">
                            ({data?.hotel?.starCategory}
                            <span className="text-yellow-500">
                                <AiFillStar />
                            </span>
                            )
                        </span>
                    </div>
                    <span className="text-sm text-grayColor block mt-1 capitalize">
                        {data?.hotel?.city?.cityName}, {data?.hotel?.state?.stateName},{" "}
                        {data?.hotel?.country?.countryName}
                    </span>
                </div>
                <div className="flex flex-wrap justify-end gap-[20px] text-sm">
                    <div className="flex items-center gap-[10px]">
                        <div className="w-[15px] h-[15px] bg-green-500 rounded-sm"></div>
                        <span>Free Sale</span>
                    </div>
                    <div className="flex items-center gap-[10px]">
                        <div className="w-[15px] h-[15px] bg-blue-500 rounded-sm"></div>
                        <span>On Allocation</span>
                    </div>
                    <div className="flex items-center gap-[10px]">
                        <div className="w-[15px] h-[15px] bg-yellow-500 rounded-sm"></div>
                        <span>On Request</span>
                    </div>
                    <div className="flex items-center gap-[10px]">
                        <div className="w-[15px] h-[15px] bg-red-500 rounded-sm"></div>
                        <span>Stop Sale</span>
                    </div>
                    <div className="flex items-center gap-[10px]">
                        <div className="w-[15px] h-[15px] bg-orange-500 rounded-sm"></div>
                        <span>No Allocation</span>
                    </div>
                </div>
            </div>
            {data?.contractGroups?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm text-grayColor block mt-[6px] font-medium">
                        There is no contract groups on this hotel!!!
                    </span>
                </div>
            ) : (
                data?.contractGroups?.map((contract, index) => {
                    return (
                        <div key={index} className="mt-5">
                            <h1 className="px-4 font-medium text-blue-500 mb-2">
                                {contract?.contractName}
                            </h1>
                            <div className="overflow-x-auto overflow-y-hidden">
                                <table className="w-full max-w-full ">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-2 min-w-[220px] border">
                                                Room Type
                                            </th>
                                            {data?.dates?.map((date, index) => {
                                                return (
                                                    <th
                                                        key={"dth" + index}
                                                        className="font-[500] p-2 whitespace-nowrap border"
                                                    >
                                                        {formatDate(date)}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                        <tr>
                                            <td className="p-2 border"></td>
                                            {data?.dates?.map((_, index) => {
                                                return (
                                                    <th
                                                        key={"dt" + index}
                                                        className="font-[500] p-2 whitespace-nowrap border"
                                                    >
                                                        Allot/Used
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {contract?.roomTypes?.map((roomType, index) => {
                                            return (
                                                <HotelAvailabilityTableRow
                                                    key={"rmt" + index}
                                                    roomType={roomType}
                                                />
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
