import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { SelectDropdown } from "../../../components";
import { addTourPackageHotelOption } from "../../../redux/slices/tourPackageFormSlice";

export default function TourPackageHotelAddModal({
    hotels,
    isHotelLoading,
    setIsHotelSelectModalOpen,
    tpHotelIndex,
}) {
    const [hotelData, setHotelData] = useState({
        hotelId: "",
        hotel: {},
        roomTypeId: "",
        roomType: {},
        boardCode: "",
        price: "",
    });

    const { data } = useSelector((state) => state.tourPackageForm);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsHotelSelectModalOpen(false));
    const dispatch = useDispatch();

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Select Hotel</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsHotelSelectModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <div>
                        <label htmlFor="">Hotel *</label>
                        <SelectDropdown
                            data={hotels || []}
                            valueName={"_id"}
                            displayName={"hotelName"}
                            selectedData={hotelData.hotelId}
                            setSelectedData={(val) => {
                                const hotel = hotels?.find((item) => {
                                    return item?._id === val;
                                });
                                if (hotel) {
                                    setHotelData((prev) => {
                                        return {
                                            ...prev,
                                            hotelId: val,
                                            hotel,
                                            roomTypeId: "",
                                            roomType: {},
                                            boardCode: "",
                                        };
                                    });
                                }
                            }}
                            placeholder="Select Hotel"
                        />
                        {isHotelLoading && (
                            <span className="text-sm text-grayColor">
                                Hotel Loading...
                            </span>
                        )}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Room Type *</label>
                        <SelectDropdown
                            data={hotelData.hotel?.roomTypes || []}
                            valueName={"_id"}
                            displayName={"roomName"}
                            selectedData={hotelData.roomTypeId}
                            setSelectedData={(val) => {
                                const rmType = hotelData.hotel?.roomTypes?.find(
                                    (item) => {
                                        return item?._id === val;
                                    }
                                );
                                if (rmType) {
                                    setHotelData((prev) => {
                                        return {
                                            ...prev,
                                            roomTypeId: val,
                                            roomType: rmType,
                                        };
                                    });
                                }
                            }}
                            placeholder="Select Room Type"
                            disabled={!hotelData.hotelId || !hotelData.hotel}
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Board Type *</label>
                        <SelectDropdown
                            data={hotelData.hotel?.boardTypes || []}
                            valueName={"boardShortName"}
                            displayName={"boardName"}
                            selectedData={hotelData.boardCode}
                            setSelectedData={(val) => {
                                setHotelData((prev) => {
                                    return { ...prev, boardCode: val };
                                });
                            }}
                            placeholder="Select Board Type"
                            disabled={!hotelData.hotelId || !hotelData.hotel}
                        />
                    </div>
                    {data?.packageType === "dynamic" && (
                        <div className="mt-4">
                            <label htmlFor="">Price *</label>
                            <input
                                type="number"
                                placeholder="Enter Price"
                                value={hotelData.price || ""}
                                onChange={(e) => {
                                    setHotelData((prev) => {
                                        return {
                                            ...prev,
                                            price: e.target.value,
                                        };
                                    });
                                }}
                            />
                        </div>
                    )}
                    <div className="flex items-center justify-end mt-5">
                        <button
                            className="w-[140px]"
                            onClick={() => {
                                dispatch(
                                    addTourPackageHotelOption({
                                        index: tpHotelIndex,
                                        data: hotelData,
                                    })
                                );
                                setIsHotelSelectModalOpen(false);
                            }}
                            disabled={
                                isHotelLoading ||
                                !hotelData.hotelId ||
                                !hotelData.roomTypeId ||
                                !hotelData.boardCode
                            }
                        >
                            Add Hotel
                        </button>
                    </div>
                    {/* <div className="grid grid-cols-6 gap-4">
                        {filteredHotels?.map((hotel, hotelIndex) => {
                            return (
                                <div key={hotelIndex}>
                                    <div className="rounded overflow-hidden mb-1 aspect-[3/2] bg-gray-400">
                                        <img
                                            src={
                                                hotel?.image?.isRelative === true
                                                    ? import.meta.env.VITE_SERVER_URL + hotel?.image?.path
                                                    : hotel?.image?.path
                                            }
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h4 className="text-sm font-medium">{hotel?.hotelName}</h4>
                                    <span className="capitalize text-[13px]">
                                        {hotel?.city?.cityName}, {hotel?.state?.stateName},{" "}
                                        {hotel?.country?.countryName}
                                    </span>
                                </div>
                            );
                        })}
                    </div> */}
                </div>
            </div>
        </div>
    );
}
