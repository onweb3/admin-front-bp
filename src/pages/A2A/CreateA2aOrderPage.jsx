import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, SelectDropdown } from "../../components";
import { useImageChange } from "../../hooks";
import { config } from "../../constants";
import Calender from "../../components/Calender";
import { formatDate } from "../../utils";
import { MdOutlineFlightTakeoff } from "react-icons/md";

export default function CreateA2aOrder() {
    const [dates, setDates] = useState([]);
    const [a2as, setA2as] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [resellers, setResellers] = useState([]);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        date: "",
        selectedA2a: "",
        selectedTicket: "",
        resellerId: "",
        totalPax: 0,
    });
    const [passengerDetails, setPassengerDetails] = useState([]);
    const { jwtToken } = useSelector((state) => state.admin);
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const { countries } = useSelector((state) => state.general);
    const [infantCount, setInfantCount] = useState(0);
    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });

        if (e.target.name === "totalPax") {
            setPassengerDetails((prev) => {
                const length = parseInt(e.target.value); // Assuming e.target.value is a valid integer

                if (!isNaN(length)) {
                    const newArray = [];
                    for (let i = 0; i < length; i++) {
                        newArray.push({
                            title: "",
                            firstName: "",
                            lastName: "",
                            code: "",
                            phoneNumber: "",
                            reference: "",
                            nationality: "",
                            passportNo: "",
                            isInfant: false,
                        });
                    }
                    return newArray;
                }

                // Handle the case where e.target.value is not a valid integer
                return prev; // Return the previous state
            });
        }
    };

    const fetchDates = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/orders/a2a/date`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setDates(response.data?.dates);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchA2a = async () => {
        try {
            setIsLoading(true);

            const response = await axios.post(
                `/orders/a2a/list/all`,
                { date: data.date },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            const reduceA2a = response.data?.map((data) => {
                return {
                    ...data,
                    fieldName: `${data?.airportFromIata}-${data?.airportToIata}-${data?.airportFromIata}`,
                };
            });
            setA2as(reduceA2a);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchResellers = async () => {
        try {
            const response = await axios.get(
                `/orders/attraction/list/resellers`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setResellers(response.data);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            // setIsLoading(false);
        }
    };

    const fetchA2aTickets = async () => {
        try {
            setIsLoading(true);

            const response = await axios.post(
                `/orders/a2a/single/${data?.selectedA2a}/${data?.resellerId}`,
                { date: data.date },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            const reduceTicket = response.data?.a2aSingleList?.map((data) => {
                return {
                    ...data,
                    fieldName: `${data.airlineOnward}(${formatDate(
                        data?.onwardDate
                    )}-${data.takeOffTimeOnward})-${
                        data.airlineReturn
                    }(${formatDate(data?.returnDate)}-${
                        data.takeOffTimeReturn
                    })`,
                };
            });
            setTickets(reduceTicket);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchResellers();
        fetchDates();
    }, []);

    useEffect(() => {
        if (data?.date) {
            fetchA2a();
        }
    }, [data?.date]);

    useEffect(() => {
        if (data?.selectedA2a && data?.resellerId) {
            fetchA2aTickets();
        }
    }, [data?.selectedA2a, data?.resellerId]);

    const handleSingleChange = ({ name, value }) => {
        try {
            if (name === "date") {
                setData();
            }

            if (name === "selectedTicket") {
                let selectedDetails = tickets.find((ticket) => {
                    return ticket._id.toString() === value.toString(); // Added a return statement here
                });

                setData((prev) => {
                    return {
                        ...prev,
                        ["selectedDetails"]: selectedDetails,
                    };
                });
            }

            setData((prev) => {
                return {
                    ...prev,
                    [name]: value,
                };
            });
        } catch (err) {}
    };
    const changeInfantPrice = () => {
        const infantCount = passengerDetails.reduce((count, passenger) => {
            if (passenger.isInfant === true) {
                return count + 1;
            }
            return count;
        }, 0);

        setInfantCount(infantCount);
    };

    useEffect(() => {
        changeInfantPrice();
    }, [passengerDetails]);

    const handlePassengerChange = (e, index) => {
        const { name, value } = e.target;

        if (name === "isInfant") {
            setPassengerDetails((prev) => {
                const updatedPassengerDetails = [...prev];

                updatedPassengerDetails[index] = {
                    ...updatedPassengerDetails[index],
                    ["isInfant"]: !updatedPassengerDetails[index]?.isInfant,
                };

                return updatedPassengerDetails;
            });
        } else {
            setPassengerDetails((prev) => {
                const updatedPassengerDetails = [...prev];

                updatedPassengerDetails[index] = {
                    ...updatedPassengerDetails[index],
                    [name]: value,
                };

                return updatedPassengerDetails;
            });
        }
    };

    const handleInfantChange = (e, index) => {
        const { name, value } = e.target;

        setPassengerDetails((prev) => {
            const updatedPassengerDetails = [...prev];

            updatedPassengerDetails[index] = {
                ...updatedPassengerDetails[index],
                infant: {
                    ...updatedPassengerDetails[index].infant,
                    [name]: value,
                },
            };

            return updatedPassengerDetails;
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            // setError("");

            const formData = {
                a2aTicket: data.selectedTicket,
                date: data.date,
                noOfTravellers: data.totalPax,
                markup: 0,
                passengerDetails: passengerDetails,
            };

            const response = await axios.post(
                `/orders/a2a/create/${data.resellerId}`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const isConfirm = window.confirm("Are you sure to complete order?");
            if (isConfirm) {
                await axios.post(
                    `/orders/a2a/complete/${response.data._id}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
            setIsLoading(false);
            navigate(`/a2a/summary`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">Create A2a Order</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/order" className="text-textColor">
                        Orders{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>A2a</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form
                        action=""
                        // onSubmit={handleSubmit}
                        className=""
                    >
                        <div className="flex gap-5 ">
                            {" "}
                            <div>
                                <div className="">
                                    <Calender
                                        dates={dates}
                                        setData={setData}
                                        selectedDate={data.date}
                                    />
                                </div>
                            </div>
                            <div className="w-full p-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor=""> Select A2A</label>
                                        <div className="">
                                            <SelectDropdown
                                                data={a2as}
                                                setData={setA2as}
                                                displayName={"fieldName"}
                                                selectedData={data?.selectedA2a}
                                                setSelectedData={(value) =>
                                                    handleSingleChange({
                                                        name: "selectedA2a",
                                                        value: value,
                                                    })
                                                }
                                                valueName={"_id"}
                                                placeholder={"select a2a "}
                                                randomIndex={"fieldName"}
                                                disabled={false}
                                                addNewButton={false}
                                            />
                                        </div>
                                    </div>{" "}
                                    <div>
                                        <label htmlFor=""> Reseller</label>
                                        <div className="">
                                            <SelectDropdown
                                                data={resellers}
                                                setData={setResellers}
                                                displayName={"companyName"}
                                                selectedData={data.resellerId}
                                                setSelectedData={(value) =>
                                                    handleSingleChange({
                                                        name: "resellerId",
                                                        value: value,
                                                    })
                                                }
                                                valueName={"_id"}
                                                randomIndex={"companyName"}
                                                disabled={false}
                                                addNewButton={false}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor=""> Select Ticket</label>
                                        <div className="">
                                            <SelectDropdown
                                                data={tickets}
                                                setData={setTickets}
                                                displayName={"fieldName"}
                                                selectedData={
                                                    data?.selectedTicket
                                                }
                                                setSelectedData={(value) =>
                                                    handleSingleChange({
                                                        name: "selectedTicket",
                                                        value: value,
                                                    })
                                                }
                                                valueName={"_id"}
                                                placeholder={"select ticket "}
                                                randomIndex={"fieldName"}
                                                disabled={false}
                                                addNewButton={false}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="">Total Pax </label>
                                        <select
                                            name="totalPax"
                                            value={data.totalPax || ""}
                                            onChange={handleChange}
                                            id=""
                                            className="capitalize"
                                        >
                                            <option value="" hidden>
                                                Select Number
                                            </option>
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
                                </div>
                            </div>
                        </div>
                        {data?.totalPax > 0 &&
                            data?.resellerId &&
                            data?.selectedA2a &&
                            data?.selectedTicket &&
                            data?.selectedDetails && (
                                <>
                                    <div className="w-full h-[40px] bg-blue-900 mt-10 flex items-center">
                                        <h2 className="text-white p-5">
                                            Order Details
                                        </h2>
                                    </div>

                                    <div className="flex items-top gap-2 ">
                                        <div>
                                            {passengerDetails.map(
                                                (passenger, index) => {
                                                    return (
                                                        <div className="p-5">
                                                            <h2 className="font-semibold py-2">
                                                                Passenger{" "}
                                                                {index + 1}
                                                            </h2>{" "}
                                                            <div className="grid grid-cols-3  gap-2">
                                                                <div>
                                                                    <label htmlFor="title">
                                                                        Mr/Mrs
                                                                    </label>
                                                                    <select
                                                                        name="title"
                                                                        value={
                                                                            passenger.title ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            handlePassengerChange(
                                                                                e,
                                                                                index
                                                                            );
                                                                        }}
                                                                        id="title"
                                                                        className="capitalize"
                                                                    >
                                                                        <option
                                                                            value=""
                                                                            hidden
                                                                        ></option>
                                                                        <option value="mr">
                                                                            Mr
                                                                        </option>
                                                                        <option value="mrs">
                                                                            Mrs
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label htmlFor="">
                                                                        First
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter  name"
                                                                        name="firstName"
                                                                        value={
                                                                            passenger.firstName ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            handlePassengerChange(
                                                                                e,
                                                                                index
                                                                            );
                                                                        }}
                                                                        required
                                                                    />
                                                                </div>{" "}
                                                                <div>
                                                                    <label htmlFor="">
                                                                        Last
                                                                        Name
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter  name"
                                                                        name="lastName"
                                                                        value={
                                                                            passenger.lastName ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            handlePassengerChange(
                                                                                e,
                                                                                index
                                                                            );
                                                                        }}
                                                                        required
                                                                    />
                                                                </div>{" "}
                                                                <div>
                                                                    <label htmlFor="">
                                                                        Nationality
                                                                    </label>
                                                                    <select
                                                                        name="nationality"
                                                                        value={
                                                                            passenger.nationality ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            handlePassengerChange(
                                                                                e,
                                                                                index
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
                                                                            (
                                                                                country,
                                                                                index
                                                                            ) => {
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
                                                                        Phone
                                                                        Code
                                                                    </label>
                                                                    <select
                                                                        name="code"
                                                                        value={
                                                                            passenger?.code ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            handlePassengerChange(
                                                                                e,
                                                                                index
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
                                                                            (
                                                                                country,
                                                                                index
                                                                            ) => {
                                                                                return (
                                                                                    <option
                                                                                        value={
                                                                                            country?.phonecode
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            country?.phonecode
                                                                                        }
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </select>
                                                                </div>{" "}
                                                                <div>
                                                                    <label htmlFor="">
                                                                        Phone
                                                                        Number
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        placeholder="Enter phoneNumber"
                                                                        name="phoneNumber"
                                                                        value={
                                                                            passenger.phoneNumber ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            handlePassengerChange(
                                                                                e,
                                                                                index
                                                                            );
                                                                        }}
                                                                        required
                                                                    />
                                                                </div>{" "}
                                                                <div>
                                                                    <label htmlFor="">
                                                                        Passport
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter passport Number"
                                                                        name="passportNo"
                                                                        value={
                                                                            passenger.passportNo ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            handlePassengerChange(
                                                                                e,
                                                                                index
                                                                            );
                                                                        }}
                                                                        required
                                                                    />
                                                                </div>{" "}
                                                                <div>
                                                                    <label htmlFor="">
                                                                        Reference
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Enter  Reference "
                                                                        name="reference"
                                                                        value={
                                                                            passenger.reference ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            handlePassengerChange(
                                                                                e,
                                                                                index
                                                                            );
                                                                        }}
                                                                        required
                                                                    />
                                                                </div>{" "}
                                                                <div className="flex flex-col items-center justify-center gap-2">
                                                                    <label htmlFor="">
                                                                        Is
                                                                        Infant
                                                                    </label>
                                                                    <input
                                                                        type="checkbox"
                                                                        name="isInfant"
                                                                        defaultChecked={
                                                                            passenger?.isInfant ===
                                                                            true
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            handlePassengerChange(
                                                                                e,
                                                                                index
                                                                            );
                                                                        }}
                                                                        // required
                                                                    />
                                                                </div>{" "}
                                                                {passenger.isInfant && (
                                                                    <>
                                                                        {" "}
                                                                        <div>
                                                                            <label htmlFor="title">
                                                                                Mr/Mrs
                                                                                (Infant)
                                                                            </label>
                                                                            <select
                                                                                name="title"
                                                                                value={
                                                                                    passenger
                                                                                        ?.infant
                                                                                        ?.title ||
                                                                                    ""
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    handleInfantChange(
                                                                                        e,
                                                                                        index
                                                                                    );
                                                                                }}
                                                                                id="title"
                                                                                className="capitalize"
                                                                            >
                                                                                <option
                                                                                    value=""
                                                                                    hidden
                                                                                ></option>
                                                                                <option value="mr">
                                                                                    Mr
                                                                                </option>
                                                                                <option value="mrs">
                                                                                    Mrs
                                                                                </option>
                                                                            </select>
                                                                        </div>
                                                                        <div>
                                                                            <label htmlFor="">
                                                                                First
                                                                                Name
                                                                                (Infant)
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Enter  name"
                                                                                name="firstName"
                                                                                value={
                                                                                    passenger
                                                                                        ?.infant
                                                                                        ?.firstName ||
                                                                                    ""
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    handleInfantChange(
                                                                                        e,
                                                                                        index
                                                                                    );
                                                                                }}
                                                                                required
                                                                            />
                                                                        </div>{" "}
                                                                        <div>
                                                                            <label htmlFor="">
                                                                                Last
                                                                                Name
                                                                                (Infant)
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Enter  name"
                                                                                name="lastName"
                                                                                value={
                                                                                    passenger
                                                                                        ?.infant
                                                                                        ?.lastName ||
                                                                                    ""
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    handleInfantChange(
                                                                                        e,
                                                                                        index
                                                                                    );
                                                                                }}
                                                                                required
                                                                            />
                                                                        </div>{" "}
                                                                        <div>
                                                                            <label htmlFor="">
                                                                                Passport
                                                                                (Infant)
                                                                            </label>
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Enter passport Number"
                                                                                name="passportNo"
                                                                                value={
                                                                                    passenger
                                                                                        ?.infant
                                                                                        ?.passportNo ||
                                                                                    ""
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    handleInfantChange(
                                                                                        e,
                                                                                        index
                                                                                    );
                                                                                }}
                                                                                required
                                                                            />
                                                                        </div>{" "}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>

                                        <div className="p-8 flex justify-center max-h-[450px]">
                                            <div class="max-w-sm rounded overflow-hidden shadow-lg">
                                                <div class="px-6 py-4 w-full">
                                                    <div className="p-2 bg-gray-50">
                                                        <div className="font-semibold text-base my-2 flex items-center justify-center gap-3">
                                                            <MdOutlineFlightTakeoff className="text-xl " />
                                                            <span>
                                                                Onward Fligth
                                                            </span>
                                                            <span className="font-light text-base">
                                                                {
                                                                    data
                                                                        ?.selectedDetails
                                                                        ?.airlineOnwardNo
                                                                }
                                                            </span>
                                                        </div>{" "}
                                                        <div class=" mb-2 flex gap-2 items-center ">
                                                            <span>
                                                                {" "}
                                                                {
                                                                    data
                                                                        ?.selectedDetails
                                                                        ?.airlineOnward
                                                                }
                                                            </span>
                                                            <span className="px-2">
                                                                {formatDate(
                                                                    data
                                                                        ?.selectedDetails
                                                                        ?.onwardDate
                                                                )}
                                                            </span>
                                                            <span>
                                                                {
                                                                    data
                                                                        ?.selectedDetails
                                                                        ?.takeOffTimeOnward
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="font-semibold text-base my-2 flex items-center justify-center gap-3">
                                                            <MdOutlineFlightTakeoff className="text-xl scale-x-[-1]" />
                                                            <span>
                                                                Return Fligth
                                                            </span>
                                                            <span className="font-light text-base">
                                                                {
                                                                    data
                                                                        ?.selectedDetails
                                                                        ?.airlineReturnNo
                                                                }
                                                            </span>
                                                        </div>{" "}
                                                        <div class="font- text-base mb-2 flex gap-2 items-center justify-center ">
                                                            <span>
                                                                {" "}
                                                                {
                                                                    data
                                                                        ?.selectedDetails
                                                                        ?.airlineReturn
                                                                }
                                                            </span>
                                                            <span className="px-2">
                                                                {formatDate(
                                                                    data
                                                                        ?.selectedDetails
                                                                        ?.returnDate
                                                                )}
                                                            </span>
                                                            <span>
                                                                {
                                                                    data
                                                                        ?.selectedDetails
                                                                        ?.takeOffTimeReturn
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="font-bold text-md mb-2 text-gray-400"></div>
                                                    <div class="text-gray-700 text-base flex gap-4  items-center justify-between mb-2 ">
                                                        <div className="flex font-bold text-sm">
                                                            Ticket
                                                        </div>
                                                        <div className="flex font-bold text-sm">
                                                            Count
                                                        </div>
                                                        <div className="flex font-bold text-sm">
                                                            Price
                                                        </div>
                                                        <div className="flex font-bold text-sm">
                                                            Total
                                                        </div>
                                                    </div>
                                                    {data?.totalPax > 0 && (
                                                        <div class="text-gray-700 text-base flex gap-4  items-center justify-between ">
                                                            <div className="flex">
                                                                Adult
                                                            </div>
                                                            <div className="flex">
                                                                {data?.totalPax}
                                                            </div>
                                                            <div className="flex">
                                                                {
                                                                    data
                                                                        ?.selectedDetails
                                                                        ?.price
                                                                }
                                                            </div>
                                                            <div className="flex">
                                                                {data
                                                                    ?.selectedDetails
                                                                    ?.price *
                                                                    data?.totalPax}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {infantCount > 0 && (
                                                        <div class="text-gray-700 text-base flex gap-4  items-center justify-between ">
                                                            <div className="flex">
                                                                Infant
                                                            </div>
                                                            <div className="flex">
                                                                {infantCount}
                                                            </div>
                                                            <div className="flex">
                                                                {
                                                                    data
                                                                        ?.selectedDetails
                                                                        ?.infantPrice
                                                                }
                                                            </div>
                                                            <div className="flex">
                                                                {data
                                                                    ?.selectedDetails
                                                                    ?.infantPrice *
                                                                    infantCount}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="w-full h-[2px] bg-black my-2"></div>
                                                    <div className="flex justify-end ">
                                                        {data?.selectedDetails
                                                            ?.price *
                                                            data?.totalPax +
                                                            data
                                                                ?.selectedDetails
                                                                ?.infantPrice *
                                                                infantCount}
                                                    </div>
                                                </div>
                                                <div class="px-6 pb-2">
                                                    <div className="mt-4 flex items-center justify-end gap-[12px]">
                                                        <button
                                                            className="w-[120px] rounded rounded-md"
                                                            onClick={
                                                                handleSubmit
                                                            }
                                                        >
                                                            {isLoading ? (
                                                                <BtnLoader />
                                                            ) : (
                                                                "Order"
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                    </form>
                </div>
            </div>
        </div>
    );
}
