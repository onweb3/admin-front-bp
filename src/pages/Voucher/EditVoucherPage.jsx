import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { BtnLoader, PageLoader, RichTextEditor } from "../../components";
import { TourTable } from "../../features/Voucher";
import axios from "../../axios";
import { convertMinutesTo24HourTime } from "../../utils";
import { useHandleClickOutside } from "../../hooks";

export default function EditVoucherPage() {
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
        noOfInfants: 0,
        hotelName: "",
        confirmationNumber: "",
        referenceNumber: "",
        checkInDate: "",
        checkInNote:
            "Standard Check in Time is 1500 hrs (except at Atlantis the Palm). Early check in is subject to being booked in advance or as per hotel availability & in this case, may charge directly to the guest.",
        checkOutDate: "",
        checkOutNote:
            "(Standard Check Out Time:12.00) Late checkout subject to hotel availability & hotel may charge directly to the guest.",
        roomDetails: "",
        noOfRooms: "",
        buffetBreakfast: "",
        basisOfTransfer: "",
        arrivalAirportId: "",
        contactName: "Mr. Atif / Mr. Kashif Jamal",
        contactNumber: "+971 566807610 / +971 523413561",
        printNote:
            "The maximum waiting period for a driver, for an arrival transfer would be Forty Five Minutes after the flight lands. If guest does not inform the driver in the given waiting period our driver will move from the airport. It is thus important to share the guests contact details in advance.",
        pagingName: "",
        arrivalDate: "",
        arrivalNote: "",
        departureDate: "",
        departureNote: "",
        termsAndConditions: "",
    });
    const [tourData, setTourData] = useState([
        {
            tourName: "",
            date: "",
            pickupFrom: "",
            pickupTimeFrom: "",
            pickupTimeTo: "",
        },
    ]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isHotelDropdownOpen, setIsHotelDropdownOpen] = useState(false);

    const hotelDropdownRef = useRef(null);
    useHandleClickOutside(hotelDropdownRef, () =>
        setIsHotelDropdownOpen(false)
    );

    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);
    const { id } = useParams();

    const filteredHotels = initialData.hotels?.filter((item) => {
        return item?.hotelName
            ?.toLowerCase()
            ?.includes(data.hotelName?.toLowerCase());
    });

    const handleNoOfChildrenChange = (e) => {
        const tempArray = Array.from(
            { length: Number(e.target.value) },
            () => "0"
        );

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

    const handleNoOfInfantsChange = (e) => {
        const tempArray = Array.from(
            { length: Number(e.target.value) },
            () => "0"
        );

        setData((prev) => {
            return {
                ...prev,
                noOfInfants: e.target.value,
                infantAges: [...prev.infantAges, ...tempArray]?.slice(
                    0,
                    Number(e.target.value)
                ),
            };
        });
    };

    const handleInfantAgeChange = (e, index) => {
        setData((prev) => {
            const updatedInfantAges = [...prev.infantAges];
            updatedInfantAges[index] = e.target.value;
            return { ...prev, infantAges: updatedInfantAges };
        });
    };

    const addExtraRow = () => {
        setTourData((prev) => [
            ...prev,
            {
                tourName: "",
                date: "",
                pickupFrom: "",
                pickupTimeFrom: "",
                pickupTimeTo: "",
            },
        ]);
    };

    const deleteExtraRow = ({ index }) => {
        setTourData((prev) => {
            const updatedTourData = [...prev];
            updatedTourData.splice(index, 1);
            return updatedTourData;
        });
    };

    const handleExtraDataChange = ({ e, index, name, value }) => {
        setTourData((prevState) => {
            const updatedData = [...prevState];
            updatedData[index] = {
                ...updatedData[index],
                [name]: value,
            };
            return updatedData;
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

            await axios.patch(
                `/vouchers/update/${id}`,
                { ...data, tours: tourData },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(`/vouchers/${id}`);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
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

    const fetchVoucher = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/vouchers/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            const {
                passengerName,
                noOfAdults,
                noOfChildren,
                childrenAges,
                noOfInfants,
                infantAges,
                hotelName,
                confirmationNumber,
                referenceNumber,
                checkInDate,
                checkInNote,
                checkOutDate,
                checkOutNote,
                roomDetails,
                noOfRooms,
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
            } = response.data?.voucherAmendment;

            setData((prev) => {
                return {
                    ...prev,
                    passengerName,
                    noOfAdults,
                    noOfChildren,
                    childrenAges: childrenAges || [],
                    noOfInfants,
                    infantAges: infantAges || [],
                    hotelName,
                    confirmationNumber,
                    referenceNumber,
                    checkInDate,
                    checkInNote,
                    checkOutDate,
                    checkOutNote,
                    roomDetails,
                    noOfRooms,
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
                    pagingName: pagingName || "",
                };
            });

            const updatedTours = tours?.map((item) => {
                delete item._id;
                if (
                    !isNaN(item.pickupTimeFrom) &&
                    item.pickupTimeFrom !== null
                ) {
                    item.pickupTimeFrom = convertMinutesTo24HourTime(
                        item?.pickupTimeFrom
                    );
                }
                if (!isNaN(item.pickupTimeTo) && item.pickupTimeTo !== null) {
                    item.pickupTimeTo = convertMinutesTo24HourTime(
                        item?.pickupTimeTo
                    );
                }
                if (
                    !isNaN(item.returnTimeFrom) &&
                    item.returnTimeFrom !== null
                ) {
                    item.returnTimeFrom = convertMinutesTo24HourTime(
                        item?.returnTimeFrom
                    );
                }
                return item;
            });
            setTourData(updatedTours || []);
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVoucher();
        fetchInitalData();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Edit Voucher
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/vouchers" className="text-textColor">
                        Vouchers{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to={`/vouchers/${id}`} className="text-textColor">
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>
            <div className="p-6">
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">Edit Voucher</h1>
                        </div>

                        {isPageLoading ? (
                            <PageLoader />
                        ) : (
                            <div className="p-6">
                                <div className="grid grid-cols-3 gap-[20px]">
                                    <div>
                                        <label htmlFor="">
                                            Reference Number *
                                        </label>
                                        <input
                                            type="text"
                                            name="referenceNumber"
                                            onChange={handleChange}
                                            value={data.referenceNumber || ""}
                                            placeholder="Enter Reference Number"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Passenger Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="passengerName"
                                            value={data.passengerName || ""}
                                            onChange={handleChange}
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
                                        <label htmlFor="">
                                            No Of Children *
                                        </label>
                                        <input
                                            type="number"
                                            name="noOfChildren"
                                            value={data.noOfChildren || ""}
                                            onChange={handleNoOfChildrenChange}
                                            placeholder="0"
                                        />
                                    </div>
                                    {data.childrenAges &&
                                        data.childrenAges?.length > 0 && (
                                            <div className="col-span-2">
                                                <label
                                                    htmlFor=""
                                                    className="w-[100%] max-w-[180px]"
                                                >
                                                    Children Ages *
                                                </label>
                                                <div className="flex items-center flex-wrap gap-[10px]">
                                                    {data.childrenAges?.map(
                                                        (age, index) => {
                                                            return (
                                                                <select
                                                                    name=""
                                                                    className="w-[100px]"
                                                                    value={
                                                                        age ||
                                                                        ""
                                                                    }
                                                                    key={index}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleChildrenAgeChange(
                                                                            e,
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        hidden
                                                                    >
                                                                        None
                                                                    </option>
                                                                    {Array.from(
                                                                        {
                                                                            length: 18,
                                                                        }
                                                                    ).map(
                                                                        (
                                                                            _,
                                                                            arrIndex
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    value={
                                                                                        arrIndex
                                                                                    }
                                                                                    key={
                                                                                        arrIndex
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        arrIndex
                                                                                    }{" "}
                                                                                    -{" "}
                                                                                    {arrIndex +
                                                                                        1}{" "}
                                                                                    yrs
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </select>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    <div>
                                        <label htmlFor="">
                                            No Of Infants *
                                        </label>
                                        <input
                                            type="number"
                                            name="noOfInfants"
                                            value={data.noOfInfants || ""}
                                            onChange={handleNoOfInfantsChange}
                                            placeholder="0"
                                        />
                                    </div>
                                    {data.infantAges &&
                                        data.infantAges?.length > 0 && (
                                            <div className="col-span-2">
                                                <label
                                                    htmlFor=""
                                                    className="w-[100%] max-w-[180px]"
                                                >
                                                    Infant Ages *
                                                </label>
                                                <div className="flex items-center flex-wrap gap-[10px]">
                                                    {data.infantAges?.map(
                                                        (age, index) => {
                                                            return (
                                                                <select
                                                                    name=""
                                                                    className="w-[100px]"
                                                                    value={
                                                                        age ||
                                                                        ""
                                                                    }
                                                                    key={index}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleInfantAgeChange(
                                                                            e,
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        hidden
                                                                    >
                                                                        None
                                                                    </option>
                                                                    {Array.from(
                                                                        {
                                                                            length: 18,
                                                                        }
                                                                    ).map(
                                                                        (
                                                                            _,
                                                                            arrIndex
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    value={
                                                                                        arrIndex
                                                                                    }
                                                                                    key={
                                                                                        arrIndex
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        arrIndex
                                                                                    }{" "}
                                                                                    -{" "}
                                                                                    {arrIndex +
                                                                                        1}{" "}
                                                                                    yrs
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </select>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </div>
                                <div className="grid grid-cols-3 gap-[20px] mt-4">
                                    <div className="col-span-2">
                                        <label htmlFor="">Hotel Name</label>
                                        <div
                                            className="relative"
                                            ref={hotelDropdownRef}
                                        >
                                            <input
                                                type="text"
                                                name="hotelName"
                                                onChange={handleChange}
                                                value={data.hotelName || ""}
                                                placeholder="Enter Hotel Name"
                                                onFocus={() =>
                                                    setIsHotelDropdownOpen(true)
                                                }
                                            />
                                            {isHotelDropdownOpen && (
                                                <div className="absolute top-[100%] left-0 w-full bg-white shadow rounded overflow-y-auto max-h-[250px]">
                                                    {filteredHotels?.map(
                                                        (hotel, index) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="py-[6px] px-4 text-[15px] cursor-pointer hover:bg-[#f3f6f9]"
                                                                    onClick={() => {
                                                                        setData(
                                                                            (
                                                                                prev
                                                                            ) => {
                                                                                return {
                                                                                    ...prev,
                                                                                    hotelName:
                                                                                        hotel?.hotelName,
                                                                                };
                                                                            }
                                                                        );
                                                                        setIsHotelDropdownOpen(
                                                                            false
                                                                        );
                                                                    }}
                                                                >
                                                                    <span>
                                                                        {
                                                                            hotel?.hotelName
                                                                        }
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Confirmation Number
                                        </label>
                                        <input
                                            type="text"
                                            name="confirmationNumber"
                                            onChange={handleChange}
                                            value={
                                                data.confirmationNumber || ""
                                            }
                                            placeholder="Enter Confirmation Number"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-[20px] mt-4">
                                    <div>
                                        <label htmlFor="">
                                            Check IN Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="checkInDate"
                                            onChange={(e) => {
                                                handleChange(e);
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        arrivalDate:
                                                            e.target.value,
                                                    };
                                                });
                                            }}
                                            value={
                                                data?.checkInDate
                                                    ? new Date(
                                                          data?.checkInDate
                                                      )
                                                          .toISOString()
                                                          .substring(0, 10)
                                                    : ""
                                            }
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label htmlFor="">CheckIn Note</label>
                                        <input
                                            type="text"
                                            name="checkInNote"
                                            onChange={handleChange}
                                            value={data.checkInNote || ""}
                                            placeholder="Enter CheckIn Note"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-[20px] mt-4">
                                    <div>
                                        <label htmlFor="">
                                            Check Out Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="checkOutDate"
                                            onChange={(e) => {
                                                handleChange(e);
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        departureDate:
                                                            e.target.value,
                                                    };
                                                });
                                            }}
                                            value={
                                                data?.checkOutDate
                                                    ? new Date(
                                                          data?.checkOutDate
                                                      )
                                                          .toISOString()
                                                          .substring(0, 10)
                                                    : ""
                                            }
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label htmlFor="">CheckOut Note</label>
                                        <input
                                            type="text"
                                            name="checkOutNote"
                                            onChange={handleChange}
                                            value={data.checkOutNote || ""}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-[20px] mt-4">
                                    <div>
                                        <label htmlFor="">Room Details</label>
                                        <input
                                            type="text"
                                            name="roomDetails"
                                            onChange={handleChange}
                                            value={data.roomDetails || ""}
                                            placeholder="Ex: Deluxe Room"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">No Of Rooms</label>
                                        <input
                                            type="text"
                                            name="noOfRooms"
                                            onChange={handleChange}
                                            value={data.noOfRooms || ""}
                                            placeholder="Enter No Of Rooms"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Buffet Breakfast
                                        </label>
                                        <input
                                            type="text"
                                            name="buffetBreakfast"
                                            onChange={handleChange}
                                            value={data.buffetBreakfast || ""}
                                            placeholder="Enter Buffet Breakfast"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Basis Of Transfer
                                        </label>
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
                                        <label htmlFor="">
                                            Arrival Airport *
                                        </label>
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
                                            {initialData?.airports?.map(
                                                (airport, index) => {
                                                    return (
                                                        <option
                                                            value={airport?._id}
                                                            key={index}
                                                        >
                                                            {
                                                                airport?.airportName
                                                            }
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-[20px] mt-4">
                                    <div>
                                        <label htmlFor="">Arrival Date</label>
                                        <input
                                            type="date"
                                            name="arrivalDate"
                                            value={
                                                data?.arrivalDate
                                                    ? new Date(
                                                          data?.arrivalDate
                                                      )
                                                          .toISOString()
                                                          .substring(0, 10)
                                                    : ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label htmlFor="">Arrival Note</label>
                                        <input
                                            type="text"
                                            name="arrivalNote"
                                            onChange={handleChange}
                                            value={data.arrivalNote || ""}
                                            placeholder="Enter Arrival Note"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-[20px] mt-4">
                                    <div>
                                        <label htmlFor="">Departure Date</label>
                                        <input
                                            type="date"
                                            name="departureDate"
                                            value={
                                                data?.departureDate
                                                    ? new Date(
                                                          data?.departureDate
                                                      )
                                                          .toISOString()
                                                          .substring(0, 10)
                                                    : ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label htmlFor="">Departure Note</label>
                                        <input
                                            type="text"
                                            name="departureNote"
                                            onChange={handleChange}
                                            value={data.departureNote || ""}
                                            placeholder="Enter Departure Note"
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
                                    ></textarea>
                                </div>
                                <div className="mt-4">
                                    <h2 className="font-medium mb-2 underline">
                                        Emergency Contact Info
                                    </h2>
                                    <div className="grid grid-cols-3 gap-[20px]">
                                        <div>
                                            <label htmlFor="">
                                                Contact Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="contactName"
                                                onChange={handleChange}
                                                value={data.contactName || ""}
                                                placeholder="Enter Contact Name"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="">
                                                Contact Number *
                                            </label>
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
                                <TourTable
                                    addExtraRow={addExtraRow}
                                    deleteExtraRow={deleteExtraRow}
                                    tourData={tourData}
                                    handleExtraDataChange={
                                        handleExtraDataChange
                                    }
                                    activities={initialData.activities || []}
                                />
                                <div className="my-10">
                                    <h1 className="text-[14px]">
                                        Terms And Conditions *
                                    </h1>
                                    <div className="mt-2">
                                        <div className="border border-t-0">
                                            <RichTextEditor
                                                getValue={(value) =>
                                                    setData((prev) => {
                                                        return {
                                                            ...prev,
                                                            termsAndConditions:
                                                                value,
                                                        };
                                                    })
                                                }
                                                initialValue={
                                                    data?.termsAndConditions ||
                                                    ""
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                {error && (
                                    <span className="text-sm block text-red-500 mt-2">
                                        {error}
                                    </span>
                                )}
                                <div className="flex items-center justify-end gap-[12px]">
                                    <button
                                        className="bg-slate-300 text-textColor px-[15px]"
                                        type="button"
                                        onClick={() => navigate(-1)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="w-[150px] bg-primaryColor"
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <BtnLoader />
                                        ) : (
                                            "Update Voucher"
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
