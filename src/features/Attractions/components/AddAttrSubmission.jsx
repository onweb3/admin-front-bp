import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearLocalStorageAttraction } from "../../../redux/slices/attractionFormSlice";
import { useDispatch } from "react-redux";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";

export default function AddAttrSubmission({
  setSection,
  newImages,
  prev,
  next,
  logoImg,
}) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data, availability, faqs, offDates } = useSelector(
    (state) => state.attractionForm
  );
  const { jwtToken } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", data?.title);
      formData.append("bookingType", data?.bookingType);
      formData.append("destination", data?.destination);
      formData.append("category", data?.category);
      formData.append("durationType", data?.durationType);
      formData.append("duration", data?.duration);
      formData.append("mapLink", data?.mapLink);
      formData.append("isOffer", data?.isOffer);
      formData.append("offerAmountType", data?.offerAmountType);
      formData.append("offerAmount", data?.offerAmount);
      formData.append("isCustomDate", data?.isCustomDate);
      formData.append("startDate", data?.startDate);
      formData.append("endDate", data?.endDate);
      formData.append("youtubeLink", data?.youtubeLink);
      formData.append("highlights", data?.highlights);
      formData.append("itineraryDescription", data?.itineraryDescription);
      formData.append("sections", JSON.stringify(data?.sections));
      formData.append("availability", JSON.stringify(availability));
      formData.append("faqs", JSON.stringify(faqs));
      formData.append("isApiConnected", data?.isApiConnected);
      formData.append("connectedApi", data?.connectedApi);
      formData.append("cancellationType", data?.cancellationType);
      formData.append("cancelBeforeTime", data?.cancelBeforeTime);
      formData.append("cancellationFee", data?.cancellationFee);
      formData.append("bookingPriorDays", data?.bookingPriorDays);
      formData.append("offDates", JSON.stringify(offDates));
      formData.append("isCombo", data?.isCombo);
      formData.append("country", data?.country);
      formData.append("city", data?.city);
      formData.append("area", data?.area);
      formData.append("state", data?.state);
      formData.append("longitude", data?.longitude);
      formData.append("latitude", data?.latitude);
      formData.append("displayOrder", data?.displayOrder);

      for (let i = 0; i < newImages?.length; i++) {
        formData.append("images", newImages[i]);
      }
      formData.append("logo", logoImg);

      await axios.post("/attractions/create", formData, {
        headers: { authorization: `Bearer ${jwtToken}` },
      });

      setIsLoading(false);
      navigate("/attractions");
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong, Try again");
      setIsLoading(false);
    }
  };

  let attrLocalData = JSON.parse(localStorage.getItem("attractionData"));

  return (
    <div>
      {error && (
        <span className="text-sm text-red-500 block mt-4">{error}</span>
      )}

      <div className="mt-4 flex items-center justify-end gap-[12px]">
        {attrLocalData?.title ||
        attrLocalData?.destination ||
        attrLocalData?.category ||
        attrLocalData?.duration ||
        attrLocalData?.city ||
        attrLocalData?.mapLink ? (
          <div>
            <button
              className="bg-red-500 w-32"
              onClick={() => {
                dispatch(clearLocalStorageAttraction());
              }}
            >
              Clear Draft
            </button>
          </div>
        ) : (
          ""
        )}
        {prev ? (
          <button
            className="bg-slate-300 text-textColor px-[15px]"
            type="button"
            onClick={() => setSection((prev) => prev - 1)}
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
            onClick={() => setSection((prev) => prev + 1)}
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
