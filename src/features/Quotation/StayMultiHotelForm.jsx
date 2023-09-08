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
    handleTransferClear,
    handleHotelCustomMarkupChange,
    handleRoomTypeChange,
} from "../../redux/slices/quotationSlice";
import { useHandleClickOutside } from "../../hooks";
import { IoMdClose } from "react-icons/io";
import Toggle from "../../components/Toggle";
// import HotelTransfer from "./HotelTransfer";
import axios from "axios";
import { AiOutlineStar } from "react-icons/ai";
import { IoBedOutline, IoFastFoodOutline } from "react-icons/io5";
import { GiIsland } from "react-icons/gi";
import { BtnLoader } from "../../components";
import HotelSearchModal from "./HotelSearchModal";
import { BiEditAlt } from "react-icons/bi";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { TbClockUp } from "react-icons/tb";
import HotelAlreadyAvailableSearchModal from "./HotelAlreadyAvailableSearchModal";

export default function StayMultiHotelForm({
    hotel,
    hotelIndex,
    stayIndex,
    // isModal,
    // setIsModal,
    setIsEdit,
    isEdit,
}) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [value, setValue] = useState("");
    const [datalist, setDatalist] = useState(false);
    const [searchQuery, setSearchQuery] = useState({});
    const [isHotel, setIsHotel] = useState(false);
    const [locality, setLocality] = useState("");
    const [isModal, setIsModal] = useState(false);

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
        isAlreadyBooked,
    } = useSelector((state) => state.quotations);

    const { jwtToken } = useSelector((state) => state.admin);

    const [searchedHotels, setSearchedHotels] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isRoomTypeDropdownOpen, setIsRoomTypeDropdownOpen] = useState(false);
    const [searchedRoomTypes, setSearchedRoomTypes] = useState([]);
    const [error, setError] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState("");

    const dropdownWrapperRef = useRef();
    useHandleClickOutside(dropdownWrapperRef, () => setIsDropdownOpen(false));
    const roomTypeDropdownWrapperRef = useRef();
    useHandleClickOutside(roomTypeDropdownWrapperRef, () =>
        setIsRoomTypeDropdownOpen(false)
    );

    useEffect(() => {
        if (hotel?.hotelName) {
            const filteredHotels = hotels?.filter((hotel) => {
                return (
                    hotel?.hotelName
                        ?.toLowerCase()
                        ?.includes(hotel?.hotelName?.toLowerCase()) ||
                    hotel?.city?.cityName
                        ?.toLowerCase()
                        ?.includes(hotel?.hotelName?.toLowerCase())
                );
            });
            setSearchedHotels(filteredHotels);
        } else {
            setSearchedHotels(hotels);
        }
    }, [hotel?.hotelName, hotels]);

    const onRowDataChange = (e, hotelIndex, roomIndex) => {
        dispatch(
            handleRowItemChange({
                value: e.target.value,
                hotelIndex,
                roomIndex,
                stayIndex,
            })
        );
    };

    const openModal = (index) => {
        setSelectedIndex(index);
        setIsEdit(true);
        setIsModal(true);
    };

    console.log(hotel, "selected hotel index");

    return (
        <>
            <div className="h-min-[200px]  border-dashed border bg-stone-200 mb-5 ">
                <div className=" w-full h-full p-4">
                    <div className=" flex items-center justify-between gap-[10px] px-2">
                        <h2 className="text-[15px] font-[500]">
                            Hotel {hotelIndex + 1}
                        </h2>
                        <div className="flex gap-2">
                            <div
                                className="flex justify-end items-center gap-2 cursor-pointer"
                                onClick={() => {
                                    openModal(hotelIndex);
                                }}
                            >
                                <BiEditAlt />
                            </div>
                            <button
                                type="button"
                                className="p-0 h-auto text-red-500 text-lg"
                                onClick={() => {
                                    dispatch(
                                        removeMultiHotel({
                                            stayIndex,
                                            hotelIndex,
                                        })
                                    );
                                    dispatch(
                                        clearTransferDetails({
                                            name: "transfers",
                                        })
                                    );
                                    dispatch(handleTransferClear());
                                }}
                            >
                                <IoMdClose />
                            </button>
                        </div>
                    </div>
                    <div className="">
                        {hotel?.hotelName && (
                            <div className="border-dashed border pt-2 px-2 w-full h-full">
                                <div className="w-full h-full flex flex-col justify-center items-center bg-stone-100 p-5">
                                    <p className="flex gap-1 items-center mt-[8px]">
                                        <span className="block  text-lg text-blue-700 ">
                                            <IoBedOutline />
                                        </span>
                                        <span className="block text-sm text-blue-700">
                                            {hotel?.hotelName}
                                        </span>
                                    </p>
                                    <div className="flex gap-4">
                                        <p className="flex gap-1 items-center mt-[8px]">
                                            <span className="block  text-lg text-green-700">
                                                <GiIsland />
                                            </span>
                                            <span className="block text-sm text-black">
                                                {hotel?.placeName
                                                    ? hotel?.placeName
                                                    : hotel?.cityName}
                                            </span>
                                        </p>
                                        <p className="flex gap-1 items-center mt-[8px]">
                                            <span className="block  text-lg text-yellow-500">
                                                <AiOutlineStar />
                                            </span>
                                            <span className="block text-sm text-black ">
                                                {hotel?.starCategory || "N/A"}
                                            </span>
                                        </p>
                                        <p className="flex gap-1 items-center mt-[8px] text-red-600">
                                            <span className="block  text-lg ">
                                                <IoFastFoodOutline />
                                            </span>
                                            <span className="block text-sm text-black">
                                                {hotel?.boardTypeCode || "N/A"}
                                            </span>
                                        </p>
                                        <p className="flex gap-1 items-center mt-[8px] text-pink-600">
                                            <span className="block  text-lg ">
                                                <MdOutlineMeetingRoom />
                                            </span>
                                            <span className="block text-sm  text-black">
                                                {hotel?.roomTypeName || "N/A"}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex gap-4">
                                        <p className="flex gap-1 items-center mt-[8px]">
                                            <span className="block  text-lg text-green-600">
                                                <TbClockUp />
                                            </span>
                                            <span className="block text-sm text-black">
                                                {new Date(hotel?.checkInDate)
                                                    .toISOString()
                                                    .substring(0, 10)}
                                            </span>
                                        </p>
                                        <p className="flex gap-1 items-center mt-[8px]">
                                            <span className="block  text-lg text-red-600 rotate-180">
                                                <TbClockUp />
                                            </span>
                                            <span className="block text-sm text-black">
                                                {new Date(hotel?.checkOutDate)
                                                    .toISOString()
                                                    .substring(0, 10)}{" "}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="h-full p-2 flex gap-2  items-center w-full">
                                        <div className="flex items-center justify-center gap-[10px]">
                                            <input
                                                type="checkbox"
                                                className="w-[16px] h-[16px]"
                                                checked={
                                                    hotel.isCustomHotelMarkup
                                                }
                                                onChange={(e) => {
                                                    dispatch(
                                                        handleHotelCustomMarkupChange(
                                                            {
                                                                stayIndex,
                                                                hotelIndex,
                                                                value: e.target
                                                                    .checked,
                                                            }
                                                        )
                                                    );
                                                }}
                                            />
                                        </div>{" "}
                                        <label>Custom Price</label>
                                    </div>
                                    <div className="flex gap-4">
                                        {hotel?.roomOccupancies?.map(
                                            (roomOccup) => {
                                                return (
                                                    <div className="">
                                                        <label htmlFor="">
                                                            {
                                                                roomOccup?.occupancyShortName
                                                            }
                                                        </label>
                                                        <input
                                                            type="number"
                                                            placeholder="Ex: 60"
                                                            // name="adultAgeLimit"
                                                            value={
                                                                roomOccup?.price
                                                            }
                                                            onChange={(e) => {
                                                                dispatch(
                                                                    handleRoomTypeChange(
                                                                        {
                                                                            stayIndex,
                                                                            hotelIndex,
                                                                            value: e
                                                                                .target
                                                                                .value,
                                                                            name: roomOccup.occupancyShortName,
                                                                        }
                                                                    )
                                                                );
                                                            }}
                                                            disabled={
                                                                !hotel.isCustomHotelMarkup
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs mt-4 font-[500]">
                            {error}
                        </p>
                    )}
                </div>
            </div>
            {isModal && isEdit && selectedIndex === hotelIndex ? (
                isAlreadyBooked ? (
                    <HotelAlreadyAvailableSearchModal
                        hotel={hotel}
                        hotelIndex={hotelIndex}
                        stayIndex={stayIndex}
                        setIsModal={setIsModal}
                        edit={true}
                        setIsEdit={setIsEdit}
                    />
                ) : (
                    <HotelSearchModal
                        hotel={hotel}
                        hotelIndex={hotelIndex}
                        stayIndex={stayIndex}
                        setIsModal={setIsModal}
                        edit={true}
                        setIsEdit={setIsEdit}
                    />
                )
            ) : (
                ""
            )}
        </>
    );
}
