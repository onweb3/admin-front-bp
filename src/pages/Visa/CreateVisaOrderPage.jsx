import React, { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axios";
import { BtnLoader, SelectDropdown } from "../../components";

export default function CreateVisaOrderPage() {
    const [visaCountries, setVisaCountries] = useState([]);
    const [visaNationalities, setVisaNationalities] = useState([]);
    const [resellers, setResellers] = useState([]);
    const [visaTypes, setVisaTypes] = useState([]);
    const [data, setData] = useState({
        countryId: "",
        nationalityId: "",
        resellerId: "",
        visaTypeId: "",
        adultsCount: 0,
        childrenCount: 0,
    });
    const navigate = useNavigate();
    const [isUpload, setIsUpload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const monthNames = [
        {
            name: "January",
            value: 1,
        },
        {
            name: "February",
            value: 2,
        },
        {
            name: "March",
            value: 3,
        },
        {
            name: "April",
            value: 4,
        },
        {
            name: "May",
            value: 5,
        },
        {
            name: "June",
            value: 6,
        },
        {
            name: "July",
            value: 7,
        },
        {
            name: "August",
            value: 8,
        },
        {
            name: "September",
            value: 9,
        },
        {
            name: "October",
            value: 10,
        },
        {
            name: "November",
            value: 11,
        },
        {
            name: "December",
            value: 12,
        },
    ];
    const [wallet, setWallet] = useState("");
    let limit = new Date().getFullYear();
    let year = [];
    for (let i = limit; i > limit - 100; i--) {
        year.push(i);
    }

    let explimit = new Date().getFullYear();
    let expYear = [];
    for (let i = explimit; i < explimit + 100; i++) {
        expYear.push(i);
    }

    let day = [];
    for (let i = 1; i <= 31; i++) {
        day.push(i);
    }
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const [passengerDetails, setPassengerDetails] = useState([]);
    const { countries } = useSelector((state) => state.general);

    const { jwtToken } = useSelector((state) => state.admin);
    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });

        if (
            e.target.name === "adultsCount" ||
            e.target.name === "childrenCount"
        ) {
            console.log("call reached 1");
            setPassengerDetails((prev) => {
                let adultlength;
                let childlength;
                if (e.target.name === "adultsCount") {
                    adultlength = parseInt(e.target.value);
                    childlength = parseInt(data?.childrenCount);
                }

                if (e.target.name === "childrenCount") {
                    childlength = parseInt(e.target.value);
                    adultlength = parseInt(data?.adultsCount);
                }

                console.log("call reached 2", adultlength, childlength);

                if (!isNaN(adultlength)) {
                    const newArray = [];
                    for (let i = 0; i < adultlength; i++) {
                        newArray.push({
                            title: "",
                            firstName: "",
                            paxType: "ADT",
                            lastName: "",
                            contactNo: "",
                            email: "",
                            passportNo: "",
                            expiryDate: {
                                day: "",
                                month: "",
                                year: "",
                            },
                            dateOfBirth: { day: "", month: "", year: "" },
                        });
                    }

                    for (let i = 0; i < childlength; i++) {
                        newArray.push({
                            title: "",
                            firstName: "",
                            lastName: "",
                            paxType: "CHD",
                            contactNo: "",
                            email: "",
                            passportNo: "",
                            expiryDate: {
                                day: "",
                                month: "",
                                year: "",
                            },
                            dateOfBirth: { day: "", month: "", year: "" },
                        });
                    }
                    return newArray;
                }

                // Handle the case where e.target.value is not a valid integer
                return prev; // Return the previous state
            });
        }
    };

    const handlePassengerChange = (e, index) => {
        const { name, value } = e.target;

        setPassengerDetails((prev) => {
            const updatedPassengerDetails = [...prev];

            updatedPassengerDetails[index] = {
                ...updatedPassengerDetails[index],
                [name]: value,
            };

            return updatedPassengerDetails;
        });
    };

    const handleDateChange = ({ name, value, field, index }) => {
        setPassengerDetails((prev) => {
            const updatedPassengerDetails = [...prev];

            updatedPassengerDetails[index] = {
                ...updatedPassengerDetails[index],
                [field]: {
                    ...updatedPassengerDetails[index][field],
                    [name]: value,
                },
            };

            return updatedPassengerDetails;
        });
    };

    const fetchCountries = async () => {
        try {
            const response = await axios.get(`/orders/visa/country/all`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setVisaCountries(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchNationality = async () => {
        try {
            const response = await axios.get(`/orders/visa/all/nationality`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setVisaNationalities(response.data);
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

    const fetchVisaTypes = async () => {
        try {
            const response = await axios.get(
                `/orders/visa/type/${data.countryId}/all/${data.nationalityId}/${data.resellerId}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setVisaTypes(response.data);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setVisaTypes([]);
            // setIsLoading(false);
        }
    };

    const handleSingleChange = ({ name, value }) => {
        if (name === "visaTypeId") {
            let selectedDetails = visaTypes.find((ticket) => {
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
    };

    useEffect(() => {
        setData((prev) => {
            return {
                ...prev,
                ["visaTypeId"]: "",
                ["selectedDetail"]: "",
            };
        });
        setVisaTypes([]);
        if (data.countryId && data.nationalityId && data.resellerId) {
            fetchVisaTypes();
        }
    }, [data?.countryId, data?.nationalityId, data?.resellerId]);

    useEffect(() => {
        fetchNationality();
        fetchCountries();
        fetchResellers();
    }, []);

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

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            // setError("");

            const formData = {
                visaType: data.visaTypeId,
                noOfAdult: data.adultsCount,
                noOfChild: data.childrenCount,
                nationality: data.nationalityId,
                travellers: passengerDetails,
            };

            const response = await axios.post(
                `/orders/visa/create/${data.resellerId}`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const isConfirm = window.confirm("Are you sure to complete order?");
            if (isConfirm) {
                let res = await axios.post(
                    `/orders/visa/payment/${response.data._id}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                navigate(`/order/visa/${res?.data?._id}`);
            }
        } catch (err) {
            setIsLoading(false);

            console.log(err);
        }
    };

    console.log(passengerDetails, data?.selectedDetails, "details");

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">Create Visa Order</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/order" className="text-textColor">
                        Orders{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Visa</span>
                </div>
            </div>{" "}
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form
                        action=""
                        // onSubmit={handleSubmit}
                        className=""
                    >
                        <div>
                            {!isUpload && (
                                <div className="w-full p-5">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="">
                                                {" "}
                                                Select country
                                            </label>
                                            <div className="">
                                                <SelectDropdown
                                                    data={visaCountries}
                                                    setData={setVisaCountries}
                                                    displayName={"countryName"}
                                                    selectedData={
                                                        data?.countryId
                                                    }
                                                    setSelectedData={(value) =>
                                                        handleSingleChange({
                                                            name: "countryId",
                                                            value: value,
                                                        })
                                                    }
                                                    valueName={"_id"}
                                                    placeholder={
                                                        "select country"
                                                    }
                                                    randomIndex={"_id"}
                                                    disabled={false}
                                                    addNewButton={false}
                                                />
                                            </div>
                                        </div>{" "}
                                        <div>
                                            <label htmlFor="">
                                                {" "}
                                                Select Nationality
                                            </label>
                                            <div className="">
                                                <SelectDropdown
                                                    data={visaNationalities}
                                                    setData={
                                                        setVisaNationalities
                                                    }
                                                    displayName={"nationality"}
                                                    selectedData={
                                                        data?.nationalityId
                                                    }
                                                    setSelectedData={(value) =>
                                                        handleSingleChange({
                                                            name: "nationalityId",
                                                            value: value,
                                                        })
                                                    }
                                                    valueName={"_id"}
                                                    placeholder={
                                                        "select nationality "
                                                    }
                                                    randomIndex={"_id"}
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
                                                    selectedData={
                                                        data.resellerId
                                                    }
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
                                            <label htmlFor="">
                                                {" "}
                                                Select VisaTypes
                                            </label>
                                            <div className="">
                                                <SelectDropdown
                                                    data={visaTypes}
                                                    setData={setVisaTypes}
                                                    displayName={"visaName"}
                                                    selectedData={
                                                        data?.visaTypeId
                                                    }
                                                    setSelectedData={(value) =>
                                                        handleSingleChange({
                                                            name: "visaTypeId",
                                                            value: value,
                                                        })
                                                    }
                                                    valueName={"_id"}
                                                    placeholder={"select visa "}
                                                    randomIndex={"_id"}
                                                    disabled={false}
                                                    addNewButton={false}
                                                />
                                            </div>
                                        </div>{" "}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="">
                                                    Adult Count{" "}
                                                </label>
                                                <select
                                                    name="adultsCount"
                                                    value={
                                                        data.adultsCount || ""
                                                    }
                                                    onChange={handleChange}
                                                    id=""
                                                    required
                                                    className="capitalize"
                                                >
                                                    <option value="" hidden>
                                                        Select Number
                                                    </option>
                                                    {numbers?.map(
                                                        (number, index) => {
                                                            return (
                                                                <option
                                                                    value={
                                                                        number
                                                                    }
                                                                    key={index}
                                                                    className="capitalize"
                                                                >
                                                                    {number}
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="">
                                                    Children Count{" "}
                                                </label>
                                                <select
                                                    name="childrenCount"
                                                    value={
                                                        data.childrenCount || ""
                                                    }
                                                    onChange={handleChange}
                                                    id=""
                                                    className="capitalize"
                                                >
                                                    <option value="" hidden>
                                                        Select Number
                                                    </option>
                                                    {numbers?.map(
                                                        (number, index) => {
                                                            return (
                                                                <option
                                                                    value={
                                                                        number
                                                                    }
                                                                    key={index}
                                                                    className="capitalize"
                                                                >
                                                                    {number}
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {data.adultsCount > 0 &&
                                        data.nationalityId &&
                                        data.countryId &&
                                        data.resellerId && (
                                            <>
                                                <div className="w-full h-[40px] bg-blue-900 mt-10 flex items-center">
                                                    <h2 className="text-white p-5">
                                                        Order Details
                                                    </h2>
                                                </div>
                                                <div className="flex items-top gap-2 ">
                                                    <div>
                                                        {passengerDetails.map(
                                                            (
                                                                passenger,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <div className="p-5">
                                                                        <h2 className="font-semibold py-2">
                                                                            Passenger{" "}
                                                                            {index +
                                                                                1}
                                                                            <span className="pl-1">
                                                                                ({" "}
                                                                                {passenger?.paxType ===
                                                                                "ADT"
                                                                                    ? "Adult"
                                                                                    : "Child"}

                                                                                )
                                                                            </span>
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
                                                                                    Email
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Enter  email"
                                                                                    name="email"
                                                                                    value={
                                                                                        passenger.email ||
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
                                                                                    Phone
                                                                                    Number
                                                                                </label>
                                                                                <input
                                                                                    type="number"
                                                                                    placeholder="Enter phoneNumber"
                                                                                    name="contactNo"
                                                                                    value={
                                                                                        passenger.contactNo ||
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
                                                                                    Passport
                                                                                    Expiry
                                                                                </label>
                                                                                <div className="grid grid-cols-3 gap-2">
                                                                                    <div>
                                                                                        <select
                                                                                            className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none bg-transparent"
                                                                                            name="day"
                                                                                            value={
                                                                                                passenger
                                                                                                    ?.expiryDate
                                                                                                    ?.day
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) => {
                                                                                                handleDateChange(
                                                                                                    {
                                                                                                        value: e
                                                                                                            .target
                                                                                                            .value,
                                                                                                        name: e
                                                                                                            .target
                                                                                                            .name,
                                                                                                        field: "expiryDate",
                                                                                                        index,
                                                                                                    }
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <option
                                                                                                hidden
                                                                                            >
                                                                                                Day
                                                                                            </option>
                                                                                            {day.map(
                                                                                                (
                                                                                                    item,
                                                                                                    index
                                                                                                ) => (
                                                                                                    <option
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                        value={
                                                                                                            item
                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            item
                                                                                                        }
                                                                                                    </option>
                                                                                                )
                                                                                            )}
                                                                                        </select>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <select
                                                                                            className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none bg-transparent"
                                                                                            name="month"
                                                                                            value={
                                                                                                passenger
                                                                                                    ?.expiryDate
                                                                                                    ?.month
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) => {
                                                                                                handleDateChange(
                                                                                                    {
                                                                                                        value: e
                                                                                                            .target
                                                                                                            .value,
                                                                                                        name: e
                                                                                                            .target
                                                                                                            .name,
                                                                                                        field: "expiryDate",
                                                                                                        index,
                                                                                                    }
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <option
                                                                                                hidden
                                                                                            >
                                                                                                Month
                                                                                            </option>
                                                                                            {monthNames.map(
                                                                                                (
                                                                                                    item,
                                                                                                    index
                                                                                                ) => (
                                                                                                    <option
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                        value={
                                                                                                            item.value
                                                                                                        }
                                                                                                        className="capitalize"
                                                                                                    >
                                                                                                        {
                                                                                                            item.name
                                                                                                        }{" "}
                                                                                                    </option>
                                                                                                )
                                                                                            )}
                                                                                        </select>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <select
                                                                                            className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none bg-transparent"
                                                                                            name="year"
                                                                                            // value={
                                                                                            //     row
                                                                                            //         ?.expiryDate
                                                                                            //         ?.year
                                                                                            // }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) => {
                                                                                                handleDateChange(
                                                                                                    {
                                                                                                        value: e
                                                                                                            .target
                                                                                                            .value,
                                                                                                        name: e
                                                                                                            .target
                                                                                                            .name,
                                                                                                        field: "expiryDate",
                                                                                                        index,
                                                                                                    }
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <option
                                                                                                hidden
                                                                                            >
                                                                                                Year
                                                                                            </option>
                                                                                            {expYear.map(
                                                                                                (
                                                                                                    item,
                                                                                                    index
                                                                                                ) => (
                                                                                                    <option
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                        value={
                                                                                                            item
                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            item
                                                                                                        }
                                                                                                    </option>
                                                                                                )
                                                                                            )}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>{" "}
                                                                            <div>
                                                                                <label htmlFor="">
                                                                                    Date
                                                                                    Of
                                                                                    Birth
                                                                                </label>
                                                                                <div className="grid grid-cols-3 gap-2">
                                                                                    <div>
                                                                                        <select
                                                                                            className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none bg-transparent"
                                                                                            name="day"
                                                                                            value={
                                                                                                passenger
                                                                                                    ?.dateOfBirth
                                                                                                    ?.day
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) => {
                                                                                                handleDateChange(
                                                                                                    {
                                                                                                        value: e
                                                                                                            .target
                                                                                                            .value,
                                                                                                        name: e
                                                                                                            .target
                                                                                                            .name,
                                                                                                        field: "dateOfBirth",
                                                                                                        index,
                                                                                                    }
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <option
                                                                                                hidden
                                                                                            >
                                                                                                Day
                                                                                            </option>
                                                                                            {day.map(
                                                                                                (
                                                                                                    item,
                                                                                                    index
                                                                                                ) => (
                                                                                                    <option
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                        value={
                                                                                                            item
                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            item
                                                                                                        }
                                                                                                    </option>
                                                                                                )
                                                                                            )}
                                                                                        </select>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <select
                                                                                            className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none bg-transparent"
                                                                                            name="month"
                                                                                            value={
                                                                                                passenger
                                                                                                    ?.dateOfBirth
                                                                                                    ?.month
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) => {
                                                                                                handleDateChange(
                                                                                                    {
                                                                                                        value: e
                                                                                                            .target
                                                                                                            .value,
                                                                                                        name: e
                                                                                                            .target
                                                                                                            .name,
                                                                                                        field: "dateOfBirth",
                                                                                                        index,
                                                                                                    }
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <option
                                                                                                hidden
                                                                                            >
                                                                                                Month
                                                                                            </option>
                                                                                            {monthNames.map(
                                                                                                (
                                                                                                    item,
                                                                                                    index
                                                                                                ) => (
                                                                                                    <option
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                        value={
                                                                                                            item.value
                                                                                                        }
                                                                                                        className="capitalize"
                                                                                                    >
                                                                                                        {
                                                                                                            item.name
                                                                                                        }{" "}
                                                                                                    </option>
                                                                                                )
                                                                                            )}
                                                                                        </select>
                                                                                    </div>
                                                                                    <div className="">
                                                                                        <select
                                                                                            className="w-full py-2 p-1 text-primaryColor border-b border-darktext outline-none bg-transparent"
                                                                                            name="year"
                                                                                            value={
                                                                                                passenger
                                                                                                    ?.dateOfBirth
                                                                                                    ?.year
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) => {
                                                                                                handleDateChange(
                                                                                                    {
                                                                                                        value: e
                                                                                                            .target
                                                                                                            .value,
                                                                                                        name: e
                                                                                                            .target
                                                                                                            .name,
                                                                                                        field: "dateOfBirth",
                                                                                                        index,
                                                                                                    }
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <option
                                                                                                hidden
                                                                                            >
                                                                                                Year
                                                                                            </option>
                                                                                            {year.map(
                                                                                                (
                                                                                                    item,
                                                                                                    index
                                                                                                ) => (
                                                                                                    <option
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                        value={
                                                                                                            item
                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            item
                                                                                                        }
                                                                                                    </option>
                                                                                                )
                                                                                            )}
                                                                                        </select>
                                                                                    </div>
                                                                                </div>
                                                                            </div>{" "}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                    <div className="p-8 flex justify-center max-h-[450px]">
                                                        <div class="max-w-sm rounded overflow-hidden shadow-lg">
                                                            <div class="px-6 py-4 w-full ">
                                                                <div>
                                                                    Account
                                                                    Balance :{" "}
                                                                    {wallet?.balance.toFixed(
                                                                        2
                                                                    )}{" "}
                                                                    AED
                                                                </div>
                                                                <div className="flex items-center justify-evenly  p-2 bg-gray-50">
                                                                    <div className="font-semibold text-md flex flex-col   gap-3">
                                                                        <span>
                                                                            Visa
                                                                        </span>
                                                                        <span>
                                                                            Validity
                                                                        </span>
                                                                    </div>{" "}
                                                                    <div className="font-semibold text-md my-2 flex flex-col pl-5 ">
                                                                        <span className="font-light text-sm">
                                                                            {
                                                                                data
                                                                                    ?.selectedDetails
                                                                                    ?.visaName
                                                                            }
                                                                        </span>
                                                                        <span className="font-light text-sm">
                                                                            {
                                                                                data
                                                                                    ?.selectedDetails
                                                                                    ?.validity
                                                                            }{" "}
                                                                            days
                                                                        </span>
                                                                    </div>{" "}
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
                                                                {data?.adultsCount >
                                                                    0 && (
                                                                    <div class="text-gray-700 text-base flex gap-4  items-center justify-between ">
                                                                        <div className="flex">
                                                                            Adult
                                                                        </div>
                                                                        <div className="flex">
                                                                            {
                                                                                data?.adultsCount
                                                                            }
                                                                        </div>
                                                                        <div className="flex">
                                                                            {
                                                                                data
                                                                                    ?.selectedDetails
                                                                                    ?.adultPrice
                                                                            }
                                                                        </div>
                                                                        <div className="flex">
                                                                            {data
                                                                                ?.selectedDetails
                                                                                ?.adultPrice *
                                                                                data?.adultsCount}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {data.childrenCount >
                                                                    0 && (
                                                                    <div class="text-gray-700 text-base flex gap-4  items-center justify-between ">
                                                                        <div className="flex">
                                                                            Child
                                                                        </div>
                                                                        <div className="flex">
                                                                            {
                                                                                data.childrenCount
                                                                            }
                                                                        </div>
                                                                        <div className="flex">
                                                                            {
                                                                                data
                                                                                    ?.selectedDetails
                                                                                    ?.childPrice
                                                                            }
                                                                        </div>
                                                                        <div className="flex">
                                                                            {data
                                                                                ?.selectedDetails
                                                                                ?.childPrice *
                                                                                data.childrenCount}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="w-full h-[2px] bg-black my-2"></div>
                                                                <div className="flex justify-end ">
                                                                    {data
                                                                        ?.selectedDetails
                                                                        ?.adultPrice *
                                                                        data?.adultsCount +
                                                                        data
                                                                            ?.selectedDetails
                                                                            ?.childPrice *
                                                                            data.childrenCount}
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
                                                                        {/* {isLoading ? (
                                                                            <BtnLoader />
                                                                        ) : ( */}
                                                                        "Order"
                                                                        {/* )} */}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                </div>
                            )}

                            {isUpload && (
                                <>
                                    <div className="w-full h-[40px] bg-blue-900 flex items-center">
                                        <h2 className="text-white p-5">
                                            Upload Documents
                                        </h2>
                                    </div>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
