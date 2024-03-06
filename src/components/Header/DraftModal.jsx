import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useHandleClickOutside } from "../../hooks";

function DraftModal({ setDraftModal, draftModal }) {
  const navigate = useNavigate();

  const wrapperRef = useRef();
  useHandleClickOutside(wrapperRef, () => {
    setDraftModal(false);
  });

  let hotelDetailsObject = JSON.parse(localStorage.getItem("hotelDetails"));
  let attrDraft = JSON.parse(localStorage.getItem("attractionData"));
  return (
    <div>
      <div
        ref={wrapperRef}
        className="absolute p-3 border  z-10 right-0 bg-white shadow-[0_5px_10px_rgb(30_32_37_/_12%)] rounded min-w-[180px] w-[300px] py-2"
      >
        <div className="grid gap-1">
          {hotelDetailsObject?.hotelName ||
          hotelDetailsObject?.address ||
          hotelDetailsObject?.postalCode ||
          hotelDetailsObject?.carParkingSlots ||
          hotelDetailsObject?.country ||
          hotelDetailsObject?.state ||
          hotelDetailsObject?.starCategory ||
          hotelDetailsObject?.landMark ||
          hotelDetailsObject?.longitude ||
          hotelDetailsObject?.latitude ||
          hotelDetailsObject?.city ||
          hotelDetailsObject?.area ||
          hotelDetailsObject?.website ||
          hotelDetailsObject?.starCategory ||
          hotelDetailsObject?.floorsCount ? (
            <div
              className=" cursor-pointer p-1 hover:bg-gray-100"
              onClick={() => {
                navigate("/hotels/add");
              }}
            >
              <h1>
                Add Hotel{" "}
                <span className="text-xs">
                  ({hotelDetailsObject?.hotelName})
                </span>{" "}
              </h1>
            </div>
          ) : (
            ""
          )}

          {attrDraft?.title ||
          attrDraft?.destination ||
          attrDraft?.category ||
          attrDraft?.duration ||
          attrDraft?.country ||
          attrDraft?.area ||
          attrDraft?.itineraryDescription ||
          attrDraft?.city ||
          attrDraft?.mapLink ? (
            <div
              className=" cursor-pointer p-1 hover:bg-gray-100"
              onClick={() => {
                navigate("/attractions/add");
              }}
            >
              <h1>
                Add Attraction{" "}
                <span className="text-xs">({attrDraft?.title})</span>{" "}
              </h1>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default DraftModal;
