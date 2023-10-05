import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";

export default function HotelEditFormButtons({ next, prev, newImages, goBack, goForward }) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        details,
        description,
        faqs,
        selectedAmenities,
        accountsContacts,
        salesContacts,
        reservationsContacts,
        hotelContacts,
        images,
        restaurants,
        bars,
    } = useSelector((state) => state.hotelForm);
    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { id } = useParams();

    const handleSubmit = async (e) => {
        try {
            setIsLoading(true);
            setError("");

            const formData = new FormData();

            formData.append("hotelName", details?.hotelName);
            formData.append("address", details?.address);
            formData.append("street", details?.street);
            formData.append("postalCode", details?.postalCode);
            formData.append("latitude", details?.latitude);
            formData.append("longitude", details?.longitude);
            formData.append("checkInTime", details?.checkInTime);
            formData.append("checkOutTime", details?.checkOutTime);
            formData.append("website", details?.website);
            formData.append("roomsCount", details?.roomsCount);
            formData.append("floorsCount", details?.floorsCount);
            formData.append("carParkingSlots", details?.carParkingSlots);
            formData.append("starCategory", details?.starCategory);
            formData.append("description", description);
            formData.append("faqs", JSON.stringify(faqs));
            formData.append("amenities", JSON.stringify(selectedAmenities));
            formData.append("landMark", details?.landMark);
            formData.append("country", details?.country);
            formData.append("state", details?.state);
            formData.append("city", details?.city);
            formData.append("area", details?.area);
            formData.append("distanceFromCity", details?.distanceFromCity);
            formData.append("openDays", JSON.stringify(details?.openDays));
            formData.append("accountsContacts", JSON.stringify(accountsContacts));
            formData.append("salesContacts", JSON.stringify(salesContacts));
            formData.append("reservationsContacts", JSON.stringify(reservationsContacts));
            formData.append("hotelContacts", JSON.stringify(hotelContacts));
            formData.append("isContractAvailable", details.isContractAvailable);
            formData.append("accommodationType", details.accommodationType);
            formData.append("isApiConnected", details.isApiConnected);
            formData.append("connectedApis", JSON.stringify(details.connectedApis));
            formData.append("boardTypes", JSON.stringify(details.boardTypes));

            formData.append("oldImages", JSON.stringify(images));
            formData.append("hbId", details.hbId);
            formData.append("hotelChain", details.hotelChain);
            formData.append("restaurants", JSON.stringify(restaurants));
            formData.append("bars", JSON.stringify(bars));
            formData.append("isActive", details?.isActive);
            formData.append("allGuestDetailsRequired", details?.allGuestDetailsRequired);

            for (let i = 0; i < newImages?.length; i++) {
                formData.append("images", newImages[i]);
            }

            await axios.patch(`/hotels/update/${id}`, formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate(-1);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
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
                {/* {update && ( */}
                <button
                    className="w-[130px] bg-primaryColor"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? <BtnLoader /> : details?.isPublished ? "Update" : "Publish"}
                </button>
                {/* )} */}
                {next === true && (
                    <button className="w-[130px]" onClick={goForward}>
                        Next
                    </button>
                )}
            </div>
        </div>
    );
}
