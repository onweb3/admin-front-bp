import React, { useEffect, useState } from "react";

import axios from "../../axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { PageLoader, Pagination } from "../../components";
import { config } from "../../constants";
import { formatDate } from "../../utils";

export default function HotelExpiringPayLaterOrdersPage() {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalOrders: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const fetchHotelPayLaterOrder = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/hotels/orders/b2b/all/pay-later/expiring?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setData(response?.data?.expiringHotelPayLaterOrders || []);
            setFilters((prev) => {
                return { ...prev, totalOrders: response.data?.totalOrders };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHotelPayLaterOrder();
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Expiring Hotel Pay Later
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
                    <span>Expiring </span>
                    <span>{">"} </span>
                    <span>Pay-Later</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">
                            All Hotel Expiring Paylater Reservations
                        </h1>
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
                                            <th className="font-[500] p-3">
                                                Ref.No
                                            </th>
                                            <th className="font-[500] p-3">
                                                Hotel
                                            </th>
                                            <th className="font-[500] p-3">
                                                Reseller
                                            </th>
                                            <th className="font-[500] p-3">
                                                Date
                                            </th>
                                            <th className="font-[500] p-3">
                                                Room
                                            </th>
                                            <th className="font-[500] p-3">
                                                Pax
                                            </th>
                                            <th className="font-[500] p-3">
                                                Due Amount
                                            </th>
                                            <th className="font-[500] p-3">
                                                Last Date
                                            </th>
                                            <th className="font-[500] p-3">
                                                Status
                                            </th>
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
                                                            `/hotels/reservation/${item?._id}`
                                                        )
                                                    }
                                                >
                                                    <td className="p-3">
                                                        <span>
                                                            {
                                                                item?.referenceNumber
                                                            }
                                                        </span>
                                                        <span className="block text-[13px] text-grayColor">
                                                            {formatDate(
                                                                item?.createdAt,
                                                                true
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-[40px] min-w-[40px] h-[40px] min-h-[40px] overflow-hidden rounded">
                                                                <img
                                                                    src={
                                                                        item
                                                                            ?.hotel
                                                                            ?.image
                                                                            ?.isRelative
                                                                            ? import.meta
                                                                                  .env
                                                                                  .VITE_SERVER_URL +
                                                                              item
                                                                                  ?.hotel
                                                                                  ?.image
                                                                                  ?.path
                                                                            : item
                                                                                  ?.hotel
                                                                                  ?.image
                                                                                  ?.path
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <span>
                                                                    {
                                                                        item
                                                                            ?.hotel
                                                                            ?.hotelName
                                                                    }
                                                                </span>
                                                                <span className="block text-[13px] text-grayColor">
                                                                    {
                                                                        item
                                                                            ?.hotel
                                                                            ?.address
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <span>
                                                            {
                                                                item?.reseller
                                                                    ?.companyName
                                                            }
                                                        </span>{" "}
                                                        <span className=" text-[13px]">
                                                            (
                                                            {
                                                                item?.reseller
                                                                    ?.agentCode
                                                            }
                                                            )
                                                        </span>
                                                    </td>
                                                    <td className="p-3">
                                                        {formatDate(
                                                            item?.fromDate
                                                        )}{" "}
                                                        -{" "}
                                                        {formatDate(
                                                            item?.toDate
                                                        )}
                                                    </td>
                                                    <td className="p-3 whitespace-nowrap">
                                                        {item?.roomsCount ||
                                                            "N/A"}{" "}
                                                        ROOM
                                                    </td>
                                                    <td className="p-3 whitespace-nowrap">
                                                        {item?.totalAdults} ADT,{" "}
                                                        {item?.totalChildren}{" "}
                                                        CHD
                                                    </td>
                                                    <td
                                                        className={
                                                            "p-3 whitespace-nowrap "
                                                        }
                                                    >
                                                        {item?.netPrice?.toFixed(
                                                            2
                                                        )}{" "}
                                                        AED
                                                    </td>
                                                    <td
                                                        className={
                                                            "p-3 " +
                                                            (new Date()
                                                                .toISOString()
                                                                .substring(
                                                                    0,
                                                                    10
                                                                ) ===
                                                            new Date(
                                                                item?.lastDateForPayment
                                                            )
                                                                .toISOString()
                                                                .substring(
                                                                    0,
                                                                    10
                                                                )
                                                                ? "text-red-500"
                                                                : "")
                                                        }
                                                    >
                                                        {formatDate(
                                                            item?.lastDateForPayment
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        <span
                                                            className={
                                                                "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                                (item?.status ===
                                                                "cancelled"
                                                                    ? "bg-[#f065481A] text-[#f06548]"
                                                                    : item?.status ===
                                                                      "confirmed"
                                                                    ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                                    : item?.status ===
                                                                      "booked"
                                                                    ? "text-[#0a83b3] bg-[#0a83b31a]"
                                                                    : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                            }
                                                        >
                                                            {item?.status}
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
                                    total={filters?.totalOrders}
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
