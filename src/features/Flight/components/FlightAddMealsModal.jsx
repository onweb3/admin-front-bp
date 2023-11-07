import React, { useEffect, useRef, useState } from "react";
import { TbArrowNarrowRight, TbArrowsExchange2 } from "react-icons/tb";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../utils";
import { MdClose, MdSetMeal } from "react-icons/md";
import axios from "../../../axios";
import { useDispatch, useSelector } from "react-redux";
import {
    handleMealCountChange,
    handleTotalChange,
} from "../../../redux/slices/FlightOrderSlice";
import { GiHotMeal } from "react-icons/gi";

export default function FlightAddMealModal({ setIsModal, mealSsr }) {
    const { singleFlightDetails, flightAncillaries } = useSelector(
        (state) => state.flightOrder
    );
    const wrapperRef = useRef();
    const [meals, setMeals] = useState([]);
    const [totalCount, setTotalCount] = useState(false);
    const [selectedSegmentIndex, setSelectedSegmentIndex] = useState();
    const dispatch = useDispatch();
    const onHandleChange = (index) => {
        try {
            const selectedMeal = mealSsr.find((meal, ind) => ind === index);

            // Make sure to check if selectedMeal is not undefined before trying to access its "meals" property
            if (selectedMeal) {
                setMeals(selectedMeal.meals);
                setSelectedSegmentIndex(index);
            }
        } catch (err) {
            console.log(err);
        }
        // Assuming mealSsr is an array containing objects with a "meals" property
    };

    useEffect(() => {
        const mealsSsrArray = flightAncillaries.mealsSsr;

        for (const mealsSsrItem of mealsSsrArray) {
            let totalSum = 0;
            if (
                mealsSsrItem.selectedMeals &&
                Array.isArray(mealsSsrItem.selectedMeals)
            ) {
                // Iterate over the meals array for each mealsSsr item
                for (const meal of mealsSsrItem.selectedMeals) {
                    totalSum += meal.count || 0;
                }
            }
            dispatch(
                handleTotalChange({
                    name1: "mealsSsr",
                    index1: mealsSsrArray.indexOf(mealsSsrItem),
                    value: totalSum,
                })
            );
        }
    }, [flightAncillaries.mealsSsr[selectedSegmentIndex || 0]?.selectedMeals]);

    const onHandleMealsChange = async (e, index, value, value1) => {
        await dispatch(
            handleMealCountChange({
                name: "count",
                value1: value1,
                value: value,
                name1: "mealsSsr",
                index1: selectedSegmentIndex,
                name2: "meals",
                index2: index,
            })
        );
    };

    useEffect(() => {
        onHandleChange(selectedSegmentIndex || 0);
    }, [meals, mealSsr]);

    console.log(mealSsr, meals, totalCount, "meals changed");

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[800px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Available Meals</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="pt-10 border-t-1 p-5 flex gap-10">
                    <div className="w-[180px] h-full">
                        {mealSsr.map((mealSsr, index) => {
                            return (
                                <div
                                    className="w-full hover:cursor-pointer"
                                    onClick={(e) => {
                                        onHandleChange(index);
                                    }}
                                >
                                    {/* <div className="pb-1">onward</div> */}
                                    <div
                                        className={`flex p-2 justify-between items-center ${
                                            selectedSegmentIndex === index
                                                ? "bg-blue-200"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex flex-start">
                                            <div className="text-sm font-semibold">
                                                {mealSsr.from}
                                            </div>
                                            <div className="text-sm font-semibold">
                                                -{" "}
                                            </div>
                                            <div className="text-sm font-semibold">
                                                {mealSsr.to}
                                            </div>{" "}
                                        </div>
                                        <div className="flex rounded rounded-full bg-white  flex-end p-1">
                                            <div className="text-sm font-semibold">
                                                {mealSsr?.totalCount || 0}{" "}
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
                        {meals.map((meal, index) => {
                            return (
                                <div className="p-2 flex gap-10">
                                    <div className=" text-2xl text-red-500">
                                        {meal?.mealImage ? (
                                            <img
                                                src={
                                                    meal?.mealImage ||
                                                    "https://img.freepik.com/free-vector/fast-food-set-with-hamburger-hotdog_1308-102865.jpg?w=2000"
                                                }
                                                alt=""
                                                className="h-8 w-8"
                                            />
                                        ) : (
                                            <GiHotMeal />
                                        )}
                                    </div>
                                    <div className="flex justify-start w-[200px] ">
                                        {meal?.mealInfo}
                                    </div>
                                    <div className="w-[70px]">
                                        {meal?.price} AED
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            className="text-sm font-semibold flex bg-gray-400 boreder rounded-full h-5 w-5 items-center justify-center"
                                            onClick={(e) => {
                                                if (
                                                    flightAncillaries
                                                        .priceQuoteResponse
                                                        .noOfAdults +
                                                        flightAncillaries
                                                            .priceQuoteResponse
                                                            .noOfChildren >
                                                    flightAncillaries?.mealsSsr[
                                                        selectedSegmentIndex
                                                    ]?.totalCount
                                                ) {
                                                    onHandleMealsChange(
                                                        e,
                                                        index,
                                                        meal,
                                                        "add"
                                                    );
                                                }
                                            }}
                                        >
                                            +
                                        </button>
                                        <div className="text-sm font-semibold">
                                            {flightAncillaries?.mealsSsr[
                                                selectedSegmentIndex
                                            ]?.selectedMeals?.find((ml) => {
                                                return (
                                                    ml?.mealCode ===
                                                    meal?.mealCode
                                                );
                                            })?.count || 0}
                                        </div>
                                        <button
                                            className="text-sm font-semibold flex bg-gray-400  boreder rounded-full h-5 w-5 items-center justify-center"
                                            onClick={(e) => {
                                                onHandleMealsChange(
                                                    e,
                                                    index,
                                                    meal,
                                                    "substract"
                                                );
                                            }}
                                        >
                                            -
                                        </button>
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
