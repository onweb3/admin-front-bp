import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addExcusrsion,
    handleExcursionTypeChange,
    handleQuotationDisableChange,
} from "../../redux/slices/quotationSlice";
import SingleExcursion from "./SingleExcursion";
import { useHandleClickOutside } from "../../hooks";
import axios from "../../axios";

export default function ExcursionQuotationForm() {
    const [searchedExcursions, setSearchedExcursions] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [perPersonTotal, setPerPersonTotal] = useState({
        adult: 0,
        child: 0,
    });

    const dispatch = useDispatch();
    const dropdownWrapperRef = useRef();
    useHandleClickOutside(dropdownWrapperRef, () => setIsDropdownOpen(false));

    const {
        excursions,
        selectedExcursions,
        selectedExcursionsIds,
        excursionTransferType,
        isExcursionQuotationDisabled,
        checkInDate,
    } = useSelector((state) => state.quotations);
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchExcursion = async (text) => {
        try {
            const response = await axios.get(
                `/quotations/inital/excursions?text=${text}&date=${checkInDate}&value=${excursionTransferType}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setSearchedExcursions(response.data);
        } catch (err) {}
    };

    useEffect(() => {
        if (searchText) {
            fetchExcursion(searchText);
        }
    }, [searchText, excursions, excursionTransferType]);

    console.log(selectedExcursions, "selected excursions");

    useEffect(() => {
        let adultTotal = 0;
        let childTotal = 0;

        for (let i = 0; i < selectedExcursions?.length; i++) {
            adultTotal += selectedExcursions[i]?.perPersonAdultPrice || 0;
            childTotal += selectedExcursions[i]?.perPersonChildPrice || 0;
        }
        setPerPersonTotal((prev) => {
            return { ...prev, adult: adultTotal, child: childTotal };
        });
    }, [selectedExcursions]);

    return (
        <div>
            <div className="flex items-center mb-7 gap-4">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={!isExcursionQuotationDisabled}
                    onChange={(e) =>
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isExcursionQuotationDisabled",
                                value: !e.target.checked,
                            })
                        )
                    }
                />
                <h1 className="text-base font-[600]  text-blue-500">
                    Excursion Quotation
                </h1>
            </div>
            {isExcursionQuotationDisabled === false ? (
                <>
                    <div className="flex items-start gap-[2em] mb-6">
                        <label
                            htmlFor=""
                            className="w-[100%] max-w-[180px]"
                        ></label>
                        <div className="w-full flex flex-wrap items-center gap-5">
                            <div className="flex items-center gap-[10px]">
                                <input
                                    type="radio"
                                    className="w-[16px] h-[16px]"
                                    name="excursion-transfer-type"
                                    defaultChecked
                                    onChange={() => {
                                        dispatch(
                                            handleExcursionTypeChange("all")
                                        );
                                    }}
                                />
                                <label htmlFor="" className="mb-0">
                                    Ticket Only
                                </label>
                            </div>
                            <div className="flex items-center gap-[10px]">
                                <input
                                    type="radio"
                                    className="w-[16px] h-[16px]"
                                    name="excursion-transfer-type"
                                    onChange={() => {
                                        dispatch(
                                            handleExcursionTypeChange("shared")
                                        );
                                    }}
                                />
                                <label htmlFor="" className="mb-0">
                                    Shared
                                </label>
                            </div>
                            <div className="flex items-center gap-[10px]">
                                <input
                                    type="radio"
                                    className="w-[16px] h-[16px]"
                                    name="excursion-transfer-type"
                                    onChange={() => {
                                        dispatch(
                                            handleExcursionTypeChange("private")
                                        );
                                    }}
                                />
                                <label htmlFor="" className="mb-0">
                                    Private
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-[2em]">
                        <label htmlFor="" className="w-[100%] max-w-[180px]">
                            Excursions
                        </label>
                        <div className="w-full">
                            <div className="">
                                <div
                                    className="relative"
                                    ref={dropdownWrapperRef}
                                >
                                    <input
                                        type="text"
                                        placeholder="Search here..."
                                        onChange={(e) =>
                                            setSearchText(e.target.value)
                                        }
                                        onFocus={() => setIsDropdownOpen(true)}
                                    />
                                    {isDropdownOpen && searchText && (
                                        <div className="absolute top-[100%] left-0 right-0 bg-[#fff] max-h-[200px] overflow-y-auto shadow-lg">
                                            {searchedExcursions?.length < 1 ? (
                                                <div className="flex items-center justify-center h-full gap-[10px] p-5">
                                                    <span className="text-sm text-gray-500">
                                                        No Excursions Found
                                                    </span>
                                                </div>
                                            ) : (
                                                searchedExcursions?.map(
                                                    (excursion, index) => {
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={
                                                                    "flex items-center gap-[10px] px-4 py-[7px] hover:bg-[#f6f6f6] cursor-pointer text-sm " +
                                                                    (selectedExcursionsIds?.includes(
                                                                        excursion?.activityId
                                                                    )
                                                                        ? "cursor-not-allowed"
                                                                        : "cursor-pointer")
                                                                }
                                                                onClick={() => {
                                                                    if (
                                                                        !selectedExcursionsIds?.includes(
                                                                            excursion?.activityId
                                                                        )
                                                                    ) {
                                                                        dispatch(
                                                                            addExcusrsion(
                                                                                {
                                                                                    excursion,
                                                                                    excursionTransferType,
                                                                                }
                                                                            )
                                                                        );
                                                                        setIsDropdownOpen(
                                                                            false
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <span
                                                                    className={
                                                                        "flex items-center justify-center w-[18px] h-[18px] min-w-[18px] min-h-[18px] rounded-full " +
                                                                        (selectedExcursionsIds?.includes(
                                                                            excursion?.activityId
                                                                        )
                                                                            ? "bg-green-200 text-green-500"
                                                                            : "bg-blue-200 text-blue-500")
                                                                    }
                                                                >
                                                                    {selectedExcursionsIds?.includes(
                                                                        excursion?.activityId
                                                                    )
                                                                        ? "-"
                                                                        : "+"}
                                                                </span>
                                                                <span className="leading-[22px]">
                                                                    {
                                                                        excursion?.activity.name?.split(
                                                                            "+"
                                                                        )[0]
                                                                    }{" "}
                                                                    <span className="text-blue-500">
                                                                        {excursion?.activity.name?.split(
                                                                            "+"
                                                                        )[1] &&
                                                                            "+ " +
                                                                                excursion?.activity?.name?.split(
                                                                                    "+"
                                                                                )[1]}
                                                                    </span>
                                                                    <span className="capitalize text-gray-500">
                                                                        {" "}
                                                                        -{" "}
                                                                        {excursion?.excursionType ===
                                                                        "ticket"
                                                                            ? "Ticket With Transfer"
                                                                            : excursion?.excursionType}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5">
                                {!selectedExcursions &&
                                selectedExcursions?.length < 1 ? (
                                    <span className="text-sm text-gray-500">
                                        No Excursions Selected!
                                    </span>
                                ) : (
                                    [...selectedExcursions]
                                        .slice(0)
                                        .reverse()
                                        ?.map((excursion) => {
                                            return (
                                                <SingleExcursion
                                                    key={excursion?.excursionId}
                                                    excursion={excursion}
                                                    excursionTransferType={
                                                        excursionTransferType
                                                    }
                                                />
                                            );
                                        })
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-[2em] mt-8 text-sm">
                        <label htmlFor="" className="w-[100%] max-w-[180px]">
                            Per Person Adult Total
                        </label>
                        <span className="font-medium">
                            {perPersonTotal?.adult?.toFixed(2)} AED
                        </span>
                    </div>
                    <div className="flex items-start gap-[2em] mt-5 text-sm">
                        <label htmlFor="" className="w-[100%] max-w-[180px]">
                            Per Person Child Total
                        </label>
                        <span className="font-medium">
                            {perPersonTotal?.child?.toFixed(2)} AED
                        </span>
                    </div>
                </>
            ) : (
                ""
            )}
            {/* <div className="flex items-center gap-[10px] mt-5">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={isExcursionQuotationDisabled}
                    onChange={(e) =>
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isExcursionQuotationDisabled",
                                value: e.target.checked,
                            })
                        )
                    }
                />
                <label htmlFor="" className="mb-0">
                    Please check this box if you don't need supplement quotation
                </label>
            </div> */}
        </div>
    );
}
