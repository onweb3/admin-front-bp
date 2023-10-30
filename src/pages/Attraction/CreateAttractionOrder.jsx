import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, SelectDropdown } from "../../components";
import { useImageChange } from "../../hooks";
import { config } from "../../constants";
import moment from "moment";

export default function CreateAttractionOrder() {
    const [data, setData] = useState({
        attractionId: "",
        activityId: "",
        resellerId: "",
        date: "",
        adultsCount: 1,
        childrenCount: "",
        infantCount: "",
        value: "",
        agentReferenceNumber: "",
        name: "",
        phoneNumber: "",
        phoneCode: "",
        country: "",
        email: "",
        hoursCount: "",
        selectedSlot: {},
        selectedReseller: {},
    });
    const [totalAmount, setTotalAmount] = useState({
        calculatedChildPrice: "",
        calculatedAdultPrice: "",
        calcluatedTotalPrice: "",
        totalPvtTransferPrice: "",
    });
    const { countries } = useSelector((state) => state.general);
    const [wallet, setWallet] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [attractions, setAttractions] = useState([]);
    const [activities, setActivities] = useState([]);
    const [resellers, setResellers] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState("");
    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { image, handleImageChange, error: imageError } = useImageChange();
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };
    const fetchWallet = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/wallets/b2b/single/${data.resellerId}`,

                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setWallet(response.data);

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, [data.resellerId]);

    const handleSingleChange = ({ name, value }) => {
        try {
            if (name === "attractionId") {
                setData();
            }

            if (name === "activityId" || name === "resellerId") {
                setData((prev) => {
                    return {
                        attractionId: data?.attractionId,
                        activityId: data?.activityId,
                        resellerId: data?.resellerId,
                    };
                });
            }

            if (name === "selectedSlot") {
                let selectedDetails = timeSlots.find((timeSlot) => {
                    return timeSlot.EventID.toString() === value.toString(); // Added a return statement here
                });

                setData((prev) => {
                    return {
                        ...prev,
                        ["selectedSlot"]: selectedDetails,
                    };
                });
            } else {
                setData((prev) => {
                    return {
                        ...prev,
                        [name]: value,
                    };
                });
            }
        } catch (err) {}
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = {
                name: data.name,
                phoneNumber: data.phoneNumber,
                country: data.country,
                email: data.email,
                agentReferenceNumber: data.agentReferenceNumber,

                selectedActivities: [
                    {
                        activity: data.activityId,
                        date: data.date,
                        adultsCount: data?.adultsCount,
                        childrenCount: data?.childrenCount
                            ? data?.childrenCount
                            : 0,
                        hoursCount: data?.hoursCount ? data?.hoursCount : "",
                        infantCount: data.infantCount ? data.infantCount : 0,
                        transferType: data.value,
                        slot: {
                            EventID: data?.selectedSlot?.EventID,
                            EventName: data?.selectedSlot?.EventName,
                            StartDateTime: data?.selectedSlot?.StartDateTime,
                            EndDateTime: data?.selectedSlot?.EndDateTime,
                            ResourceID: data?.selectedSlot?.ResourceID,
                            Status: data?.selectedSlot?.Status,
                            AdultPrice: data?.selectedSlot?.AdultPrice,
                            ChildPrice: data?.selectedSlot?.ChildPrice,
                            Available: data?.selectedSlot?.Available,
                        },
                    },
                ],
            };
            const response = await axios.post(
                `/orders/attraction/create/${data.resellerId}`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const isConfirm = window.confirm("Are you sure to complete order?");
            if (isConfirm) {
                await axios.post(
                    `/orders/attraction/complete/${response.data._id}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
            setIsLoading(false);
            navigate(`/order/attraction/transaction`);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchAttractions = async () => {
        try {
            const response = await axios.get(`/orders/attraction/list`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setAttractions(response.data);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchTimeSlots = async () => {
        try {
            const response = await axios.post(
                `/orders/attraction/timeslot/${data.resellerId}`,
                {
                    productId: selectedActivity?.productId,
                    productCode: selectedActivity?.productCode,
                    timeSlotDate: data.date,
                    activityId: data.activityId,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const timeSlots = response.data.map((timeSlot) => {
                return {
                    ...timeSlot,
                    displayName: `${timeSlot.EventName}-avai(${
                        timeSlot.Available
                    })-adult(${timeSlot.AdultPrice} AED)-child(${
                        timeSlot.ChildPrice
                    } AED)-slot(${moment(timeSlot.StartDateTime).format(
                        "h:mm A"
                    )})`,
                };
            });

            setTimeSlots(timeSlots);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchActivities = async () => {
        try {
            if (data?.attractionId) {
                const response = await axios.get(
                    `/orders/attraction/activities/list/${data.attractionId}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                setActivities(response.data);
            }
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
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
            setIsLoading(false);
        }
    };

    const fetchSingleActivity = async () => {
        try {
            if (data?.attractionId && data?.activityId && data?.resellerId) {
                const response = await axios.get(
                    `/orders/attraction/single/activity/${data?.activityId}/${data?.resellerId}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                setSelectedActivity(response.data);
            }
        } catch (err) {}
    };
    console.log(data);
    useEffect(() => {
        fetchAttractions();
        fetchResellers();
    }, []);

    useEffect(() => {
        fetchActivities();
        setSelectedActivity("");
        setTimeSlots("");
    }, [data.attractionId]);

    useEffect(() => {
        fetchSingleActivity();
    }, [data.attractionId, data?.activityId, data?.resellerId]);

    useEffect(() => {
        if (
            selectedActivity &&
            selectedActivity?.attraction?.connectedApi ===
                "63f0a47b479d4a0376fe12f4" &&
            data?.date
        )
            fetchTimeSlots();
    }, [data.date]);

    useEffect(() => {
        if (
            selectedActivity &&
            data?.attractionId &&
            data?.activityId &&
            data?.resellerId &&
            data?.date &&
            data?.value
        ) {
            let totalPax =
                (!isNaN(data.adultsCount) ? Number(data.adultsCount) : 0) +
                (!isNaN(data.childrenCount) ? Number(data.childrenCount) : 0);

            let calculatedAdultPrice = 0;
            let calculatedChildPrice = 0;
            let calculatedInfantPrice = 0;
            let totalPvtTransferPrice = 0;
            let privateTransfersTotalPrice = 0;
            let privateTransfersTotalCost = 0;
            let privateTransfers = [];

            if (selectedActivity?.activityType === "transfer") {
                if (data?.value === "private") {
                    const sortedPvtTransfers =
                        selectedActivity.privateTransfers.sort(
                            (a, b) => a.maxCapacity - b.maxCapacity
                        );

                    let tempPax = totalPax;
                    while (tempPax > 0) {
                        for (let j = 0; j < sortedPvtTransfers.length; j++) {
                            if (
                                tempPax <= sortedPvtTransfers[j].maxCapacity ||
                                j === sortedPvtTransfers.length - 1
                            ) {
                                let currentPax =
                                    tempPax > sortedPvtTransfers[j].maxCapacity
                                        ? sortedPvtTransfers[j].maxCapacity
                                        : tempPax;
                                let pvtTransferPrice =
                                    sortedPvtTransfers[j].price;
                                let pvtTransferCost =
                                    sortedPvtTransfers[j].cost;

                                privateTransfersTotalPrice += pvtTransferPrice;
                                privateTransfersTotalCost += pvtTransferCost;
                                tempPax -= currentPax;

                                const objIndex = privateTransfers.findIndex(
                                    (obj) => {
                                        return (
                                            obj?.pvtTransferId ===
                                            sortedPvtTransfers[j]?._id
                                        );
                                    }
                                );

                                if (objIndex === -1) {
                                    privateTransfers.push({
                                        pvtTransferId:
                                            sortedPvtTransfers[j]?._id,
                                        name: sortedPvtTransfers[j].name,
                                        maxCapacity:
                                            sortedPvtTransfers[j].maxCapacity,
                                        count: 1,
                                        price: pvtTransferPrice,
                                        cost: sortedPvtTransfers[j].cost,
                                        totalPrice: pvtTransferPrice,
                                    });

                                    if (selectedActivity.base === "hourly") {
                                        totalPvtTransferPrice +=
                                            pvtTransferPrice * data?.hoursCount;
                                    } else {
                                        totalPvtTransferPrice +=
                                            pvtTransferPrice;
                                    }
                                } else {
                                    privateTransfers[objIndex].count += 1;
                                    privateTransfers[objIndex].totalPrice +=
                                        pvtTransferPrice;
                                    if (selectedActivity.base === "hourly") {
                                        totalPvtTransferPrice +=
                                            pvtTransferPrice * data?.hoursCount;
                                    } else {
                                        totalPvtTransferPrice +=
                                            pvtTransferPrice;
                                    }
                                }

                                if (tempPax <= 0) {
                                    break;
                                }
                            }
                        }
                    }
                } else if (data?.value === "shared") {
                    if (selectedActivity.base === "hourly") {
                        calculatedAdultPrice =
                            selectedActivity?.sharedTransferPrice *
                            data?.adultsCount *
                            data?.hoursCount;
                        calculatedChildPrice =
                            selectedActivity?.sharedTransferPrice *
                            data?.childrenCount *
                            data?.hoursCount;
                        calculatedInfantPrice =
                            selectedActivity?.sharedTransferPrice *
                            data?.infantCount *
                            data?.hoursCount;
                    } else {
                        calculatedAdultPrice =
                            selectedActivity?.sharedTransferPrice *
                            data?.adultsCount;
                        calculatedChildPrice =
                            selectedActivity?.sharedTransferPrice *
                            data?.childrenCount;
                        calculatedInfantPrice =
                            selectedActivity?.sharedTransferPrice *
                            data?.infantCount;
                    }
                }
            } else if (selectedActivity?.activityType === "normal") {
                if (data?.value === "without") {
                    calculatedAdultPrice =
                        selectedActivity?.adultPrice * data?.adultsCount;
                    calculatedChildPrice =
                        selectedActivity?.childPrice * data?.childrenCount;
                    calculatedInfantPrice =
                        selectedActivity?.infantPrice * data?.infantCount;
                } else if (data?.value === "shared") {
                    calculatedAdultPrice =
                        (selectedActivity?.sharedTransferPrice +
                            selectedActivity?.adultPrice) *
                        data?.adultsCount;
                    calculatedChildPrice =
                        (selectedActivity?.sharedTransferPrice +
                            selectedActivity?.childPrice) *
                        data?.childrenCount;

                    calculatedInfantPrice =
                        (selectedActivity?.sharedTransferPrice +
                            selectedActivity?.infantPrice) *
                        data?.infantCount;
                } else if (data?.value === "private") {
                    const sortedPvtTransfers =
                        selectedActivity.privateTransfers.sort(
                            (a, b) => a.maxCapacity - b.maxCapacity
                        );

                    let tempPax = totalPax;
                    while (tempPax > 0) {
                        for (let j = 0; j < sortedPvtTransfers.length; j++) {
                            if (
                                tempPax <= sortedPvtTransfers[j].maxCapacity ||
                                j === sortedPvtTransfers.length - 1
                            ) {
                                let currentPax =
                                    tempPax > sortedPvtTransfers[j].maxCapacity
                                        ? sortedPvtTransfers[j].maxCapacity
                                        : tempPax;
                                let pvtTransferPrice =
                                    sortedPvtTransfers[j].price;
                                let pvtTransferCost =
                                    sortedPvtTransfers[j].cost;

                                privateTransfersTotalPrice += pvtTransferPrice;
                                privateTransfersTotalCost += pvtTransferCost;
                                tempPax -= currentPax;

                                const objIndex = privateTransfers.findIndex(
                                    (obj) => {
                                        return (
                                            obj?.pvtTransferId ===
                                            sortedPvtTransfers[j]?._id
                                        );
                                    }
                                );

                                if (objIndex === -1) {
                                    privateTransfers.push({
                                        pvtTransferId:
                                            sortedPvtTransfers[j]?._id,
                                        name: sortedPvtTransfers[j].name,
                                        maxCapacity:
                                            sortedPvtTransfers[j].maxCapacity,
                                        count: 1,
                                        price: pvtTransferPrice,
                                        cost: sortedPvtTransfers[j].cost,
                                        totalPrice: pvtTransferPrice,
                                    });
                                    totalPvtTransferPrice += pvtTransferPrice;
                                } else {
                                    privateTransfers[objIndex].count += 1;
                                    privateTransfers[objIndex].totalPrice +=
                                        pvtTransferPrice;
                                    totalPvtTransferPrice += pvtTransferPrice;
                                }

                                if (tempPax <= 0) {
                                    break;
                                }
                            }
                        }
                    }
                    calculatedAdultPrice =
                        selectedActivity?.adultPrice * data?.adultsCount;
                    calculatedChildPrice =
                        selectedActivity?.childPrice * data?.childrenCount;
                    calculatedInfantPrice =
                        selectedActivity?.infantPrice * data?.infantCount;
                }
            }

            setTotalAmount({
                calculatedChildPrice,
                calculatedAdultPrice,
                totalPvtTransferPrice,
                calcluatedTotalPrice:
                    (data?.childrenCount > 0 ? calculatedChildPrice : 0) +
                    calculatedAdultPrice +
                    totalPvtTransferPrice,
            });
        }
    }, [data?.value, data?.adultsCount, data?.childrenCount, data?.hoursCount]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">
                    Create Attraction Order
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/order" className="text-textColor">
                        Orders{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Attraction</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleSubmit} className="">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor=""> Attractions</label>
                                <div className="">
                                    <SelectDropdown
                                        data={attractions}
                                        setData={setAttractions}
                                        displayName={"title"}
                                        selectedData={data.attractionId}
                                        setSelectedData={(value) =>
                                            handleSingleChange({
                                                name: "attractionId",
                                                value: value,
                                            })
                                        }
                                        valueName={"_id"}
                                        randomIndex={"title"}
                                        disabled={false}
                                        addNewButton={false}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="">Activites</label>
                                <div className="">
                                    <SelectDropdown
                                        data={activities}
                                        setData={setActivities}
                                        displayName={"name"}
                                        selectedData={data.activityId}
                                        setSelectedData={(value) =>
                                            handleSingleChange({
                                                name: "activityId",
                                                value: value,
                                            })
                                        }
                                        valueName={"_id"}
                                        randomIndex={"name"}
                                        disabled={false}
                                        addNewButton={false}
                                    />
                                </div>
                            </div>
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
                                <label htmlFor=""> Date</label>
                                <input
                                    type="date"
                                    placeholder="Enter ICAO code"
                                    name="date"
                                    value={data.date || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Transfer </label>
                                <select
                                    name="value"
                                    value={data.value || ""}
                                    onChange={handleChange}
                                    id=""
                                    required
                                    className="capitalize"
                                >
                                    <option value="" hidden>
                                        Select Options
                                    </option>
                                    {selectedActivity?.activityType ===
                                        "normal" && (
                                        <option value="without">Without</option>
                                    )}
                                    {selectedActivity?.isSharedTransferAvailable && (
                                        <option value="shared">Shared</option>
                                    )}
                                    {selectedActivity?.isPrivateTransferAvailable && (
                                        <option value="private">Private</option>
                                    )}
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="">Adult Count </label>
                                    <select
                                        name="adultsCount"
                                        value={data.adultsCount || ""}
                                        onChange={handleChange}
                                        id=""
                                        required
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
                                <div>
                                    <label htmlFor="">Children Count </label>
                                    <select
                                        name="childrenCount"
                                        value={data.childrenCount || ""}
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
                                <div>
                                    <label htmlFor="">Infant Count </label>
                                    <select
                                        name="infantCount"
                                        value={data.infantCount || ""}
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
                            {selectedActivity.base === "hourly" && (
                                <div>
                                    <label htmlFor="">Hour Count </label>
                                    <select
                                        name="hoursCount"
                                        value={data.hoursCount || ""}
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
                            )}
                            {selectedActivity?.attraction?.connectedApi ===
                                "63f0a47b479d4a0376fe12f4" && (
                                <div>
                                    <label htmlFor=""> Time Slot</label>
                                    <div className="">
                                        <SelectDropdown
                                            data={timeSlots}
                                            setData={setTimeSlots}
                                            displayName={"displayName"}
                                            selectedData={
                                                data?.selectedSlot?.EventID
                                            }
                                            setSelectedData={(value) =>
                                                handleSingleChange({
                                                    name: "selectedSlot",
                                                    value: value,
                                                })
                                            }
                                            valueName={"EventID"}
                                            randomIndex={"EventID"}
                                            disabled={false}
                                            addNewButton={false}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                        {selectedActivity &&
                            data?.attractionId &&
                            data?.activityId &&
                            data?.resellerId &&
                            data?.date &&
                            data?.value &&
                            data?.adultsCount > 0 && (
                                <>
                                    <div className="w-full h-[40px] bg-blue-900 mt-10 flex items-center">
                                        <h2 className="text-white p-5">
                                            Order Details
                                        </h2>
                                    </div>

                                    <div className="flex items-top gap-2 ">
                                        <div>
                                            <div className="grid grid-cols-3 p-5 gap-2">
                                                <div>
                                                    <label htmlFor="title">
                                                        Mr/Mrs
                                                    </label>
                                                    <select
                                                        name="title"
                                                        value={data.title || ""}
                                                        onChange={handleChange}
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
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter  name"
                                                        name="name"
                                                        value={data.name || ""}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>{" "}
                                                <div>
                                                    <label htmlFor="">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter email"
                                                        name="email"
                                                        value={data.email || ""}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>{" "}
                                                <div>
                                                    <label htmlFor="">
                                                        Nationality
                                                    </label>
                                                    <select
                                                        name="country"
                                                        value={
                                                            data.country || ""
                                                        }
                                                        onChange={handleChange}
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
                                                        Phone Code
                                                    </label>
                                                    <select
                                                        name="phoneCode"
                                                        value={
                                                            data.phoneCode || ""
                                                        }
                                                        onChange={handleChange}
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
                                                                            country.phonecode
                                                                        }
                                                                    >
                                                                        {
                                                                            country.phonecode
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </select>
                                                </div>{" "}
                                                <div>
                                                    <label htmlFor="">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder="Enter phoneNumber"
                                                        name="phoneNumber"
                                                        value={
                                                            data.phoneNumber ||
                                                            ""
                                                        }
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>{" "}
                                                <div>
                                                    <label htmlFor="">
                                                        Agent Reference Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Agent Reference Numbe"
                                                        name="agentReferenceNumber"
                                                        value={
                                                            data.agentReferenceNumber ||
                                                            ""
                                                        }
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>{" "}
                                            </div>
                                        </div>

                                        <div className="p-8 flex justify-center items-center">
                                            <div class="max-w-sm rounded overflow-hidden shadow-lg">
                                                <img
                                                    class="w-full"
                                                    src={
                                                        selectedActivity
                                                            ?.attraction
                                                            ?.images[0]
                                                            ? config.SERVER_URL +
                                                              selectedActivity
                                                                  ?.attraction
                                                                  ?.images[0]
                                                            : selectedActivity
                                                                  ?.attraction
                                                                  ?.images[0]
                                                    }
                                                    alt="Sunset in the mountains"
                                                />
                                                <div class="px-6 py-4 w-full">
                                                    <div class="font-bold text-xl mb-2">
                                                        {selectedActivity?.name}
                                                    </div>
                                                    <div class="font-bold text-md mb-2 text-gray-500">
                                                        {
                                                            selectedActivity
                                                                ?.attraction
                                                                ?.title
                                                        }
                                                    </div>
                                                    <div class="font-bold text-md mb-2 ">
                                                        {
                                                            selectedActivity?.activityType
                                                        }{" "}
                                                        <span className="text-green-400">
                                                            {" "}
                                                            ( {data?.value})
                                                        </span>
                                                    </div>
                                                    <div>
                                                        Account Balance :{" "}
                                                        {wallet?.balance.toFixed(
                                                            2
                                                        )}{" "}
                                                        AED
                                                    </div>
                                                    <div class="font-bold text-md mb-2 text-gray-400"></div>
                                                    <div class="text-gray-700 text-base flex gap-4  items-center justify-between mb-2 ">
                                                        <div className="flex font-bold text-sm">
                                                            Ticket For
                                                        </div>
                                                        <div className="flex font-bold text-sm">
                                                            Count
                                                        </div>
                                                        {selectedActivity.base ===
                                                            "hourly" && (
                                                            <div className="flex font-bold text-sm">
                                                                Hours
                                                            </div>
                                                        )}
                                                        <div className="flex font-bold text-sm">
                                                            Total
                                                        </div>
                                                    </div>
                                                    {data?.adultsCount > 0 &&
                                                        ((data?.value !==
                                                            "private" &&
                                                            selectedActivity.activityType ==
                                                                "transfer") ||
                                                            selectedActivity.activityType !==
                                                                "transfer") && (
                                                            <div class="text-gray-700 text-base flex gap-4  items-center justify-between ">
                                                                <div className="flex">
                                                                    Adult
                                                                </div>
                                                                <div className="flex">
                                                                    {
                                                                        data?.adultsCount
                                                                    }
                                                                </div>
                                                                {selectedActivity.base ===
                                                                    "hourly" && (
                                                                    <div className="flex">
                                                                        {
                                                                            data?.hoursCount
                                                                        }
                                                                    </div>
                                                                )}
                                                                <div className="flex">
                                                                    {
                                                                        totalAmount.calculatedAdultPrice
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}
                                                    {data?.childrenCount > 0 &&
                                                        ((data?.value !==
                                                            "private" &&
                                                            selectedActivity.activityType ==
                                                                "transfer") ||
                                                            selectedActivity.activityType !==
                                                                "transfer") && (
                                                            <div class="text-gray-700 text-base flex gap-4  items-center justify-between ">
                                                                <div className="flex">
                                                                    Child
                                                                </div>
                                                                <div className="flex">
                                                                    {
                                                                        data?.childrenCount
                                                                    }
                                                                </div>
                                                                {selectedActivity.base ===
                                                                    "hourly" && (
                                                                    <div className="flex">
                                                                        {
                                                                            data?.hoursCount
                                                                        }
                                                                    </div>
                                                                )}
                                                                <div className="flex">
                                                                    {
                                                                        totalAmount.calculatedChildPrice
                                                                    }
                                                                </div>
                                                            </div>
                                                        )}{" "}
                                                    {data?.value ===
                                                        "private" && (
                                                        <div class="text-gray-700 text-base flex gap-4  items-center justify-between ">
                                                            <div className="flex">
                                                                Pvt Transfer
                                                            </div>
                                                            {/* <div className="flex">
                                                                "N/A"
                                                            </div> */}
                                                            <div> </div>
                                                            {selectedActivity.base ===
                                                                "hourly" && (
                                                                <div className="flex">
                                                                    {
                                                                        data?.hoursCount
                                                                    }
                                                                </div>
                                                            )}
                                                            <div className="flex">
                                                                {
                                                                    totalAmount.totalPvtTransferPrice
                                                                }
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="w-full h-[2px] bg-black my-2"></div>
                                                    <div className="flex justify-end ">
                                                        {
                                                            totalAmount.calcluatedTotalPrice
                                                        }
                                                    </div>
                                                </div>
                                                <div class="px-6 pb-2">
                                                    <div className="mt-4 flex items-center justify-end gap-[12px]">
                                                        <button className="w-[120px] rounded rounded-md">
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

                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
