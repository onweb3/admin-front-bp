import React, { useState } from "react";
import { TbArrowNarrowRight, TbArrowsExchange2 } from "react-icons/tb";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../utils";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import { useSelector } from "react-redux";
import FlightAddMealModal from "./FlightAddMealsModal";

export default function FlightAddOns({ flightAncillaries }) {
    const { singleFlightDetails, totalAncillariesPax } = useSelector(
        (state) => state.flightOrder
    );
    console.log(singleFlightDetails, "dsss");
    const [isMealModal, setIsMealModal] = useState(false);
    const [isSeatModal, setIsSeatModal] = useState(false);
    const [isLuggageModal, setIsLuggageModal] = useState(false);
    console.log(flightAncillaries, "ancillaires");

    return (
        <div className="p-5">
            <h1 className="pb-5">Add Ons</h1>

            <div className="border p-10 flex flex-col gap-10">
                {flightAncillaries?.mealsSsr?.length > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <div>icon </div>
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

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div>icon </div>
                        <div>
                            {" "}
                            <div className="text-blue-900 font-semibold">
                                Add Seat
                            </div>{" "}
                            <div>Seat are cheaper when pre-booked</div>
                        </div>
                    </div>
                    <div>
                        <button className="px-5">view price</button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div>icon </div>
                        <div>
                            {" "}
                            <div className="text-blue-900 font-semibold">
                                Add Baggage
                            </div>{" "}
                            <div>Baggage are cheaper when pre-booked</div>
                        </div>
                    </div>
                    <div>
                        <button className="px-5">view price</button>
                    </div>
                </div>
            </div>
            {isMealModal && (
                <FlightAddMealModal
                    setIsModal={setIsMealModal}
                    mealSsr={flightAncillaries?.mealsSsr}
                    totalPax={totalAncillariesPax}
                />
            )}
        </div>
    );
}
