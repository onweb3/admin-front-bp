import React from "react";
import { CiGlobe } from "react-icons/ci";
import { FaCar } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import { useSelector } from "react-redux";

import { config } from "../../../constants";

export default function TourPackageSummaryForm({ selectedSection, newImages }) {
    const { data, itineraries, tPackageHotels } = useSelector(
        (state) => state.tourPackageForm
    );

    return (
        <div className={selectedSection === "summary" ? "block" : "hidden"}>
            <div className="relative flex flex-col items-center justify-center bg-slate-300 w-full h-[200px] rounded">
                {(newImages || data?.thumbnail) && (
                    <div className="absolute inset-0">
                        <img
                            src={
                                newImages && newImages[0]
                                    ? URL.createObjectURL(newImages[0])
                                    : config.SERVER_URL + data?.thumbnail[0]
                            }
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="z-10 text-center">
                    <h2 className="text-lg font-[600]">
                        {data?.packageName || "N/A"}
                    </h2>
                    <span className="text-sm block mt-1">
                        {data?.noOfDays || "N/A"} Days - Availability (
                        {data?.isCustomDate === true ? "Custom" : "All Day"})
                    </span>
                </div>
            </div>

            <div className="mt-10">
                <h3 className="font-[600] text-lg mb-2">Overview</h3>
                <p className="text-sm leading-7">{data?.overveiw}</p>
            </div>

            <div className="mt-10">
                <h3 className="font-[600] text-lg mb-4">Itineraries</h3>
                {itineraries?.length < 1 ? (
                    <span className="text-sm text-grayColor font-medium">
                        Select number of days first..!
                    </span>
                ) : (
                    itineraries?.map((itinerary, itineraryIndex) => {
                        const airportPickup =
                            itineraryIndex === 0 &&
                            data?.isAirportTransfer === true;
                        const airportDropOff =
                            itineraryIndex === itineraries?.length - 1 &&
                            data?.isAirportTransfer === true;

                        return (
                            <div
                                key={itineraryIndex}
                                className="relative pl-[50px] pb-5"
                            >
                                <div
                                    className={
                                        "absolute top-0 left-0 h-full w-[40px] text-white flex flex-col items-center justify-center text-center " +
                                        (itineraryIndex % 2 === 0
                                            ? "bg-[#be61c9]"
                                            : "bg-[#9821a7]")
                                    }
                                >
                                    <span className="text-[13px]">Day</span>
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
                                                At the time of your arrival our
                                                driver will greet you & assist
                                                you with your baggage to the
                                                Vehicle and drive you safely to
                                                your Hotel or Residence.
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {itinerary?.itineraryItems?.length < 1 &&
                                !airportPickup &&
                                !airportDropOff ? (
                                    <span className="text-sm text-grayColor font-medium">
                                        No Activities Added
                                    </span>
                                ) : (
                                    itinerary?.itineraryItems?.map(
                                        (itineraryItem, itineraryItemIndex) => {
                                            return (
                                                <div
                                                    key={itineraryItemIndex}
                                                    className="flex items-start mb-5 last:mb-0 gap-4"
                                                >
                                                    <div className="w-[100px] h-[60px] rounded overflow-hidden bg-slate-300">
                                                        <img
                                                            src={
                                                                config.SERVER_URL +
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
                                                                Full Day
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

                                                        {/* <div className="absolute bottom-[100%] right-0">
                                        <button
                                            className="h-auto py-1 px-2 bg-transparent text-[#444] border rounded-tr-none font-[500] text-[13px]"
                                            onClick={() => {
                                                dispatch(
                                                    removeTPackageItineraryItems({
                                                        itineraryIndex,
                                                        itineraryItemIndex,
                                                    })
                                                );
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div> */}
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
                                                Air Port Drop Off
                                            </h4>
                                            <p className="mt-2 text-sm leading-6">
                                                At the time of your departure
                                                Our Driver will Pick you from
                                                your desired hotel in Dubai and
                                                drop you at the Dubai
                                                International Airport.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-10">
                <h3 className="font-[600] text-lg">Hotel Options</h3>

                {tPackageHotels?.map((tpHotel, tpHotelIndex) => {
                    let lastNight =
                        (tpHotelIndex !== 0 &&
                            tPackageHotels[tpHotelIndex - 1]?.noOfNights - 1) ||
                        0;

                    return (
                        <div key={tpHotelIndex} className="mt-5">
                            <h3 className="text-[14px]">
                                <span className="text-orange-500 font-[600] uppercase">
                                    Day {tpHotelIndex + 1 + lastNight} To{" "}
                                    {tpHotelIndex +
                                        Number(tpHotel?.noOfNights) +
                                        1 +
                                        lastNight || "N/A"}
                                </span>
                                {tpHotel?.noOfNights &&
                                    ` (${tpHotel?.noOfNights} Nights)`}
                            </h3>
                            <div className="grid grid-cols-7 gap-4 mt-3">
                                {tpHotel?.hotelOptions?.length < 1 ? (
                                    <span className="text-sm text-grayColor font-medium">
                                        No Hotels Added
                                    </span>
                                ) : (
                                    tpHotel?.hotelOptions?.map(
                                        (hOption, hOptIndex) => {
                                            return (
                                                <div key={hOptIndex}>
                                                    <div className="w-full rounded overflow-hidden relative aspect-[5/3]">
                                                        <img
                                                            src={
                                                                hOption?.hotel
                                                                    ?.image
                                                                    ?.isRelative ===
                                                                true
                                                                    ? config.SERVER_URL +
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
                                                            hOption?.hotel
                                                                ?.hotelName
                                                        }
                                                    </span>
                                                    <span className="block text-sm text-grayColor capitalize">
                                                        {
                                                            hOption?.hotel
                                                                ?.address
                                                        }
                                                    </span>
                                                    <span className="text-sm capitalize">
                                                        {
                                                            hOption?.roomType
                                                                ?.roomName
                                                        }{" "}
                                                        | {hOption?.boardCode}
                                                    </span>
                                                </div>
                                            );
                                        }
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
