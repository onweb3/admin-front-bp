import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addHotel,
    handleHotelDisabledRemarkChange,
    updateIsHotelQuotationDisabled,
    updateIsTourismFeeIncluded,
    handleQuotationDisableChange,
    handleTransferClear,
    clearHotelDetails,
} from "../../redux/slices/quotationSlice";
import SingleHotelForm from "./SingleHotelForm";

import "react-datepicker/dist/react-datepicker.css";

export default function HotelQuotationForm() {
    const {
        hotelQt,
        isHotelQuotationDisabled,
        hotelDisabledRemark,
        isAlreadyBooked,
        isTourismFeeIncluded,
    } = useSelector((state) => state.quotations);
    const dispatch = useDispatch();

    return (
        <div>
            <div className="flex items-center mb-7 gap-4">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={!isHotelQuotationDisabled}
                    onChange={(e) =>
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isHotelQuotationDisabled",
                                value: !e.target.checked,
                            })
                        )
                    }
                />
                <h1 className="text-base font-[600]  text-blue-500">
                    Hotel Quotation
                </h1>
            </div>

            {isHotelQuotationDisabled === false ? (
                <>
                    <div className="flex justify-center items-center bg-gray-200 p-5 ">
                        <div class="flex justi items-center  border border-dashed bg-stone-100 p-5 w-full">
                            <div class="w-full ">
                                <div className="flex items-center justify-center pb-4">
                                    <p className="font-500 text-md text-orange-600 w-full">
                                        {" "}
                                        Is Hotel Already Booked ?
                                    </p>
                                    <div class="flex justify-evenly items-center w-full">
                                        <div class="flex justify-center items-center gap-4">
                                            <input
                                                type="radio"
                                                id="bookHotel"
                                                name="isAlreadyBooked"
                                                className="w-[18px] h-[18px]"
                                                checked={isAlreadyBooked}
                                                onChange={(e) => {
                                                    dispatch(
                                                        handleQuotationDisableChange(
                                                            {
                                                                name: "isAlreadyBooked",
                                                                value: e.target
                                                                    .checked,
                                                            }
                                                        )
                                                    );
                                                    dispatch(
                                                        clearHotelDetails()
                                                    );
                                                    dispatch(
                                                        handleTransferClear()
                                                    );
                                                }}
                                            />
                                            <label
                                                htmlFor=""
                                                className="w-[100%] max-w-[180px] flex items-center"
                                            >
                                                <p class="whitespace-nowrap">
                                                    Yes Booked
                                                </p>
                                            </label>
                                        </div>
                                        <div class="flex justify-center items-center gap-4">
                                            <input
                                                type="radio"
                                                id="alreadyBooked"
                                                name="isAlreadyBooked"
                                                checked={!isAlreadyBooked}
                                                className="w-[18px] h-[18px]"
                                                onChange={(e) => {
                                                    dispatch(
                                                        handleQuotationDisableChange(
                                                            {
                                                                name: "isAlreadyBooked",
                                                                value: !e.target
                                                                    .checked,
                                                            }
                                                        )
                                                    );
                                                    dispatch(
                                                        clearHotelDetails()
                                                    );
                                                    dispatch(
                                                        handleTransferClear()
                                                    );
                                                }}
                                            />
                                            <label
                                                htmlFor=""
                                                className="w-[100%] max-w-[180px] flex items-center"
                                            >
                                                <p class="whitespace-nowrap">
                                                    Not Booked
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center pb-4">
                                    <p className="font-500 text-md text-orange-600 w-full">
                                        {" "}
                                        Is Tourisum Fee Required ?
                                    </p>
                                    <div class="flex justify-evenly items-center w-full">
                                        <div class="flex justify-center items-center gap-4">
                                            <input
                                                type="radio"
                                                id="bookHotel"
                                                name="isTourismFeeIncluded"
                                                className="w-[18px] h-[18px]"
                                                checked={isTourismFeeIncluded}
                                                onChange={(e) => {
                                                    dispatch(
                                                        handleQuotationDisableChange(
                                                            {
                                                                name: "isTourismFeeIncluded",
                                                                value: e.target
                                                                    .checked,
                                                            }
                                                        )
                                                    );
                                                    dispatch(
                                                        clearHotelDetails()
                                                    );
                                                    dispatch(
                                                        handleTransferClear()
                                                    );
                                                }}
                                            />
                                            <label
                                                htmlFor=""
                                                className="w-[100%] max-w-[180px] flex items-center"
                                            >
                                                <p class="whitespace-nowrap">
                                                    Yes
                                                </p>
                                            </label>
                                        </div>
                                        <div class="flex justify-center items-center gap-4">
                                            <input
                                                type="radio"
                                                id="alreadyBooked"
                                                name="isTourismFeeIncluded"
                                                checked={!isTourismFeeIncluded}
                                                className="w-[18px] h-[18px]"
                                                onChange={(e) => {
                                                    dispatch(
                                                        handleQuotationDisableChange(
                                                            {
                                                                name: "isTourismFeeIncluded",
                                                                value: !e.target
                                                                    .checked,
                                                            }
                                                        )
                                                    );
                                                    dispatch(
                                                        clearHotelDetails()
                                                    );
                                                    dispatch(
                                                        handleTransferClear()
                                                    );
                                                }}
                                            />
                                            <label
                                                htmlFor=""
                                                className="w-[100%] max-w-[180px] flex items-center"
                                            >
                                                <p class="whitespace-nowrap">
                                                    No
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {hotelQt?.stays?.map((stay, stayIndex) => {
                        return (
                            <SingleHotelForm
                                key={stayIndex}
                                stay={stay}
                                stayIndex={stayIndex}
                            />
                        );
                    })}
                    <button
                        type="button"
                        className="text-blue-500 font-medium text-sm underline"
                        onClick={() => {
                            dispatch(addHotel());
                            dispatch(handleTransferClear());
                        }}
                    >
                        Add New Stay
                    </button>
                </>
            ) : (
                ""
            )}

            {/* <div className="flex items-center gap-[10px] mt-5">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={isHotelQuotationDisabled}
                    onChange={(e) =>
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isHotelQuotationDisabled",
                                value: e.target.checked,
                            })
                        )
                    }
                />
                <label htmlFor="" className="mb-0">
                    Please check this box if you don't need hotel quotation
                </label>
            </div>
            {isHotelQuotationDisabled && (
                <div className="flex items-start gap-[2em] mt-6">
                    <label htmlFor="" className="w-[100%] max-w-[180px]">
                        Remark
                    </label>
                    <textarea
                        name=""
                        id=""
                        placeholder="Enter hotel quotation disabled remark"
                        value={hotelDisabledRemark || ""}
                        onChange={(e) =>
                            dispatch(
                                handleHotelDisabledRemarkChange(e.target.value)
                            )
                        }
                        className="h-[100px]"
                    ></textarea>
                </div>
            )} */}
        </div>
    );
}
