import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { TopCard } from "../../features/Dashboard";
import {
  avatarImg,
  bookingCancelledPng,
  bookingConfirmedPng,
  bookingReceivedPng,
  ticketBoughtPng,
  ticketCancelledPng,
  ticketConfirmedPng,
  totalRevenuePng,
  usersPng,
} from "../../assets/images";
import axios from "../../axios";
// import { config } from "../../constants";
import { formatDate, hasPermission } from "../../utils";

export default function HotelDashboardPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [data, setData] = useState({
    recentHotelOrders: [],
    expiringHotelPayLaterOrders: [],
    topHotelsList: [],
    topResellersList: [],
    nextDayHotelArrivalsList: [],
    nextDayHotelDeparturesList: [],
    recentCancellationRequests: [],
    unConfirmedBookings: [],
  });

  const { admin, jwtToken } = useSelector((state) => state.admin);
  const navigate = useNavigate();

  const fetchHotelDashboardData = async () => {
    try {
      setIsPageLoading(true);

      const response = await axios.get("/hotels/dashboard", {
        headers: { authorization: `Bearer ${jwtToken}` },
      });

      setData((prev) => {
        return {
          ...prev,
          recentHotelOrders: response.data?.recentHotelOrders || [],
          expiringHotelPayLaterOrders:
            response.data?.expiringHotelPayLaterOrders || [],
          topHotelsList: response.data?.topHotelsList || [],
          topResellersList: response.data?.topResellersList || [],
          nextDayHotelArrivalsList:
            response.data?.nextDayHotelArrivalsList || [],
          nextDayHotelDeparturesList:
            response.data?.nextDayHotelDeparturesList || [],
          recentCancellationRequests:
            response.data?.recentCancellationRequests || [],
          unConfirmedBookings: response.data?.unConfirmedBookings || [],
        };
      });
      setIsPageLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchHotelDashboardData();
  }, []);

  if (isPageLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between gap-[10px] mb-5">
          <div className="animate-pulse">
            <span className="block bg-gray-300 h-[20px] w-[180px]"></span>
            <span className="block mt-1 h-[15px] bg-gray-300 w-[280px]"></span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-6">
          <div className="w-full bg-gray-300 h-[100px] rounded"></div>
          <div className="w-full bg-gray-300 h-[100px] rounded"></div>
          <div className="w-full bg-gray-300 h-[100px] rounded"></div>
          <div className="w-full bg-gray-300 h-[100px] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-[10px] mb-5">
        <div>
          <span className="font-medium text-textColor">
            Good morning, {admin?.name}
          </span>
          <span className="block mt-1 text-[13px] text-grayColor">
            Here's what's happening with your website.
          </span>
        </div>
      </div>

      {/* <div className="grid grid-cols-4 gap-6">
                <TopCard
                    title={"Total Revenue"}
                    value={300}
                    link="/"
                    linkText="View all details"
                    icon={totalRevenuePng}
                    isAmount={true}
                />
                <TopCard
                    title={"Total Booking Received"}
                    value={3}
                    link="/"
                    linkText="View all booking"
                    icon={bookingReceivedPng}
                />
                <TopCard
                    title={"Total Booking Confimed"}
                    value={2}
                    link="/"
                    linkText="View all booking"
                    icon={bookingConfirmedPng}
                />
                <TopCard
                    title={"Total Booking Cancelled"}
                    value={1}
                    link="/"
                    linkText="View all booking"
                    icon={bookingCancelledPng}
                />
                <TopCard
                    title={"Total Users Signed"}
                    value={20}
                    link="/"
                    linkText="View all booking"
                    icon={usersPng}
                />
                <TopCard
                    title={"Total Ticket Bought"}
                    value={10}
                    link="/"
                    linkText="View all booking"
                    icon={ticketBoughtPng}
                />
                <TopCard
                    title={"Total Ticket Confirmed"}
                    value={6}
                    link="/"
                    linkText="View all booking"
                    icon={ticketConfirmedPng}
                />
                <TopCard
                    title={"Total Ticket Cancelled"}
                    value={4}
                    link="/"
                    linkText="View all booking"
                    icon={ticketCancelledPng}
                />
            </div> */}

      {/* RECENT ORDERS */}
      {hasPermission({
        roles: admin?.roles || [],
        name: "recent-hotel-reservations",
        permission: "view",
      }) && (
        <div className="bg-white rounded shadow-sm mt-6">
          <div className="flex items-center justify-between border-b border-dashed p-4">
            <h1 className="font-medium">Recent Orders</h1>
            <div>
              <Link
                to="/hotels/reservation"
                className="text-sm text-blue-500 underline"
              >
                View All
              </Link>
            </div>
          </div>
          {data?.recentHotelOrders?.length < 1 ? (
            <div className="p-6">
              <span className="block text-sm text-center font-medium text-grayColor">
                No Data Found!
              </span>
            </div>
          ) : (
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
                    <th className="font-[500] p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data?.recentHotelOrders?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                        onClick={() =>
                          navigate(`/hotels/reservation/${item?._id}`)
                        }
                      >
                        <td className="p-3">
                          <span>{item?.referenceNumber}</span>
                          <span className="block text-[13px] text-grayColor">
                            {formatDate(item?.createdAt, true)}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-[40px] min-w-[40px] h-[40px] min-h-[40px] overflow-hidden rounded">
                              <img
                                src={
                                  item?.hotel?.image?.isRelative
                                    ? import.meta.env.VITE_SERVER_URL +
                                      item?.hotel?.image?.path
                                    : item?.hotel?.image?.path
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span>{item?.hotel?.hotelName}</span>
                              <span className="block text-[13px] text-grayColor">
                                {item?.hotel?.address}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span>{item?.reseller?.companyName}</span>{" "}
                          <span className=" text-[13px]">
                            ({item?.reseller?.agentCode})
                          </span>
                        </td>
                        <td className="p-3">
                          {formatDate(item?.fromDate)} -{" "}
                          {formatDate(item?.toDate)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {item?.roomsCount || "N/A"} ROOM
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {item?.totalAdults} ADT, {item?.totalChildren} CHD
                        </td>
                        <td className={"p-3 whitespace-nowrap "}>
                          {item?.netPrice?.toFixed(2)} AED
                        </td>
                        <td className="p-3">
                          <span
                            className={
                              "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                              (item?.status === "cancelled"
                                ? "bg-[#f065481A] text-[#f06548]"
                                : item?.status === "confirmed"
                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                : item?.status === "booked"
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
          )}
        </div>
      )}

      {hasPermission({
        roles: admin?.roles || [],
        name: "unconfirmed-hotel-reservations",
        permission: "view",
      }) && (
        <div className="bg-white rounded shadow-sm mt-6">
          <div className="flex items-center justify-between border-b border-dashed p-4">
            <h1 className="font-medium">Orders Not Confirmed</h1>
            <div>
              <Link
                to="/hotels/reservation"
                className="text-sm text-blue-500 underline"
              >
                View All
              </Link>
            </div>
          </div>
          {data?.unConfirmedBookings?.length < 1 ? (
            <div className="p-6">
              <span className="block text-sm text-center font-medium text-grayColor">
                No Data Found!
              </span>
            </div>
          ) : (
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
                    <th className="font-[500] p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data?.unConfirmedBookings?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                        onClick={() =>
                          navigate(`/hotels/reservation/${item?._id}`)
                        }
                      >
                        <td className="p-3">
                          <span>{item?.referenceNumber}</span>
                          <span className="block text-[13px] text-grayColor">
                            {formatDate(item?.createdAt, true)}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-[40px] min-w-[40px] h-[40px] min-h-[40px] overflow-hidden rounded">
                              <img
                                src={
                                  item?.hotel?.image?.isRelative
                                    ? import.meta.env.VITE_SERVER_URL +
                                      item?.hotel?.image?.path
                                    : item?.hotel?.image?.path
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span>{item?.hotel?.hotelName}</span>
                              <span className="block text-[13px] text-grayColor">
                                {item?.hotel?.address}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span>{item?.reseller?.companyName}</span>{" "}
                          <span className=" text-[13px]">
                            ({item?.reseller?.agentCode})
                          </span>
                        </td>
                        <td className="p-3">
                          {formatDate(item?.fromDate)} -{" "}
                          {formatDate(item?.toDate)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {item?.roomsCount || "N/A"} ROOM
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {item?.totalAdults} ADT, {item?.totalChildren} CHD
                        </td>
                        <td className={"p-3 whitespace-nowrap "}>
                          {item?.netPrice?.toFixed(2)} AED
                        </td>
                        <td className="p-3">
                          <span
                            className={
                              "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                              (item?.status === "cancelled"
                                ? "bg-[#f065481A] text-[#f06548]"
                                : item?.status === "confirmed"
                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                : item?.status === "booked"
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
          )}
        </div>
      )}

      {hasPermission({
        roles: admin?.roles || [],
        name: "hotel-expiring-paylater-report",
        permission: "view",
      }) && (
        <div className="bg-white rounded shadow-sm mt-6">
          <div className="flex items-center justify-between border-b border-dashed p-4">
            <h1 className="font-medium">Expiring Pay Later Bookings</h1>
            <div>
              <Link
                to="/hotels/reservation/expiring/paylater"
                className="text-sm text-blue-500 underline"
              >
                View All
              </Link>
            </div>
          </div>
          {data.expiringHotelPayLaterOrders?.length < 1 ? (
            <div className="p-6">
              <span className="block text-sm text-center font-medium text-grayColor">
                No Data Found!
              </span>
            </div>
          ) : (
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
                    <th className="font-[500] p-3">Due Amount</th>
                    <th className="font-[500] p-3">Last Date</th>
                    <th className="font-[500] p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data?.expiringHotelPayLaterOrders?.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                        onClick={() =>
                          navigate(`/hotels/reservation/${item?._id}`)
                        }
                      >
                        <td className="p-3">
                          <span>{item?.referenceNumber}</span>
                          <span className="block text-[13px] text-grayColor">
                            {formatDate(item?.createdAt, true)}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-[40px] min-w-[40px] h-[40px] min-h-[40px] overflow-hidden rounded">
                              <img
                                src={
                                  item?.hotel?.image?.isRelative
                                    ? import.meta.env.VITE_SERVER_URL +
                                      item?.hotel?.image?.path
                                    : item?.hotel?.image?.path
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span>{item?.hotel?.hotelName}</span>
                              <span className="block text-[13px] text-grayColor">
                                {item?.hotel?.address}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span>{item?.reseller?.companyName}</span>{" "}
                          <span className=" text-[13px]">
                            ({item?.reseller?.agentCode})
                          </span>
                        </td>
                        <td className="p-3">
                          {formatDate(item?.fromDate)} -{" "}
                          {formatDate(item?.toDate)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {item?.roomsCount || "N/A"} ROOM
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {item?.totalAdults} ADT, {item?.totalChildren} CHD
                        </td>
                        <td className={"p-3 whitespace-nowrap "}>
                          {item?.netPrice?.toFixed(2)} AED
                        </td>
                        <td
                          className={
                            "p-3 " +
                            (new Date().toISOString().substring(0, 10) ===
                            new Date(item?.lastDateForPayment)
                              .toISOString()
                              .substring(0, 10)
                              ? "text-red-500"
                              : "")
                          }
                        >
                          {formatDate(item?.lastDateForPayment)}
                        </td>
                        <td className="p-3">
                          <span
                            className={
                              "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                              (item?.status === "cancelled"
                                ? "bg-[#f065481A] text-[#f06548]"
                                : item?.status === "confirmed"
                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                : item?.status === "booked"
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
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {hasPermission({
          roles: admin?.roles || [],
          name: "next-day-arrival-hotel-reservations",
          permission: "view",
        }) && (
          <div className="bg-white rounded shadow-sm mt-6">
            <div className="flex items-center justify-between border-b border-dashed p-4">
              <h1 className="font-medium">Next Day Arrivals</h1>
            </div>
            {data.nextDayHotelArrivalsList?.length < 1 ? (
              <div className="p-6">
                <span className="block text-sm text-center font-medium text-grayColor">
                  No Data Found!
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                    <tr>
                      <th className="font-[500] p-3">Ref.No</th>
                      <th className="font-[500] p-3">Hotel</th>
                      <th className="font-[500] p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {data?.nextDayHotelArrivalsList?.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                          onClick={() =>
                            navigate(`/hotels/reservation/${item?._id}`)
                          }
                        >
                          <td className="p-3">
                            <span>{item?.referenceNumber}</span>
                            <span className="block text-[13px] text-grayColor">
                              {formatDate(item?.createdAt, true)}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-[40px] min-w-[40px] h-[40px] min-h-[40px] overflow-hidden rounded">
                                <img
                                  src={
                                    item?.hotel?.image?.isRelative
                                      ? import.meta.env.VITE_SERVER_URL +
                                        item?.hotel?.image?.path
                                      : item?.hotel?.image?.path
                                  }
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <span>{item?.hotel?.hotelName}</span>
                                <span className="block text-[13px] text-grayColor">
                                  {item?.hotel?.address}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            {formatDate(item?.fromDate)} -{" "}
                            {formatDate(item?.toDate)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {hasPermission({
          roles: admin?.roles || [],
          name: "next-day-departure-hotel-reservations",
          permission: "view",
        }) && (
          <div className="bg-white rounded shadow-sm mt-6">
            <div className="flex items-center justify-between border-b border-dashed p-4">
              <h1 className="font-medium">Next Day Departures</h1>
            </div>
            {data.nextDayHotelDeparturesList?.length < 1 ? (
              <div className="p-6">
                <span className="block text-sm text-center font-medium text-grayColor">
                  No Data Found!
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                    <tr>
                      <th className="font-[500] p-3">Ref.No</th>
                      <th className="font-[500] p-3">Hotel</th>
                      <th className="font-[500] p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {data?.nextDayHotelDeparturesList?.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                          onClick={() =>
                            navigate(`/hotels/reservation/${item?._id}`)
                          }
                        >
                          <td className="p-3">
                            <span>{item?.referenceNumber}</span>
                            <span className="block text-[13px] text-grayColor">
                              {formatDate(item?.createdAt, true)}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-[40px] min-w-[40px] h-[40px] min-h-[40px] overflow-hidden rounded">
                                <img
                                  src={
                                    item?.hotel?.image?.isRelative
                                      ? import.meta.env.VITE_SERVER_URL +
                                        item?.hotel?.image?.path
                                      : item?.hotel?.image?.path
                                  }
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <span>{item?.hotel?.hotelName}</span>
                                <span className="block text-[13px] text-grayColor">
                                  {item?.hotel?.address}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            {formatDate(item?.fromDate)} -{" "}
                            {formatDate(item?.toDate)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {hasPermission({
          roles: admin?.roles || [],
          name: "hotel-recent-cancellation-requests",
          permission: "view",
        }) && (
          <div className="bg-white rounded shadow-sm mt-6">
            <div className="flex items-center justify-between border-b border-dashed p-4">
              <h1 className="font-medium">Recent Cancellation Requests</h1>
              <div>
                <Link
                  to="/hotels/reservation/cancellation-requests"
                  className="text-sm text-blue-500 underline"
                >
                  View All
                </Link>
              </div>
            </div>
            {data.recentCancellationRequests?.length < 1 ? (
              <div className="p-6">
                <span className="block text-sm text-center font-medium text-grayColor">
                  No Data Found!
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                    <tr>
                      <th className="font-[500] p-3">Ref.No</th>
                      <th className="font-[500] p-3">Hotel</th>
                      <th className="font-[500] p-3">Date</th>
                      <th className="font-[500] p-3">Cancellation</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {data.recentCancellationRequests?.map((item, index) => {
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
                            <span>{item?.orderId?.referenceNumber}</span>
                            <span className="block text-[13px] text-grayColor">
                              {formatDate(item?.orderId?.createdAt, true)}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-[40px] min-w-[40px] h-[40px] min-h-[40px] overflow-hidden rounded">
                                <img
                                  src={
                                    item?.orderId?.hotel?.image?.isRelative
                                      ? import.meta.env.VITE_SERVER_URL +
                                        item?.orderId?.hotel?.image?.path
                                      : item?.orderId?.hotel?.image?.path
                                  }
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <span>{item?.orderId?.hotel?.hotelName}</span>
                                {/* <span className="block text-[13px] text-grayColor">
                                                                {item?.orderId?.hotel?.address}
                                                            </span> */}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {formatDate(item?.orderId?.fromDate)} - <br />
                            {formatDate(item?.orderId?.toDate)}
                          </td>
                          <td className="p-3">
                            <span
                              className={
                                "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                (item?.cancellationStatus === "failed"
                                  ? "bg-[#f065481A] text-[#f06548]"
                                  : item?.cancellationStatus === "success"
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {hasPermission({
          roles: admin?.roles || [],
          name: "top-hotel-reservation-hotels",
          permission: "view",
        }) && (
          <div className="bg-white rounded shadow-sm mt-6">
            <div className="flex items-center justify-between border-b border-dashed p-4">
              <h1 className="font-medium">Top Hotels</h1>
              <div>
                <Link
                  to="/hotels/reservation/top-hotels"
                  className="text-sm text-blue-500 underline"
                >
                  View All
                </Link>
              </div>
            </div>
            {data?.topHotelsList?.length < 1 ? (
              <div className="p-6">
                <span className="block text-sm text-center font-medium text-grayColor">
                  No Data Found!
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                    <tr>
                      <th className="font-[500] p-3">Hotel</th>
                      <th className="font-[500] p-3">Orders</th>
                      <th className="font-[500] p-3">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {data.topHotelsList?.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                          onClick={() => navigate(`/hotels/${item?._id}/edit`)}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="h-[35px] w-[35px] min-w-[35px] min-h-[35px] overflow-hidden rounded-sm">
                                <img
                                  src={
                                    item?.hotel?.image?.isRelative === true
                                      ? import.meta.env.VITE_SERVER_URL +
                                        item?.hotel?.image?.path
                                      : item?.hotel?.image?.path
                                  }
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <span>{item?.hotel?.hotelName}</span>
                                <span className="block text-[13px] text-grayColor">
                                  {item?.hotel?.address}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 ">{item?.totalOrders || 0}</td>
                          <td className="p-3 whitespace-nowrap">
                            {item?.totalVolume?.toFixed(2) || 0} AED
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {hasPermission({
          roles: admin?.roles || [],
          name: "top-hotel-reservation-resellers",
          permission: "view",
        }) && (
          <div className="bg-white rounded shadow-sm mt-6">
            <div className="flex items-center justify-between border-b border-dashed p-4">
              <h1 className="font-medium">Top Resellers</h1>
              <div>
                <Link
                  to="/hotels/reservation/top-resellers"
                  className="text-sm text-blue-500 underline"
                >
                  View All
                </Link>
              </div>
            </div>
            {data?.topResellersList?.length < 1 ? (
              <div className="p-6">
                <span className="block text-sm text-center font-medium text-grayColor">
                  No Data Found!
                </span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                    <tr>
                      <th className="font-[500] p-3">Reseller</th>
                      <th className="font-[500] p-3">Orders</th>
                      <th className="font-[500] p-3">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {data.topResellersList?.map((item, index) => {
                      return (
                        <tr
                          key={index}
                          className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                          onClick={() => navigate(`/b2b/${item?._id}/details`)}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="h-[35px] w-[35px] min-w-[35px] min-h-[35px] overflow-hidden rounded-full">
                                <img
                                  src={
                                    item?.reseller?.companyLogo
                                      ? import.meta.env.VITE_SERVER_URL +
                                        item?.reseller?.companyLogo
                                      : avatarImg
                                  }
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <span>
                                  {item?.reseller?.companyName} (
                                  {item?.reseller?.agentCode})
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 ">{item?.totalOrders || 0}</td>
                          <td className="p-3 whitespace-nowrap">
                            {item?.totalVolume?.toFixed(2) || 0} AED
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
