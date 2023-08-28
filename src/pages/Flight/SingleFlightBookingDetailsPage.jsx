import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { TbArrowNarrowRight, TbArrowsExchange2 } from "react-icons/tb";
import { AiOutlineClockCircle, AiOutlineCloudDownload } from "react-icons/ai";
import moment from "moment";

import axios from "../../axios";
import { getFormatedDuration } from "../../utils";
import { PageLoader } from "../../components";

export default function SingleFlightBookingDetailsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [flightBooking, setFlightBooking] = useState({});

    const { bookingId } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchFlightBooking = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/flights/bookings/single/${bookingId}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setFlightBooking(response?.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleBookingPdfDownload = async () => {
        if (flightBooking?.status === "completed") {
            const pdfBuffer = await axios.get(`/flights/bookings/single/pdf/${bookingId}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
                responseType: "arraybuffer",
            });

            const blob = new Blob([pdfBuffer.data], {
                type: "application/pdf",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = `tickets-${flightBooking?.referenceNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
        }
    };

    useEffect(() => {
        fetchFlightBooking();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Flight Bookings</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Flights </span>
                    <span>{">"} </span>
                    <Link to="/flights/bookings" className="text-textColor">
                        Bookings
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {bookingId?.slice(0, 3)}...{bookingId?.slice(-3)}
                    </span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm p-6">
                        <div className="flex items-start justify-between gap-[20px] mb-5">
                            <div className="">
                                <div className="flex items-center gap-[10px] font-[600] text-lg">
                                    {flightBooking?.trips[0]?.flightSegments[0]?.from}{" "}
                                    {flightBooking?.tripType === "oneway" ? (
                                        <span className="text-lg">
                                            <TbArrowNarrowRight />
                                        </span>
                                    ) : (
                                        <span className="text-lg">
                                            <TbArrowsExchange2 />
                                        </span>
                                    )}{" "}
                                    {
                                        flightBooking?.trips[0]?.flightSegments[
                                            flightBooking?.trips[0]?.flightSegments?.length - 1
                                        ]?.to
                                    }{" "}
                                    ({flightBooking?.noOfAdults} ADT
                                    {flightBooking?.noOfChildren > 0 &&
                                        `, ${flightBooking?.noOfChildren} CHD`}
                                    {flightBooking?.noOfInfants > 0 &&
                                        `, ${flightBooking?.noOfInfants} INF`}
                                    )
                                </div>
                                <span className="block text-sm text-grayColor">
                                    Booked by{" "}
                                    <span className="underline">
                                        {flightBooking?.reseller?.companyName} (
                                        {flightBooking?.reseller?.agentCode})
                                    </span>{" "}
                                    at {moment(flightBooking?.createdAt).format("D MMM YYYY")}
                                </span>
                            </div>
                            <div className="flex items-center gap-[25px]">
                                <div className="text-center">
                                    <span className="block text-sm text-grayColor font-medium">
                                        Net Fare
                                    </span>
                                    <span className="font-[600] text-lg">
                                        {flightBooking?.netFare} AED
                                    </span>
                                </div>
                                <span
                                    className={
                                        "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                        (flightBooking?.status === "cancelled"
                                            ? "bg-[#f065481A] text-[#f06548]"
                                            : flightBooking?.status === "completed"
                                            ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                            : "bg-[#f7b84b1A] text-[#f7b84b]")
                                    }
                                >
                                    {flightBooking?.status}
                                </span>
                                {flightBooking?.status === "completed" && (
                                    <button
                                        className="px-3 bg-[#299cdb] flex items-center gap-2"
                                        onClick={handleBookingPdfDownload}
                                    >
                                        <span className="text-lg">
                                            <AiOutlineCloudDownload />
                                        </span>
                                        Download
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-10">
                            <div className="col-span-5">
                                {flightBooking?.trips?.map((trip, tripIndex) => {
                                    return (
                                        <div key={tripIndex} className="mb-5 last:mb-0">
                                            <div className="bg-primaryColor text-white px-4 py-2 font-[600]">
                                                {trip?.departureAirport} to {trip?.arrivalAirport}
                                                <span className="font-[400] ml-4 text-sm">
                                                    {moment(
                                                        trip?.flightSegments[0]?.departureDate
                                                    ).format("D MMM YYYY HH:mm")}
                                                </span>
                                            </div>
                                            {trip?.flightSegments?.map((segment, segmentIndex) => {
                                                return (
                                                    <div key={segmentIndex}>
                                                        <div className="flex items-start gap-[50px] mt-5 ">
                                                            <div>
                                                                <div className="w-[40px] h-[40px] overflow-hidden mb-2">
                                                                    <img
                                                                        src={segment?.airlineLogo}
                                                                        alt=""
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <h3 className="font-medium mb-1">
                                                                    {segment?.airlineName}
                                                                </h3>
                                                                <span className="text-grayColor text-sm block">
                                                                    {segment?.flightNumber}
                                                                </span>
                                                                <span className="text-grayColor text-sm block mt-[2px]">
                                                                    {trip?.fareDetails?.fareName ||
                                                                        ""}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="flex items-center gap-[10px] font-[600]">
                                                                    <span className="text-blue-500">
                                                                        {segment?.from}
                                                                    </span>
                                                                    <span>
                                                                        {moment(
                                                                            segment?.departureDate
                                                                        ).format("HH:mm")}
                                                                    </span>
                                                                </span>
                                                                <span className="text-grayColor text-sm block mt-[2px]">
                                                                    {moment(
                                                                        segment?.departureDate
                                                                    ).format("D MMM YYYY")}
                                                                </span>
                                                                <span className="text-grayColor text-sm block mt-[2px]">
                                                                    {segment?.fromAirport}
                                                                </span>
                                                                <span className="text-grayColor text-sm block mt-[2px]">
                                                                    {segment?.fromTerminal}
                                                                </span>
                                                            </div>
                                                            <div className="">
                                                                <span className="flex justify-center items-center mb-1">
                                                                    <AiOutlineClockCircle />
                                                                </span>
                                                                <span className="text-grayColor text-sm block text-center mt-[2px]">
                                                                    {getFormatedDuration(
                                                                        segment?.departureDate,
                                                                        segment?.arrivalDate
                                                                    )}
                                                                </span>
                                                                <span className="text-grayColor text-sm block text-center mt-[2px] capitalize">
                                                                    {segment?.travelClass}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="flex items-center gap-[10px] font-[600]">
                                                                    <span className="text-blue-500">
                                                                        {segment?.to}
                                                                    </span>
                                                                    <span>
                                                                        {moment(
                                                                            segment?.arrivalDate
                                                                        ).format("HH:mm")}
                                                                    </span>
                                                                </span>
                                                                <span className="text-grayColor text-sm block mt-[2px]">
                                                                    {moment(
                                                                        segment?.arrivalDate
                                                                    ).format("D MMM YYYY")}
                                                                </span>
                                                                <span className="text-grayColor text-sm block mt-[2px]">
                                                                    {segment?.toAirport}
                                                                </span>
                                                                <span className="text-grayColor text-sm block mt-[2px]">
                                                                    {segment?.toTerminal}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4">
                                                            <table className="w-full text-[14px]">
                                                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                                                    <tr>
                                                                        <th className="p-2 text-sm text-grayColor font-medium">
                                                                            Travellers
                                                                        </th>
                                                                        <th className="p-2 text-sm text-grayColor font-medium">
                                                                            PNR
                                                                        </th>
                                                                        <th className="p-2 text-sm text-grayColor font-medium">
                                                                            Ticket
                                                                        </th>
                                                                        <th className="p-2 text-sm text-grayColor font-medium">
                                                                            Seat
                                                                        </th>
                                                                        <th className="p-2 text-sm text-grayColor font-medium">
                                                                            Meal
                                                                        </th>
                                                                        <th className="p-2 text-sm text-grayColor font-medium">
                                                                            Baggage
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {segment?.passengers?.map(
                                                                        (passenger, passIndex) => {
                                                                            return (
                                                                                <tr
                                                                                    key={passIndex}
                                                                                    className="border-b border-tableBorderColor last:border-b-0"
                                                                                >
                                                                                    <td className="p-2">
                                                                                        {
                                                                                            passenger?.nameTitle
                                                                                        }{" "}
                                                                                        {
                                                                                            passenger?.firstName
                                                                                        }{" "}
                                                                                        {
                                                                                            passenger?.lastName
                                                                                        }
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        {
                                                                                            flightBooking?.bookingPNR
                                                                                        }
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        {passenger?.ticketNumber ||
                                                                                            "N/A"}
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        {passenger?.seatNumber
                                                                                            ? passenger?.seatNumber
                                                                                            : "N/A"}
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        {passenger
                                                                                            ?.mealRequests
                                                                                            ?.length >
                                                                                        0
                                                                                            ? passenger
                                                                                                  ?.mealRequests[0]
                                                                                                  ?.mealInfo
                                                                                            : "N/A"}
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        {passenger
                                                                                            ?.baggageRequests
                                                                                            ?.length >
                                                                                        0
                                                                                            ? passenger
                                                                                                  ?.baggageRequests[0]
                                                                                                  ?.baggageInfo
                                                                                            : "N/A"}
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        }
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="col-span-2">
                                <table className="text-[15px]">
                                    <tr>
                                        <td className="p-1 pl-0 text-grayColor">Reference No</td>
                                        <td className="p-1 font-medium">#{flightBooking?.referenceNumber}</td>
                                    </tr>
                                </table>
                                <div className="mb-6">
                                    <h3 className="font-medium">Contact Info</h3>
                                    <table className="text-[15px]">
                                        <tr>
                                            <td className="p-1 pl-0 text-grayColor">Email</td>
                                            <td className="p-1">nihal@hami.live</td>
                                        </tr>
                                        <tr>
                                            <td className="p-1 pl-0 text-grayColor">
                                                Phone Number
                                            </td>
                                            <td className="p-1">+91 7994766524</td>
                                        </tr>
                                    </table>
                                </div>
                                <table className="w-full text-[15px]">
                                    <tbody>
                                        <tr>
                                            <td className="font-medium py-1 w-full">
                                                <div className="flex gap-[15px] items-center w-full">
                                                    <span className="">Base Fare</span>
                                                    <div className="border-b border-dashed flex-1"></div>
                                                    <span className="text-right font-[600]">
                                                        {flightBooking?.baseFare}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-grayColor py-1 w-full">
                                                <div className="flex gap-[15px] items-center w-full">
                                                    <span className="">Total Tax</span>
                                                    <div className="border-b border-dashed flex-1"></div>
                                                    <span className="text-right">
                                                        {flightBooking?.totalTax}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-grayColor py-1 w-full">
                                                <div className="flex gap-[15px] items-center w-full">
                                                    <span className="">Total Fee</span>
                                                    <div className="border-b border-dashed flex-1"></div>
                                                    <span className="text-right">
                                                        {flightBooking?.totalFee}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-grayColor py-1 w-full">
                                                <div className="flex gap-[15px] items-center w-full">
                                                    <span className="">Admin Markup</span>
                                                    <div className="border-b border-dashed flex-1"></div>
                                                    <span className="text-right">0</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-grayColor py-1 w-full">
                                                <div className="flex gap-[15px] items-center w-full">
                                                    <span className="">
                                                        Agent To Sub Agent Markup
                                                    </span>
                                                    <div className="border-b border-dashed flex-1"></div>
                                                    <span className="text-right">0</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-grayColor py-1 w-full">
                                                <div className="flex gap-[15px] items-center w-full">
                                                    <span className="">Client Markup</span>
                                                    <div className="border-b border-dashed flex-1"></div>
                                                    <span className="text-right">0</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <td className="font-medium py-1 w-full">
                                            <div className="flex gap-[15px] items-center w-full">
                                                <span className="">Total Offer</span>
                                                <div className="border-b border-dashed flex-1"></div>
                                                <span className="text-right font-[600]">- 0</span>
                                            </div>
                                        </td>
                                        <tr>
                                            <td className="font-medium py-2 w-full">
                                                <div className="flex gap-[15px] items-center w-full">
                                                    <span className="">Net Fare</span>
                                                    <div className="border-b border-dashed flex-1"></div>
                                                    <span className="text-right font-[600] text-lg text-green-500 whitespace-nowrap">
                                                        AED {flightBooking?.netFare}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
