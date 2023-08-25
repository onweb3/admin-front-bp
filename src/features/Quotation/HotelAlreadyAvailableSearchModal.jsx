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
} from "../../redux/slices/quotationSlice";
import { useHandleClickOutside } from "../../hooks";
import { IoMdClose } from "react-icons/io";
import Toggle from "../../components/Toggle";
// import HotelTransfer from "./HotelTransfer";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { IoBedOutline } from "react-icons/io5";
import { GiCheckMark, GiIsland } from "react-icons/gi";
import { BtnLoader } from "../../components";
import axioss from "../../axios";
import axios from "axios";
import { MdClose } from "react-icons/md";
import Datalist from "./DataList";
import { config } from "../../constants";

export default function HotelAlreadyAvailableSearchModal({
    hotel,
    hotelIndex,
    stayIndex,
    setIsEdit,
    edit,
    setIsModal,
}) {
    const dispatch = useDispatch();
    const wrapperRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [value, setValue] = useState("");
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
    // const [isModal, setIsModal] = useState(false);

    const [isAvailablityLoading, setIsAvailablityLoading] = useState(false);
    const [availableHotels, setAvailableHotels] = useState([]);
    const [responseData, setResponseData] = useState({
        fromDate: "",
        toDate: "",
        rooms: [],
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
        isAlreadyBooked,
        hotelQt,
    } = useSelector((state) => state.quotations);

    function formatDate(dateString) {
        console.log(dateString, "date string");
        const date = new Date(dateString);

        console.log(date, "date");
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        console.log(formattedDate, "formatted date");
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
                  ].checkOutDate
              )
            : checkInDate
            ? formatDate(checkInDate)
            : "",
        hotelId: hotel?.hotelId || "",
        roomTypeId: hotel?.roomTypeId || "",
        boardTypeCode: hotel?.boardTypeCode || "",
        hotelName: hotel?.hotelName || "",
        starCategory: hotel?.starCategory || "",
        cityId: hotel?.city?._id || "",
        hotelData: hotel?.hotelData || "",
        rooms: [
            {
                noOfAdults: 1,
                noOfChildren: noOfChildren > 0 ? 1 : 0,
                childrenAges: noOfChildren > 0 ? [childrenAges[0]] : [],
            },
        ],
    });

    const { jwtToken } = useSelector((state) => state.admin);

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
    console.log(isAvailablityLoading, "availablity loading");

    const fetchAvailableHotels = async (e) => {
        try {
            e.preventDefault();
            setIsAvailablityLoading(true);
            const response = await axioss.post(
                `/quotations/hotels/availability?limit=10`,
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
            setResponseData({
                fromDate: response?.data?.fromDate,
                toDate: response?.data?.toDate,
                rooms: response?.data?.rooms,
            });
            setButtonHidden(true);

            setIsAvailablityLoading(false);
        } catch (err) {
            setError(err?.response?.data.error);
            console.log(err);
            setIsAvailablityLoading(false);
        }
    };

    const getSearchSuggestions = async (value) => {
        try {
            setIsLoading(true);

            const response = await axioss.get(
                `/quotations/hotels/availability/search/suggestions?search=${value}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            if (response.data.length < 1) {
                setError("No availability found for this search query");
            }
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

    useEffect(() => {
        !locality && setValue(hotel?.hotelName || "");
    }, [locality]);

    const onClickHandler = ({ name, value }) => {
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
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

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-10 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-[1300px] h-[700px] rounded shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto p-5"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">
                        {edit
                            ? "Edit Hotel (Already Booked)"
                            : "Add Hotel (Already Booked)"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="flex items-start gap-[2em] mt-6">
                    <div className="w-full">
                        <div
                            ref={dropdownWrapperRef}
                            className="relative w-full"
                        >
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
                                onChange={(e) => setValue(e.target.value)}
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
                                            data?.checkInDate
                                                ? new Date(data?.checkInDate)
                                                      .toJSON()
                                                      .slice(0, 10)
                                                : new Date()
                                                      .toJSON()
                                                      .slice(0, 10)
                                        }
                                        max={
                                            data?.checkOutDate
                                                ? new Date(data?.checkOutDate)
                                                      .toJSON()
                                                      .slice(0, 10)
                                                : new Date()
                                                      .toJSON()
                                                      .slice(0, 10)
                                        }
                                        onChange={(e) => {
                                            onChangeSearchData(e);
                                        }}
                                        name="checkInDate"
                                        value={data?.checkInDate || ""}
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
                                            data?.checkInDate
                                                ? new Date(data?.checkInDate)
                                                      .toJSON()
                                                      .slice(0, 10)
                                                : new Date()
                                                      .toJSON()
                                                      .slice(0, 10)
                                        }
                                        max={
                                            data?.checkOutDate
                                                ? new Date(data?.checkOutDate)
                                                      .toJSON()
                                                      .slice(0, 10)
                                                : new Date()
                                                      .toJSON()
                                                      .slice(0, 10)
                                        }
                                        name="checkOutDate"
                                        onChange={(e) => {
                                            onChangeSearchData(e);
                                        }}
                                        value={data?.checkOutDate || ""}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-12">
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
                                        "Search"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

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
                                                            ?.city?.cityName,
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
                                                            ?.area?.areaName,
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
                                                            hotel?.hotel?.image
                                                                ?.isRelative
                                                                ? config.SERVER_URL +
                                                                  hotel?.hotel
                                                                      ?.image
                                                                      ?.path
                                                                : hotel?.hotel
                                                                      ?.image
                                                                      ?.path
                                                        }
                                                        alt={
                                                            "hotel" + hotelIndex
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div
                                                        className={` ${
                                                            selectedHotel?.hotel
                                                                ?._id ===
                                                            hotel?.hotel?._id
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
                                                        {hotel?.hotel?.address}
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
                                                            hotel?.hotel?.state
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
                        <div className="flex justify-end mt-6">
                            <button
                                className="w-[100px]"
                                onClick={() => {
                                    setIsEdit(false);

                                    dispatch(
                                        handleHotelsDataChange({
                                            data: data,
                                            hotelIndex: hotelIndex,
                                            stayIndex: stayIndex,
                                            edit,
                                        })
                                    );

                                    setIsModal(false);
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? <BtnLoader /> : "Add"}
                            </button>
                        </div>
                    ) : (
                        ""
                    )}
                </>

                {error && (
                    <span className="text-sm block text-red-500 mt-2">
                        {error}
                    </span>
                )}
            </div>
        </div>
    );
}
