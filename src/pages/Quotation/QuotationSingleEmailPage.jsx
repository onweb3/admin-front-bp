import React, { useCallback, useEffect, useState } from "react";
// import { logoPng } from "../../../../static/imagesB2B";
import { useSelector } from "react-redux";
import { MdContentCopy } from "react-icons/md";
import axios from "../../axios";
import { useParams } from "react-router-dom";
import { config } from "../../constants";

function QuotationSingleEmailPage() {
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { jwtToken } = useSelector((state) => state.admin);
    const { amendementNumber } = useParams();
    const [quotationList, setQuotationList] = useState({});

    const fetchQuotaionDetails = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/quotations/amendment/${amendementNumber}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            console.log(response.data, "ammendments");
            setQuotationList(response.data.amendment);
            // let transfers =
            //     response?.data.amendment.transferQuotation.stayTransfers.map(
            //         (st) => {
            //             return {
            //                 stays: st.transfers,
            //                 stayNo: st.stayNo,
            //             };
            //         }
            //     );

            // console.log(transfers, "transfer transfers");

            // dispatch(handleTransferChange({ value: transfers }));
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }, [jwtToken, amendementNumber]);

    useEffect(() => {
        fetchQuotaionDetails();
    }, [fetchQuotaionDetails]);

    const copyDocument = () => {
        const element = document.getElementById("email-wrapper");
        let range, sel;
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            range.selectNodeContents(element);
            sel.addRange(range);
        }
        document.execCommand("Copy");
        setIsCopied(true);
    };

    useEffect(() => {
        let timeOut;
        if (isCopied) {
            timeOut = setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        }
        return () => clearTimeout(timeOut);
    }, [isCopied]);

    return (
        <div className="bg-white">
            <div className="p-10">
                <div className="flex justify-end ">
                    <button
                        onClick={copyDocument}
                        className="text-[14px] font-[600] text-white bg-blue-500 shadow-sm rounded p-2 h-8 flex"
                    >
                        <MdContentCopy />
                        {isCopied ? "Copied" : "Copy"}
                    </button>
                </div>

                <div
                    className="container mx-auto p-10  text-blue-900"
                    id="email-wrapper"
                >
                    <span className="text-[12px]">
                        Dear {quotationList?.clientName}
                    </span>
                    <br />
                    <br />
                    <br />
                    <div className="cust-border">
                        <span className="text-[13px] font-bold">
                            Greetings from {config.COMPANY_NAME?.split(" ")[1]}
                            !!!!
                            <span />
                        </span>
                        <br />
                        <span className="text-[13px]">
                            Kindly find the below quote for your reference.
                        </span>
                    </div>
                    <br />
                    <div className="mb-5 text-[13px] ">
                        <table>
                            <tbody>
                                <tr>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingTop: "2px",
                                            paddingBottom: "2px",
                                        }}
                                        className="cust-border"
                                    >
                                        Quotation Number
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        :
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        {quotationList?.quotationNumber}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingTop: "2px",
                                            paddingBottom: "2px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        Total Pax
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        :
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        {quotationList?.noOfAdults} Adult,{" "}
                                        {quotationList?.noOfChildren} Children
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingTop: "2px",
                                            paddingBottom: "2px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        Package
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        :
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        {quotationList?.noOfNights}N /{" "}
                                        {quotationList?.noOfNights + 1}D
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingTop: "2px",
                                            paddingBottom: "2px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        Check In
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        :
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        {quotationList?.checkInDate?.slice(
                                            0,
                                            10
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingTop: "2px",
                                            paddingBottom: "2px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        Check Out
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        :
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        {quotationList?.checkOutDate?.slice(
                                            0,
                                            10
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingTop: "2px",
                                            paddingBottom: "2px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        Arrival Airport
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        :
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        {quotationList?.arrivalAirportName}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingTop: "2px",
                                            paddingBottom: "2px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        Departure Airport
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        :
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        {quotationList?.departureAirportName}
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingTop: "2px",
                                            paddingBottom: "2px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        Pax Type
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        :
                                    </td>
                                    <td
                                        style={{
                                            paddingRight: "10px",
                                            paddingLeft: "10px",
                                            border: "none",
                                        }}
                                        className="cust-border"
                                    >
                                        {quotationList?.paxType}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <br />
                    <div className="mb-4 cust-border ">
                        {quotationList?.hotelQuotation ? (
                            !quotationList?.hotelQuotation.isAlreadyBooked ? (
                                <div className="cust-border">
                                    <div className="relative overflow-x-auto">
                                        {quotationList?.hotelQuotation?.stays?.map(
                                            (stay, index) => {
                                                return (
                                                    <div className="mt-6">
                                                        <h2 className="cust-border mb-2 text-[12px] font-bold">
                                                            Stay Option{" "}
                                                            {index + 1}
                                                        </h2>
                                                        <table className="w-full text-left border">
                                                            <thead>
                                                                <tr>
                                                                    <th className=" text-[12px] font-bold border px-[8px] py-[8px]">
                                                                        Checkin
                                                                        Date
                                                                    </th>
                                                                    <th className="text-[12px] font-bold border px-[8px] py-[8px]">
                                                                        Checkout
                                                                        Date
                                                                    </th>
                                                                    <th className="text-[12px] font-bold border px-[8px] py-[8px]">
                                                                        Star
                                                                        Category
                                                                    </th>
                                                                    <th className="text-[12px] font-bold border px-[8px] py-[8px]">
                                                                        Name of
                                                                        Hotel
                                                                    </th>
                                                                    <th className="text-[12px] font-bold border px-[8px] py-[8px]">
                                                                        Location
                                                                    </th>
                                                                    {quotationList
                                                                        ?.hotelQuotation
                                                                        ?.stays
                                                                        ?.length >
                                                                        0 &&
                                                                        quotationList?.hotelQuotation?.stays[0]?.roomOccupancyList?.map(
                                                                            (
                                                                                roomOccupancy,
                                                                                index
                                                                            ) => {
                                                                                return (
                                                                                    <th
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="text-[12px] font-bold border px-[8px]"
                                                                                    >
                                                                                        {
                                                                                            roomOccupancy?.occupancyShortName
                                                                                        }
                                                                                    </th>
                                                                                );
                                                                            }
                                                                        )}
                                                                </tr>
                                                            </thead>
                                                            <tbody className="text-[12px]">
                                                                {stay?.hotels?.map(
                                                                    (
                                                                        item,
                                                                        multiHotelIndex
                                                                    ) => {
                                                                        return (
                                                                            <tr
                                                                                key={
                                                                                    multiHotelIndex
                                                                                }
                                                                                className=""
                                                                            >
                                                                                <td className="border px-[8px] py-[5px]">
                                                                                    {item?.checkInDate
                                                                                        ? new Date(
                                                                                              item?.checkInDate
                                                                                          ).toDateString()
                                                                                        : "N/A"}
                                                                                </td>
                                                                                <td className="border px-[10px] py-[5px]">
                                                                                    {item?.checkOutDate
                                                                                        ? new Date(
                                                                                              item?.checkOutDate
                                                                                          ).toDateString()
                                                                                        : "N/A"}
                                                                                </td>
                                                                                <td className="border px-[10px] py-[5px]">
                                                                                    {item?.starCategory
                                                                                        ? item?.starCategory
                                                                                        : "N/A"}
                                                                                </td>
                                                                                <td className="border px-[10px]">
                                                                                    {item?.hotelName ||
                                                                                        "N/A"}
                                                                                    <br />
                                                                                    {item?.roomOccupancyName && (
                                                                                        <>
                                                                                            <span className="">
                                                                                                *{" "}
                                                                                                {
                                                                                                    item?.roomOccupancyName
                                                                                                }
                                                                                            </span>
                                                                                            <br />
                                                                                        </>
                                                                                    )}
                                                                                    {/* <span className="block mt-1">
                                                                *{" "}
                                                                {item.isBreakfastIncluded
                                                                    ? "Breakfast Included"
                                                                    : "Room Only"}
                                                            </span>
                                                            <span className="block mt-1">
                                                                *{" "}
                                                                {item?.isRefundable
                                                                    ? "Refundable"
                                                                    : "Non Refundable"}
                                                            </span> */}
                                                                                    <span className="block mt-1">
                                                                                        *{" "}
                                                                                        Room
                                                                                        Type
                                                                                        :{" "}
                                                                                        {
                                                                                            item?.roomTypeName
                                                                                        }
                                                                                    </span>
                                                                                    <span className="block mt-1">
                                                                                        *{" "}
                                                                                        Board
                                                                                        Type
                                                                                        :{" "}
                                                                                        {
                                                                                            item?.boardTypeCode
                                                                                        }
                                                                                    </span>
                                                                                </td>
                                                                                <td className="border px-[10px]">
                                                                                    {item?.city ||
                                                                                        "N/A"}
                                                                                </td>
                                                                                {multiHotelIndex <
                                                                                    1 &&
                                                                                    stay?.roomOccupancyList?.map(
                                                                                        (
                                                                                            roomOccupancy,
                                                                                            index
                                                                                        ) => {
                                                                                            return (
                                                                                                <td
                                                                                                    rowSpan={
                                                                                                        stay
                                                                                                            ?.hotels
                                                                                                            ?.length >
                                                                                                        0
                                                                                                            ? stay
                                                                                                                  ?.hotels
                                                                                                                  ?.length
                                                                                                            : 0
                                                                                                    }
                                                                                                    key={
                                                                                                        index
                                                                                                    }
                                                                                                    className="border px-[10px]"
                                                                                                >
                                                                                                    {roomOccupancy?.priceWithTransfer
                                                                                                        ? roomOccupancy?.priceWithTransfer?.toFixed(
                                                                                                              2
                                                                                                          ) +
                                                                                                          " " +
                                                                                                          quotationList?.quotationCurrency
                                                                                                        : "N/A"}
                                                                                                </td>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {" "}
                                    <div className="mt-5 text-[15px] cust-border">
                                        {quotationList?.noOfAdults && (
                                            <div>
                                                Per person Adult price:{" "}
                                                {amendment?.perPersonAdultPrice?.toFixed(
                                                    2
                                                )}{" "}
                                                {
                                                    quotationList?.quotationCurrency
                                                }
                                            </div>
                                        )}
                                        {quotationList?.noOfChildren ? (
                                            <div className="mt-1">
                                                Per person Child price:{" "}
                                                {amendment?.perPersonChildPrice?.toFixed(
                                                    2
                                                )}{" "}
                                                {amendment?.quotationCurrency}
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="cust-border">
                                        {quotationList?.hotelQuotation?.stays?.map(
                                            (stay, index) => {
                                                return (
                                                    <div className="mt-6">
                                                        <h2 className="cust-border mb-2 text-[12px] font-bold">
                                                            Stay Option{" "}
                                                            {index + 1}
                                                        </h2>
                                                        <table className="w-full text-left">
                                                            <thead>
                                                                <tr>
                                                                    <th className=" text-[12px] font-bold border px-[8px] py-[8px]">
                                                                        Checkin
                                                                        Date
                                                                    </th>
                                                                    <th className="text-[12px] font-bold border px-[8px] py-[8px]">
                                                                        Checkout
                                                                        Date
                                                                    </th>
                                                                    <th className="text-[12px] font-bold border px-[8px] py-[8px]">
                                                                        Star
                                                                        Category
                                                                    </th>
                                                                    <th className="text-[12px] font-bold border px-[8px] py-[8px]">
                                                                        Name of
                                                                        Hotel
                                                                    </th>
                                                                    <th className="text-[12px] font-bold border px-[8px] py-[8px]">
                                                                        Location
                                                                    </th>
                                                                    {quotationList
                                                                        ?.hotelQuotation
                                                                        ?.stays
                                                                        ?.length >
                                                                        0 &&
                                                                        quotationList?.hotelQuotation?.stays[0]?.roomOccupancyList?.map(
                                                                            (
                                                                                roomOccupancy,
                                                                                index
                                                                            ) => {
                                                                                return (
                                                                                    <th
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="text-[12px] font-bold border px-[8px]"
                                                                                    >
                                                                                        {
                                                                                            roomOccupancy?.occupancyShortName
                                                                                        }
                                                                                    </th>
                                                                                );
                                                                            }
                                                                        )}
                                                                </tr>
                                                            </thead>
                                                            <tbody className="text-[12px]">
                                                                {stay?.hotels?.map(
                                                                    (
                                                                        item,
                                                                        multiHotelIndex
                                                                    ) => {
                                                                        return (
                                                                            <tr
                                                                                key={
                                                                                    multiHotelIndex
                                                                                }
                                                                                className=""
                                                                            >
                                                                                <td className="border px-[8px] py-[5px]">
                                                                                    {item?.checkInDate
                                                                                        ? new Date(
                                                                                              item?.checkInDate
                                                                                          ).toDateString()
                                                                                        : "N/A"}
                                                                                </td>
                                                                                <td className="border px-[10px] py-[5px]">
                                                                                    {item?.checkOutDate
                                                                                        ? new Date(
                                                                                              item?.checkOutDate
                                                                                          ).toDateString()
                                                                                        : "N/A"}
                                                                                </td>
                                                                                <td className="border px-[10px] py-[5px]">
                                                                                    {item?.starCategory
                                                                                        ? item?.starCategory
                                                                                        : "N/A"}
                                                                                </td>
                                                                                <td className="border px-[10px]">
                                                                                    {item?.hotelName ||
                                                                                        "N/A"}
                                                                                    <br />
                                                                                    {item?.roomOccupancyName && (
                                                                                        <>
                                                                                            <span className="">
                                                                                                *{" "}
                                                                                                {
                                                                                                    item?.roomOccupancyName
                                                                                                }
                                                                                            </span>
                                                                                            <br />
                                                                                        </>
                                                                                    )}
                                                                                    {/* <span className="block mt-1">
                                                                *{" "}
                                                                {item.isBreakfastIncluded
                                                                    ? "Breakfast Included"
                                                                    : "Room Only"}
                                                            </span>
                                                            <span className="block mt-1">
                                                                *{" "}
                                                                {item?.isRefundable
                                                                    ? "Refundable"
                                                                    : "Non Refundable"}
                                                            </span> */}
                                                                                    <span className="block mt-1">
                                                                                        *{" "}
                                                                                        Room
                                                                                        Type
                                                                                        :{" "}
                                                                                        {
                                                                                            item?.roomTypeName
                                                                                        }
                                                                                    </span>
                                                                                    <span className="block mt-1">
                                                                                        *{" "}
                                                                                        Board
                                                                                        Type
                                                                                        :{" "}
                                                                                        {
                                                                                            item?.boardTypeCode
                                                                                        }
                                                                                    </span>
                                                                                </td>
                                                                                <td className="border px-[10px]">
                                                                                    {item?.city ||
                                                                                        "N/A"}
                                                                                </td>
                                                                                {multiHotelIndex <
                                                                                    1 &&
                                                                                    stay?.roomOccupancyList?.map(
                                                                                        (
                                                                                            roomOccupancy,
                                                                                            index
                                                                                        ) => {
                                                                                            return (
                                                                                                <td
                                                                                                    rowSpan={
                                                                                                        stay
                                                                                                            ?.hotels
                                                                                                            ?.length >
                                                                                                        0
                                                                                                            ? stay
                                                                                                                  ?.hotels
                                                                                                                  ?.length
                                                                                                            : 0
                                                                                                    }
                                                                                                    key={
                                                                                                        index
                                                                                                    }
                                                                                                    className="border px-[10px]"
                                                                                                >
                                                                                                    {roomOccupancy?.priceWithTransfer
                                                                                                        ? roomOccupancy?.priceWithTransfer?.toFixed(
                                                                                                              2
                                                                                                          ) +
                                                                                                          " " +
                                                                                                          quotationList?.quotationCurrency
                                                                                                        : "N/A"}
                                                                                                </td>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </>
                            )
                        ) : (
                            <div className="mt-5 text-[15px] cust-border">
                                {quotationList?.noOfAdults && (
                                    <div className="cust-border">
                                        Per person Adult price:{" "}
                                        {quotationList?.perPersonAdultPrice?.toFixed(
                                            2
                                        )}{" "}
                                        {quotationList?.quotationCurrency}
                                    </div>
                                )}
                                {quotationList?.noOfChildren && (
                                    <div className="mt-1 cust-border">
                                        Per person Child price:{" "}
                                        {quotationList?.perPersonChildPrice?.toFixed(
                                            2
                                        )}{" "}
                                        {quotationList?.quotationCurrency}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="cust-border">
                        <div className="cust-border">
                            {quotationList?.excursionQuotation?.excursions
                                ?.length ? (
                                <div>
                                    <h3 className="text-[12px] font-bold pt-5">
                                        Inclusions
                                    </h3>
                                </div>
                            ) : null}
                            <div className="cust-border">
                                {quotationList?.excursionQuotation?.excursions?.map(
                                    (exc, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="cust-border"
                                            >
                                                <ul className="list-disc ml-6 text-xs">
                                                    {exc?.transferType ===
                                                    "shared" ? (
                                                        <li className="cust-border">
                                                            {" "}
                                                            {
                                                                exc?.excursionName
                                                            }{" "}
                                                            - Tickets With SIC
                                                            Transfer{" "}
                                                        </li>
                                                    ) : exc?.transferType ===
                                                      "without" ? (
                                                        <li className="cust-border">
                                                            {exc.excursionName}{" "}
                                                            - Only Ticket
                                                        </li>
                                                    ) : exc?.transferType ===
                                                      "private" ? (
                                                        <li className="cust-border">
                                                            {exc?.excursionName}{" "}
                                                            - Tickets With PVT
                                                            Transfer
                                                        </li>
                                                    ) : null}
                                                </ul>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                            <div className="cust-border">
                                {quotationList?.isTransferQuotationDisabled ===
                                    false &&
                                quotationList?.transferQuotation?.length ? (
                                    <>
                                        {quotationList?.transferQuotation?.map(
                                            (tq, idx) => {
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="cust-border"
                                                    >
                                                        {tq?.stays?.map(
                                                            (stay, ind) => {
                                                                return (
                                                                    <div
                                                                        key={
                                                                            ind
                                                                        }
                                                                        className="cust-border"
                                                                    >
                                                                        <ul className="list-disc ml-6 text-xs">
                                                                            <li className="cust-border">
                                                                                {
                                                                                    stay?.transferToName
                                                                                }{" "}
                                                                                <span className="text-xs font-semibold">
                                                                                    To
                                                                                </span>{" "}
                                                                                {
                                                                                    stay?.transferFromName
                                                                                }{" "}
                                                                                -
                                                                                Private
                                                                                Transfer
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="cust-border">
                        <div className="cust-border">
                            {quotationList?.excSupplementQuotation?.excursions
                                ?.length ? (
                                <div className="cust-border">
                                    <h3 className=" text-[12px] font-bold pt-5">
                                        Suppliments
                                    </h3>
                                </div>
                            ) : (
                                ""
                            )}
                            <div className="cust-border">
                                {quotationList?.excSupplementQuotation?.excursions?.map(
                                    (exc) => {
                                        return (
                                            <div>
                                                <ul className="list-disc ml-6 text-xs">
                                                    {exc?.transferType ===
                                                    "shared" ? (
                                                        <>
                                                            <li>
                                                                {" "}
                                                                {
                                                                    exc?.excursionName
                                                                }{" "}
                                                                - Tickets With
                                                                SIC Transfer -
                                                                Adult Price :{" "}
                                                                {
                                                                    exc?.adultPrice
                                                                }
                                                                , Children Price
                                                                :{" "}
                                                                {
                                                                    exc?.childPrice
                                                                }
                                                            </li>
                                                        </>
                                                    ) : exc?.transferType ===
                                                      "without" ? (
                                                        <>
                                                            <li>
                                                                {
                                                                    exc.excursionName
                                                                }{" "}
                                                                - Only Ticket -
                                                                Adult Price :{" "}
                                                                {
                                                                    exc?.adultPrice
                                                                }
                                                                , Children Price
                                                                :{" "}
                                                                {
                                                                    exc?.childPrice
                                                                }
                                                            </li>
                                                        </>
                                                    ) : exc?.transferType ===
                                                      "private" ? (
                                                        <>
                                                            <li>
                                                                {
                                                                    exc?.excursionName
                                                                }{" "}
                                                                - Tickets
                                                                With PVT Transfer
                                                                - Adult Price :{" "}
                                                                {
                                                                    exc?.adultPrice
                                                                }
                                                                , Children Price
                                                                :{" "}
                                                                {
                                                                    exc?.childPrice
                                                                }
                                                            </li>
                                                        </>
                                                    ) : (
                                                        ""
                                                    )}
                                                </ul>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="cust-border">
                        {quotationList?.visa ? (
                            <div>
                                <div className="pt-10 cust-border">
                                    <div className="relative overflow-x-auto">
                                        <div className="cust-border">
                                            <h1 className="cust-border text-[12px] font-bold">
                                                Visa{" "}
                                            </h1>
                                        </div>
                                        <div className="mb-5 text-[12px] cust-border">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingTop:
                                                                    "2px",
                                                                paddingBottom:
                                                                    "2px",
                                                                border: "none",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            Visa Name
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                                border: "none",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            :
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                                border: "none",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            {
                                                                quotationList
                                                                    ?.visa?.name
                                                            }
                                                        </td>
                                                    </tr>
                                                    {/* <tr>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingTop:
                                                                    "2px",
                                                                paddingBottom:
                                                                    "2px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            Validity
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            :
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            {
                                                                quotationList
                                                                    ?.visa
                                                                    ?.visaId
                                                                    ?.validity
                                                            }{" "}
                                                            {
                                                                quotationList
                                                                    ?.visa
                                                                    ?.visaId
                                                                    ?.validityTimeFormat
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingTop:
                                                                    "2px",
                                                                paddingBottom:
                                                                    "2px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            Processing Time
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            :
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            {
                                                                quotationList
                                                                    ?.visa
                                                                    ?.visaId
                                                                    ?.processingTime
                                                            }{" "}
                                                            {
                                                                quotationList
                                                                    ?.visa
                                                                    ?.visaId
                                                                    ?.processingTimeFormat
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingTop:
                                                                    "2px",
                                                                paddingBottom:
                                                                    "2px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            Stay Period
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            :
                                                        </td>
                                                        <td
                                                            style={{
                                                                paddingRight:
                                                                    "10px",
                                                                paddingLeft:
                                                                    "10px",
                                                            }}
                                                            className="cust-border"
                                                        >
                                                            {
                                                                quotationList
                                                                    ?.visa
                                                                    ?.visaId
                                                                    ?.stayPeriod
                                                            }{" "}
                                                            {
                                                                quotationList
                                                                    ?.visa
                                                                    ?.visaId
                                                                    ?.stayPeriodFormat
                                                            }
                                                        </td>
                                                    </tr> */}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>

                    <br />
                    <div className="cust-border">
                        <h3 className=" mb-2 text-[12px] font-bold">
                            Terms and Conditions
                        </h3>
                        <ul className="list-disc ml-6 text-[12px]">
                            <li className="cust-border">
                                All the above package cost is quoted in AED per
                                person and is valid till Mon May 01 2023
                            </li>
                            <li className="cust-border">
                                The above rates are subject to change as per
                                hotel's inputs. This could be due to withdrawal
                                of promotional by the Hotel or currency
                                fluctuation or any additional taxes or toll
                                implemented by the Government.
                            </li>
                            <li className="cust-border">
                                Accommodation for Child as stated is as per the
                                child policy of the respective Hotel. Child
                                below 02 Years Is considered as an infant and
                                from 02 years to 12 years as a child.
                            </li>
                            <li className="cust-border">
                                Above package rate is subject to availability of
                                rooms and offered inclusions and is subject to
                                change as per availability at the time of
                                booking. Kindly reconfirm with our team before
                                confirming to the client.
                            </li>
                            <li className="cust-border">
                                Cancellation charges are applicable as per the
                                Hotel policy. NRF rates are subject to 100%
                                cancellation charges.
                            </li>
                            <li className="cust-border">
                                All the services included in the package are
                                compulsory and no refund will be given if any of
                                the services are not taken.
                            </li>
                            <li className="cust-border">
                                Tourism Dirham which has been levied by the
                                hotels in Dubai, same has to be paid directly by
                                the guest at the hotel upon check-in.
                            </li>
                            <li className="cust-border">
                                Guest need to carry QR code vaccine certificate
                                & required to provide a negative PCR test result
                                acquired within 48 hours in Dubai only, to enter
                                Grand Mosque/Ferrari world Or any Mall visit at
                                Abu Dhabi.
                            </li>
                            <li className="cust-border">
                                PCR cost Not included in above rates
                            </li>
                            <li className="cust-border">
                                Please Note the Check-In time is 3:00 PM And
                                check out time Is 12:00 PM. Early Check-In or
                                Late Check-Out Is depending upon Hotel room
                                availability and may be subject to an extra
                                charge.
                            </li>
                            <li className="cust-border">
                                Rooms And Rates Are Subject To Availability At
                                The Time Of Booking Confirmation kindly
                                reconfirm before the booking.
                            </li>
                        </ul>
                    </div>

                    <br />
                    {/* <div className="cust-border text-xs">
                        <span
                            style={{
                                fontWeight: 500,
                                fontSize: "13px",
                                lineHeight: "26px",
                            }}
                            className="cust-border"
                        >
                            {quotationList?.reseller?.name}
                        </span>
                        <br />
                        <span
                            style={{ fontSize: "14px", lineHeight: "26px" }}
                            className="cust-border"
                        >
                            Email:{" "}
                            <span
                                style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                }}
                                className="cust-border"
                            >
                                {quotationList?.reseller?.email}
                            </span>
                        </span>
                        <br />
                        <span
                            style={{ marginTop: "20px", lineHeight: "26px" }}
                            className="cust-border"
                        >
                            Mobile/Whatsapp:{" "}
                            {quotationList?.reseller?.phoneNumber || ""} | Tel:{" "}
                            Ext.{" "}
                        </span>
                        <br />
                        <span
                            className="cust-border"
                            style={{ lineHeight: "26px" }}
                        >
                            Dubai | Ahmedabad | Kenya | Delhi
                        </span>
                        <br />
                        <span
                            className="cust-border"
                            style={{ lineHeight: "26px" }}
                        >
                            Website: www.travellerschoice.ae B2B Agent Login:
                            https://app.mytcb2b.com/
                        </span>
                        <br />
                    </div>
                    <img
                        width="150"
                        src={config.COMPANY_LOGO}
                        alt=""
                        style={{ marginTop: "15px" }}
                    /> */}
                </div>
            </div>
        </div>
    );
}

export default QuotationSingleEmailPage;
