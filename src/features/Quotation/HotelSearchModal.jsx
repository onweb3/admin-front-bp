import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    changeSelectedHotel,
    handleHotelTransferChange,
    handleHotelsDataChange,
    handleRowItemChange,
    removeMultiHotel,
    setTypesOfHotel,
    updateHotelBreakfastIncludedOrNot,
    updateHotelIsRefundable,
    clearTransferDetails,
    handleHotelsTransferDataChange,
    handleTransferClear,
    handleRoomOccupancy,
    handleHotelCustomMarkupChange,
} from "../../redux/slices/quotationSlice";
import { useHandleClickOutside } from "../../hooks";
import { IoMdClose } from "react-icons/io";
import Toggle from "../../components/Toggle";
// import HotelTransfer from "./HotelTransfer";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoBedOutline } from "react-icons/io5";
import { GiCheckMark, GiIsland } from "react-icons/gi";
import { BtnLoader, Pagination } from "../../components";
import axioss from "../../axios";
import axios from "axios";
import { MdClose } from "react-icons/md";
import Datalist from "./DataList";
import { config } from "../../constants";
import { formatDate } from "../../utils";
import { BsFilterLeft } from "react-icons/bs";

export default function HotelSearchModal({
    hotel,
    hotelIndex,
    stayIndex,
    setIsModal,
    edit,
    setIsEdit,
}) {
    const dispatch = useDispatch();
    const wrapperRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isNotAvailable, setIsNotAvailable] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [value, setValue] = useState(hotel?.hotelName?.toString() || "");
    const [datalist, setDatalist] = useState(false);
    const [searchQuery, setSearchQuery] = useState({
        suggestionType: hotel?.hotelId ? "HOTEL" : "",
        id: hotel?.hotelId || "",
    });
    const [isHotel, setIsHotel] = useState(false);
    const [locality, setLocality] = useState("");
    const [selectedHotel, setSelectedHotel] = useState([]);
    const [selectedRoomType, setSetSelectedRoomType] = useState([]);
    const [selectedBoardType, setSelectedBoardType] = useState([]);
    const [confirmError, setConfirmError] = useState("");
    const [isAvailablityLoading, setIsAvailablityLoading] = useState(false);
    const [availableHotels, setAvailableHotels] = useState([]);
    const [responseData, setResponseData] = useState({
        fromDate: "",
        toDate: "",
        rooms: [],
    });
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 5,
        totalHotels: 0,
        search: "",
    });

    const {
        hotels,
        noOfAdults,
        noOfChildren,
        childrenAges,
        checkOutDate,
        checkInDate,
        cities,
        areas,
        states,
        hotelQt,
        isTourismFeeIncluded,
    } = useSelector((state) => state.quotations);

    const { jwtToken } = useSelector((state) => state.admin);

    function formatDateToYYYYMMDD(inputDate) {
        // Extract the day and month from the given date
        const day = inputDate?.getDate(); // Use getDate() instead of getUTCDate()
        const month = inputDate?.getMonth() + 1; // Adding 1 because months are zero-based

        // Format the day and month as two-digit strings
        const formattedDay = day < 10 ? `0${day}` : day?.toString();
        const formattedMonth = month < 10 ? `0${month}` : month?.toString();

        // Create the desired format "YYYY-MM-DD"
        const formattedDate = `${inputDate?.getUTCFullYear()}-${formattedMonth}-${formattedDay}`;
        return formattedDate;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        return formattedDate;
    }


    const [data, setData] = useState({
        checkOutDate: hotel?.checkOutDate
            ? formatDate(hotel?.checkOutDate)
            : checkOutDate
            ? formatDate(checkOutDate)
            : "",
        checkInDate: hotel?.checkInDate
            ? formatDate(hotel?.checkInDate)
            : hotelQt?.stays[stayIndex]?.hotels?.length > 0
            ? formatDate(
                  hotelQt?.stays[stayIndex]?.hotels[
                      hotelQt?.stays[stayIndex]?.hotels?.length - 1
                  ]?.checkOutDate
              )
            : checkInDate
            ? formatDate(checkInDate)
            : "",
        // checkOutDate: hotel?.checkOutDate || "",
        // checkInDate: hotel?.checkInDate || "",
        hotelId: hotel?.hotelId || "",
        roomTypeId: hotel?.roomTypeId || "",
        boardTypeCode: hotel?.boardTypeCode || "",
        hotelName: hotel?.hotelName || "",
        starCategory: hotel?.starCategory || "",
        cityId: hotel?.city?._id || "",
        areaId: hotel?.area?._id || "",
        areaName: hotel?.area?.areaName || "",
        roomOccupancies: hotel?.roomOccupancies || "gasdgh",

        hotelData: hotel?.hotelData || "",

        rooms: [
            {
                noOfAdults: 1,
                noOfChildren: noOfChildren > 0 ? 1 : 0,
                childrenAges: noOfChildren > 0 ? [childrenAges[0]] : [],
            },
        ],
    });

    const [searchedHotels, setSearchedHotels] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isRoomTypeDropdownOpen, setIsRoomTypeDropdownOpen] = useState(false);
    const [searchedRoomTypes, setSearchedRoomTypes] = useState([]);
    const [error, setError] = useState(false);
    const [next, setNext] = useState(false);
    const [buttonHidden, setButtonHidden] = useState(false);

    const dropdownWrapperRef = useRef();
    useHandleClickOutside(dropdownWrapperRef, () => setIsDropdownOpen(false));
    const roomTypeDropdownWrapperRef = useRef();
    useHandleClickOutside(roomTypeDropdownWrapperRef, () =>
        setIsRoomTypeDropdownOpen(false)
    );

    const onChangeSearchData = (e) => {
        e.preventDefault();

        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const fetchAvailableHotels = async () => {
        try {
            // e.preventDefault();
            setError("");
            setIsAvailablityLoading(true);
            setData((prev) => ({
                ...prev,
                hotelId: "",
                roomTypeId: "",
                boardTypeCode: "",
                hotelName: "",
                starCategory: "",
                cityId: "",
                areaId: "",
                areaName: "",
                roomOccupancies: "",
                hotelData: "",
            }));

            setNext(false);

            setSelectedHotel("");
            setSelectedBoardType("");
            setSetSelectedRoomType("");

            const response = await axioss.post(
                `/quotations/hotels/availability?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    searchQuery: searchQuery,
                    fromDate: data.checkInDate,
                    toDate: data.checkOutDate,
                    rooms: data.rooms,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setAvailableHotels(response?.data?.hotels);
            if (response?.data?.hotels?.length < 1) {
                setError(
                    "No availability found for this search query . you can add hotel and custom price"
                );
            }

            setFilters((prev) => {
                return {
                    ...prev,
                    totalHotels: response.data?.totalHotels,
                };
            });
            setResponseData({
                fromDate: response?.data?.fromDate,
                toDate: response?.data?.toDate,
                rooms: response?.data?.rooms,
            });
            setButtonHidden(true);
            // dispatch(
            //     setHotelInStay({
            //         stayIndex: selectedStayIndex,
            //         hotelIndex: selectedHotelIndex,
            //         name: "checkInDate",
            //         value: response?.data?.fromDate,
            //     })
            // );
            // dispatch(
            //     setHotelInStay({
            //         stayIndex: selectedStayIndex,
            //         hotelIndex: selectedHotelIndex,
            //         name: "checkOutDate",
            //         value: response?.data?.toDate,
            //     })
            // );

            setIsAvailablityLoading(false);
        } catch (err) {
            setAvailableHotels([]);

            setError(err?.response?.data.error);
            setIsAvailablityLoading(false);
        }
    };

    const fetchAvailability = async () => {
        try {
            // e.preventDefault();
            setError("");
            setIsAvailablityLoading(true);
            setData((prev) => ({
                ...prev,

                roomTypeId: "",
                boardTypeCode: "",
                hotelName: "",
                starCategory: "",
                cityId: "",
                areaId: "",
                areaName: "",
                roomOccupancies: "",
                hotelData: "",
            }));

            setNext(false);

            setSelectedHotel("");

            const response = await axioss.get(
                `/quotations/hotels/room-board/${searchQuery.id}`,

                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setAvailableHotels([
                {
                    hotel: response?.data?.hotel,
                    roomTypes: response?.data?.roomTypes,
                },
            ]);
            if (response?.data?.hotels?.length < 1) {
                setError("No availability found for this search query ");
            }

            setFilters((prev) => {
                return {
                    ...prev,
                    totalHotels: 1,
                };
            });

            setIsNotAvailable(true);
            // setResponseData({
            //     fromDate: response?.data?.fromDate,
            //     toDate: response?.data?.toDate,
            //     rooms: response?.data?.rooms,
            // });
            setButtonHidden(true);
            // dispatch(
            //     setHotelInStay({
            //         stayIndex: selectedStayIndex,
            //         hotelIndex: selectedHotelIndex,
            //         name: "checkInDate",
            //         value: response?.data?.fromDate,
            //     })
            // );
            // dispatch(
            //     setHotelInStay({
            //         stayIndex: selectedStayIndex,
            //         hotelIndex: selectedHotelIndex,
            //         name: "checkOutDate",
            //         value: response?.data?.toDate,
            //     })
            // );

            setIsAvailablityLoading(false);
        } catch (err) {
            setAvailableHotels([]);

            setError(err?.response?.data.error);
            console.log(err);
            setIsAvailablityLoading(false);
        }
    };

    const getSearchSuggestions = async (value) => {
        try {
            setIsLoading(true);

            const response = await axioss.get(
                `/quotations/hotels/availabilities/search/suggestions?search=${value}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setSuggestions(response?.data);

            setIsLoading(false);
        } catch (err) {
            console.log(err?.response?.data?.error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (value.length > 2) {
            getSearchSuggestions(value);
        }
    }, [value]);

    const handleFocus = (e) => {
        setDatalist(true);
        setLocality("");
    };

    const clearDetails = () => {
        try {
            setData((prev) => ({
                ...prev,
                hotelId: "",
                roomTypeId: "",
                boardTypeCode: "",
                hotelName: "",
                starCategory: "",
                cityId: "",
                areaId: "",
                areaName: "",
            }));

            setFilters((prev) => {
                return {
                    ...prev,
                    skip: 0,
                    limit: 5,
                    totalHotels: 0,
                };
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        !locality && setValue(hotel?.hotelName || "");
    }, [locality]);

    const onClickHandler = ({ name, value }) => {
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNotAvailSubmit = () => {
        try {
            // setIsSubmitLoading(true);
            dispatch(
                handleHotelsDataChange({
                    data: {
                        ...data,
                        roomOccupancies: [
                            { occupancyShortName: "SGL", price: "" },
                            { occupancyShortName: "DBL", price: "" },
                            { occupancyShortName: "TPL", price: "" },
                            { occupancyShortName: "CWB", price: "" },
                            { occupancyShortName: "CNB", price: "" },
                        ],
                        isCustomHotelMarkup: true,
                    },
                    hotelIndex: hotelIndex,
                    stayIndex: stayIndex,
                    edit: edit,
                })
            );

            // setIsSubmitLoading(false);

            setIsModal(false);

            dispatch(handleTransferClear());
            setIsEdit(false);
            setNext(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitLoading(true);
            let response = await axioss.post(
                `/quotations/hotels/room-type/rate`,
                {
                    noOfAdults,
                    noOfChildren,
                    childrenAges,
                    checkInDate: data?.checkInDate,
                    checkOutDate: data?.checkOutDate,
                    hotelId: data?.hotelId,
                    roomTypeId: data?.roomTypeId,
                    boardTypeCode: data?.boardTypeCode,
                    isTourismFeeIncluded,
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            dispatch(
                handleHotelsDataChange({
                    data: { ...data, roomOccupancies: response?.data?.rates },
                    hotelIndex: hotelIndex,
                    stayIndex: stayIndex,
                    edit: edit,
                })
            );

            setIsSubmitLoading(false);

            setIsModal(false);

            dispatch(handleTransferClear());
            setIsEdit(false);
            setNext(false);
        } catch (e) {
            setIsSubmitLoading(false);
            setConfirmError(err?.response?.data.error);
        }
    };


    useEffect(() => {
        if (
            searchQuery.suggestionType &&
            data.checkInDate &&
            data.checkOutDate &&
            data.rooms
        ) {

            fetchAvailableHotels();
        }
    }, [filters.skip, filters.limit, filters.search]);


    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-10 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-[1300px] h-[720px] rounded shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto p-5"
            >
                {" "}
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">
                        {edit ? "Edit Hotel" : "Add Hotel"}
                    </h2>
                    <div className="flex bg-gray-50 shadow-sm">
                        <div className="w-[300px] h-auto  text-textColor flex text-sm font-[500]  items-center justify-center ">
                            <div className="flex item-center ">
                                Arrival Date
                            </div>
                            <div className="flex item-center p-4 ">
                                {checkInDate ? formatDate(checkInDate) : "N/A"}
                            </div>
                        </div>
                        <div className="flex items-center">-</div>
                        <div className="w-[300px] h-auto text-textColor text-sm font-[500]  flex justify-center items-center ">
                            <div className="flex item-center p-4">
                                Departure Date
                            </div>
                            <div className="flex item-center p-4">
                                {checkOutDate
                                    ? formatDate(checkOutDate)
                                    : "N/A"}
                            </div>
                        </div>
                    </div>

                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => {
                            setIsModal(false);
                        }}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="flex items-start gap-[2em] mt-4">
                    <div className="w-full">
                        <div
                            ref={dropdownWrapperRef}
                            className="relative w-full"
                        >
                            {" "}
                            <label
                                htmlFor=""
                                className="w-[100%] max-w-[180px]"
                            >
                                Search Here{" "}
                            </label>
                            <input
                                type="text"
                                placeholder="Search here..."
                                // onChange={(e) => {
                                //     setData((prev) => ({
                                //         ...prev,
                                //         searchQuery: {
                                //             ...prev.searchQuery,
                                //             id: e.target.value,
                                //         },
                                //     }));
                                // }}
                                onFocus={handleFocus}
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                }}
                            />
                            {value.length > 2 ? (
                                <Datalist
                                    className="z-20"
                                    locality={locality}
                                    setLocality={setLocality}
                                    datalist={datalist}
                                    suggestions={suggestions}
                                    value={value}
                                    setDatalist={setDatalist}
                                    setValue={setValue}
                                    isLoading={isLoading}
                                    setIsHotel={setIsHotel}
                                    setSearchQuery={setSearchQuery}
                                />
                            ) : (
                                ""
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-5 z-10">
                            <div className=" items-start gap-[2em] mt-6">
                                <label
                                    htmlFor=""
                                    className="w-[100%] max-w-[180px]"
                                >
                                    Checkin-Date
                                </label>
                                <div className=" w-full">
                                    <input
                                        type="date"
                                        min={
                                            checkInDate
                                                ? formatDate(checkInDate)
                                                : ""
                                        }
                                        max={
                                            checkOutDate
                                                ? formatDate(checkOutDate)
                                                : ""
                                        }
                                        onChange={(e) => {
                                            onChangeSearchData(e);
                                        }}
                                        name="checkInDate"
                                        value={data?.checkInDate || ""}
                                        // onFocus={(e) =>
                                        //     (e.currentTarget.type = "date")
                                        // }
                                        // onBlur={(e) =>
                                        //     (e.currentTarget.type = "text")
                                        // }
                                    />
                                </div>
                            </div>

                            <div className=" items-start gap-[2em] mt-6">
                                <label
                                    htmlFor=""
                                    className="w-[100%] max-w-[180px]"
                                >
                                    CheckOut-Date
                                </label>
                                <div className=" w-full">
                                    <input
                                        type="date"
                                        min={
                                            checkInDate
                                                ? formatDate(checkInDate)
                                                : ""
                                        }
                                        max={
                                            checkOutDate
                                                ? formatDate(checkOutDate)
                                                : ""
                                        }
                                        name="checkOutDate"
                                        onChange={(e) => {
                                            onChangeSearchData(e);
                                        }}
                                        value={data?.checkOutDate || ""}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-12 gap-2">
                                <button
                                    className="w-[200px]"
                                    onClick={(e) => {
                                        clearDetails();
                                        fetchAvailability(e);
                                    }}
                                    // disabled={isAvailablityLoading}
                                >
                                    {setIsAvailablityLoading === true ? (
                                        <BtnLoader />
                                    ) : (
                                        "Add Hotel"
                                    )}
                                </button>{" "}
                                <button
                                    className="w-[200px]"
                                    onClick={(e) => {
                                        clearDetails();
                                        fetchAvailableHotels(e);
                                    }}
                                    // disabled={isAvailablityLoading}
                                >
                                    {setIsAvailablityLoading === true ? (
                                        <BtnLoader />
                                    ) : (
                                        "Get Price"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {next === false ? (
                    <>
                        <div className="grid grid-cols-5 gap-3 pt-10">
                            {!isAvailablityLoading ? (
                                <>
                                    {availableHotels.length > 0 &&
                                        availableHotels?.map(
                                            (hotel, hotelIndex) => (
                                                <div
                                                    key={hotel?.hotel?._id}
                                                    onClick={() => {
                                                        onClickHandler({
                                                            name: "hotelId",
                                                            value: hotel?.hotel
                                                                ?._id,
                                                        });
                                                        onClickHandler({
                                                            name: "hotelName",
                                                            value: hotel?.hotel
                                                                ?.hotelName,
                                                        });
                                                        onClickHandler({
                                                            name: "placeName",
                                                            value: hotel?.hotel
                                                                ?.city
                                                                ?.cityName,
                                                        });
                                                        onClickHandler({
                                                            name: "starCategory",
                                                            value: hotel?.hotel
                                                                ?.starCategory,
                                                        });
                                                        onClickHandler({
                                                            name: "hotelData",
                                                            value: hotel?.hotel,
                                                        });
                                                        onClickHandler({
                                                            name: "cityId",
                                                            value: hotel?.hotel
                                                                ?.city?._id,
                                                        });
                                                        onClickHandler({
                                                            name: "areaId",
                                                            value: hotel?.hotel
                                                                ?.area?._id,
                                                        });
                                                        onClickHandler({
                                                            name: "areaName",
                                                            value: hotel?.hotel
                                                                ?.area
                                                                ?.areaName,
                                                        });
                                                        setSelectedHotel(hotel);
                                                    }}
                                                    className={`${
                                                        selectedHotel?.hotel
                                                            ?._id ===
                                                        hotel?.hotel?._id
                                                            ? " bg-green-50 "
                                                            : " bg-white "
                                                    } cursor-pointer overflow-hidden hover:-translate-y-1 transition-all duration-300 rounded-md border-[1px] border-gray-100 border-opacity-20 shadow-round w-full  flex flex-col items-center`}
                                                >
                                                    <div className="relative w-full h-[100px] ">
                                                        <img
                                                            src={
                                                                hotel?.hotel
                                                                    ?.image
                                                                    ?.isRelative
                                                                    ? config.SERVER_URL +
                                                                      hotel
                                                                          ?.hotel
                                                                          ?.image
                                                                          ?.path
                                                                    : hotel
                                                                          ?.hotel
                                                                          ?.image
                                                                          ?.path
                                                            }
                                                            alt={
                                                                "hotel" +
                                                                hotelIndex
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div
                                                            className={` ${
                                                                selectedHotel
                                                                    ?.hotel
                                                                    ?._id ===
                                                                hotel?.hotel
                                                                    ?._id
                                                                    ? " block "
                                                                    : " hidden "
                                                            } absolute top-1 right-1 bg-green-500 text-xs text-white flex justify-center items-center w-4 h-4 rounded-full shadow-mn`}
                                                        >
                                                            <GiCheckMark />
                                                        </div>
                                                    </div>
                                                    <div className="p-2 text-left">
                                                        <div className="pt-2">
                                                            <p className="text-sm font-[500] text-gray-400">
                                                                {
                                                                    hotel?.hotel
                                                                        ?.hotelName
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="text-xs text-grayColor">
                                                            {
                                                                hotel?.hotel
                                                                    ?.address
                                                            }
                                                        </div>
                                                        <div className="text-xs text-grayColor flex items-center gap-1">
                                                            {
                                                                hotel?.hotel
                                                                    ?.starCategory
                                                            }
                                                            <span className="text-yellow-400 text-sm">
                                                                <AiFillStar />
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-grayColor">
                                                            {hotel?.hotel?.city
                                                                ?.cityName +
                                                                " , " +
                                                                hotel?.hotel
                                                                    ?.state
                                                                    ?.stateName}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                </>
                            ) : (
                                <div className="bg-white overflow-hidden hover:-translate-y-1 transition-all duration-300 rounded-md border-[1px] border-gray-100 border-opacity-20 shadow-round w-full pb-8  flex flex-col items-center">
                                    <div className="animate-pulse w-full h-[100px] bg-gray-200"></div>
                                    <div className="p-2 text-center">
                                        <div className="pt-2">
                                            <p className="h-5 w-20 bg-gray-400 rounded animate-pulse"></p>
                                        </div>
                                        <div className="h-3 w-32 bg-grayColor mt-3 rounded animate-pulse"></div>
                                        <div className="h-3 w-36 bg-grayColor mt-3 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {buttonHidden ? (
                            <>
                                {filters?.totalHotels > 5 &&
                                availableHotels.length > 0 ? (
                                    <div className="p-4">
                                        <Pagination
                                            limit={filters?.limit}
                                            skip={filters?.skip}
                                            total={filters?.totalHotels}
                                            incOrDecSkip={(number) =>
                                                setFilters((prev) => {
                                                    return {
                                                        ...prev,
                                                        skip:
                                                            prev.skip + number,
                                                    };
                                                })
                                            }
                                            updateSkip={(skip) =>
                                                setFilters((prev) => {
                                                    return { ...prev, skip };
                                                })
                                            }
                                        />
                                    </div>
                                ) : (
                                    ""
                                )}
                                {data?.hotelId ? (
                                    <div className="flex justify-end mt-6">
                                        <button
                                            className="w-[100px]"
                                            onClick={() => setNext(true)}
                                            disabled={isLoading}
                                        >
                                            Next
                                        </button>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </>
                        ) : (
                            ""
                        )}
                    </>
                ) : (
                    <>
                        <div>
                            {selectedHotel.length !== 0 ? (
                                <div className="py-5 ">
                                    <p className=" px-2 text-sm text-stone-500 font-[500]">
                                        Room Types
                                    </p>
                                    <div className="pt-4">
                                        <div className="grid grid-cols-4 gap-2 items-center">
                                            {selectedHotel?.roomTypes?.map(
                                                (roomType) => (
                                                    <div
                                                        onClick={() => {
                                                            setSetSelectedRoomType(
                                                                roomType
                                                            );
                                                            onClickHandler({
                                                                name: "roomTypeName",
                                                                value: roomType?.roomName,
                                                            });
                                                            onClickHandler({
                                                                name: "roomTypeId",
                                                                value: roomType?.roomTypeId,
                                                            });
                                                        }}
                                                        key={
                                                            roomType?.roomTypeId
                                                        }
                                                        className={`relative ${
                                                            selectedRoomType?.roomTypeId ===
                                                            roomType?.roomTypeId
                                                                ? " bg-green-50 "
                                                                : " bg-white "
                                                        }  rounded shadow-md flex justify-center items-center h-16 cursor-pointer`}
                                                    >
                                                        <p className="text-sm text-gray-500 capitalize">
                                                            {roomType?.roomName}
                                                        </p>
                                                        <div
                                                            className={` ${
                                                                selectedRoomType?.roomTypeId ===
                                                                roomType?.roomTypeId
                                                                    ? " block "
                                                                    : " hidden "
                                                            } absolute top-1 right-1 bg-green-500 text-xs text-white flex justify-center items-center w-4 h-4 rounded-full shadow-mn`}
                                                        >
                                                            <GiCheckMark />
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}

                            {selectedRoomType.length !== 0 ? (
                                <div className="py-5 ">
                                    <p className=" px-2 text-sm text-stone-500 font-[500]">
                                        Board Types
                                    </p>
                                    <div className="pt-4">
                                        <div className="grid grid-cols-4 gap-2 items-center">
                                            {selectedRoomType?.boardTypes?.map(
                                                (boardType) => (
                                                    <div
                                                        onClick={() => {
                                                            setSelectedBoardType(
                                                                boardType
                                                            );
                                                            onClickHandler({
                                                                name: "boardTypeCode",
                                                                value: boardType?.boardCode,
                                                            });
                                                            onClickHandler({
                                                                name: "boardTypeName",
                                                                value: boardType?.boardName,
                                                            });
                                                        }}
                                                        key={
                                                            boardType?.boardCode
                                                        }
                                                        className={`relative ${
                                                            selectedBoardType?.boardCode ===
                                                            boardType?.boardCode
                                                                ? " bg-green-50 "
                                                                : " bg-white "
                                                        }  rounded shadow-md flex justify-center items-center h-16 cursor-pointer`}
                                                    >
                                                        <p className="text-sm text-gray-500">
                                                            {boardType?.boardName +
                                                                `(${boardType?.boardCode})`}
                                                        </p>
                                                        <div
                                                            className={` ${
                                                                selectedBoardType?.boardCode ===
                                                                boardType?.boardCode
                                                                    ? " block "
                                                                    : " hidden "
                                                            } absolute top-1 right-1 bg-green-500 text-xs text-white flex justify-center items-center w-4 h-4 rounded-full shadow-mn`}
                                                        >
                                                            <GiCheckMark />
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="flex justify-end gap-4">
                            <div className="flex justify-end mt-6">
                                <button
                                    className="w-[100px] "
                                    onClick={() => setNext(false)}
                                    disabled={isLoading}
                                >
                                    {isLoading ? <BtnLoader /> : "Back"}
                                </button>
                            </div>{" "}
                            {data.boardTypeCode &&
                            data.roomTypeId &&
                            data.hotelId ? (
                                <>
                                    {" "}
                                    {isNotAvailable ? (
                                        <div className="flex justify-end mt-6">
                                            <button
                                                className="w-[150px] bg-green-500"
                                                onClick={() => {
                                                    handleNotAvailSubmit();
                                                }}
                                                disabled={isSubmitLoading}
                                            >
                                                {isSubmitLoading ? (
                                                    <BtnLoader />
                                                ) : (
                                                    "Confirm Hotel "
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end mt-6">
                                            <button
                                                className="w-[150px] bg-green-500"
                                                onClick={() => {
                                                    handleSubmit();
                                                }}
                                                disabled={isSubmitLoading}
                                            >
                                                {isSubmitLoading ? (
                                                    <BtnLoader />
                                                ) : (
                                                    "Confirm Hotel "
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                // <>
                                //     <div className="flex justify-end mt-6">
                                //         <button
                                //             className="w-[100px] bg-green-200"
                                //             onClick={() => setNext(false)}
                                //             disabled={isLoading}
                                //         >
                                //             {isLoading ? <BtnLoader /> : "edit"}
                                //         </button>
                                //     </div>{" "}
                                // </>
                                ""
                            )}
                        </div>
                    </>
                )}
                {error && (
                    <div className="flex flex-col gap-4">
                        <span className="text-sm block text-red-500 mt-2">
                            {error}
                        </span>
                    </div>
                )}
                {confirmError && (
                    <div className="flex flex-col gap-4">
                        <span className="text-sm block text-red-500 mt-2">
                            {confirmError}
                        </span>{" "}
                    </div>
                )}
            </div>
        </div>
    );
}
