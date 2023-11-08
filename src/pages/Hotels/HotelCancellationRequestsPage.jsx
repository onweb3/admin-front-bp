import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { config } from "../../constants";
import { formatDate } from "../../utils";

export default function HotelCancellationRequestsPage() {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalCancellationRequests: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const fetchHotelOrderCancellationRequests = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/hotels/orders/b2b/all/cancellation-requests?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setData(response?.data?.cancellationRequests || []);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalCancellationRequests: response.data?.totalCancellationRequests,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHotelOrderCancellationRequests();
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Hotel Order Cancellation Requests
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        hotels
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels/reservation" className="text-textColor">
                        Reservation
                    </Link>
                    <span>{">"} </span>
                    <span>Cancellation Requests </span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Hotel Order Cancellation Requests</h1>
                        {/* <button
                            className="px-3 bg-[#299cdb] flex items-center justify-center gap-[10px]"
                            // onClick={handleDownload}
                        >
                            <FiDownload /> Download
                        </button> */}
                    </div>

                    {isLoading ? (
                        <PageLoader />
                    ) : !data || data?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. Not Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Ref.No</th>
                                            <th className="font-[500] p-3">Hotel</th>
                                            <th className="font-[500] p-3">Reseller</th>
                                            <th className="font-[500] p-3">Date</th>
                                            <th className="font-[500] p-3">Room</th>
                                            <th className="font-[500] p-3">Pax</th>
                                            <th className="font-[500] p-3">Price</th>
                                            <th className="font-[500] p-3">Cancellation</th>
                                            <th className="font-[500] p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {data?.map((item, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                                                    onClick={() =>
                                                        navigate(
                                                            `/hotels/reservation/${item?.orderId?._id}`
                                                        )
                                                    }
                                                >
                                                    <td className="p-3">
                                                        <span>
                                                            {item?.orderId?.referenceNumber}
                                                        </span>
                                                        <span className="block text-[13px] text-grayColor">
                                                            {formatDate(item?.createdAt, true)}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-[40px] min-w-[40px] h-[40px] min-h-[40px] overflow-hidden rounded">
                                                                <img
                                                                    src={
                                                                        item?.orderId?.hotel?.image
                                                                            ?.isRelative
                                                                            ? config.SERVER_URL +
                                                                              item?.orderId?.hotel
                                                                                  ?.image?.path
                                                                            : item?.orderId?.hotel
                                                                                  ?.image?.path
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <span>
                                                                    {
                                                                        item?.orderId?.hotel
                                                                            ?.hotelName
                                                                    }
                                                                </span>
                                                                <span className="block text-[13px] text-grayColor">
                                                                    {item?.orderId?.hotel?.address}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <span>{item?.resellerId?.companyName}</span>{" "}
                                                        <span className=" text-[13px]">
                                                            ({item?.resellerId?.agentCode})
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        {formatDate(item?.orderId?.fromDate)} -{" "}
                                                        {formatDate(item?.orderId?.toDate)}
                                                    </td>
                                                    <td className="p-3 whitespace-nowrap">
                                                        {item?.orderId?.roomsCount || "N/A"} ROOM
                                                    </td>
                                                    <td className="p-3 whitespace-nowrap">
                                                        {item?.orderId?.totalAdults} ADT,{" "}
                                                        {item?.orderId?.totalChildren} CHD
                                                    </td>
                                                    <td className={"p-3 whitespace-nowrap "}>
                                                        {item?.orderId?.netPrice?.toFixed(2)} AED
                                                    </td>
                                                    <td className="p-3">
                                                        <span
                                                            className={
                                                                "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                                (item?.cancellationStatus ===
                                                                "failed"
                                                                    ? "bg-[#f065481A] text-[#f06548]"
                                                                    : item?.cancellationStatus ===
                                                                      "success"
                                                                    ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                                    : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                            }
                                                        >
                                                            {item?.cancellationStatus}
                                                        </span>
                                                        <span className="block mt-2 text-[13px] text-grayColor">
                                                            {formatDate(item?.createdAt, true)}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <span
                                                            className={
                                                                "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                                (item?.orderId?.status ===
                                                                "cancelled"
                                                                    ? "bg-[#f065481A] text-[#f06548]"
                                                                    : item?.orderId?.status ===
                                                                      "confirmed"
                                                                    ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                                    : item?.orderId?.status ===
                                                                      "booked"
                                                                    ? "text-[#0a83b3] bg-[#0a83b31a]"
                                                                    : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                            }
                                                        >
                                                            {item?.orderId?.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalCancellationRequests}
                                    incOrDecSkip={(number) =>
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                skip: prev.skip + number,
                                            };
                                        })
                                    }
                                    updateSkip={(skip) =>
                                        setFilters((prev) => {
                                            return { ...prev, skip };
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
