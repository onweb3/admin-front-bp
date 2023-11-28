import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";

export default function TourPackageAddFormButtons({ next, prev, goForward, goBack }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);
    const { data, itineraries, tPackageHotels, availableDates } = useSelector(
        (state) => state.tourPackageForm
    );
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setError("");
            setIsLoading(true);

            const filteredItineraries = itineraries?.map((itin) => {
                return {
                    ...itin,
                    itineraryItems: itin?.itineraryItems?.map((itinItem) => {
                        return {
                            // TODO:
                            // udpate this attraction id
                            attractionId: itinItem.activityId,
                            activityId: itinItem.activityId,
                            itineraryName: itinItem.itineraryName,
                            description: itinItem.description,
                        };
                    }),
                };
            });

            const filteredHotels = tPackageHotels?.map((hotel) => {
                return {
                    noOfNights: hotel?.noOfNights,
                    hotelOptions: hotel?.hotelOptions?.map((hotelOption) => {
                        return {
                            hotelId: hotelOption?.hotelId,
                            roomTypeId: hotelOption?.roomTypeId,
                            boardCode: hotelOption?.boardCode,
                        };
                    }),
                };
            });

            const response = await axios.post(
                `/tour-packages/add`,
                {
                    ...data,
                    itineraries: filteredItineraries,
                    availableDates,
                    hotels: filteredHotels,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.error || "Something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8">
            {error && <span className="text-sm text-red-500 block mt-4">{error}</span>}

            <div className="mt-4 flex items-center justify-end gap-[12px]">
                {prev ? (
                    <button
                        className="bg-slate-300 text-textColor px-[15px]"
                        type="button"
                        onClick={goBack}
                    >
                        Back
                    </button>
                ) : (
                    <button
                        className="bg-slate-300 text-textColor px-[15px]"
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                )}
                {next ? (
                    <button className="w-[100px] bg-primaryColor" type="button" onClick={goForward}>
                        next
                    </button>
                ) : (
                    <button
                        className="w-[100px] bg-primaryColor"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? <BtnLoader /> : "Submit"}
                    </button>
                )}
            </div>
        </div>
    );
}
