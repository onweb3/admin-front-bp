import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { BsClipboardPlus } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

import {
    addNewMultiHotel,
    removeHotel,
    removeMultiHotel,
    clearTransferDetails,
    handleTransferClear,
} from "../../redux/slices/quotationSlice";
import { formatDate } from "../../utils";
import HotelAlreadyAvailableSearchModal from "./HotelAlreadyAvailableSearchModal";
import HotelSearchModal from "./HotelSearchModal";
import StayMultiHotelForm from "./StayMultiHotelForm";

const tourFee = {
    "2 star": 10,
    "3 star": 10,
    "4 star": 15,
    "5 star": 20,
    "7 star": 20,
    apartment: 0,
};

export default function SingleHotelForm({ stay, stayIndex }) {
    const dispatch = useDispatch();
    const { hotelQt, isAlreadyBooked, checkInDate, checkOutDate } = useSelector(
        (state) => state.quotations
    );
    const [isModal, setIsModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    console.log(
        formatDate(new Date(checkOutDate)),
        formatDate(
            new Date(stay?.hotels[stay?.hotels?.length - 1]?.checkOutDate)
        ),

        "datess"
    );
    return (
        <div className="border border-dashed p-5 mt-7 bg-[#f9f9f9]">
            <div className="mb-7 flex items-center justify-between gap-[10px]">
                <h2 className="text-[15px] font-[500]">Stay {stayIndex + 1}</h2>
                <button
                    type="button"
                    className="p-0 h-auto text-red-500 text-lg"
                    onClick={(e) => {
                        dispatch(removeHotel(stayIndex));
                        dispatch(handleTransferClear());
                    }}
                >
                    <IoMdClose />
                </button>
            </div>
            <div className="">
                {stay?.hotels?.map((hotel, hotelIndex) => (
                    <StayMultiHotelForm
                        key={hotel.hotelId}
                        stay={stay}
                        hotelIndex={hotelIndex}
                        hotel={hotel}
                        stayIndex={stayIndex}
                        setIsModal={setIsModal}
                        setIsEdit={setIsEdit}
                        isEdit={isEdit}
                        isModal={isModal}
                    />
                ))}

                {formatDate(
                    new Date(
                        stay?.hotels[stay?.hotels?.length - 1]?.checkOutDate
                    )
                ) === formatDate(new Date(checkOutDate)) ? (
                    ""
                ) : (
                    <div className=" h-[180px] border-dashed border p-5 bg-stone-200">
                        <div className=" h-full w-full  ">
                            <div
                                className="h-full w-full border border-dashed bg-stone-100 "
                                onClick={() => {
                                    setIsModal(true);
                                    setIsEdit(false);
                                    // dispatch(addNewMultiHotel(stayIndex));
                                    // dispatch(
                                    //     clearTransferDetails({ name: "transfers" })
                                    // );
                                    dispatch(handleTransferClear());
                                }}
                            >
                                <div className=" flex h-full flex-col items-center justify-center text-blue-500 hover:text-blue-300 ">
                                    <p className="text-4xl">
                                        <BsClipboardPlus />
                                    </p>
                                    <p className="text-[15px] pt-2 text-gray-700">
                                        Add hotel
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isModal && !isEdit ? (
                isAlreadyBooked ? (
                    <HotelAlreadyAvailableSearchModal
                        stay={stay}
                        stayIndex={stayIndex}
                        setIsModal={setIsModal}
                        edit={false}
                        setIsEdit={setIsEdit}
                    />
                ) : (
                    <HotelSearchModal
                        stay={stay}
                        stayIndex={stayIndex}
                        setIsModal={setIsModal}
                        edit={false}
                        setIsEdit={setIsEdit}
                    />
                )
            ) : (
                ""
            )}

            {/* {isModal && !isEdit ? (
                <HotelSearchModal
                    stay={stay}
                    stayIndex={stayIndex}
                    setIsModal={setIsModal}
                    edit={false}
                    setIsEdit={setIsEdit}
                />
            ) : (
                ""
            )} */}
        </div>
    );
}
