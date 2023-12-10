import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setData } from "../../../redux/slices/attractionFormSlice";
import axios from "../../../axios";
import { SelectDropdown } from "../../../components";

export default function AttrDetailsForm({ section, isEdit = false }) {
    const { data, categories } = useSelector((state) => state.attractionForm);
    const { destinations } = useSelector((state) => state.general);
    const { states, cities, countries, areas } = useSelector((state) => state.general);

    const availableStates = states?.filter((item) => {
        return item?.country === data.country;
    });
    const availableCities = cities?.filter((item) => {
        return item?.country === data.country;
    });
    const availableAreas = areas?.filter((item) => {
        return item?.country === data.country;
    });
    const dispatch = useDispatch();
    const [apis, setApis] = useState([]);

    const handleChange = (e) => {
        dispatch(setData({ name: e.target.name, value: e.target.value }));
    };

    const handleDetailsChange = ({ name, value }) => {
        dispatch(setData({ name: name, value: value }));
    };

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchApisList = async () => {
        try {
            const response = await axios.get(`/api-master/all`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setApis(response?.data?.apis);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchApisList();
    }, []);

    return (
        <div className={isEdit ? (section === 1 ? "block" : "hidden") : section === 2 ? "block" : "hidden"}>
            <div className="grid grid-cols-3 gap-[20px]">
                <div>
                    <label htmlFor="">Attraction Title</label>
                    <input type="text" name="title" value={data.title || ""} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="">Bookin Type</label>
                    <select name="bookingType" onChange={handleChange} value={data.bookingType || ""} id="">
                        <option value="ticket">Ticket</option>
                        <option value="booking">Booking</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="">Destination</label>
                    <select
                        name="destination"
                        id=""
                        value={data.destination || ""}
                        onChange={handleChange}
                        className="capitalize"
                    >
                        <option value="" hidden>
                            Select Destination
                        </option>
                        {destinations?.map((destination, index) => {
                            return (
                                <option value={destination?._id} key={index} className="capitalize">
                                    {destination?.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-[20px] mt-5">
                <div>
                    <label htmlFor="">Category</label>
                    <select
                        name="category"
                        value={data.category || ""}
                        onChange={handleChange}
                        id=""
                        className="capitalize"
                    >
                        <option value="" hidden>
                            Select Category
                        </option>
                        {categories?.map((category, index) => {
                            return (
                                <option value={category?._id} key={index} className="capitalize">
                                    {category?.categoryName}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <label htmlFor="">Duration Type</label>
                    <select name="durationType" id="" value={data.durationType || ""} onChange={handleChange}>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="">Duration</label>
                    <input
                        type="number"
                        name="duration"
                        value={data.duration || ""}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-[20px] mt-5">
                {data.bookingType === "booking" && (
                    <div>
                        <label htmlFor="">Bookig Prior (Days)</label>
                        <input
                            type="number"
                            name="bookingPriorDays"
                            value={data.bookingPriorDays || ""}
                            onChange={handleChange}
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="">County *</label>
                    <SelectDropdown
                        data={countries}
                        valueName={"isocode"}
                        displayName={"countryName"}
                        placeholder="Select Country"
                        selectedData={data?.countryCode || ""}
                        setSelectedData={(val) => {
                            handleDetailsChange({
                                name: "countryCode",
                                value: val,
                            });
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
                        selectedData={data?.state || ""}
                        setSelectedData={(val) => {
                            handleDetailsChange({
                                name: "state",
                                value: val,
                            });
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
                        selectedData={data?.city || ""}
                        setSelectedData={(val) => {
                            handleDetailsChange({
                                name: "city",
                                value: val,
                            });
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
                        selectedData={data?.area || ""}
                        setSelectedData={(val) => {
                            handleDetailsChange({
                                name: "area",
                                value: val,
                            });
                        }}
                    />
                </div>{" "}
                <div>
                    <label htmlFor="">Latitude *</label>
                    <input
                        type="text"
                        name="latitude"
                        value={data?.latitude || ""}
                        onChange={handleChange}
                        placeholder="Ex: 25.276987"
                    />
                </div>
                <div>
                    <label htmlFor="">Longitude *</label>
                    <input
                        type="text"
                        name="longitude"
                        value={data?.longitude || ""}
                        onChange={handleChange}
                        placeholder="Ex: 55.296249"
                    />
                </div>
                <div className="h-full ">
                    <label htmlFor="">Google Map Link</label>
                    <input
                        type="text"
                        value={data.mapLink || ""}
                        name="mapLink"
                        onChange={handleChange}
                        placeholder="Enter Google Map Link"
                    />
                </div>
                <div className="">
                    <div className="flex items-center gap-[10px]">
                        <input
                            type="checkbox"
                            className="w-[16px] h-[16px]"
                            name="isApiConnected"
                            checked={data?.isApiConnected || false}
                            onChange={(e) =>
                                dispatch(
                                    setData({
                                        name: "isApiConnected",
                                        value: e.target.checked,
                                    })
                                )
                            }
                        />
                        <label htmlFor="" className="mb-0">
                            API Connected
                        </label>
                    </div>
                    {data?.isApiConnected && (
                        <div className="mt-2">
                            <label htmlFor="">Select API</label>
                            <select
                                name="connectedApi"
                                id=""
                                onChange={handleChange}
                                value={data.connectedApi || ""}
                            >
                                <option value="" hidden>
                                    Select API
                                </option>
                                {apis.map((api, index) => {
                                    return (
                                        <option value={api._id} key={index}>
                                            {api.apiCode}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-[20px] items-start mt-5">
                <div>
                    <div className="flex items-center gap-[10px]">
                        <input
                            type="checkbox"
                            className="w-[16px] h-[16px]"
                            checked={data.isOffer || ""}
                            onChange={(e) =>
                                dispatch(
                                    setData({
                                        name: "isOffer",
                                        value: e.target.checked,
                                    })
                                )
                            }
                        />
                        <label htmlFor="" className="mb-0">
                            Offer Available
                        </label>
                    </div>
                    {data?.isOffer === true && (
                        <div className="mt-2">
                            <label htmlFor="">Offer Amount Type</label>
                            <select
                                name="offerAmountType"
                                onChange={handleChange}
                                value={data.offerAmountType || ""}
                            >
                                <option value="flat">Flat</option>
                                <option value="percentage">Percentage</option>
                            </select>
                        </div>
                    )}
                </div>
                {data.isOffer === true && (
                    <div className="flex flex-col justify-end h-full">
                        <label htmlFor="">Offer</label>
                        <input
                            type="number"
                            name="offerAmount"
                            onChange={handleChange}
                            value={data?.offerAmount || ""}
                        />
                    </div>
                )}
                <div className="flex gap-[10px]">
                    <input
                        type="checkbox"
                        className="w-[16px] h-[16px]"
                        name="isCombo"
                        checked={data?.isCombo || false}
                        onChange={(e) =>
                            dispatch(
                                setData({
                                    name: "isCombo",
                                    value: e.target.checked,
                                })
                            )
                        }
                    />
                    <label htmlFor="" className="mb-0">
                        Is Combo
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-[20px] mt-5">
                <div>
                    <label htmlFor="">Cancellation Type</label>
                    <select
                        name="cancellationType"
                        id=""
                        value={data.cancellationType || ""}
                        onChange={handleChange}
                    >
                        <option value="nonRefundable">No Refundable</option>
                        <option value="freeCancellation">Free Cancellation</option>
                        <option value="cancelWithFee">Cancel with fee</option>
                    </select>
                </div>
                {data?.cancellationType !== "nonRefundable" && (
                    <>
                        <div>
                            <label htmlFor="">Cancel Before (Time)</label>
                            <select
                                name="cancelBeforeTime"
                                value={data?.cancelBeforeTime || ""}
                                onChange={handleChange}
                                id=""
                            >
                                <option value="0">0 Hrs</option>
                                <option value="24">24 Hrs</option>
                                <option value="48">48 Hrs</option>
                                <option value="72">72 Hrs</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Cancellation Fee in %</label>
                            <input
                                type="number"
                                name="cancellationFee"
                                value={data.cancellationFee || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
