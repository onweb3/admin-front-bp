import React, { useRef, useState } from "react";
import { TbArrowNarrowRight, TbArrowsExchange2 } from "react-icons/tb";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../utils";
import { MdClose } from "react-icons/md";
import axios from "../../../axios";
import { useSelector } from "react-redux";

export default function FlightAvailabiltyModal({
    flightResults,
    setIsAvailabilityModal,
    setFlightResults,
}) {
    const [data, setData] = useState({
        searchId: flightResults?.searchId || "",
        fsrId: "",
        fareKey: "",
    });
    const { jwtToken } = useSelector((state) => state.admin);

    const [isLoading, setIsLoading] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState("");
    const [error, setError] = useState("");

    const wrapperRef = useRef();

    const handleChange = (index, value) => {
        try {
            console.log("call");
            setFlightResults((prev) => {
                return {
                    ...prev,
                    result: prev?.result?.map((flight, i) => {
                        if (i === index) {
                            // Update the object at the specified index
                            return { ...flight, value: value };
                        } else {
                            // Keep the other objects unchanged
                            return flight;
                        }
                    }),
                };
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleBook = async (e, index) => {
        try {
            e.preventDefault();
            // setIsLoading(true);
            setError("");
            setSelectedIndex(index);
            const selectedResult = flightResults?.result.find(
                (result, ind) => ind === index
            );

            const selectedValue = selectedResult.fares.find(
                (fare) => fare.fareKey === selectedResult.value
            );

            console.log(selectedValue, selectedResult, "resultttt");
            if (selectedValue && selectedResult) {
                console.log("call reached");
                const formData = {
                    searchId: data?.searchId,
                    fsrId: selectedResult?.fsrId,
                    fareKey: selectedValue?.fareKey,
                };
                const response = await axios.post(
                    `/orders/flight/addToCart`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            } else {
                setError(
                    err?.response?.data?.error ||
                        "Something went wrong, Try again"
                );
                setIsLoading(false);
            }
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            console.log(err);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[1000px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Available Flights</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsAvailabilityModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-5  ">
                    <div className="w-full px-10 border border-rounded bg-gray-100 ">
                        <div className="w-full flex justify-between gap-5 py-2 ">
                            <div className="text-gray-400 font-semibold text-md">
                                Image
                            </div>
                            <div className="text-gray-400 font-semibold text-md">
                                Flight
                            </div>
                            <div className="text-gray-400 font-semibold text-md">
                                Departure{" "}
                            </div>
                            <div className="text-gray-400 font-semibold text-md">
                                Arrival{" "}
                            </div>
                            <div className="text-gray-400 font-semibold text-md">
                                Price
                            </div>
                            <div className="text-gray-400 font-semibold text-md">
                                Type
                            </div>
                            <div className="text-gray-400 font-semibold text-md px-10">
                                Book
                            </div>
                        </div>
                    </div>
                </div>
                {flightResults?.result?.map((result, index) => {
                    return (
                        <div className="p-3 ">
                            <div className="w-full p-10 border border-rounded">
                                <div className="w-full flex justify-between gap-5 py-2">
                                    {result?.trips?.map((trip, ind) => {
                                        return (
                                            <>
                                                <img
                                                    src={
                                                        trip?.airlines[0]
                                                            ?.airlineLogo
                                                    }
                                                    alt=""
                                                    className="h-[35px]"
                                                />{" "}
                                                <div>
                                                    {
                                                        trip?.airlines[0]
                                                            ?.airlineName
                                                    }
                                                    <div>
                                                        {
                                                            trip?.airlines[0]
                                                                ?.airlineCode
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                    {
                                                        trip?.flightSegments[0]?.departureDate
                                                            .split("T")[1]
                                                            .split(":")[0]
                                                    }
                                                    :{" "}
                                                    {
                                                        trip?.flightSegments[0]?.departureDate
                                                            .split("T")[1]
                                                            .split(":")[1]
                                                    }
                                                </div>
                                                <div>
                                                    {
                                                        trip?.flightSegments[0]?.arrivalDate
                                                            .split("T")[1]
                                                            .split(":")[0]
                                                    }
                                                    :{" "}
                                                    {
                                                        trip?.flightSegments[0]?.arrivalDate
                                                            .split("T")[1]
                                                            .split(":")[1]
                                                    }
                                                </div>
                                                <div>PRICE</div>
                                            </>
                                        );
                                    })}
                                    <div>
                                        <select
                                            className=""
                                            value={result?.value}
                                            onChange={(e) => {
                                                handleChange(
                                                    index,
                                                    e.target.value
                                                );
                                            }}
                                        >
                                            <option value="" hidden>
                                                select
                                            </option>
                                            {result?.fares?.map((fare, i) => {
                                                return (
                                                    <option
                                                        value={fare?.fareKey}
                                                    >
                                                        {fare?.fareName}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <button
                                        className="w-[120px]"
                                        onClick={(e) => {
                                            handleBook(e, index);
                                        }}
                                    >
                                        Book
                                    </button>
                                </div>
                            </div>
                            {selectedIndex === index && error && (
                                <span className="text-sm block text-red-500 mt-2 absolute">
                                    {error}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>{" "}
        </div>
    );
}
