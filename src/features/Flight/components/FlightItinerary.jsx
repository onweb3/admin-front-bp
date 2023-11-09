import React, { useState } from "react";
import { TbArrowNarrowRight, TbArrowsExchange2 } from "react-icons/tb";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../utils";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import { useSelector } from "react-redux";

export default function FlightItinerary({ trip }) {
    const [expanded, setExpanded] = useState(false);
    const {} = useSelector((state) => state.flightOrder);
    return (
        <div className="flex">
            <div className="border-1">
                <div className=" flex items-center gap-4 mb-5 ">
                    <div className="flex items-center gap-2">
                        <div>{trip.departureAirport}</div>
                        <BsArrowRight />
                        <div>{trip.arrivalAirport}</div>
                    </div>

                    <div>
                        {formatDate(trip.flightSegments[0].departureDate)}
                    </div>
                </div>
                <div className="flex gap-10 items-center">
                    <div className="flex gap-3">
                        <img
                            src={trip?.airlines[0]?.airlineLogo}
                            alt=""
                            className="h-[35px]"
                        />{" "}
                        <div>
                            {trip.airlines[0].airlineName}
                            <div>{trip.airlines[0].airlineCode}</div>
                        </div>{" "}
                    </div>
                    <div>
                        {trip.flightSegments.map((segment) => {
                            return (
                                <div className="">
                                    <div className="flex gap-3 items-center">
                                        <div>
                                            {formatDate(segment?.departureDate)}
                                            <span className="pl-2">
                                                {
                                                    segment?.departureDate
                                                        .split("T")[1]
                                                        .split(":")[0]
                                                }
                                                :{" "}
                                                {
                                                    segment?.departureDate
                                                        .split("T")[1]
                                                        .split(":")[1]
                                                }{" "}
                                            </span>
                                        </div>
                                        <div className="">
                                            {" "}
                                            <div className="">
                                                {" "}
                                                {segment.fromAirport}
                                            </div>{" "}
                                            <div className="">
                                                {" "}
                                                {segment.fromCountry}
                                            </div>
                                            <div className="">
                                                {" "}
                                                {segment.fromTerminal}
                                            </div>
                                        </div>
                                    </div>{" "}
                                </div>
                            );
                        })}
                    </div>
                    <div className="gap-4">
                        <div className="flex gap-4">
                            <div>checkin Baggage</div>{" "}
                            <div>
                                {trip.fareDetails.checkInBaggageWeight} Kg
                            </div>{" "}
                        </div>
                        <div className="flex gap-4">
                            <div>cabin Baggage</div>{" "}
                            <div> {trip.fareDetails.cabinBaggageWeight} Kg</div>{" "}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
