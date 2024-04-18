import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FaCar } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";

import axios from "../../axios";
import { PageLoader } from "../../components";
import { config } from "../../constants";

export default function SingleTourPackagePage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [tourPackage, setTourPackage] = useState({});

    const { tPackageId } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchTourPackage = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(
                `/tour-packages/single/${tPackageId}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setTourPackage(response.data);
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTourPackage();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Tour Package Details
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/tour-packages" className="text-textColor">
                        Tour Packages{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {tPackageId?.slice(0, 3)}...{tPackageId?.slice(-3)}
                    </span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm p-4">
                        <div className="relative flex flex-col items-center justify-center bg-slate-300 w-full h-[200px] rounded">
                            {tourPackage?.thumbnail && (
                                <div className="absolute inset-0">
                                    <img
                                        src={
                                            import.meta.env.VITE_SERVER_URL +
                                            tourPackage?.thumbnail
                                        }
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="z-10 text-center">
                                <h2 className="text-lg font-[600]">
                                    {tourPackage?.packageName || "N/A"}
                                </h2>
                                <span className="text-sm block mt-1">
                                    {tourPackage?.noOfDays || "N/A"} Days -
                                    Availability (
                                    {tourPackage?.isCustomDate === true
                                        ? "Custom"
                                        : "All Day"}
                                    )
                                </span>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h3 className="font-[600] text-lg mb-2">
                                Overview
                            </h3>
                            <p className="text-sm leading-7">
                                {tourPackage?.overveiw}
                            </p>
                        </div>

                        <div className="mt-10">
                            <h3 className="font-[600] text-lg mb-4">
                                Itineraries
                            </h3>
                            {tourPackage?.itineraries?.length < 1 ? (
                                <span className="text-sm text-grayColor font-medium">
                                    Select number of days first..!
                                </span>
                            ) : (
                                tourPackage?.itineraries?.map(
                                    (itinerary, itineraryIndex) => {
                                        const airportPickup =
                                            itineraryIndex === 0 &&
                                            tourPackage?.isAirportTransfer ===
                                                true;
                                        const airportDropOff =
                                            itineraryIndex ===
                                                tourPackage?.itineraries
                                                    ?.length -
                                                    1 &&
                                            tourPackage?.isAirportTransfer ===
                                                true;

                                        return (
                                            <div
                                                key={itineraryIndex}
                                                className="relative pl-[50px] pb-5"
                                            >
                                                <div
                                                    className={
                                                        "absolute top-0 left-0 h-full w-[40px] text-white flex flex-col items-center justify-center text-center " +
                                                        (itineraryIndex % 2 ===
                                                        0
                                                            ? "bg-[#be61c9]"
                                                            : "bg-[#9821a7]")
                                                    }
                                                >
                                                    <span className="text-[13px]">
                                                        Day
                                                    </span>
                                                    <span className="font-[600]">
                                                        {itineraryIndex + 1}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 mb-3">
                                                    <h3 className="font-[600] text-[14px]">
                                                        {itinerary?.title
                                                            ? itinerary?.title
                                                            : "N/A"}
                                                    </h3>
                                                </div>

                                                {airportPickup && (
                                                    <div className="flex items-start mb-5 last:mb-0 gap-4">
                                                        <div className="w-[100px] h-[60px] rounded overflow-hidden bg-slate-300">
                                                            {/* <img
                                                src=""
                                                alt=""
                                                className="w-full h-full object-cover"
                                            /> */}
                                                        </div>
                                                        <div className="border p-3 w-full relative">
                                                            <h4 className="font-[500] text-sm mb-1">
                                                                Air Port Pick Up
                                                            </h4>
                                                            <p className="mt-2 text-sm leading-6">
                                                                At the time of
                                                                your arrival our
                                                                driver will
                                                                greet you &
                                                                assist you with
                                                                your baggage to
                                                                the Vehicle and
                                                                drive you safely
                                                                to your Hotel or
                                                                Residence.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                                {itinerary?.itineraryItems
                                                    ?.length < 1 &&
                                                !airportPickup &&
                                                !airportDropOff ? (
                                                    <span className="text-sm text-grayColor font-medium">
                                                        No Activities Added
                                                    </span>
                                                ) : (
                                                    itinerary?.itineraryItems?.map(
                                                        (
                                                            itineraryItem,
                                                            itineraryItemIndex
                                                        ) => {
                                                            return (
                                                                <div
                                                                    key={
                                                                        itineraryItemIndex
                                                                    }
                                                                    className="flex items-start mb-5 last:mb-0 gap-4"
                                                                >
                                                                    <div className="w-[100px] h-[60px] rounded overflow-hidden bg-grayColor">
                                                                        <img
                                                                            src={
                                                                                import.meta
                                                                                    .env
                                                                                    .VITE_SERVER_URL +
                                                                                itineraryItem
                                                                                    ?.activity
                                                                                    ?.attraction
                                                                                    ?.image
                                                                            }
                                                                            alt=""
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="border p-3 w-full relative">
                                                                        <h4 className="font-[500] text-sm mb-1">
                                                                            {
                                                                                itineraryItem?.itineraryName
                                                                            }
                                                                        </h4>
                                                                        <div className="flex items-center flex-wrap gap-3 text-[13px]">
                                                                            <span className="flex items-center gap-1">
                                                                                <FaCar />
                                                                                {
                                                                                    itineraryItem?.transferType
                                                                                }{" "}
                                                                                {itineraryItem?.transferType ===
                                                                                    "private" &&
                                                                                    `(${itineraryItem?.vehicleType?.name})`}
                                                                            </span>
                                                                            <span className="flex items-center gap-1">
                                                                                <MdOutlineAccessTime />
                                                                                Full
                                                                                Day
                                                                            </span>
                                                                            <span className="flex items-center gap-1">
                                                                                <CiGlobe />
                                                                                English
                                                                            </span>
                                                                        </div>
                                                                        <p className="mt-2 text-sm leading-6">
                                                                            {
                                                                                itineraryItem?.description
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                )}
                                                {airportDropOff && (
                                                    <div className="flex items-start mb-5 last:mb-0 gap-4">
                                                        <div className="w-[100px] h-[60px] rounded overflow-hidden bg-slate-300">
                                                            {/* <img
                                                src=""
                                                alt=""
                                                className="w-full h-full object-cover"
                                            /> */}
                                                        </div>
                                                        <div className="border p-3 w-full relative">
                                                            <h4 className="font-[500] text-sm mb-1">
                                                                Air Port Drop
                                                                Off
                                                            </h4>
                                                            <p className="mt-2 text-sm leading-6">
                                                                At the time of
                                                                your departure
                                                                Our Driver will
                                                                Pick you from
                                                                your desired
                                                                hotel in Dubai
                                                                and drop you at
                                                                the Dubai
                                                                International
                                                                Airport.
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                )
                            )}
                        </div>

                        <div className="mt-10">
                            <h3 className="font-[600] text-lg">
                                Hotel Options
                            </h3>

                            {tourPackage?.hotels?.map(
                                (tpHotel, tpHotelIndex) => {
                                    let lastNight =
                                        (tpHotelIndex !== 0 &&
                                            tourPackage?.hotels[
                                                tpHotelIndex - 1
                                            ]?.noOfNights - 1) ||
                                        0;

                                    return (
                                        <div
                                            key={tpHotelIndex}
                                            className="mt-5"
                                        >
                                            <h3 className="text-[14px]">
                                                <span className="text-orange-500 font-[600] uppercase">
                                                    Day{" "}
                                                    {tpHotelIndex +
                                                        1 +
                                                        lastNight}{" "}
                                                    To{" "}
                                                    {tpHotelIndex +
                                                        Number(
                                                            tpHotel?.noOfNights
                                                        ) +
                                                        1 +
                                                        lastNight || "N/A"}
                                                </span>
                                                {tpHotel?.noOfNights &&
                                                    ` (${tpHotel?.noOfNights} Nights)`}
                                            </h3>
                                            <div className="grid grid-cols-7 gap-4 mt-3">
                                                {tpHotel?.hotelOptions?.length <
                                                1 ? (
                                                    <span className="text-sm text-grayColor font-medium">
                                                        No Hotels Added
                                                    </span>
                                                ) : (
                                                    tpHotel?.hotelOptions?.map(
                                                        (
                                                            hOption,
                                                            hOptIndex
                                                        ) => {
                                                            return (
                                                                <div
                                                                    key={
                                                                        hOptIndex
                                                                    }
                                                                >
                                                                    <div className="w-full rounded overflow-hidden relative aspect-[5/3]">
                                                                        <img
                                                                            src={
                                                                                hOption
                                                                                    ?.hotel
                                                                                    ?.image
                                                                                    ?.isRelative ===
                                                                                true
                                                                                    ? import.meta
                                                                                          .env
                                                                                          .VITE_SERVER_URL +
                                                                                      hOption
                                                                                          ?.hotel
                                                                                          ?.image
                                                                                          ?.path
                                                                                    : hOption
                                                                                          ?.hotel
                                                                                          ?.image
                                                                                          ?.path
                                                                            }
                                                                            alt=""
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <span className="block font-medium text-sm mt-2">
                                                                        {
                                                                            hOption
                                                                                ?.hotel
                                                                                ?.hotelName
                                                                        }
                                                                    </span>
                                                                    <span className="block text-sm text-grayColor capitalize">
                                                                        {
                                                                            hOption
                                                                                ?.hotel
                                                                                ?.address
                                                                        }
                                                                    </span>
                                                                    <span className="text-sm capitalize">
                                                                        {
                                                                            hOption
                                                                                ?.roomType
                                                                                ?.roomName
                                                                        }{" "}
                                                                        |{" "}
                                                                        {
                                                                            hOption?.boardCode
                                                                        }
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
