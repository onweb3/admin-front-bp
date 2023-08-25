import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";

export default function RoomTypeAmenitiesModal({
    setIsAmenitiesModalOpen,
    amenities,
    selectedAmenities,
    setSelectedAmenities,
}) {
    const [searchQuery, setSearchQuery] = useState("");

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsAmenitiesModalOpen(false));

    const filteredData = searchQuery
        ? amenities?.filter((item) =>
              item.name?.toLowerCase().includes(searchQuery?.toLowerCase())
          )
        : amenities;

    const removeSelectedAmenity = (id) => {
        const filteredAmenitis = selectedAmenities?.filter((item) => {
            return item !== id;
        });
        setSelectedAmenities(filteredAmenitis);
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full h-[80vh] max-h-[80vh] rounded max-w-[900px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Edit Room Type Amenities</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsAmenitiesModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>

                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Search here..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="grid grid-cols-5 gap-3 mt-5">
                        {filteredData?.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-[10px]"
                                >
                                    <input
                                        type="checkbox"
                                        className="w-[16px] h-[16px]"
                                        id={item?.name + index}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedAmenities((prev) => {
                                                    return [...prev, item?._id];
                                                });
                                            } else {
                                                removeSelectedAmenity(
                                                    item?._id
                                                );
                                            }
                                        }}
                                        checked={selectedAmenities?.includes(
                                            item?._id
                                        )}
                                    />
                                    <label
                                        htmlFor={item?.name + index}
                                        className="mb-0"
                                    >
                                        {item?.name}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
