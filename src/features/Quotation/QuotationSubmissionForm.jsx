import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment/moment";

import axios from "../../axios";
import BtnLoader from "../../components/BtnLoader";
import {
    handleMarkupChange,
    handleMarkupTypeChange,
    handleQuotationCurrencyChange,
    handleCustomMarkupChange,
} from "../../redux/slices/quotationSlice";

export default function QuotationSubmissionForm({ isEdit = false }) {
    const [markupError, setMarkupError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { isCustomMarkup } = useSelector((state) => state.quotations);

    const { jwtToken } = useSelector((state) => state.admin);
    const {
        hotelQt,
        transfer,
        selectedVisa,
        selectedExcursions,
        isTransferQuotationDisabled,
        isTourismFeeIncluded,
        quotationCurrency,
        markup,
        markupType,
        noOfAdults,
        noOfChildren,
        childrenAges,
        isHotelQuotationDisabled,
        dateError,
        checkInDate,
        checkOutDate,
        otbPrice,
        hotelDisabledRemark,
        clientName,
        selectedExcSupplements,
        stays,
        // transfers,
        transferQuotation,
        selectedExcursionTypeSuppliments,
        selectedVisaId,
        isSupplimentQuotationDisabled,
        selectedExcursionType,
        isVisaQuotationDisabled,
        isExcursionQuotationDisabled,
        selectedExcursionSuppliments,
        arrivalAirport,
        departureAirport,
        paxType,
        isArrivalAirportDisabled,
        isDepartureAirportDisabled,
        isResellerDisabled,
        selectedReseller,
        isAlreadyBooked,
        arrivalTerminalId,
        arrivalTerminalCode,
        departureTerminalId,
        departureTerminalCode,
        selectedVisaNationality,
        customMarkupType,
        customMarkup,
    } = useSelector((state) => state.quotations);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { quotationNumber, amendementNumber } = useParams();

    const handleSubmitQuotation = async () => {
        try {
            if (dateError) {
                return setError(dateError);
            }

            // if (!markup) {
            //     return setMarkupError(true);
            // }

            if (!markupError) {
                setIsLoading(true);
                setError("");

                let response;
                if (isEdit) {
                    response = await axios.patch(
                        `/quotations/update/${quotationNumber}`,
                        {
                            clientName,
                            noOfAdults,
                            noOfChildren,
                            childrenAges,
                            paxType,
                            arrivalAirport,
                            departureAirport,
                            isArrivalAirportDisabled,
                            isDepartureAirportDisabled,
                            isHotelQuotationDisabled,
                            isSupplimentQuotationDisabled,
                            isExcursionQuotationDisabled,
                            hotelQt,
                            isTransferQuotationDisabled,
                            transfer: transferQuotation?.transfers,
                            isVisaQuotationDisabled,
                            visaId: selectedVisa,
                            selectedVisaNationality,
                            selectedExcursionType: selectedExcursions,
                            selectedExcursionTypeSuppliments:
                                selectedExcSupplements,
                            otbPrice,
                            hotelDisabledRemark,
                            isAlreadyBooked,
                            quotationCurrency,
                            isResellerDisabled,
                            arrivalTerminalId,
                            arrivalTerminalCode,
                            departureTerminalId,
                            departureTerminalCode,
                            resellerId: selectedReseller.resellerId,
                            checkInDate: checkInDate
                                ? moment(checkInDate).format().substring(0, 10)
                                : "",
                            checkOutDate: checkOutDate
                                ? moment(checkOutDate).format().substring(0, 10)
                                : "",
                            isCustomMarkup,
                            customMarkupType,
                            customMarkup,
                        },
                        {
                            headers: { Authorization: `Bearer ${jwtToken}` },
                        }
                    );
                } else {
                    response = await axios.post(
                        "/quotations/create",
                        {
                            clientName,
                            noOfAdults,
                            noOfChildren,
                            childrenAges,
                            paxType,
                            arrivalAirport,
                            departureAirport,
                            isArrivalAirportDisabled,
                            isDepartureAirportDisabled,
                            isHotelQuotationDisabled,
                            isSupplimentQuotationDisabled,
                            isExcursionQuotationDisabled,
                            hotelQt,
                            isTransferQuotationDisabled,
                            transfer: transferQuotation?.transfers,
                            isVisaQuotationDisabled,
                            visaId: selectedVisa,
                            selectedExcursionType: selectedExcursions,
                            selectedExcursionTypeSuppliments:
                                selectedExcSupplements,
                            otbPrice,
                            hotelDisabledRemark,
                            quotationCurrency,
                            isAlreadyBooked,
                            arrivalTerminalId,
                            arrivalTerminalCode,
                            departureTerminalId,
                            departureTerminalCode,
                            checkInDate: checkInDate
                                ? moment(checkInDate).format().substring(0, 10)
                                : "",
                            checkOutDate: checkOutDate
                                ? moment(checkOutDate).format().substring(0, 10)
                                : "",
                            isResellerDisabled,
                            resellerId: selectedReseller.resellerId,
                            selectedVisaNationality,
                            isCustomMarkup,
                            customMarkupType,
                            customMarkup,
                        },
                        {
                            headers: { Authorization: `Bearer ${jwtToken}` },
                        }
                    );
                }

                navigate(`/quotations/${response?.data?.quotationNumber}`);
            }

            // dispatchEvent((clear))
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
            console.log(err);
        }
    };

    useEffect(() => {
        if (
            markup &&
            markupType === "percentage" &&
            (markup > 15 || markup < 4)
        ) {
            setMarkupError(true);
        } else {
            setMarkupError(false);
        }
    }, [markupType, markup]);

    return (
        <div>
            <div className="flex items-center mb-7 gap-4">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={isCustomMarkup}
                    onChange={(e) =>
                        dispatch(
                            handleCustomMarkupChange({
                                name: "isSupplimentQuotationDisabled",
                                value: e.target.checked,
                            })
                        )
                    }
                />
                <h1 className="text-base font-[600] text-blue-500">
                    Custom Markup
                </h1>
            </div>

            {isCustomMarkup && (
                <div className="flex items-start gap-[2em] mt-6">
                    <label htmlFor="" className="w-[100%] max-w-[180px]">
                        Markup <br />
                        (Min: 4% - Max: 15%)
                    </label>

                    <div className="w-full ">
                        <div className="flex items-start gap-[2em] mb-[10px]">
                            <div className="flex items-center gap-[10px]">
                                <input
                                    type="radio"
                                    name="markup-type"
                                    className="w-[18px] h-[18px]"
                                    onChange={() =>
                                        dispatch(
                                            dispatch(
                                                handleMarkupTypeChange(
                                                    "percentage"
                                                )
                                            )
                                        )
                                    }
                                    checked={customMarkupType === "percentage"}
                                />
                                <label htmlFor="" className="mb-0">
                                    Percentage
                                </label>
                            </div>
                            <div className="flex items-center gap-[10px]">
                                <input
                                    type="radio"
                                    name="markup-type"
                                    className="w-[18px] h-[18px]"
                                    onChange={() =>
                                        dispatch(handleMarkupTypeChange("flat"))
                                    }
                                    checked={customMarkupType === "flat"}
                                />
                                <label htmlFor="" className="mb-0">
                                    Flat
                                </label>
                            </div>
                        </div>

                        <input
                            type="number"
                            required
                            onChange={(e) => {
                                dispatch(handleMarkupChange(e.target.value));
                            }}
                            value={customMarkup || ""}
                            placeholder="Enter Markup"
                            onWheel={(e) => e.target.blur()}
                        />
                        <span className="text-sm block mt-[7px] text-gray-500">
                            Add your markup in {quotationCurrency}
                        </span>
                        {markupError && (
                            <span className="text-sm text-red-500 block mt-[7px]">
                                The markup value should be 4% to 15%
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className="flex items-start gap-[2em] mt-[15px]">
                <label htmlFor="" className="w-[100%] max-w-[180px]">
                    Create Quotation in
                </label>
                <div className="flex flex-wrap items-center gap-[30px]">
                    <div className="flex items-center gap-[10px]">
                        <input
                            type="radio"
                            name="quotation-currency"
                            className="w-[18px] h-[18px]"
                            onChange={() =>
                                dispatch(handleQuotationCurrencyChange("USD"))
                            }
                            checked={quotationCurrency === "USD"}
                        />
                        <label htmlFor="" className="mb-0">
                            USD
                        </label>
                    </div>
                    <div className="flex items-center gap-[10px]">
                        <input
                            type="radio"
                            name="quotation-currency"
                            className="w-[18px] h-[18px]"
                            onChange={() =>
                                dispatch(handleQuotationCurrencyChange("AED"))
                            }
                            checked={quotationCurrency === "AED"}
                        />
                        <label htmlFor="" className="mb-0">
                            AED
                        </label>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-start gap-[2em]">
                    <span className="w-[100%] max-w-[180px]"></span>
                    <span className="text-sm text-red-500 block mt-5">
                        {error}
                    </span>
                </div>
            )}
            <div className="flex justify-end mt-6">
                <button
                    className="w-[200px]"
                    onClick={handleSubmitQuotation}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <BtnLoader />
                    ) : isEdit ? (
                        "Update Quotation"
                    ) : (
                        "Create Quotation"
                    )}
                </button>
            </div>
        </div>
    );
}
