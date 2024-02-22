import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";

export default function TourPackageAddFormButtons({
    next,
    prev,
    goForward,
    goBack,
    newImages,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);
    const {
        data,
        itineraries,
        tPackageHotels,
        availableDates,
        excludedDates,
        thumbnail,
    } = useSelector((state) => state.tourPackageForm);
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
                            attractionId: itinItem.activity?.attraction?._id,
                            activityId: itinItem.activityId,
                            transferType: itinItem.transferType,
                            vehicleTypeId: itinItem.vehicleTypeId || undefined,
                            itineraryName: itinItem.itineraryName,
                            description: itinItem.description,
                            price: itinItem.price,
                        };
                    }),
                };
            });

            const filteredHotels = tPackageHotels?.map((hotel) => {
                return {
                    ...hotel,
                    _id: undefined,
                    hotelOptions: hotel?.hotelOptions?.map((hotelOption) => {
                        return {
                            hotelId: hotelOption?.hotelId,
                            roomTypeId: hotelOption?.roomTypeId,
                            boardCode: hotelOption?.boardCode,
                            price: hotelOption?.price,
                        };
                    }),
                };
            });

            const formData = new FormData();
            formData.append("packageType", data?.packageType);
            formData.append("packageName", data?.packageName);
            formData.append("overveiw", data?.overveiw);
            formData.append(
                "packageThemes",
                JSON.stringify(data?.packageThemes)
            );
            formData.append("noOfDays", data?.noOfDays);
            formData.append("isCustomDate", data?.isCustomDate);
            formData.append("availableDates", JSON.stringify(availableDates));
            formData.append("excludedDates", JSON.stringify(excludedDates));
            formData.append("itineraries", JSON.stringify(filteredItineraries));
            formData.append("hotels", JSON.stringify(filteredHotels));
            formData.append("isAirportTransfer", data?.isAirportTransfer);
            formData.append("airportTransferPrice", data?.airportTransferPrice);
            formData.append("isInterHotelTransfer", data?.isInterHotelTransfer);
            formData.append("interHotelPrice", data?.interHotelPrice);
            formData.append("inclusions", data?.inclusions);
            formData.append("exclusions", data?.exclusions);
            formData.append("visaPolicy", data?.visaPolicy);
            formData.append("termsAndConditions", data?.termsAndConditions);
            formData.append("oldImages", JSON.stringify(data?.thumbnail || []));
            formData.append("country", data?.country);
            formData.append("destination", data?.destination);
            for (let i = 0; i < newImages?.length; i++) {
                formData.append("thumbnailImg", newImages[i]);
            }

            const response = await axios.post(`/tour-packages/add`, formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.error || "Something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8">
            {error && (
                <span className="text-sm text-red-500 block mt-4">{error}</span>
            )}

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
                    <button
                        className="w-[100px] bg-primaryColor"
                        type="button"
                        onClick={goForward}
                    >
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
