import React, { useEffect, useRef, useState } from "react";
import { TbArrowNarrowRight, TbArrowsExchange2 } from "react-icons/tb";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../utils";
import { MdClose } from "react-icons/md";
import axios from "../../../axios";
import { useDispatch, useSelector } from "react-redux";
import {
    handleBagggageCountChange,
    handleTotalChange,
} from "../../../redux/slices/FlightOrderSlice";

export default function FlightBaggageModal({ setIsModal, baggageSsr }) {
    const { singleFlightDetails, flightAncillaries } = useSelector(
        (state) => state.flightOrder
    );
    const wrapperRef = useRef();
    const [baggages, setBaggage] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedSegmentIndex, setSelectedSegmentIndex] = useState();
    const dispatch = useDispatch();
    const onHandleChange = (index) => {
        try {
            const selectedBaggage = baggageSsr.find(
                (meal, ind) => ind === index
            );

            // Make sure to check if selectedMeal is not undefined before trying to access its "meals" property
            if (selectedBaggage) {
                setBaggage(selectedBaggage?.baggages);
                setSelectedSegmentIndex(index);
            }
        } catch (err) {
            console.log(err);
        }
        // Assuming mealSsr is an array containing objects with a "meals" property
    };

    useEffect(() => {
        const baggageSsrArray = flightAncillaries.baggageSsr;

        // Initialize the total sum to zero

        // Iterate over the mealsSsr array
        for (const baggageSsrItem of baggageSsrArray) {
            let totalSum = 0;

            if (
                baggageSsrItem.selectedBaggage &&
                Array.isArray(baggageSsrItem.selectedBaggage)
            ) {
                // Iterate over the meals array for each mealsSsr item
                for (const bagg of baggageSsrItem.selectedBaggage) {
                    totalSum += bagg.count || 0;
                }
            }
            dispatch(
                handleTotalChange({
                    name1: "baggageSsr",
                    index1: baggageSsrArray.indexOf(baggageSsrItem),
                    value: totalSum,
                })
            );
        }
    }, [
        flightAncillaries.baggageSsr[selectedSegmentIndex || 0]
            ?.selectedBaggage,
    ]);

    const onHandleMealsChange = (e, index, value, value1) => {
        dispatch(
            handleBagggageCountChange({
                name: "count",
                value: value,
                value1: value1,
                name1: "baggageSsr",
                index1: selectedSegmentIndex,
                name2: "baggages",
                index2: index,
            })
        );

        // Assuming you have a variable named 'totalCount' and another variable named 'value'
    };

    useEffect(() => {
        onHandleChange(selectedSegmentIndex || 0);
    }, [baggages, baggageSsr]);

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[800px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Available Baggage</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="pt-10 border-t-1 p-5 flex gap-10">
                    <div className="w-[180px] h-full">
                        {baggageSsr.map((baggageSsr, index) => {
                            return (
                                <div
                                    className="w-full"
                                    onClick={(e) => {
                                        onHandleChange(index);
                                    }}
                                >
                                    
                                    <div
                                        className={`flex p-2 justify-between items-center ${
                                            selectedSegmentIndex === index
                                                ? "bg-blue-200"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex flex-start">
                                            <div className="text-sm font-semibold">
                                                {baggageSsr.from}
                                            </div>
                                            <div className="text-sm font-semibold">
                                                -{" "}
                                            </div>
                                            <div className="text-sm font-semibold">
                                                {baggageSsr.to}
                                            </div>{" "}
                                        </div>
                                        <div className="flex rounded rounded-full bg-white  flex-end p-1">
                                            <div className="text-sm font-semibold">
                                                {baggageSsr.totalCount || 0}{" "}
                                            </div>
                                            <div className="text-sm font-semibold">
                                                /
                                            </div>
                                            <div className="text-sm font-semibold">
                                                {flightAncillaries
                                                    .priceQuoteResponse
                                                    .noOfAdults +
                                                    flightAncillaries
                                                        .priceQuoteResponse
                                                        .noOfChildren}{" "}
                                            </div>{" "}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-full h-[500px]  overflow-y-auto">
                        {baggages?.map((baggage, index) => {
                            return (
                                <div className="p-2 flex gap-10">
                                    <div className="w-[100px] h-[20px]">
                                        icons
                                    </div>
                                    <div className="flex justify-start w-[200px] ">
                                        {baggage?.baggageInfo}
                                    </div>
                                    <div className="w-[50px]">
                                        {baggage?.price} AED
                                    </div>
                                    <div className="flex gap-3">
                                        <div
                                            className="text-sm font-semibold flex bg-gray-200 boreder rounded-full h-5 w-5 items-center justify-center"
                                            onClick={(e) => {
                                                if (
                                                    flightAncillaries
                                                        .priceQuoteResponse
                                                        .noOfAdults +
                                                        flightAncillaries
                                                            .priceQuoteResponse
                                                            .noOfChildren >
                                                    flightAncillaries
                                                        ?.baggageSsr[
                                                        selectedSegmentIndex
                                                    ]?.totalCount
                                                ) {
                                                    onHandleMealsChange(
                                                        e,
                                                        index,
                                                        baggage,
                                                        "add"
                                                    );
                                                }
                                            }}
                                        >
                                            +
                                        </div>
                                        <div className="text-sm font-semibold">
                                            {flightAncillaries.baggageSsr[
                                                selectedSegmentIndex
                                            ].selectedBaggage?.find(
                                                (seleBag) => {
                                                    return (
                                                        seleBag?.baggageInfo ===
                                                        baggage?.baggageInfo
                                                    );
                                                }
                                            )?.count || 0}
                                        </div>
                                        <div
                                            className="text-sm font-semibold flex bg-gray-200  boreder rounded-full h-5 w-5 items-center justify-center"
                                            onClick={(e) => {
                                                onHandleMealsChange(
                                                    e,
                                                    index,
                                                    baggage,
                                                    "substract"
                                                );
                                            }}
                                        >
                                            -
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
