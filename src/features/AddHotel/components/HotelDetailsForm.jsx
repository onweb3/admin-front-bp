import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";

import {
    handleHotelDetailsChange,
    removeHotelOpenDay,
    selectHotelOpenDay,
} from "../../../redux/slices/hotelFormSlice";
import { MultipleSelectDropdown, SelectDropdown } from "../../../components";

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export default function HotelDetailsForm({ selectedSection }) {
    const [isHbIdCopied, setIsHbIdCopied] = useState(false);

    const { details, accommodationTypes, apis, boards, hotelChains } = useSelector(
        (state) => state.hotelForm
    );
    const { states, cities, countries, areas } = useSelector((state) => state.general);
    const dispatch = useDispatch();

    const availableStates = states?.filter((item) => {
        return item?.country === details.country;
    });
    const availableCities = cities?.filter((item) => {
        return item?.state === details.state && item?.country === details.country;
    });
    const availableAreas = areas?.filter((item) => {
        return (
            item?.city === details.city &&
            item?.state === details.state &&
            item?.country === details.country
        );
    });

    const handleChange = (e) => {
        dispatch(
            handleHotelDetailsChange({
                name: e.target?.name,
                value: e.target?.value,
            })
        );
    };

    const handleCheckBoxChange = (e) => {
        dispatch(
            handleHotelDetailsChange({
                name: e.target?.name,
                value: e.target?.checked,
            })
        );
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsHbIdCopied(false);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [isHbIdCopied]);

    return (
        <div className={selectedSection === "-details" ? "block" : "hidden"}>
            <div className="grid grid-cols-4 gap-[20px]">
                <div>
                    <label htmlFor="">Hotel Name *</label>
                    <input
                        type="text"
                        name="hotelName"
                        value={details?.hotelName || ""}
                        onChange={handleChange}
                        placeholder="Ex: Abc Hotel"
                    />
                </div>
                <div>
                    <label htmlFor="">Chain *</label>
                    <SelectDropdown
                        data={hotelChains}
                        valueName={"_id"}
                        displayName={"chainName"}
                        placeholder="Select Chain"
                        selectedData={details.hotelChain || ""}
                        setSelectedData={(val) => {
                            dispatch(
                                handleHotelDetailsChange({
                                    name: "hotelChain",
                                    value: val,
                                })
                            );
                        }}
                        bracketValue={"chainCode"}
                    />
                </div>
                <div>
                    <label htmlFor="">Accommodation Type *</label>
                    <SelectDropdown
                        data={accommodationTypes}
                        valueName={"_id"}
                        displayName={"accommodationTypeName"}
                        placeholder="Select Accommodation Type"
                        selectedData={details.accommodationType || ""}
                        setSelectedData={(val) => {
                            dispatch(
                                handleHotelDetailsChange({
                                    name: "accommodationType",
                                    value: val,
                                })
                            );
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="">County *</label>
                    <SelectDropdown
                        data={countries}
                        valueName={"_id"}
                        displayName={"countryName"}
                        placeholder="Select Country"
                        selectedData={details.country || ""}
                        setSelectedData={(val) => {
                            dispatch(
                                handleHotelDetailsChange({
                                    name: "country",
                                    value: val,
                                })
                            );
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="">Emirate *</label>
                    <SelectDropdown
                        data={availableStates}
                        valueName={"_id"}
                        displayName={"stateName"}
                        placeholder="Select Emirate"
                        selectedData={details.state || ""}
                        setSelectedData={(val) => {
                            dispatch(
                                handleHotelDetailsChange({
                                    name: "state",
                                    value: val,
                                })
                            );
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="">City *</label>
                    <SelectDropdown
                        data={availableCities}
                        valueName={"_id"}
                        displayName={"cityName"}
                        placeholder="Select City"
                        selectedData={details.city || ""}
                        setSelectedData={(val) => {
                            dispatch(
                                handleHotelDetailsChange({
                                    name: "city",
                                    value: val,
                                })
                            );
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="">Area *</label>
                    <SelectDropdown
                        data={availableAreas}
                        valueName={"_id"}
                        displayName={"areaName"}
                        placeholder="Select Area"
                        selectedData={details.area || ""}
                        setSelectedData={(val) => {
                            dispatch(
                                handleHotelDetailsChange({
                                    name: "area",
                                    value: val,
                                })
                            );
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="">Address *</label>
                    <input
                        type="text"
                        name="address"
                        value={details?.address || ""}
                        onChange={handleChange}
                        placeholder="Enter Address"
                    />
                </div>
                <div>
                    <label htmlFor="">Landmark</label>
                    <input
                        type="text"
                        name="landMark"
                        value={details?.landMark || ""}
                        onChange={handleChange}
                        placeholder="Ex: Near Burj Khalifa"
                    />
                </div>
                <div>
                    <label htmlFor="">Street</label>
                    <input
                        type="text"
                        name="street"
                        value={details?.street || ""}
                        onChange={handleChange}
                        placeholder="Enter Street"
                    />
                </div>
                <div>
                    <label htmlFor="">Postal Code</label>
                    <input
                        type="number"
                        name="postalCode"
                        value={details?.postalCode || ""}
                        onChange={handleChange}
                        placeholder="Enter Postal Code"
                    />
                </div>
                <div>
                    <label htmlFor="">Website</label>
                    <input
                        type="text"
                        name="website"
                        value={details?.website || ""}
                        onChange={handleChange}
                        placeholder="Ex: https://hotel-name.com"
                    />
                </div>
                <div>
                    <label htmlFor="">Star Category *</label>
                    <select
                        id=""
                        name="starCategory"
                        value={details?.starCategory || ""}
                        onChange={handleChange}
                    >
                        <option value="" hidden>
                            Select Star Category
                        </option>
                        <option value="2">2 Star</option>
                        <option value="3">3 Star</option>
                        <option value="4">4 Star</option>
                        <option value="5">5 Star</option>
                        <option value="apartment">apartment</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="">Latitude *</label>
                    <input
                        type="text"
                        name="latitude"
                        value={details?.latitude || ""}
                        onChange={handleChange}
                        placeholder="Ex: 25.276987"
                    />
                </div>
                <div>
                    <label htmlFor="">Longitude *</label>
                    <input
                        type="text"
                        name="longitude"
                        value={details?.longitude || ""}
                        onChange={handleChange}
                        placeholder="Ex: 55.296249"
                    />
                </div>
                <div>
                    <label htmlFor="">Check In Time *</label>
                    <input
                        type="time"
                        placeholder=""
                        name="checkInTime"
                        value={details?.checkInTime || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="">Check Out Time *</label>
                    <input
                        type="time"
                        placeholder=""
                        name="checkOutTime"
                        value={details?.checkOutTime || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="">Rooms Count</label>
                    <input
                        type="number"
                        placeholder="0"
                        name="roomsCount"
                        value={!isNaN(details?.roomsCount) ? details?.roomsCount : ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="">Floors Count</label>
                    <input
                        type="number"
                        name="floorsCount"
                        value={!isNaN(details?.floorsCount) ? details?.floorsCount : ""}
                        onChange={handleChange}
                        placeholder="0"
                    />
                </div>
                <div>
                    <label htmlFor="">Car Parking Slots</label>
                    <input
                        type="number"
                        placeholder="0"
                        name="carParkingSlots"
                        value={!isNaN(details?.carParkingSlots) ? details?.carParkingSlots : ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="">Distance From City (km)</label>
                    <input
                        type="number"
                        placeholder="0"
                        name="distanceFromCity"
                        value={!isNaN(details?.distanceFromCity) ? details?.distanceFromCity : ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="">Board Types</label>
                    <div className="">
                        <MultipleSelectDropdown
                            data={boards}
                            displayName={"boardName"}
                            selectedData={details.boardTypes || []}
                            setSelectedData={(selBoards) =>
                                dispatch(
                                    handleHotelDetailsChange({
                                        name: "boardTypes",
                                        value: selBoards,
                                    })
                                )
                            }
                            valueName={"_id"}
                            randomIndex={"boardTypes"}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="">Open Days *</label>
                    <div className="flex items-center gap-[2px]">
                        {days?.map((day, index) => {
                            return (
                                <span
                                    key={index}
                                    className={
                                        "w-[25px] h-[25px] text-white cursor-pointer capitalize rounded flex items-center justify-center " +
                                        (details?.openDays?.includes(day)
                                            ? "bg-orange-500"
                                            : "bg-gray-500")
                                    }
                                    onClick={() => {
                                        if (details?.openDays?.includes(day)) {
                                            dispatch(removeHotelOpenDay(day));
                                        } else {
                                            dispatch(selectHotelOpenDay(day));
                                        }
                                    }}
                                >
                                    {day?.slice(0, 1)}
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div className="flex items-center gap-[10px]">
                    <input
                        type="checkbox"
                        name="isContractAvailable"
                        checked={details?.isContractAvailable || false}
                        onChange={handleCheckBoxChange}
                        className="w-[17px] h-[17px]"
                        id="isContractAvailable"
                    />
                    <label htmlFor="isContractAvailable" className="mb-0">
                        Contract Available
                    </label>
                </div>
                <div className="flex items-center gap-[10px]">
                    <input
                        type="checkbox"
                        name="isApiConnected"
                        checked={details?.isApiConnected || false}
                        onChange={handleCheckBoxChange}
                        className="w-[17px] h-[17px]"
                        id="isApiConnected"
                    />
                    <label htmlFor="isApiConnected" className="mb-0">
                        Is Api Connected
                    </label>
                </div>
                <div>
                    <label htmlFor="">Connected APIs</label>
                    <div className="">
                        <MultipleSelectDropdown
                            data={apis}
                            displayName={"apiName"}
                            selectedData={details.connectedApis || []}
                            setSelectedData={(selApis) =>
                                dispatch(
                                    handleHotelDetailsChange({
                                        name: "connectedApis",
                                        value: selApis,
                                    })
                                )
                            }
                            valueName={"_id"}
                            randomIndex={"connectedApis"}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-[10px]">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={details?.isActive || false}
                        onChange={handleCheckBoxChange}
                        className="w-[17px] h-[17px]"
                        id="isActive"
                    />
                    <label htmlFor="isActive" className="mb-0">
                        Is Active
                    </label>
                </div>
                <div></div>
                <div>
                    <label htmlFor="">Hotel Bed Id</label>
                    <div className="flex items-center gap-[10px]">
                        <input
                            type="number"
                            placeholder="Enter hotel bed id"
                            name="hbId"
                            value={details?.hbId || ""}
                            onChange={handleChange}
                        />
                        <button
                            className={
                                "w-[40px] flex items-center justify-center text-lg bg-[#f3f6f9]  hover:bg-[#f0f0f0] " +
                                (isHbIdCopied ? "text-green-500" : "text-[#222]")
                            }
                            onClick={() => {
                                navigator.clipboard.writeText(details?.hbId || "");
                                setIsHbIdCopied(true);
                            }}
                        >
                            {isHbIdCopied ? <FaCheck /> : <FiCopy />}
                        </button>
                    </div>
                    <span className="text-sm text-grayColor block mt-2">
                        Consult technical team before updating this filed.(Hotel Bed provided id)
                    </span>
                </div>
            </div>
        </div>
    );
}
