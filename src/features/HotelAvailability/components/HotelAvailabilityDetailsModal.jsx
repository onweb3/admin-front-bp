import React, { useRef } from "react";
import { MdClose } from "react-icons/md";
import { useHandleClickOutside } from "../../../hooks";
import { formatDate } from "../../../utils";

export default function HotelAvailabilityDetailsModal({
    setIsModalOpen,
    allocation,
    roomType,
}) {
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsModalOpen(false));

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 text-[#222] ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Hotel Availability</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(false);
                        }}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4 ">
                    <table>
                        <tbody className="text-left">
                            <tr>
                                <td className="p-1">Room Type</td>
                                <td className="p-1">:</td>
                                <td className="p-1">
                                    {roomType?.roomTypeName || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-1">Date</td>
                                <td className="p-1">:</td>
                                <td className="p-1">
                                    {allocation?.date
                                        ? formatDate(allocation?.date)
                                        : "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-1">Allocation Type</td>
                                <td className="p-1">:</td>
                                <td className="p-1">
                                    {allocation?.allocationType || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-1">Allocation</td>
                                <td className="p-1">:</td>
                                <td className="p-1">
                                    {allocation?.allocation || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-1">Unit Wise</td>
                                <td className="p-1">:</td>
                                <td className="p-1">
                                    {allocation?.unitWise || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-1">Release Date</td>
                                <td className="p-1">:</td>
                                <td className="p-1">
                                    {allocation?.releaseDate || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-1">Booked Allocations</td>
                                <td className="p-1">:</td>
                                <td className="p-1">
                                    {allocation?.bookedAllocations || "N/A"}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-1">Last Updated</td>
                                <td className="p-1">:</td>
                                <td className="p-1">
                                    {allocation?.updatedAt
                                        ? formatDate(
                                              allocation?.updatedAt,
                                              true
                                          )
                                        : "N/A"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
