import React, { useEffect, useState } from "react";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../axios";

function Calender({ dates, setData, selectedDate }) {
    const navigate = useNavigate();
    let date = new Date();

    const [currDays, setCurrDays] = useState([]);
    const [currMonth, setCurrMonth] = useState(date.getMonth());
    const [currYear, setCurrYear] = useState(date.getFullYear());
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { jwtToken } = useSelector((state) => state.admin);
    console.log(currDays, "items");
    const fetchDate = async () => {
        try {
            setIsLoading(true);

            let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
                lastDateofMonth = new Date(
                    currYear,
                    currMonth + 1,
                    0
                ).getDate(), // getting last date of month
                lastDayofMonth = new Date(
                    currYear,
                    currMonth,
                    lastDateofMonth
                ).getDay(), // getting last day of month
                lastDateofLastMonth = new Date(
                    currYear,
                    currMonth,
                    0
                ).getDate(); // getting last date of previous month
            let lastFullDateofLastMonth = new Date(
                currYear,
                currMonth,
                0
            ).toISOString();
            let lastFullDateOfMonth = new Date(
                currYear,
                currMonth + 1,
                0
            ).toISOString();

            let array = [];
            let chunk = {};
            let availArray = [];
            for (let i = firstDayofMonth; i > 0; i--) {
                chunk = {
                    day: lastDateofLastMonth - i + 1,
                    active: false,
                    isToday: false,
                    date: lastFullDateofLastMonth - i + 1,
                };
                array.push(chunk);
            }

            for (let i = 1; i <= lastDateofMonth; i++) {
                if (
                    i === date.getDate() &&
                    currMonth === new Date().getMonth() &&
                    currYear === new Date().getFullYear()
                ) {
                    for (let k = 0; k < dates.length; k++) {
                        if (
                            dates[k] ===
                            `${currYear}-${
                                `${currMonth + 1}`.length < 2
                                    ? `0${currMonth + 1}`
                                    : `${currMonth + 1}`
                            }-${`${i}`.length < 2 ? `0${i}` : `${i}`}`
                        ) {
                            availArray.push(dates[k]);
                        }
                    }

                    chunk = {
                        day: i,
                        active: true,
                        isToday: true,
                        date: `${currYear}-${
                            `${currMonth + 1}`.length < 2
                                ? `0${currMonth + 1}`
                                : `${currMonth + 1}`
                        }-${`${i}`.length < 2 ? `0${i}` : `${i}`}`,
                        avail: availArray?.length > 0 ? true : false,
                    };
                    availArray = [];
                } else {
                    for (let k = 0; k < dates?.length; k++) {
                        if (
                            dates[k] ===
                            `${currYear}-${
                                `${currMonth + 1}`.length < 2
                                    ? `0${currMonth + 1}`
                                    : `${currMonth + 1}`
                            }-${`${i}`.length < 2 ? `0${i}` : `${i}`}`
                        ) {
                            availArray.push(dates[k]);
                        }
                    }

                    chunk = {
                        day: i,
                        active: true,
                        isToday: false,
                        date: `${currYear}-${
                            `${currMonth + 1}`.length < 2
                                ? `0${currMonth + 1}`
                                : `${currMonth + 1}`
                        }-${`${i}`.length < 2 ? `0${i}` : `${i}`}`,
                        avail: availArray?.length > 0 ? true : false,
                    };
                    availArray = [];
                }

                array.push(chunk);
            }

            for (let i = lastDayofMonth; i < 6; i++) {
                chunk = {
                    day: i - lastDayofMonth + 1,
                    active: false,
                    isToday: false,
                    date: i - lastFullDateOfMonth + 1,
                };
                array.push(chunk);
            }
            setCurrDays(array);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    };

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const incrementHandler = () => {
        if (currMonth === 11) {
            setCurrMonth(0);
            setCurrYear(currYear + 1);
        } else {
            setCurrMonth(currMonth + 1);
        }
    };
    const decrementHandler = () => {
        if (currMonth === 0) {
            setCurrMonth(11);
            setCurrYear(currYear - 1);
        } else {
            setCurrMonth(currMonth - 1);
        }
    };

    useEffect(() => {
        fetchDate();
        //  console.log(availableDate, "available date");
    }, [currMonth, dates]);

    const clickHandler = (item) => {
        let currentDay =
            item?.day.toString().length < 2
                ? "0" + item?.day.toString()
                : item?.day.toString();
        let currentMonth =
            (currMonth + 1).toString().length < 2
                ? "0" + (currMonth + 1).toString()
                : (currMonth + 1).toString();
        let date = `${currYear}-${currentMonth}-${currentDay}`;
        setData((prev) => {
            return { ...prev, ["date"]: date };
        });
    };

    return (
        <div className="bg-white shadow-round p-5 rounded-2xl sm:w-full lg:max-w-screen-sm ">
            <header className="flex justify-between items-center sm:px-7">
                <p className="font-[700] tracking-wide text-lg">{`${months[currMonth]}, ${currYear}`}</p>
                <div className="flex gap-4">
                    <span
                        id="prev"
                        className="rounded-full w-7 h-7 hover:bg-slate-200 flex justify-center items-center"
                        onClick={decrementHandler}
                    >
                        <AiOutlineLeft />
                    </span>
                    <span
                        id="next"
                        className="rounded-full w-7 h-7 hover:bg-slate-200 flex justify-center items-center"
                        onClick={incrementHandler}
                    >
                        <AiOutlineRight />
                    </span>
                </div>
            </header>
            <div className="calendar">
                <ul className="grid grid-cols-7 gap-5 my-5 place-items-center font-[550]">
                    <li>Sun</li>
                    <li>Mon</li>
                    <li>Tue</li>
                    <li>Wed</li>
                    <li>Thu</li>
                    <li>Fri</li>
                    <li>Sat</li>
                </ul>
                <ul className="grid grid-cols-7 gap-5 place-items-center">
                    {currDays?.map((item, index) => (
                        <li
                            className={`${
                                item?.active
                                    ? " text-gray-400 "
                                    : " text-gray-200 "
                            } ${
                                item?.isToday
                                    ? " bg-blue-400 rounded-full  w-7 h-7 flex justify-center items-center text-white  "
                                    : ""
                            }  ${
                                item?.date === selectedDate
                                    ? "bg-green-900 rounded-full  w-7 h-7 flex justify-center items-center text-white  "
                                    : ""
                            } cursor-pointer ${
                                item?.avail
                                    ? " bg-green-500 rounded-full  w-7 h-7 flex justify-center items-center text-white "
                                    : " "
                            } `}
                            key={index}
                            onClick={() => clickHandler(item)}
                        >
                            {item?.day}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Calender;
