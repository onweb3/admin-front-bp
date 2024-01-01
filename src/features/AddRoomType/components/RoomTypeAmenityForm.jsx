import React, { useState } from "react";
import { BiPencil } from "react-icons/bi";
import { BsFillArrowRightCircleFill } from "react-icons/bs";

import RoomTypeAmenitiesModal from "./RoomTypeAmenitiesModal";

export default function RoomTypeAmenityForm({
    amenities,
    selectedAmenities,
    setSelectedAmenities,
    isEditPermission = true,
}) {
    const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);

    return (
        <div>
            <div>
                <div className="flex items-center justify-between">
                    <h1 className="font-[600] flex items-center gap-[10px]">
                        <BsFillArrowRightCircleFill /> Room Type Amenities
                    </h1>
                    {isEditPermission && (
                        <button
                            className="flex items-center gap-[8px] px-3 bg-primaryColor"
                            onClick={() => {
                                setIsAmenitiesModalOpen(true);
                            }}
                            type="button"
                        >
                            <BiPencil /> Edit
                        </button>
                    )}
                </div>
                {selectedAmenities?.length < 1 ? (
                    <div className="text-center">
                        <span className="font-medium text-sm text-grayColor">No Amenities Selected..!</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-[10px] flex-wrap mt-2">
                        {amenities?.map((item, index) => {
                            if (selectedAmenities?.includes(item?._id)) {
                                return (
                                    <span key={index} className="bg-[#f3f6f9] rounded px-2 py-1 text-sm">
                                        <span>{item?.name}</span>
                                    </span>
                                );
                            } else {
                                return <></>;
                            }
                        })}
                    </div>
                )}
            </div>
            {isAmenitiesModalOpen && (
                <RoomTypeAmenitiesModal
                    setIsAmenitiesModalOpen={setIsAmenitiesModalOpen}
                    selectedAmenities={selectedAmenities}
                    setSelectedAmenities={setSelectedAmenities}
                    amenities={amenities}
                />
            )}
        </div>
    );
}
