import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { AddVoucherV2HotelSection, AddVoucherV2TourTable } from "../../features/Voucher";
import { BtnLoader, PageLoader, RichTextEditor } from "../../components";
import axios from "../../axios";

export default function EditVoucherV2Page() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [initialData, setInitialData] = useState({
        airports: [],
        hotels: [],
        activities: [],
    });
    const [data, setData] = useState({
        passengerName: "",
        noOfAdults: 0,
        noOfChildren: 0,
        childrenAges: [],
        buffetBreakfast: "",
        basisOfTransfer: "",
        arrivalAirportId: "",
        contactName: "Mr. Atif / Mr. Kashif Jamal / Mr. Siddique",
        contactNumber: "+971 566807610 / +971 523413561 / +971 52 906 4745",
        printNote:
            "The maximum waiting period for a driver, for an arrival transfer would be Forty Five Minutes after the flight lands. If guest does not inform the driver in the given waiting period our driver will move from the airport. It is thus important to share the guests contact details in advance.",
        pagingName: "",
        arrivalDate: "",
        arrivalNote: "",
        departureDate: "",
        departureNote: "",
        termsAndConditions: "",
    });
    const [tourData, setTourData] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);
    const { id } = useParams();

    const handleNoOfChildrenChange = (e) => {
        const tempArray = Array.from({ length: Number(e.target.value) }, () => "0");

        setData((prev) => {
            return {
                ...prev,
                noOfChildren: e.target.value,
                childrenAges: [...prev.childrenAges, ...tempArray]?.slice(
                    0,
                    Number(e.target.value)
                ),
            };
        });
    };

    const handleChildrenAgeChange = (e, index) => {
        setData((prev) => {
            const updatedChildrenAges = [...prev.childrenAges];
            updatedChildrenAges[index] = e.target.value;
            return { ...prev, childrenAges: updatedChildrenAges };
        });
    };

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const response = await axios.patch(
                `/v2/vouchers/update/${id}`,
                { ...data, tours: tourData, hotels },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(`/vouchers/v2/${response?.data?._id}`);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const fetchVoucher = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/v2/vouchers/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            const {
                referenceNumber,
                passengerName,
                noOfAdults,
                noOfChildren,
                childrenAges,
                buffetBreakfast,
                basisOfTransfer,
                arrivalAirportId,
                contactName,
                contactNumber,
                printNote,
                arrivalDate,
                arrivalNote,
                departureDate,
                departureNote,
                termsAndConditions,
                tours,
                pagingName,
                hotels,
            } = response.data?.voucherAmendment;

            setData((prev) => {
                return {
                    ...prev,
                    referenceNumber,
                    passengerName,
                    noOfAdults,
                    noOfChildren,
                    childrenAges: childrenAges || [],
                    buffetBreakfast,
                    basisOfTransfer,
                    arrivalAirportId,
                    contactName,
                    contactNumber,
                    printNote,
                    arrivalDate: arrivalDate ? arrivalDate?.substring(0, 10) : "",
                    arrivalNote,
                    departureDate: departureDate ? departureDate?.substring(0, 10) : "",
                    departureNote,
                    termsAndConditions,
                    pagingName: pagingName || "",
                };
            });
            const tempHotels = hotels?.map((item) => {
                delete item?.hotelName;
                delete item?._id;

                return item;
            });
            setHotels(tempHotels);

            const updatedTours = tours?.map((item) => {
                delete item._id;
                if (!isNaN(item.pickupTimeFrom) && item.pickupTimeFrom !== null) {
                    item.pickupTimeFrom = convertMinutesTo24HourTime(item?.pickupTimeFrom);
                }
                if (!isNaN(item.pickupTimeTo) && item.pickupTimeTo !== null) {
                    item.pickupTimeTo = convertMinutesTo24HourTime(item?.pickupTimeTo);
                }
                if (!isNaN(item.returnTimeFrom) && item.returnTimeFrom !== null) {
                    item.returnTimeFrom = convertMinutesTo24HourTime(item?.returnTimeFrom);
                }
                return item;
            });
            setTourData(updatedTours || []);
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchInitalData = async () => {
        try {
            const response = await axios.get(`/vouchers/initial-data`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setInitialData((prev) => {
                return {
                    ...prev,
                    hotels: response?.data?.hotels,
                    airports: response?.data?.airports,
                    activities: response?.data?.activities,
                };
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVoucher();
        fetchInitalData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/vouchers/settings", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setData((prev) => {
                return { ...prev, termsAndConditions: response?.data?.termsAndCondition || "" };
            });
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Edit Voucher V2</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/vouchers/v2" className="text-textColor">
                        Vouchers{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>V2 </span>
                    <span>{">"} </span>
                    <Link to={`/vouchers/v2/${id}`} className="text-textColor">
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm p-6">
                        <div className="grid grid-cols-3 gap-[20px]">
                            <div>
                                <label htmlFor="">Reference Number *</label>
                                <input
                                    type="text"
                                    name="referenceNumber"
                                    onChange={handleChange}
                                    value={data.referenceNumber || ""}
                                    placeholder="Enter Reference Number"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Passenger Name *</label>
                                <input
                                    type="text"
                                    name="passengerName"
                                    value={data.passengerName || ""}
                                    onChange={(e) => {
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                passengerName: e.target.value,
                                                pagingName: e.target.value,
                                            };
                                        });
                                    }}
                                    placeholder="Ex: Mr. John Deo"
                                />
                            </div>
                            <div>
                                <label htmlFor="">No Of Adults *</label>
                                <input
                                    type="number"
                                    name="noOfAdults"
                                    value={data.noOfAdults || ""}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label htmlFor="">No Of Children *</label>
                                <input
                                    type="number"
                                    name="noOfChildren"
                                    value={data.noOfChildren || ""}
                                    onChange={handleNoOfChildrenChange}
                                    placeholder="0"
                                />
                            </div>
                            {data.childrenAges && data.childrenAges?.length > 0 && (
                                <div className="col-span-2">
                                    <label htmlFor="" className="w-[100%] max-w-[180px]">
                                        Children Ages *
                                    </label>
                                    <div className="flex items-center flex-wrap gap-[10px]">
                                        {data.childrenAges?.map((age, index) => {
                                            return (
                                                <select
                                                    name=""
                                                    className="w-[100px]"
                                                    value={age || ""}
                                                    key={index}
                                                    onChange={(e) =>
                                                        handleChildrenAgeChange(e, index)
                                                    }
                                                >
                                                    <option value="" hidden>
                                                        None
                                                    </option>
                                                    {Array.from({
                                                        length: 18,
                                                    }).map((_, arrIndex) => {
                                                        return (
                                                            <option value={arrIndex} key={arrIndex}>
                                                                {arrIndex} - {arrIndex + 1} yrs
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-[20px] mt-4">
                            <div>
                                <label htmlFor="">Buffet Breakfast</label>
                                <input
                                    type="text"
                                    name="buffetBreakfast"
                                    onChange={handleChange}
                                    value={data.buffetBreakfast || ""}
                                    placeholder="Enter Buffet Breakfast"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Basis Of Transfer *</label>
                                <input
                                    type="text"
                                    name="basisOfTransfer"
                                    onChange={handleChange}
                                    value={data.basisOfTransfer || ""}
                                    placeholder="Enter Basis Of Transfer"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Paging Name *</label>
                                <input
                                    type="text"
                                    name="pagingName"
                                    onChange={handleChange}
                                    value={data.pagingName || ""}
                                    placeholder="Enter Paging Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="">Arrival Airport</label>
                                <select
                                    name="arrivalAirportId"
                                    value={data.arrivalAirportId || ""}
                                    onChange={handleChange}
                                    id=""
                                    className="capitalize"
                                >
                                    <option value="" hidden>
                                        Select Airport
                                    </option>
                                    {initialData?.airports?.map((airport, index) => {
                                        return (
                                            <option value={airport?._id} key={index}>
                                                {airport?.airportName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-[20px] mt-4">
                            <div>
                                <label htmlFor="">Arrival Date</label>
                                <input
                                    type="date"
                                    name="arrivalDate"
                                    value={data.arrivalDate || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="">Arrival At</label>
                                <input
                                    type="text"
                                    name="arrivalNote"
                                    onChange={handleChange}
                                    value={data.arrivalNote || ""}
                                    placeholder="Enter Arrival At"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-[20px] mt-4">
                            <div>
                                <label htmlFor="">Departure Date</label>
                                <input
                                    type="date"
                                    name="departureDate"
                                    value={data.departureDate || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="">Departure At</label>
                                <input
                                    type="text"
                                    name="departureNote"
                                    onChange={handleChange}
                                    value={data.departureNote || ""}
                                    placeholder="Enter Departure At"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Print Note</label>
                            <textarea
                                name="printNote"
                                id=""
                                value={data.printNote || ""}
                                placeholder="Enter Print Note"
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="mt-4">
                            <h2 className="font-medium mb-2">Emergency Contact Info</h2>
                            <div className="grid grid-cols-3 gap-[20px]">
                                <div>
                                    <label htmlFor="">Contact Name *</label>
                                    <input
                                        type="text"
                                        name="contactName"
                                        onChange={handleChange}
                                        value={data.contactName || ""}
                                        placeholder="Enter Contact Name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Contact Number *</label>
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        onChange={handleChange}
                                        value={data.contactNumber || ""}
                                        placeholder="Enter Contact Number"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <AddVoucherV2HotelSection
                                hotels={hotels}
                                setHotels={setHotels}
                                initialData={initialData}
                            />
                        </div>

                        <AddVoucherV2TourTable tourData={tourData} setTourData={setTourData} />

                        <div className="mt-8">
                            <h1 className="text-[14px]">Terms And Conditions *</h1>
                            <div className="mt-2">
                                <div className="border border-t-0">
                                    <RichTextEditor
                                        getValue={(value) =>
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    termsAndConditions: value,
                                                };
                                            })
                                        }
                                        initialValue={data?.termsAndConditions || ""}
                                    />
                                </div>
                            </div>
                        </div>
                        {error && <span className="text-sm block text-red-500 mt-3">{error}</span>}
                        <div className="flex items-center justify-end gap-[12px] mt-5">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button
                                className="w-[160px] bg-primaryColor"
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? <BtnLoader /> : "Update Voucher"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
