import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearHotelDraft } from "../../../redux/slices/hotelFormSlice";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";

export default function HotelAddFormButtons({
  next,
  prev,
  newImages,
  goForward,
  goBack,
}) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { jwtToken } = useSelector((state) => state.admin);
  const {
    details,
    description,
    faqs,
    selectedAmenities,
    accountsContacts,
    salesContacts,
    reservationsContacts,
    hotelContacts,
    restaurants,
    bars,
  } = useSelector((state) => state.hotelForm);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      console.log(selectedAmenities);

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
      formData.append(
        "reservationsContacts",
        JSON.stringify(reservationsContacts)
      );
      formData.append("hotelContacts", JSON.stringify(hotelContacts));
      formData.append("isContractAvailable", details.isContractAvailable);
      formData.append("accommodationType", details.accommodationType);
      formData.append("isApiConnected", details.isApiConnected);
      formData.append("connectedApis", JSON.stringify(details.connectedApis));
      formData.append("boardTypes", JSON.stringify(details.boardTypes));
      formData.append("hbId", details.hbId);
      // formData.append("ottilaId", details.ottilaId);
      formData.append("hotelChain", details.hotelChain);
      formData.append("restaurants", JSON.stringify(restaurants));
      formData.append("bars", JSON.stringify(bars));
      formData.append("isActive", details?.isActive);
      formData.append(
        "allGuestDetailsRequired",
        details?.allGuestDetailsRequired
      );

      for (let i = 0; i < newImages?.length; i++) {
        formData.append("images", newImages[i]);
      }

      await axios.post("/hotels/add", formData, {
        headers: { authorization: `Bearer ${jwtToken}` },
      });

      setIsLoading(false);
      navigate(-1);
      dispatch(clearHotelDraft());
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong, Try again");
      setIsLoading(false);
    }
  };

  let hotelDetails = localStorage.getItem("hotelDetails");
  let hotelDetailsObject = JSON.parse(hotelDetails);

  let hotelDescription = localStorage.getItem("hotelDescription");
  let hotelDescriptionObject = JSON.parse(hotelDescription);

  let hotelFaq = localStorage.getItem("hotelFaq");
  let hotelFaqObject = JSON.parse(hotelFaq);

  let hotelAmenety = localStorage.getItem("hotelAmeneties");
  let hotelAmenetyObject = JSON.parse(hotelAmenety);

  let hotelRestaurant = localStorage.getItem("hotelRestaurant");
  let hotelRestaurantObject = JSON.parse(hotelRestaurant);

  let hotelBars = localStorage.getItem("hotelBars");
  let hotelBarsObject = JSON.parse(hotelBars);

  let salesContact = localStorage.getItem("salesContacts");
  let salesObject = JSON.parse(salesContact);

  let accountContacts = localStorage.getItem("accountContacts");
  let accountContactObject = JSON.parse(accountContacts);

  let hotelContact = localStorage.getItem("hotelContacts");
  let hotelContactObject = JSON.parse(hotelContact);

  let reservationContacts = localStorage.getItem("reservationContacts");
  let reservationContactsObject = JSON.parse(reservationContacts);

  return (
    <div className="mt-8">
      {error && (
        <span className="text-sm text-red-500 block mt-4">{error}</span>
      )}

      <div className="mt-4 flex items-center justify-end gap-[12px]">
        <div>
          {hotelDetailsObject ||
          hotelDescriptionObject ||
          hotelFaqObject ||
          hotelAmenetyObject ||
          hotelRestaurantObject ||
          hotelBarsObject ||
          salesObject ||
          accountContactObject ||
          hotelContactObject ||
          reservationContactsObject ? (
            <button
              className="w-44 bg-red-500"
              onClick={() => {
                dispatch(clearHotelDraft());
              }}
            >
              Clear Draft
            </button>
          ) : (
            ""
          )}
        </div>
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
