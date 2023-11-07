import React, { useState } from "react";
import { TbArrowNarrowRight, TbArrowsExchange2 } from "react-icons/tb";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";

import { formatDate } from "../../../utils";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsArrowRight, BsFillBagFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import FlightAddMealModal from "./FlightAddMealsModal";
import FlightBaggageModal from "./FlightBaggageModal";
import FlightSeatModal from "./FligthSeatModal";
import axios from "../../../axios";
import { BtnLoader, PageLoader } from "../../../components";
import { GiMeal } from "react-icons/gi";
import { MdOutlineAirlineSeatReclineExtra } from "react-icons/md";

export default function FlightAddOns({ flightAncillaries, setShowContacts }) {
    const { singleFlightDetails, totalAncillariesPax } = useSelector(
        (state) => state.flightOrder
    );
    const [isLoading, setIsLoading] = useState(false);

    console.log(singleFlightDetails, "dsss");
    const [isMealModal, setIsMealModal] = useState(false);
    const [isSeatModal, setIsSeatModal] = useState(false);
    const [isBaggageModal, setIsBaggageModal] = useState(false);
    console.log(flightAncillaries, "ancillaires");
    const { jwtToken } = useSelector((state) => state.admin);
    const { tbId } = useParams();
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setError("");
            const formData = {
                tbId: tbId,
                ancillaries: flightAncillaries?.priceQuoteResponse?.trips?.map(
                    (trip) => {
                        return {
                            journeyOriginDestinationInfo: {
                                from: trip.departureAirport,
                                to: trip.arrivalAirport,
                            },
                            userSelectedBaggageAncillaries:
                                flightAncillaries?.baggageSsr
                                    ?.map((baggSsr) => {
                                        let bagggaeCount = 0; // Initialize the count outside of the map function

                                        if (
                                            baggSsr?.selectedBaggage &&
                                            baggSsr?.selectedBaggage?.length > 1
                                        ) {
                                            return {
                                                journeyKey: baggSsr?.journeyKey,
                                                baggageDetails:
                                                    baggSsr?.selectedBaggage?.flatMap(
                                                        (bagg) => {
                                                            const baggageDetails =
                                                                [];
                                                            for (
                                                                let i = 0;
                                                                i < bagg.count;
                                                                i++
                                                            ) {
                                                                baggageDetails.push(
                                                                    {
                                                                        baggageCode:
                                                                            bagg.baggageCode,
                                                                        baggageInfo:
                                                                            bagg.baggageInfo,
                                                                        paxId: flightAncillaries
                                                                            ?.priceQuoteResponse
                                                                            ?.passengers?.[
                                                                            bagggaeCount
                                                                        ]
                                                                            ?.paxId,
                                                                    }
                                                                );
                                                                bagggaeCount += 1; // Increment the count
                                                            }
                                                            return baggageDetails;
                                                        }
                                                    ),
                                            };
                                        }
                                    })
                                    .filter((arr) => arr != null),
                            userSelectedMealAncillaries:
                                flightAncillaries?.mealsSsr
                                    ?.map((mealSsr) => {
                                        let mealCount = 0; // Initialize the count outside of the map function

                                        if (
                                            mealSsr?.selectedMeals &&
                                            mealSsr?.selectedMeals?.length > 1
                                        ) {
                                            return {
                                                segmentKey: mealSsr?.segmentKey,
                                                mealDetails:
                                                    mealSsr?.selectedMeals?.flatMap(
                                                        (meal) => {
                                                            const mealDetails =
                                                                [];
                                                            for (
                                                                let i = 0;
                                                                i < meal?.count;
                                                                i++
                                                            ) {
                                                                mealDetails.push(
                                                                    {
                                                                        mealCode:
                                                                            meal.mealCode,
                                                                        mealInfo:
                                                                            meal.mealInfo,
                                                                        paxId: flightAncillaries
                                                                            ?.priceQuoteResponse
                                                                            ?.passengers?.[
                                                                            mealCount
                                                                        ]
                                                                            ?.paxId,
                                                                    }
                                                                );
                                                                mealCount += 1; // Increment the count
                                                            }
                                                            return mealDetails;
                                                        }
                                                    ),
                                            };
                                        }
                                    })
                                    .filter((arr) => arr != null),
                            userSelectedSeatAncillaries:
                                flightAncillaries?.seatSsr
                                    ?.map((seatSsr) => {
                                        let seatCount = 0; // Initialize the count outside of the map function

                                        if (
                                            seatSsr?.selectedSeats &&
                                            seatSsr?.selectedSeats?.length > 1
                                        ) {
                                            return {
                                                segmentKey: seatSsr.segmentKey,
                                                seatDetails:
                                                    seatSsr?.selectedSeats?.flatMap(
                                                        (seat) => {
                                                            const seatDetails =
                                                                [];

                                                            seatDetails.push({
                                                                seatCode:
                                                                    seat.seatCode,
                                                                seatNumber:
                                                                    seat.seatNumber,
                                                                paxId: flightAncillaries
                                                                    ?.priceQuoteResponse
                                                                    ?.passengers?.[
                                                                    seatCount
                                                                ]?.paxId,
                                                            });
                                                            seatCount += 1; // Increment the count

                                                            return seatDetails;
                                                        }
                                                    ),
                                            };
                                        }
                                    })
                                    .filter((arr) => arr != null),
                        };
                    }
                ),
            };

            const response = await axios.post(
                `/orders/flight/ancillaries/add`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setShowContacts(true);
            setIsLoading(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
            console.log(err);
        }
    };
    return (
        <div className="p-2">
            <h1 className="pb-2">Add Ons</h1>
            {flightAncillaries.priceQuoteResponse ? (
                <div className="border p-10 flex flex-col gap-10">
                    {flightAncillaries?.mealsSsr?.length > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="text-3xl text-green-500">
                                    <GiMeal />{" "}
                                </div>
                                <div>
                                    {" "}
                                    <div className="text-blue-900 font-semibold">
                                        Add Meals
                                    </div>{" "}
                                    <div>Meals are cheaper when pre-booked</div>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="px-5"
                                    onClick={(e) => {
                                        setIsMealModal(true);
                                    }}
                                >
                                    view price
                                </button>
                            </div>
                        </div>
                    )}
                    {flightAncillaries?.seatSsr?.length > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="text-3xl text-yellow-500">
                                    <MdOutlineAirlineSeatReclineExtra />{" "}
                                </div>
                                <div>
                                    {" "}
                                    <div className="text-blue-900 font-semibold">
                                        Add Seat
                                    </div>{" "}
                                    <div>Seat are cheaper when pre-booked</div>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="px-5"
                                    onClick={(e) => {
                                        setIsSeatModal(true);
                                    }}
                                >
                                    view price
                                </button>
                            </div>
                        </div>
                    )}
                    {flightAncillaries?.baggageSsr?.length > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="text-3xl text-orange-500">
                                    <BsFillBagFill />{" "}
                                </div>{" "}
                                <div>
                                    {" "}
                                    <div className="text-blue-900 font-semibold">
                                        Add Baggage
                                    </div>{" "}
                                    <div>
                                        Baggage are cheaper when pre-booked
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="px-5"
                                    onClick={(e) => {
                                        setIsBaggageModal(true);
                                    }}
                                >
                                    view price
                                </button>
                            </div>
                        </div>
                    )}
                    {error && (
                        <span className="text-sm block text-red-500 mt-2">
                            {error}
                        </span>
                    )}
                    <button className="w-[150px]" onClick={handleSubmit}>
                        {isLoading ? <BtnLoader /> : "Submit"}
                    </button>
                </div>
            ) : (
                <PageLoader />
            )}
            {isMealModal && (
                <FlightAddMealModal
                    setIsModal={setIsMealModal}
                    mealSsr={flightAncillaries?.mealsSsr}
                    totalPax={totalAncillariesPax}
                />
            )}
            {isBaggageModal && (
                <FlightBaggageModal
                    setIsModal={setIsBaggageModal}
                    baggageSsr={flightAncillaries?.baggageSsr}
                    totalPax={totalAncillariesPax}
                />
            )}{" "}
            {isSeatModal && (
                <FlightSeatModal
                    setIsModal={setIsSeatModal}
                    seatSsr={flightAncillaries?.seatSsr}
                    totalPax={totalAncillariesPax}
                />
            )}
        </div>
    );
}
