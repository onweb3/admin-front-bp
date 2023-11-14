import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";

import {
    handleChildrenAgeChange,
    handleNoOfAdultsChange,
    handleNoOfChildrenChange,
    setDateError,
    handleCheckInChange,
    handleCheckOutChange,
    handleClientNameChange,
    handleAirportStatusChange,
    handleAirportDataChange,
    clearTransferDetails,
    clearHotelDetails,
    handleChangeReseller,
    handleArrivalAirportTransferChange,
    handleTransferClear,
    setHandlePaxTypeChange,
} from "../../redux/slices/quotationSlice";
import axios from "../../axios";

export default function QuotationPax({ isEdit }) {
    const [noOfNights, setnoOfNights] = useState("");
    const {
        noOfAdults,
        noOfChildren,
        childrenAges,
        dateError,
        checkInDate,
        checkOutDate,
        clientName,
        airports,
        visas,
        departureAirport,
        arrivalAirport,
        isDepartureAirportDisabled,
        isArrivalAirportDisabled,
        selectedReseller,
        isResellerDisabled,
        departureTerminalId,
        arrivalTerminalId,
        paxType,
    } = useSelector((state) => state.quotations);
    const dispatch = useDispatch();
    const { jwtToken } = useSelector((state) => state.admin);

    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resellers, setResellers] = useState([]);
    const [error, setError] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (checkInDate && checkOutDate) {
            const convertedCheckOutDate = new Date(checkOutDate);
            const convertedCheckInDate = new Date(checkInDate);
            const diffTime = Math.abs(
                convertedCheckOutDate - convertedCheckInDate
            );
            setnoOfNights(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            if (convertedCheckOutDate < convertedCheckInDate) {
                dispatch(
                    setDateError("Checkout date must be after checkin date")
                );
            } else {
                dispatch(setDateError(""));
            }
        }
    }, [checkInDate, checkOutDate]);

    const handleNoOfNightsChange = (e) => {
        if (checkInDate && e.target.value) {
            const convertedCheckInDate = new Date(checkInDate);
            const convertedCheckOutDate = new Date(
                convertedCheckInDate.setDate(
                    convertedCheckInDate.getDate() + Number(e.target.value)
                )
            );
            dispatch(handleCheckOutChange(convertedCheckOutDate));
            dispatch(clearHotelDetails());
            if (convertedCheckOutDate < convertedCheckInDate) {
                dispatch(
                    setDateError("Checkout date must be after checkin date")
                );
            } else {
                dispatch(setDateError(""));
            }
        } else if (checkOutDate && e.target.value) {
            const convertedCheckOutDate = new Date(checkOutDate);
            const convertedCheckInDate = new Date(
                convertedCheckOutDate.setDate(
                    convertedCheckOutDate.getDate() - Number(e.target.value)
                )
            );
            dispatch(handleCheckInChange(convertedCheckInDate));
            dispatch(clearHotelDetails());
            dispatch(clearTransferDetails());
            if (convertedCheckOutDate < convertedCheckInDate) {
                dispatch(
                    setDateError("Checkout date must be after checkin date")
                );
            } else {
                dispatch(setDateError(""));
            }
        }
        setnoOfNights(e.target.value);
    };

    const handleDateChange = () => {
        if (checkInDate && checkOutDate) {
            const convertedCheckOutDate = new Date(checkOutDate);
            const convertedCheckInDate = new Date(checkInDate);
            const diffTime = Math.abs(
                convertedCheckOutDate - convertedCheckInDate
            );
            setnoOfNights(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            dispatch(clearHotelDetails());
            dispatch(clearTransferDetails());
            if (convertedCheckOutDate < convertedCheckInDate) {
                dispatch(
                    setDateError("Checkout date must be after checkin date")
                );
            } else {
                dispatch(setDateError(""));
            }
        }
    };

    const fetchResellersData = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setIsDropdownOpen(false);

            const response = await axios.get(
                `/quotations/inital/resellers?searchText=${e.target.value}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setResellers(response?.data.resellers);
            setIsDropdownOpen(true);
            setIsLoading(false);
        } catch (err) {
            setError(err?.response?.data);
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchResellersData();
    }, [selectedReseller.resellerName]);

    return (
        <div>
            <div className="flex items-start gap-[2em] mt-6">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    Client Name
                </label>
                <input
                    type="string"
                    value={clientName || ""}
                    onChange={(e) =>
                        dispatch(handleClientNameChange(e.target.value))
                    }
                    placeholder="Enter No of Adults"
                />
            </div>
            <div className="flex items-start gap-[2em] mt-6 ">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    Search Company
                </label>
                {!isEdit ? (
                    <div className="h-full p-2 flex gap-2 justify-center items-center w-[200px]">
                        <div className="flex items-center justify-center gap-[10px]">
                            <input
                                type="checkbox"
                                className="w-[16px] h-[16px]"
                                checked={isResellerDisabled}
                                onChange={(e) => {
                                    if (!isEdit) {
                                        // Add this condition to prevent changes when isEdit is true
                                        dispatch(
                                            handleAirportStatusChange({
                                                name: "isResellerDisabled",
                                                value: e.target.checked,
                                            })
                                        );
                                        dispatch(clearTransferDetails());
                                    }
                                }}
                            />
                        </div>{" "}
                        <label>Disable Reseller</label>
                    </div>
                ) : (
                    ""
                )}
                <div className="relative w-[400px]">
                    {isResellerDisabled === false ? (
                        <>
                            <input
                                className=""
                                type="string"
                                value={selectedReseller.resellerName || ""}
                                onChange={(e) => {
                                    if (!isEdit) {
                                        setResellers([]);
                                        fetchResellersData(e);
                                        dispatch(
                                            handleChangeReseller({
                                                resellerName: e.target.value,
                                            })
                                        );
                                    }
                                }}
                                disabled={isEdit}
                                placeholder="Enter Company Name..."
                            />

                            {selectedReseller.resellerName &&
                                isDropdownOpen && (
                                    <div className="absolute top-[100%] left-0 right-0 bg-[#fff] max-h-[200px] overflow-y-auto shadow-lg">
                                        {isLoading == false ? (
                                            <>
                                                {" "}
                                                {resellers?.length < 1 ? (
                                                    <div className="flex items-center justify-center h-full gap-[10px] p-5">
                                                        <span className="text-sm text-gray-500">
                                                            No Company Found
                                                        </span>
                                                    </div>
                                                ) : (
                                                    resellers?.map(
                                                        (reseller, index) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={
                                                                        "flex items-center gap-[10px] px-4 py-[7px] hover:bg-[#f6f6f6] cursor-pointer text-sm z-10" +
                                                                        (selectedReseller.resellerId ===
                                                                        reseller?._id
                                                                            ? "cursor-not-allowed"
                                                                            : "cursor-pointer")
                                                                    }
                                                                    onClick={() => {
                                                                        dispatch(
                                                                            handleChangeReseller(
                                                                                {
                                                                                    resellerId:
                                                                                        reseller._id,
                                                                                    resellerName:
                                                                                        reseller.companyName,
                                                                                }
                                                                            )
                                                                        );
                                                                        setIsDropdownOpen(
                                                                            false
                                                                        );
                                                                        setSearchText(
                                                                            reseller.companyName
                                                                        );
                                                                    }}
                                                                >
                                                                    {" "}
                                                                    <span className="leading-[22px]">
                                                                        {
                                                                            reseller?.companyName?.split(
                                                                                "+"
                                                                            )[0]
                                                                        }{" "}
                                                                        <span className="text-blue-500">
                                                                            {reseller?.companyName?.split(
                                                                                "+"
                                                                            )[1] &&
                                                                                "+ " +
                                                                                    reseller?.companyName?.split(
                                                                                        "+"
                                                                                    )[1]}
                                                                        </span>
                                                                        <span className="capitalize text-gray-500">
                                                                            {" "}
                                                                            -{" "}
                                                                            {
                                                                                reseller?.agentCode
                                                                            }{" "}
                                                                            {""}{" "}
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            "Loading..."
                                        )}
                                    </div>
                                )}
                        </>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            <div className="flex items-start gap-[2em] mt-6">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    Pax Type
                </label>
                <div className="flex items-center flex-wrap gap-[10px]">
                    <select
                        name=""
                        className="w-[100px]"
                        value={paxType || ""}
                        onChange={(e) =>
                            dispatch(
                                setHandlePaxTypeChange({
                                    value: e.target.value,
                                })
                            )
                        }
                    >
                        {/* <option value="" hidden>
                            None
                        </option> */}

                        <option value="solo">Solo</option>
                        <option value="couple">Couple</option>
                        <option value="family">Family</option>
                        <option value="friends">Friends</option>
                    </select>
                </div>
            </div>
            <div className="flex items-start gap-[2em] mt-6">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    No Of Adults
                </label>
                <input
                    type="number"
                    value={noOfAdults || ""}
                    onChange={(e) =>
                        dispatch(handleNoOfAdultsChange(e.target.value))
                    }
                    placeholder="Enter No of Adults"
                    onWheel={(e) => e.target.blur()}
                    disabled={paxType === "solo" || paxType === "couple"} // Corrected the disabled attribute
                />
            </div>
            <div className="flex items-start gap-[2em] mt-6">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    No Of Children
                </label>
                <input
                    type="number"
                    value={noOfChildren || ""}
                    onChange={(e) =>
                        dispatch(handleNoOfChildrenChange(e.target.value))
                    }
                    placeholder="Enter no of Children"
                    onWheel={(e) => e.target.blur()}
                    disabled={paxType === "solo" || paxType === "couple"} // Corrected the disabled attribute
                />
            </div>
            {childrenAges && childrenAges?.length > 0 && noOfChildren > 0 && (
                <div className="flex items-start gap-[2em] mt-6">
                    <label htmlFor="" className="w-[100%] max-w-[180px]">
                        Children Ages
                    </label>
                    <div className="flex items-center flex-wrap gap-[10px]">
                        {childrenAges?.map((age, index) => {
                            return (
                                <select
                                    name=""
                                    className="w-[100px]"
                                    value={age || ""}
                                    key={index}
                                    onChange={(e) =>
                                        dispatch(
                                            handleChildrenAgeChange({
                                                index,
                                                value: e.target.value,
                                            })
                                        )
                                    }
                                >
                                    <option value="" hidden>
                                        None
                                    </option>
                                    {Array.from({ length: 18 }).map(
                                        (_, arrIndex) => {
                                            return (
                                                <option
                                                    value={arrIndex}
                                                    key={arrIndex}
                                                >
                                                    {arrIndex} - {arrIndex + 1}{" "}
                                                    yrs
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            );
                        })}
                    </div>
                </div>
            )}
            <div className="flex items-start gap-[2em] mt-6">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    Check In Date
                </label>
                <DatePicker
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    selected={checkInDate ? new Date(checkInDate) : ""}
                    onChange={(date) => {
                        handleDateChange();
                        dispatch(handleCheckInChange(date));
                    }}
                    minDate={new Date()}
                    className="w-[100%] h-[40px]"
                />
            </div>
            <div className="flex items-start gap-[2em] mt-6">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    No of nights
                </label>
                <input
                    type="number"
                    placeholder="Enter number no of nights"
                    onChange={handleNoOfNightsChange}
                    value={noOfNights || ""}
                    onWheel={(e) => e.target.blur()}
                />
            </div>
            <div className="flex items-start gap-[2em] mt-6">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    Check Out Date
                </label>
                <DatePicker
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    selected={checkOutDate ? new Date(checkOutDate) : ""}
                    onChange={(date) => {
                        handleDateChange();
                        dispatch(handleCheckOutChange(date));
                    }}
                    minDate={
                        checkInDate
                            ? new Date(
                                  new Date(checkInDate).setDate(
                                      new Date(checkInDate).getDate() + 1
                                  )
                              )
                            : new Date()
                    }
                />
            </div>
            {dateError && (
                <span className="text-red-500 text-sm block mt-4">
                    {dateError}
                </span>
            )}
            <div className="flex items-start gap-[2em] mt-6">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    Package :{" "}
                    <span className="font-medium">
                        {noOfNights
                            ? "" + noOfNights + "N " + (noOfNights + 1) + "D"
                            : "N/A"}
                    </span>
                </label>
            </div>

            <div className="flex items-start gap-[2em] mt-6">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    Arrival Airport{" "}
                </label>
                <div className="flex  w-full gap-[10px]">
                    <div className="flex items-center gap-[10px]">
                        <input
                            type="checkbox"
                            className="w-[16px] h-[16px]"
                            checked={!isArrivalAirportDisabled}
                            onChange={(e) => {
                                dispatch(
                                    handleAirportStatusChange({
                                        name: "isArrivalAirportDisabled",
                                        value: !e.target.checked,
                                    })
                                );

                                dispatch(handleTransferClear());
                            }}
                        />
                    </div>{" "}
                    {!isArrivalAirportDisabled ? (
                        <select
                            name="arrivalAirport"
                            value={
                                `${arrivalAirport}-${arrivalTerminalId}` || ""
                            }
                            onChange={(e) => {
                                dispatch(
                                    handleAirportDataChange({
                                        name: "arrivalAirport",
                                        value: e.target.value,
                                        name2: "arrivalAirportName",
                                        name3: "arrivalTerminalCode",
                                        name4: "arrivalTerminalId",
                                    })
                                );
                                dispatch(handleTransferClear());
                            }}
                            id=""
                            required
                        >
                            {" "}
                            <option value="">select</option>
                            {airports.map((airport, index) => (
                                <option
                                    key={index}
                                    value={`${airport._id}-${airport.terminals._id}`}
                                >
                                    {airport.airportName} -{" "}
                                    {airport.terminals.terminalCode}
                                </option>
                            ))}
                        </select>
                    ) : (
                        ""
                    )}
                </div>
            </div>

            <div className="flex items-start gap-[2em] mt-6">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    Departure Airport
                </label>
                <div className="flex  w-full gap-[10px]">
                    <div className="flex items-center gap-[10px]">
                        <input
                            type="checkbox"
                            className="w-[16px] h-[16px]"
                            checked={!isDepartureAirportDisabled}
                            onChange={(e) => {
                                dispatch(
                                    handleAirportStatusChange({
                                        name: "isDepartureAirportDisabled",
                                        value: !e.target.checked,
                                    })
                                );
                                dispatch(handleTransferClear());
                            }}
                        />
                    </div>{" "}
                    {!isDepartureAirportDisabled ? (
                        <select
                            name="departureAirport"
                            value={
                                `${departureAirport}-${departureTerminalId}` ||
                                ""
                            }
                            onChange={(e) => {
                                dispatch(
                                    handleAirportDataChange({
                                        name: "departureAirport",
                                        value: e.target.value,
                                        name2: "departureAirportName",
                                        name3: "departureTerminalCode",
                                        name4: "departureTerminalId",
                                    })
                                );
                                dispatch(handleTransferClear());
                            }}
                            id=""
                            required
                        >
                            <option value="">select</option>
                            {airports.map((airport, index) => (
                                <option
                                    key={index}
                                    value={`${airport._id}-${airport.terminals._id}`}
                                >
                                    {" "}
                                    {airport.airportName}-{" "}
                                    {airport.terminals.terminalCode}
                                </option>
                            ))}
                        </select>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
}
