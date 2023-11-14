import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";

import {
    removeSelectedGuide,
    changeGuideCount,
    changeGuidePerPersonPrice,
} from "../../redux/slices/quotationSlice";

export default function SingleGuide({ guide }) {
    const {
        selectedExcursionsIds,
        selectedExcursions,
        excursions,
        noOfAdults,
        noOfChildren,
        checkInDate,
        selectedGuidesIds,
        guides,
    } = useSelector((state) => state.quotations);
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    const dispatch = useDispatch();

    useEffect(() => {
        const selectedGud = guides?.find((obj) => obj?._id === guide?.guideId);

        if (selectedGud && guide) {
            let calculatedPrice = 0;

            calculatedPrice =
                (selectedGud?.prices?.price * guide?.count) /
                (noOfAdults + noOfChildren);
            dispatch(
                changeGuidePerPersonPrice({
                    _id: guide?.guideId,
                    perPersonPrice: calculatedPrice,
                })
            );
        }
    }, [guide]);

    return (
        <div className="mb-6 bg-[#f6f6f6] p-4">
            <div className="flex items-start gap-[10px] ">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px] min-w-[16px] min-h-[16px] mt-[4px]"
                    onChange={() => {
                        if (selectedGuidesIds?.includes(guide?.guideId)) {
                            dispatch(removeSelectedGuide(guide?.guideId));
                        }
                    }}
                    checked={selectedGuidesIds?.includes(guide?.guideId)}
                />

                <label htmlFor="" className="mb-0 font-[500]">
                    {guide?.name} -Duration ( {guide?.duration} hr)
                </label>
            </div>{" "}
            <div className="pt-5 ">
                <label htmlFor="" className="mb-0 font-[500]">
                    {" "}
                    Count{" "}
                </label>
                <select
                    name="count"
                    value={guide?.count || 0}
                    onChange={(e) => {
                        dispatch(
                            changeGuideCount({
                                value: e.target.value,
                                guideId: guide?.guideId,
                            })
                        );
                    }}
                    id=""
                    required
                    className="capitalize"
                >
                    <options value="" hidden>
                        select{" "}
                    </options>
                    {numbers?.map((number, index) => {
                        return (
                            <option
                                value={number}
                                key={index}
                                className="capitalize"
                            >
                                {number}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="mt-5 text-sm grid grid-cols-2">
                <span className="block">
                    Price:{" "}
                    <span className="font-medium">
                        {guide?.perPersonPrice?.toFixed(2)} AED
                    </span>
                </span>
            </div>
        </div>
    );
}
