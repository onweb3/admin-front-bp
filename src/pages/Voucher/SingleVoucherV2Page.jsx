import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FiDownload, FiEdit } from "react-icons/fi";

import axios from "../../axios";
import { PageLoader } from "../../components";
import { formatDate } from "../../utils";
import { SingleV2VoucherTourRow } from "../../features/Voucher";

export default function SingleVoucherV2Page() {
    const [voucher, setVoucher] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelStLoading, setIsCancelStLoading] = useState(false);

    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const downloadVoucherPdf = async () => {
        try {
            const response = await axios.get(
                `/v2/vouchers/${voucher?.voucherAmendment?._id}/pdf/download?dateTime=${formatDate(
                    new Date(),
                    true
                )}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                    responseType: "arraybuffer",
                }
            );

            const blob = new Blob([response.data], {
                type: "application/pdf",
            });
            window.open(URL.createObjectURL(blob), "_blank");
        } catch (err) {
            console.log(err);
        }
    };

    const updateVoucherAmendCancelStatus = async () => {
        try {
            const isConfirm = window.confirm("Are you sure to update cancellation status?");
            if (isConfirm) {
                setIsCancelStLoading(true);
                await axios.patch(
                    `/v2/vouchers/cancellation/udpate`,
                    {
                        isCancelled: true,
                        voucherAmendId: voucher?.voucherAmendment?._id,
                    },
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                setVoucher((prev) => {
                    return {
                        ...prev,
                        voucherAmendment: { ...prev.voucherAmendment, isCancelled: true },
                    };
                });
                setIsCancelStLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchVoucher = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/v2/vouchers/single/${id}/tours`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setVoucher(response?.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVoucher();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Voucher Details</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/vouchers" className="text-textColor">
                        Vouchers{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}
                    </span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">
                                Voucher Details {!isLoading && `- (#${voucher?.voucherId})`}
                            </h1>
                            <div className="flex items-center gap-[10px]">
                                <div className="mr-3">
                                    {isCancelStLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-[25px] h-[25px] rounded-full border-4 border-primaryColor border-r-transparent animate-spin"></div>
                                        </div>
                                    ) : voucher?.voucherAmendment?.isCancelled ? (
                                        <span
                                            className={
                                                "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                (voucher?.voucherAmendment?.isCancelled === true
                                                    ? "bg-[#f065481A] text-[#f06548]"
                                                    : "text-[#0ab39c] bg-[#0ab39c1A]")
                                            }
                                        >
                                            cancelled
                                        </span>
                                    ) : (
                                        <select
                                            name=""
                                            id=""
                                            onChange={(e) => {
                                                if (e.target.value === "cancel") {
                                                    updateVoucherAmendCancelStatus();
                                                }
                                            }}
                                        >
                                            <option value="" hidden>
                                                Active
                                            </option>
                                            <option value="cancel">Cancel</option>
                                        </select>
                                    )}
                                </div>
                                <button
                                    className="px-3 flex items-center gap-[10px]"
                                    onClick={downloadVoucherPdf}
                                >
                                    <FiDownload /> Download
                                </button>
                                <Link to="edit">
                                    <button className="px-3 flex items-center gap-[10px]">
                                        <FiEdit /> Edit
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex gap-[10px]">
                                <div className="w-full">
                                    <table className="w-full text-[15px]">
                                        <tbody>
                                            <tr>
                                                <td className="p-2 min-w-[180px] align-top">
                                                    Reference Number
                                                </td>
                                                <td className="p-2 align-top">:</td>
                                                <td className="p-2">
                                                    {voucher?.voucherAmendment?.referenceNumber}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 align-top">Passenger Name</td>
                                                <td className="p-2 align-top">:</td>
                                                <td className="p-2">
                                                    {voucher?.voucherAmendment?.passengerName}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 align-top">Pax</td>
                                                <td className="p-2 align-top">:</td>
                                                <td className="p-2">
                                                    {voucher?.voucherAmendment?.noOfAdults} Adults
                                                    {voucher?.voucherAmendment?.noOfChildren
                                                        ? ` + ${
                                                              voucher?.voucherAmendment
                                                                  ?.noOfChildren
                                                          } Children (${voucher?.voucherAmendment?.childrenAges
                                                              ?.map(
                                                                  (age, index) =>
                                                                      `${age}${
                                                                          index !==
                                                                          voucher?.voucherAmendment
                                                                              ?.childrenAges
                                                                              ?.length -
                                                                              1
                                                                              ? ", "
                                                                              : ""
                                                                      }`
                                                              )
                                                              .join("")})`
                                                        : ""}
                                                    {voucher?.voucherAmendment?.noOfInfants
                                                        ? ` + ${
                                                              voucher?.voucherAmendment?.noOfInfants
                                                          } Infants (${voucher?.voucherAmendment?.infantAges
                                                              ?.map(
                                                                  (age, index) =>
                                                                      `${age}${
                                                                          index !==
                                                                          voucher?.voucherAmendment
                                                                              ?.infantAges?.length -
                                                                              1
                                                                              ? ", "
                                                                              : ""
                                                                      }`
                                                              )
                                                              .join("")})`
                                                        : ""}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-2 align-top">Print Note</td>
                                                <td className="p-2 align-top">:</td>
                                                <td className="p-2 text-grayColor">
                                                    {voucher?.voucherAmendment?.printNote}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="w-full">
                                    <table className="w-full text-[15px] h-auto">
                                        <tbody>
                                            <tr>
                                                <td className=" p-2 min-w-[180px] align-top">
                                                    Buffet Breakfast
                                                </td>
                                                <td className="p-2 align-top">:</td>
                                                <td className="p-2">
                                                    {voucher?.voucherAmendment?.buffetBreakfast ||
                                                        "N/A"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className=" p-2 align-top">
                                                    Basis of Transfer
                                                </td>
                                                <td className="p-2 align-top">:</td>
                                                <td className=" p-2">
                                                    {voucher?.voucherAmendment?.basisOfTransfer ||
                                                        "N/A"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className=" p-2 align-top">Paging Name</td>
                                                <td className="p-2 align-top">:</td>
                                                <td className=" p-2">
                                                    {voucher?.voucherAmendment?.pagingName || "N/A"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className=" p-2 align-top">Arrival Airport</td>
                                                <td className="p-2 align-top">:</td>
                                                <td className=" p-2">
                                                    {voucher?.voucherAmendment
                                                        ?.arrivalAirportName || "N/A"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className=" p-2 align-top">Arrival Date</td>
                                                <td className="p-2 align-top">:</td>
                                                <td className=" p-2">
                                                    {voucher?.voucherAmendment?.arrivalDate
                                                        ? formatDate(
                                                              voucher?.voucherAmendment?.arrivalDate
                                                          )
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className=" p-2 align-top">Arrival Note</td>
                                                <td className="p-2 align-top">:</td>
                                                <td className=" p-2">
                                                    {voucher?.voucherAmendment?.arrivalNote ||
                                                        "N/A"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className=" p-2 align-top">Departure Date</td>
                                                <td className="p-2 align-top">:</td>
                                                <td className=" p-2">
                                                    {voucher?.voucherAmendment?.departureDate
                                                        ? formatDate(
                                                              voucher?.voucherAmendment
                                                                  ?.departureDate
                                                          )
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className=" p-2 align-top">Departure Note</td>
                                                <td className="p-2 align-top">:</td>
                                                <td className=" p-2">
                                                    {voucher?.voucherAmendment?.departureNote ||
                                                        "N/A"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className=" p-2 align-top">Contact Info</td>
                                                <td className="p-2 align-top">:</td>
                                                <td className=" p-2">
                                                    {voucher?.voucherAmendment?.contactName}{" "}
                                                    {voucher?.voucherAmendment?.contactNumber}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {voucher?.voucherAmendment?.hotels?.length > 0 && (
                                <div className="mt-8">
                                    <h2 className="font-medium text-lg mb-2">Hotels</h2>
                                    <table className="w-full">
                                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                            <tr>
                                                <th className="font-[500] p-3">#</th>
                                                <th className="font-[500] p-3">Hotel Name</th>
                                                <th className="font-[500] p-3">Checkin Date</th>
                                                <th className="font-[500] p-3">Checkout Date</th>
                                                <th className="font-[500] p-3">Chekin Note</th>
                                                <th className="font-[500] p-3">Checkout Note</th>
                                                <th className="font-[500] p-3">Confirm Num</th>
                                                <th className="font-[500] p-3">Room Datails</th>
                                                <th className="font-[500] p-3">No.Of Rooms</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[14px]">
                                            {voucher?.voucherAmendment?.hotels?.map(
                                                (hotel, index) => {
                                                    return (
                                                        <tr className="border-b border-tableBorderColor">
                                                            <td className="p-3">{index + 1}</td>
                                                            <td className="p-3 capitalize">
                                                                {hotel?.hotelName}
                                                            </td>
                                                            <td className="p-3 capitalize">
                                                                {hotel?.checkInDate
                                                                    ? formatDate(hotel?.checkInDate)
                                                                    : "N/A"}
                                                            </td>
                                                            <td className="p-3">
                                                                {hotel?.checkInDate
                                                                    ? formatDate(
                                                                          hotel?.checkOutDate
                                                                      )
                                                                    : "N/A"}
                                                            </td>
                                                            <td className="p-3">
                                                                {hotel?.checkInNote || "N/A"}
                                                            </td>
                                                            <td className="p-3">
                                                                {hotel?.checkOutNote || "N/A"}
                                                            </td>
                                                            <td className="p-3">
                                                                {hotel?.confirmationNumber || "N/A"}
                                                            </td>
                                                            <td className="p-3">
                                                                {hotel?.roomDetails || "N/A"}
                                                            </td>
                                                            <td className="p-3">
                                                                {hotel?.noOfRooms || "N/A"}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="mt-8">
                                <h2 className="font-medium text-lg mb-2">Tours</h2>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">#</th>
                                            <th className="font-[500] p-3">Tour Name</th>
                                            <th className="font-[500] p-3">Tour Type</th>
                                            <th className="font-[500] p-3">Date</th>
                                            <th className="font-[500] p-3">Pickup From</th>
                                            <th className="font-[500] p-3">Pickup Time From</th>
                                            <th className="font-[500] p-3">Pickup Time To</th>
                                            <th className="font-[500] p-3">Return Time</th>
                                            <th className="font-[500] p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[14px]">
                                        {voucher?.voucherAmendment?.tours?.map((tour, index) => {
                                            return (
                                                <SingleV2VoucherTourRow
                                                    key={index}
                                                    tour={tour}
                                                    index={index}
                                                    voucherAmendId={voucher?.voucherAmendment?._id}
                                                />
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-8">
                                <h2 className="font-medium text-lg mb-2">Terms And Conditions</h2>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: voucher?.voucherAmendment?.termsAndConditions,
                                    }}
                                    className="text-[15px]"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
