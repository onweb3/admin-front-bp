import React, { useState } from "react";
import { TbArrowNarrowRight, TbArrowsExchange2 } from "react-icons/tb";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";

import { formatDate } from "../../../utils";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsArrowRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import FlightAddMealModal from "./FlightAddMealsModal";
import FlightBaggageModal from "./FlightBaggageModal";
import FlightSeatModal from "./FligthSeatModal";
import axios from "../../../axios";
import {
    handlePassengerChange,
    handleContactChange,
} from "../../../redux/slices/FlightOrderSlice";
import { PageLoader } from "../../../components";

export default function FlightContactDetails({ flightAncillaries }) {
    const { countries } = useSelector((state) => state.general);
    const dispatch = useDispatch();
    const { singleFlightDetails, totalAncillariesPax } = useSelector(
        (state) => state.flightOrder
    );

    const handleSubmit = async () => {
        try {
            const formData = {
                tbId: tbId,
            };

            const response = await axios.post(
                `/orders/flight//bookings/initiate`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="p-2">
            {" "}
            <h1 className="pb-2">Contacts </h1>
            {flightAncillaries.priceQuoteResponse ? (
                <div className="border p-2 flex flex-col gap-10">
                    <div>
                        {" "}
                        <div className="">
                            <h2 className="font-semibold py-2">
                                Contact Details
                            </h2>{" "}
                            <div className="grid grid-cols-4  gap-2">
                                <div>
                                    <label htmlFor="">Country Code</label>
                                    <select
                                        name="phoneCode"
                                        value={
                                            flightAncillaries
                                                ?.priceQuoteResponse
                                                ?.contactDetails?.phoneCode ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            dispatch(
                                                handleContactChange({
                                                    name: e.target.name,
                                                    value: e.target.value,
                                                })
                                            );
                                        }}
                                        id="country"
                                        className="capitalize"
                                    >
                                        <option value="" hidden></option>
                                        {countries.map((country, index) => {
                                            return (
                                                <option
                                                    value={country?.phonecode}
                                                >
                                                    {country.phonecode}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>{" "}
                                <div>
                                    <label htmlFor="">Phone Number</label>
                                    <input
                                        type="number"
                                        placeholder="Enter  Phone Number"
                                        name="phoneNumber"
                                        value={
                                            flightAncillaries
                                                ?.priceQuoteResponse
                                                ?.contactDetails?.phoneNumber ||
                                            ""
                                        }
                                        onChange={(e) => {
                                            dispatch(
                                                handleContactChange({
                                                    name: e.target.name,
                                                    value: e.target.value,
                                                })
                                            );
                                        }}
                                        required
                                    />
                                </div>{" "}
                                <div>
                                    <label htmlFor="">Email </label>
                                    <input
                                        type="email"
                                        placeholder="Enter Email"
                                        name="email"
                                        value={
                                            flightAncillaries
                                                ?.priceQuoteResponse
                                                ?.contactDetails?.email || ""
                                        }
                                        onChange={(e) => {
                                            dispatch(
                                                handleContactChange({
                                                    name: e.target.name,
                                                    value: e.target.value,
                                                })
                                            );
                                        }}
                                        required
                                    />
                                </div>{" "}
                            </div>
                        </div>{" "}
                    </div>
                    <div>
                        {flightAncillaries?.priceQuoteResponse?.passengers.map(
                            (passenger, index) => {
                                return (
                                    <div className="p-2">
                                        <h2 className="font-semibold py-2">
                                            Passenger {index + 1} (
                                            {passenger?.type})
                                        </h2>{" "}
                                        <div className="grid grid-cols-4  gap-2">
                                            <div>
                                                <label htmlFor="">
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter  name"
                                                    name="firstName"
                                                    value={
                                                        passenger?.firstName ||
                                                        ""
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            handlePassengerChange(
                                                                {
                                                                    name: e
                                                                        .target
                                                                        .name,
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                    index,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                    required
                                                />
                                            </div>{" "}
                                            <div>
                                                <label htmlFor="">
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter  name"
                                                    name="lastName"
                                                    value={
                                                        passenger?.lastName ||
                                                        ""
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            handlePassengerChange(
                                                                {
                                                                    name: e
                                                                        .target
                                                                        .name,
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                    index,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                    required
                                                />
                                            </div>{" "}
                                            <div>
                                                <label htmlFor="">
                                                    Date Of Birth
                                                </label>
                                                <input
                                                    type="date"
                                                    placeholder=""
                                                    name="birthDate"
                                                    value={
                                                        passenger?.birthDate ||
                                                        ""
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            handlePassengerChange(
                                                                {
                                                                    name: e
                                                                        .target
                                                                        .name,
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                    index,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                    required
                                                />
                                            </div>{" "}
                                            <div>
                                                <label htmlFor="">Gender</label>
                                                <select
                                                    name="gender"
                                                    value={
                                                        passenger?.gender || ""
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            handlePassengerChange(
                                                                {
                                                                    name: e
                                                                        .target
                                                                        .name,
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                    index,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                    className="capitalize"
                                                >
                                                    <option
                                                        value=""
                                                        hidden
                                                    ></option>

                                                    <option value="male">
                                                        Male
                                                    </option>
                                                    <option value="female">
                                                        Female
                                                    </option>
                                                </select>
                                            </div>{" "}
                                            <div>
                                                <label htmlFor="">
                                                    Nationality
                                                </label>
                                                <select
                                                    name="nationality"
                                                    value={
                                                        passenger?.nationality ||
                                                        ""
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            handlePassengerChange(
                                                                {
                                                                    name: e
                                                                        .target
                                                                        .name,
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                    index,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                    id="country"
                                                    className="capitalize"
                                                >
                                                    <option
                                                        value=""
                                                        hidden
                                                    ></option>
                                                    {countries.map(
                                                        (country, index) => {
                                                            return (
                                                                <option
                                                                    value={
                                                                        country?._id
                                                                    }
                                                                >
                                                                    {
                                                                        country.isocode
                                                                    }
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>{" "}
                                            <div>
                                                <label htmlFor="">
                                                    Passport Number
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter passport Number"
                                                    name="passportNumber"
                                                    value={
                                                        passenger?.passportNumber ||
                                                        ""
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            handlePassengerChange(
                                                                {
                                                                    name: e
                                                                        .target
                                                                        .name,
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                    index,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                    required
                                                />
                                            </div>{" "}
                                            <div>
                                                <label htmlFor="">
                                                    Passport Expiry
                                                </label>
                                                <input
                                                    type="date"
                                                    placeholder="Enter passport Number"
                                                    name="passportExpiry"
                                                    value={
                                                        passenger?.passportExpiry ||
                                                        ""
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            handlePassengerChange(
                                                                {
                                                                    name: e
                                                                        .target
                                                                        .name,
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                    index,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                    required
                                                />
                                            </div>{" "}
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>{" "}
                    <button className="w-[150px]" onClick={handleSubmit}>
                        submit
                    </button>
                </div>
            ) : (
                <PageLoader />
            )}
        </div>
    );
}
