import React, { useState } from "react";
import { MdOutlineAccessTime } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { FaCar } from "react-icons/fa";

import TourPackageActivityAddModal from "./TourPackageActivityAddModal";
import {
    handleTPackageItinerariesDataChange,
    removeTPackageItineraryItems,
} from "../../../redux/slices/tourPackageFormSlice";
import { config } from "../../../constants";

export default function TourPackageActivitiesRow({ itinerary, itineraryIndex }) {
    const [isAddItineraryModalOpen, setIsItineraryModalOpen] = useState(false);

    const dispatch = useDispatch();

    return (
        <div className="mb-10 last:mb-0">
            <div className="flex items-center gap-4 mb-3">
                <h3 className="font-[600] text-[14px] uppercase">Day {itineraryIndex + 1}</h3>
                <button
                    className="h-auto px-3 bg-orange-500"
                    onClick={() => setIsItineraryModalOpen(true)}
                >
                    + Add Activity
                </button>
            </div>

            <div className="mb-3">
                <label htmlFor="">Title</label>
                <input
                    type="text"
                    placeholder="Enter Title"
                    name="title"
                    value={itinerary?.title || ""}
                    onChange={(e) => {
                        dispatch(
                            handleTPackageItinerariesDataChange({
                                itineraryIndex,
                                name: "title",
                                value: e.target.value,
                            })
                        );
                    }}
                />
            </div>

            {isAddItineraryModalOpen && (
                <TourPackageActivityAddModal
                    setIsItineraryModalOpen={setIsItineraryModalOpen}
                    itineraryIndex={itineraryIndex}
                />
            )}

            {itinerary?.itineraryItems?.length < 1 ? (
                <span className="text-sm text-grayColor font-medium">No Activities Added</span>
            ) : (
                itinerary?.itineraryItems?.map((itineraryItem, itineraryItemIndex) => {
                    return (
                        <div key={itineraryItemIndex} className="flex items-start mt-10 gap-4">
                            <div className="w-[100px] h-[60px] rounded overflow-hidden bg-grayColor">
                                <img
                                    src={
                                        config.SERVER_URL +
                                        itineraryItem?.activity?.attraction?.image
                                    }
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="border p-3 w-full relative">
                                <h4 className="font-[500] text-sm mb-1">
                                    {itineraryItem?.itineraryName}
                                </h4>
                                <div className="flex items-center flex-wrap gap-3 text-[13px]">
                                    <span className="flex items-center gap-1">
                                        <FaCar />
                                        {itineraryItem?.transferType}{" "}
                                        {itineraryItem?.transferType === "private" &&
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
                                <span className="block mt-1 text-[13px] font-medium text-green-600">
                                    {itineraryItem?.price} AED
                                </span>

                                <div className="absolute bottom-[100%] right-0">
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
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
