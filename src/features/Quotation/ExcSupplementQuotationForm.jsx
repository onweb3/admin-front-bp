import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    addExcSupplement,
    handleExcSupplementTransferTypeChange,
    handleQuotationDisableChange,
} from "../../redux/slices/quotationSlice";
import { useHandleClickOutside } from "../../hooks";
import SingleExcSupplement from "./SingleExcSupplement";

export default function ExcSupplementQuotationForm() {
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
        selectedExcSupplements,
        selectedExcSupplementIds,
        excSupplementTransferType,
        isSupplimentQuotationDisabled,
    } = useSelector((state) => state.quotations);

    useEffect(() => {
        if (searchText) {
            const filteredExcursions = excursions?.filter((excursion) => {
                return (
                    excursion?.name
                        ?.toLowerCase()
                        ?.includes(searchText?.toLowerCase()) &&
                    (excSupplementTransferType === "shared"
                        ? excursion?.qtnActivityType === "transfer"
                            ? !!Number(excursion?.transferPricing?.sicPrice)
                            : excursion?.qtnActivityType === "ticket"
                            ? !!Number(
                                  excursion?.ticketPricing
                                      ?.sicWithTicketAdultPrice
                              ) &&
                              !!Number(
                                  excursion?.ticketPricing
                                      ?.sicWithTicketChildPrice
                              )
                            : false
                        : excSupplementTransferType === "private"
                        ? excursion?.qtnActivityType === "transfer"
                            ? !!Number(
                                  excursion?.transferVehicleType?.length > 0
                              )
                            : excursion?.qtnActivityType === "ticket"
                            ? !!Number(excursion?.ticketVehicleType?.length > 0)
                            : false
                        : true)
                );
            });
            setSearchedExcursions(filteredExcursions);
        } else {
            setSearchedExcursions(excursions);
        }
    }, [searchText, excursions, excSupplementTransferType]);

    // useEffect(() => {
    //     let adultTotal = 0;
    //     let childTotal = 0;

    //     for (let i = 0; i < selectedExcSupplements?.length; i++) {
    //         adultTotal += selectedExcSupplements[i]?.perPersonAdultPrice || 0;
    //         childTotal += selectedExcSupplements[i]?.perPersonChildPrice || 0;
    //     }
    //     setPerPersonTotal((prev) => {
    //         return { ...prev, adult: adultTotal, child: childTotal };
    //     });
    // }, [selectedExcSupplements]);

    return (
        <div>
            <div className="flex items-center mb-7 gap-4">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={!isSupplimentQuotationDisabled}
                    onChange={(e) =>
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isSupplimentQuotationDisabled",
                                value: !e.target.checked,
                            })
                        )
                    }
                />
                <h1 className="text-base font-[600] text-blue-500">
                    Supplements
                </h1>
            </div>
            {isSupplimentQuotationDisabled === false ? (
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
                                    name="exc-supplement-transfer-type"
                                    defaultChecked
                                    onChange={() => {
                                        dispatch(
                                            handleExcSupplementTransferTypeChange(
                                                "all"
                                            )
                                        );
                                    }}
                                />
                                <label htmlFor="" className="mb-0">
                                    All
                                </label>
                            </div>
                            <div className="flex items-center gap-[10px]">
                                <input
                                    type="radio"
                                    className="w-[16px] h-[16px]"
                                    name="exc-supplement-transfer-type"
                                    onChange={() => {
                                        dispatch(
                                            handleExcSupplementTransferTypeChange(
                                                "shared"
                                            )
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
                                    name="exc-supplement-transfer-type"
                                    onChange={() => {
                                        dispatch(
                                            handleExcSupplementTransferTypeChange(
                                                "private"
                                            )
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
                                                                    (selectedExcSupplementIds?.includes(
                                                                        excursion?._id
                                                                    )
                                                                        ? "cursor-not-allowed"
                                                                        : "cursor-pointer")
                                                                }
                                                                onClick={() => {
                                                                    if (
                                                                        !selectedExcSupplementIds?.includes(
                                                                            excursion?._id
                                                                        )
                                                                    ) {
                                                                        dispatch(
                                                                            addExcSupplement(
                                                                                {
                                                                                    excursion,
                                                                                    excSupplementTransferType,
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
                                                                        (selectedExcSupplementIds?.includes(
                                                                            excursion?._id
                                                                        )
                                                                            ? "bg-green-200 text-green-500"
                                                                            : "bg-blue-200 text-blue-500")
                                                                    }
                                                                >
                                                                    {selectedExcSupplementIds?.includes(
                                                                        excursion?._id
                                                                    )
                                                                        ? "-"
                                                                        : "+"}
                                                                </span>
                                                                <span className="leading-[22px]">
                                                                    {
                                                                        excursion?.name?.split(
                                                                            "+"
                                                                        )[0]
                                                                    }{" "}
                                                                    <span className="text-blue-500">
                                                                        {excursion?.name?.split(
                                                                            "+"
                                                                        )[1] &&
                                                                            "+ " +
                                                                                excursion?.name?.split(
                                                                                    "+"
                                                                                )[1]}
                                                                    </span>
                                                                    <span className="capitalize text-gray-500">
                                                                        {" "}
                                                                        -{" "}
                                                                        {excursion?.qtnActivityType ===
                                                                        "ticket"
                                                                            ? "Ticket With Transfer"
                                                                            : excursion?.qtnActivityType}
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
                                {!selectedExcSupplements &&
                                selectedExcSupplements?.length < 1 ? (
                                    <span className="text-sm text-gray-500">
                                        No Excursions Selected!
                                    </span>
                                ) : (
                                    [...selectedExcSupplements]
                                        .slice(0)
                                        .reverse()
                                        ?.map((excursion) => {
                                            return (
                                                <SingleExcSupplement
                                                    key={excursion?.excursionId}
                                                    excursion={excursion}
                                                    excSupplementTransferType={
                                                        excSupplementTransferType
                                                    }
                                                />
                                            );
                                        })
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                ""
            )}

            {/* <div className="flex items-center gap-[10px] mt-5">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={isSupplimentQuotationDisabled}
                    onChange={(e) =>
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isSupplimentQuotationDisabled",
                                value: e.target.checked,
                            })
                        )
                    }
                />
                <label htmlFor="" className="mb-0">
                    Please check this box if you don't need supplement quotation
                </label>
            </div> */}
            {/* <div className="flex items-start gap-[2em] mt-8 text-sm">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    Per Person Adult Total
                </label>
                <span className="font-medium">
                    {perPersonTotal.adult?.toFixed(2)} AED
                </span>
            </div>
            <div className="flex items-start gap-[2em] mt-5 text-sm">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    Per Person Child Total
                </label>
                <span className="font-medium">
                    {perPersonTotal.child?.toFixed(2)} AED
                </span>
            </div> */}
        </div>
    );
}
