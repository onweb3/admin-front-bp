import React, { useRef } from "react";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";
import { formatDate } from "../../../utils";
import { AiOutlineMail, AiOutlinePhone, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function RequestDetailsModal({ setIsDetailsModalOpen, request }) {
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsDetailsModalOpen(false));

    return (
        <div
            className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 cursor-default "
            onClick={(e) => e.stopPropagation()}
        >
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Hotel Request Details</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        type="button"
                        onClick={() => setIsDetailsModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <h3 className="font-medium capitalize">{request?.hotel?.hotelName}</h3>
                    <span className="block text-grayColor capitalize">
                        {request?.hotel?.city?.cityName}, {request?.hotel?.state?.stateName},{" "}
                        {request?.hotel?.country?.countryName}
                    </span>
                    <table className="w-full mt-3">
                        <tbody>
                            <tr>
                                <td>Ref.No</td>
                                <td className="p-1">:</td>
                                <td>{request?.b2bHotelRequestId || "N/A"}</td>
                            </tr>
                            <tr>
                                <td>CheckIn Date</td>
                                <td className="p-1">:</td>
                                <td>{formatDate(request?.fromDate)}</td>
                            </tr>
                            <tr>
                                <td>CheckOut Date</td>
                                <td className="p-1">:</td>
                                <td>{formatDate(request?.toDate)}</td>
                            </tr>
                            <tr>
                                <td>No Of Nights</td>
                                <td className="p-1">:</td>
                                <td className="capitalize">{request?.noOfNights} Nights</td>
                            </tr>
                            <tr>
                                <td>Room Type</td>
                                <td className="p-1">:</td>
                                <td>{request?.roomType?.roomName}</td>
                            </tr>
                            <tr>
                                <td>Board Type</td>
                                <td className="p-1">:</td>
                                <td className="capitalize">
                                    {request?.boardType?.boardName} (
                                    {request?.boardType?.boardShortName})
                                </td>
                            </tr>
                            <tr>
                                <td>Rooms Count</td>
                                <td className="p-1">:</td>
                                <td className="capitalize">{request?.roomsCount} Rooms</td>
                            </tr>
                            <tr>
                                <td className="">Pax</td>
                                <td className="p-1">:</td>
                                <td>
                                    <div>
                                        {request?.rooms?.map((item, itemIndex) => {
                                            return (
                                                <div key={itemIndex}>
                                                    <span className="font-medium">
                                                        Room {itemIndex + 1}
                                                    </span>
                                                    <span className="block">
                                                        {item?.noOfAdults} ADT, {item?.noOfChildren}{" "}
                                                        CHD{" "}
                                                        {item?.noOfChildren > 0
                                                            ? item?.childrenAges?.map(
                                                                  (age, ageIndex) => {
                                                                      return (
                                                                          <span key={ageIndex}>
                                                                              {age}
                                                                              {ageIndex <
                                                                              item?.childrenAges
                                                                                  ?.length -
                                                                                  1
                                                                                  ? ", "
                                                                                  : ""}
                                                                          </span>
                                                                      );
                                                                  }
                                                              )
                                                            : ""}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Nationality</td>
                                <td className="p-1">:</td>
                                <td className="capitalize">{request?.nationality || "All"}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="mt-3 bg-blue-200">
                        <span className="block capitalize">
                            Requested By{" "}
                            <Link
                                to={`/b2b/${request?.reseller?._id}/details`}
                                className="underline"
                            >
                                {request?.reseller?.companyName} ({request?.reseller?.agentCode})
                            </Link>{" "}
                            at {formatDate(request?.createdAt, true)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
