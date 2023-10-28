import React, { useEffect, useRef, useState } from "react";
import { TbArrowNarrowRight, TbArrowsExchange2 } from "react-icons/tb";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../utils";
import { MdClose } from "react-icons/md";
import axios from "../../../axios";
import { useDispatch, useSelector } from "react-redux";
import { handleMealCountChange } from "../../../redux/slices/FlightOrderSlice";

export default function FlightAddMealModal({ setIsModal, mealSsr, totalPax }) {
    const wrapperRef = useRef();
    const [meals, setMeals] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
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

    const onHandleMealsChange = (e, index, value) => {
        dispatch(
            handleMealCountChange({
                name: "count",
                value: value,
                name1: "mealsSsr",
                index1: selectedSegmentIndex,
                name2: "meals",
                index2: index,
            })
        );

        // Assuming you have a variable named 'totalCount' and another variable named 'value'

        if (value === "add") {
            setTotalCount(totalCount + 1);
        } else if (value === "substract" && totalCount > 0) {
            setTotalCount(totalCount - 1);
        }
    };

    useEffect(() => {
        onHandleChange(selectedSegmentIndex);
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
                                    className="w-full"
                                    onClick={(e) => {
                                        onHandleChange(index);
                                    }}
                                >
                                    <div className="pb-1">onward</div>
                                    <div className="flex bg-blue-200 p-2 justify-between items-center">
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
                                                {totalCount}{" "}
                                            </div>
                                            <div className="text-sm font-semibold">
                                                /
                                            </div>
                                            <div className="text-sm font-semibold">
                                                {totalPax}{" "}
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
                                    <div className="w-[100px] h-[20px]">
                                        icons
                                    </div>
                                    <div className="flex justify-start w-[200px] ">
                                        {meal?.mealInfo}
                                    </div>
                                    <div className="w-[50px]">
                                        {meal?.price}
                                    </div>
                                    <div className="flex gap-3">
                                        <div
                                            className="text-sm font-semibold flex bg-gray-200 boreder rounded-full h-5 w-5 items-center justify-center"
                                            onClick={(e) => {
                                                if (totalPax > totalCount) {
                                                    onHandleMealsChange(
                                                        e,
                                                        index,
                                                        "add"
                                                    );
                                                }
                                            }}
                                        >
                                            +
                                        </div>
                                        <div className="text-sm font-semibold">
                                            {meal?.count || 0}
                                        </div>
                                        <div
                                            className="text-sm font-semibold flex bg-gray-200  boreder rounded-full h-5 w-5 items-center justify-center"
                                            onClick={(e) => {
                                                onHandleMealsChange(
                                                    e,
                                                    index,
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
