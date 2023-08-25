import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GrRefresh } from "react-icons/gr";
import { FiRefreshCw } from "react-icons/fi";

import {
    addHotel,
    handleHotelDisabledRemarkChange,
    updateIsHotelQuotationDisabled,
    updateIsTourismFeeIncluded,
    handleQuotationDisableChange,
    handleHotelsTransferDataChange,
} from "../../redux/slices/quotationSlice";
import SingleHotelForm from "./SingleHotelForm";

import "react-datepicker/dist/react-datepicker.css";
import TransferStayQuotation from "./TransferStayQuotation";
import EditTransferStayQuotation from "./EditTransferStayQuotation";
export default function TransferQuotationForm({ isEdit }) {
    const {
        hotelQt,
        isHotelQuotationDisabled,
        hotelDisabledRemark,
        arrivalAirport,
        departureAirport,
        isArrivalAirportDisabled,
        isDepartureAirportDisabled,
        isTransferQuotationDisabled,
        transferQuotation,
    } = useSelector((state) => state.quotations);
    const dispatch = useDispatch();
    const [isReload, setIsReload] = useState(false);

    return (
        <div>
            <div className="flex items-center mb-7 gap-4">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={!isTransferQuotationDisabled}
                    onChange={(e) => {
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isTransferQuotationDisabled",
                                value: !e.target.checked,
                            })
                        );
                    }}
                />
                <h1 className="text-base font-[600] text-blue-500">
                    Transfer Quotation
                </h1>
            </div>

            {isTransferQuotationDisabled === false ? (
                <>
                    {transferQuotation?.transfers?.length > 0 &&
                    hotelQt?.stays &&
                    hotelQt?.stays?.length > 0 ? (
                        <>
                            {" "}
                            {transferQuotation?.transfers?.map(
                                (transfer, transferIndex) => {
                                    return (
                                        <div className="border border-dashed p-5 mt-7 bg-[#f9f9f9]">
                                            <div className="mb-7  items-center justify-between gap-[10px]">
                                                <h2 className="text-[15px] font-[500] mb-5">
                                                    Stay {transferIndex + 1}
                                                </h2>{" "}
                                                {isEdit === true ? (
                                                    <>
                                                        {transfer.stays.map(
                                                            (
                                                                stay,
                                                                stayIndex
                                                            ) => (
                                                                <EditTransferStayQuotation
                                                                    transfer={
                                                                        transfer
                                                                    }
                                                                    stay={stay}
                                                                    transferIndex={
                                                                        transferIndex
                                                                    }
                                                                    stayIndex={
                                                                        stayIndex
                                                                    }
                                                                    // isReload={
                                                                    //     isReload
                                                                    // }
                                                                    // setIsReload={
                                                                    //     setIsReload
                                                                    // }
                                                                />
                                                            )
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {transfer.stays.map(
                                                            (
                                                                stay,
                                                                stayIndex
                                                            ) => (
                                                                <TransferStayQuotation
                                                                    transfer={
                                                                        transfer
                                                                    }
                                                                    stay={stay}
                                                                    transferIndex={
                                                                        transferIndex
                                                                    }
                                                                    stayIndex={
                                                                        stayIndex
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </>
                    ) : (
                        <div className="border border-dashed p-5 mt-7 bg-[#f9f9f9] flex justify-center items-center">
                            <div className="mb-7  items-center gap-[10px] flex justify-center items-center">
                                <button
                                    className="w-[150px] text-white p-2 "
                                    onClick={(e) => {
                                        dispatch(
                                            handleHotelsTransferDataChange({
                                                value: e.target.checked,
                                            })
                                        );

                                        // setIsReload(true);
                                    }}
                                >
                                    <div className="flex justify-between items-center ">
                                        <FiRefreshCw className="text-white font-[500]" />
                                        <span>Reload Transfer</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                ""
            )}

            {/* <div className="flex items-center gap-[10px] mt-5">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={isTransferQuotationDisabled}
                    onChange={(e) => {
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isTransferQuotationDisabled",
                                value: e.target.checked,
                            })
                        );
                    }}
                />

                <label htmlFor="" className="mb-0">
                    Please check this box if you don't need transfer quotation
                </label>
            </div> */}
        </div>
    );
}
