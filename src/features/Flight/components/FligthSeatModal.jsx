import React, { useEffect, useRef, useState } from "react";
import { TbArrowNarrowRight, TbArrowsExchange2 } from "react-icons/tb";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../utils";
import { MdClose } from "react-icons/md";
import axios from "../../../axios";
import { useDispatch, useSelector } from "react-redux";
import { handleMealCountChange } from "../../../redux/slices/FlightOrderSlice";
import SeatBox from "./SeatBox";

export default function FlightSeatModal({ setIsModal, seatSsr }) {
    const { singleFlightDetails, flightAncillaries } = useSelector(
        (state) => state.flightOrder
    );
    const wrapperRef = useRef();
    const [seats, setSeats] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);
    const dispatch = useDispatch();
    const onHandleChange = (index) => {
        try {
            const selectedMeal = seatSsr.find((meal, ind) => ind === index);

            // Make sure to check if selectedMeal is not undefined before trying to access its "meals" property
            if (selectedMeal) {
                setSeats(selectedMeal);
                setSelectedSegmentIndex(index);
            }
        } catch (err) {
            console.log(err);
        }
        // Assuming mealSsr is an array containing objects with a "meals" property
    };

    useEffect(() => {
        onHandleChange(selectedSegmentIndex || 0);
    }, [seats, seatSsr]);


    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[110vh] max-w-[800px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Available Seats</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>

                <div className="pt-10 border-t-1 p-5 flex gap-10">
                    <div className="w-[180px] h-full">
                        {seatSsr.map((seatSsr, index) => {
                            return (
                                <div
                                    className="w-full hover:cursor-pointer"
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
                                                {seatSsr.from}
                                            </div>
                                            <div className="text-sm font-semibold">
                                                -{" "}
                                            </div>
                                            <div className="text-sm font-semibold">
                                                {seatSsr.to}
                                            </div>{" "}
                                        </div>
                                        <div className="flex rounded rounded-full bg-white  flex-end p-1">
                                            <div className="text-sm font-semibold">
                                                {flightAncillaries?.seatSsr[
                                                    index
                                                ]?.selectedSeats?.length ||
                                                    0}{" "}
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
                    {seats?.seatPriceGroup && (
                        <div className="overflow-x-auto border p-2">
                            <div className="flex justify-between">
                                {" "}
                                <div className="flex gap-5">
                                    {seats?.seatPriceGroup?.map((st) => {
                                        return (
                                            <div className="grid-cols-1">
                                                <div className="flex gap-2">
                                                    <div
                                                        className={`${
                                                            st?.groupNo === 1
                                                                ? "w-5 h-5 bg-blue-200"
                                                                : st?.groupNo ===
                                                                  2
                                                                ? "w-5 h-5 bg-purple-200"
                                                                : st?.groupNo ===
                                                                  3
                                                                ? "w-5 h-5 bg-violet-500"
                                                                : st?.groupNo ===
                                                                  4
                                                                ? "w-5 h-5 bg-orange-200"
                                                                : st?.groupNo ===
                                                                  5
                                                                ? "w-5 h-5 bg-pink-300"
                                                                : ""
                                                        }`}
                                                    ></div>
                                                    <p>{st.startRange}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="col-span-12 flex items-center gap-4 pr-4">
                                    <div className=" flex gap-2">
                                        {" "}
                                        <div className="h-5 w-5  bg-red-500 rounded-3xl items-center" />
                                        Booked
                                    </div>

                                    <div className=" flex gap-2">
                                        {" "}
                                        <div className="h-5 w-5 bg-teal-400  rounded-3xl items-center" />
                                        Selected
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 grid grid-cols-12 max-w-[1500px] items-center h- py-10   ">
                                <div className="h-[200px] flex items-center relative col-span-2">
                                    <img
                                        // src={planeHead}
                                        alt=""
                                        className="  w-[240px]  transform -rotate-90"
                                    />
                                    <div className="absolute right-0 h-[100%] ">
                                        <ul className="flex flex-col justify-between h-[100%] py-1.5 text-[16px] font-medium">
                                            <div className=" flex flex-col gap-2">
                                                <li>A</li>
                                                <li>B</li>
                                                <li>C</li>
                                            </div>
                                            <div className=" flex flex-col gap-2">
                                                <li>D</li>
                                                <li>E</li>
                                                <li>F</li>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                                <div className="h-[240px] border-[2px] border-x-0 w-[1000px] relative col-span-10">
                                    <div className="absolute bottom-[135px] left-[40%]  ">
                                        <img
                                            // src={leftWing}
                                            alt=""
                                            className="w-[120px]  transform -rotate-90  "
                                        />
                                    </div>
                                    <div className="absolute left-[40%] top-[135px]">
                                        <img
                                            // src={rightWing}
                                            alt=""
                                            className="w-[120px]   transform -rotate-90  "
                                        />
                                    </div>
                                    {seats?.seatMap?.map((st, i) => {
                                        return (
                                            <>
                                                <div className="h-[100%] flex gap-3 py-3.5 px-8  w-[90%]">
                                                    {st?.rows?.map((rw, j) => {
                                                        return (
                                                            <>
                                                                <div
                                                                    key={j}
                                                                    className="flex  h-full relative"
                                                                >
                                                                    <ul className="flex flex-col justify-between h-[100%] py-3.5 text-[24px] font-medium">
                                                                        {rw.seats.map(
                                                                            (
                                                                                seat,
                                                                                index
                                                                            ) => (
                                                                                <SeatBox
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    status={
                                                                                        seat?.availability
                                                                                    }
                                                                                    row={
                                                                                        seat?.seatNumber
                                                                                    }
                                                                                    col={
                                                                                        index +
                                                                                        1
                                                                                    }
                                                                                    price={
                                                                                        seat?.price
                                                                                    }
                                                                                    passengerKey={
                                                                                        seat?.seatCode
                                                                                    }
                                                                                    // segmentKey={
                                                                                    //     ele?.segmentKey
                                                                                    // }
                                                                                    group={
                                                                                        seat?.group
                                                                                    }
                                                                                    // onClick={
                                                                                    //     handleSeatClick
                                                                                    // }
                                                                                    // deselectedAll={
                                                                                    //     deselectedAll
                                                                                    // }
                                                                                    // setDeselectedAll={
                                                                                    //     setDeselectedAll
                                                                                    // }
                                                                                    seatCode={
                                                                                        seat?.seatCode
                                                                                    }
                                                                                    seatNumber={
                                                                                        seat?.seatNumber
                                                                                    }
                                                                                    //    noOfAdults={noOfAdults}
                                                                                    setSelectedSegmentIndex={
                                                                                        setSelectedSegmentIndex
                                                                                    }
                                                                                    selectedSegmentIndex={
                                                                                        selectedSegmentIndex
                                                                                    }
                                                                                    seat={
                                                                                        seat
                                                                                    }
                                                                                    seats={
                                                                                        st
                                                                                    }
                                                                                />
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                    <div className="absolute text-16 bottom-[-45px] left-1 text-center font-semibold">
                                                                        {j + 1}
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
