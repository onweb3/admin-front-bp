import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { FaStar } from "react-icons/fa";

import HotelAmenityModal from "./HotelAmenityModal";
import { removeSelectedHotelAmenity } from "../../../redux/slices/hotelFormSlice";

export default function HotelAmenityForm({ selectedSection }) {
    const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);

    const dispatch = useDispatch();
    const { selectedAmenities } = useSelector((state) => state.hotelForm);

    return (
        <div className={selectedSection === "-amenities" ? "block" : "hidden"}>
            <div className="">
                <div className="flex items-center justify-between">
                    <h1 className="font-[600] flex items-center gap-[10px]">
                        <BsFillArrowRightCircleFill /> Hotel Amenities
                    </h1>
                    <button
                        className="flex items-center gap-[8px] px-3"
                        onClick={() => setIsAmenityModalOpen(true)}
                    >
                        + Add New
                    </button>
                </div>
                {selectedAmenities?.length < 1 ? (
                    <div className="text-center">
                        <span className="font-medium text-sm text-grayColor">
                            No Amenities Selected..!
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-[10px] flex-wrap mt-2">
                        {selectedAmenities?.map((item, index) => {
                            return (
                                <span
                                    key={index}
                                    className="bg-[#f3f6f9] rounded px-2 py-1 text-sm flex items-center gap-[10px]"
                                >
                                    <span className="capitalize">{item?.name}</span>
                                    {item?.isPaid && (
                                        <span className="font-medium text-green-500" >
                                            $
                                        </span>
                                    )}
                                    {item?.isFeatured && (
                                        <span className="font-medium text-yellow-500" >
                                            <FaStar />
                                        </span>
                                    )}
                                    <span
                                        className="text-base cursor-pointer text-red-500"
                                        onClick={() => {
                                            dispatch(
                                                removeSelectedHotelAmenity(
                                                    item?.amenity
                                                )
                                            );
                                        }}
                                    >
                                        <MdClose />
                                    </span>
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
            {isAmenityModalOpen && (
                <HotelAmenityModal
                    setIsAmenityModalOpen={setIsAmenityModalOpen}
                />
            )}
        </div>
    );
}
