import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FiDownload } from "react-icons/fi";
import { Link } from "react-router-dom";
import moment from "moment";
import { FaCar } from "react-icons/fa";

import { formatDate } from "../../../utils";
import axios from "../../../axios";

export default function VoucherV2DailyReportsTableRow({ voucher, index, filters }) {
    const [tourStatus, setTourStatus] = useState(
        voucher?.voucherAmendment?.tours?.tourItems?.status || ""
    );
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state?.admin);

    const downloadVoucherPdf = async (id) => {
        try {
            const response = await axios.get(
                `/v2/vouchers/${id}/pdf/download?dateTime=${formatDate(new Date(), true)}`,
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

    const handleTourStatusUpdate = async ({ status }) => {
        try {
            const isConfirm = window.confirm("Are you sure to update status?");
            if (isConfirm) {
                setIsLoading(true);
                await axios.patch(
                    `/v2/vouchers/tour-status/update`,
                    {
                        voucherAmendId: voucher?.voucherAmendment?._id,
                        status: status,
                        tourId: voucher?.voucherAmendment?.tours?.tourItems?._id,
                    },
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                setTourStatus(status);
                setIsLoading(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <tr className="border-b border-tableBorderColor">
            <td className="p-3">{filters.skip * filters.limit + (index + 1)}</td>
            <td className="p-3">
                <Link to={`/vouchers/v2/${voucher?._id}`} className="text-blue-500 underline">
                    {voucher?.voucherAmendment?.referenceNumber}
                </Link>
            </td>
            <td className="p-3 whitespace-nowrap">
                {formatDate(voucher?.voucherAmendment?.tours?.tourItems?.date)}
            </td>
            <td className="p-3">
                <span className="text-blue-500">{voucher?.voucherAmendment?.passengerName}</span> -
                ({voucher?.voucherAmendment?.noOfAdults} Adults
                {voucher?.voucherAmendment?.noOfChildren
                    ? ` + ${voucher?.voucherAmendment?.noOfChildren} Children (
                ${voucher?.voucherAmendment?.childrenAges
                    ?.map((item, index) => {
                        return `${item}${
                            index !== voucher?.voucherAmendment?.childrenAges?.length - 1
                                ? ", "
                                : ""
                        }`;
                    })
                    .join("")}
                )`
                    : ""}
                )
                {voucher?.voucherAmendment?.basisOfTransfer
                    ? ` - ${voucher?.voucherAmendment?.basisOfTransfer}`
                    : ""}
            </td>
            <td className="p-3">
                {voucher?.voucherAmendment?.tours?.tourItems?.tourName}
                {voucher?.voucherAmendment?.tours?.tourItems?.tourType && (
                    <span className="block text-[13px] text-grayColor capitalize">
                        ({voucher?.voucherAmendment?.tours?.tourItems?.tourType})
                    </span>
                )}
            </td>
            <td className="p-3 whitespace-nowrap">
                {voucher?.voucherAmendment?.tours?.tourItems?.pickupISODateTime
                    ? moment(voucher?.voucherAmendment?.tours?.tourItems?.pickupISODateTime)
                          .utcOffset(voucher?.voucherAmendment?.tours?.tourItems?.utcOffset)
                          .format("HH:mm")
                    : "N/A"}{" "}
                - <br />
                {voucher?.voucherAmendment?.tours?.tourItems?.pickupISOToDateTime
                    ? moment(voucher?.voucherAmendment?.tours?.tourItems?.pickupISOToDateTime)
                          .utcOffset(voucher?.voucherAmendment?.tours?.tourItems?.utcOffset)
                          .format("HH:mm")
                    : "N/A"}
            </td>
            <td className="p-3">
                {voucher?.voucherAmendment?.tours?.tourItems?.returnISODateTime
                    ? moment(voucher?.voucherAmendment?.tours?.tourItems?.returnISODateTime)
                          .utcOffset(voucher?.voucherAmendment?.tours?.tourItems?.utcOffset)
                          .format("HH:mm")
                    : "N/A"}
            </td>
            <td className="p-3 min-w-[150px]">
                {voucher?.voucherAmendment?.tours?.tourItems?.pickupFrom || "N/A"}
            </td>
            <td className="p-3 whitespace-nowrap">
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="w-[25px] h-[25px] rounded-full border-4 border-primaryColor border-r-transparent animate-spin"></div>
                    </div>
                ) : tourStatus === "booked" ? (
                    <span
                        className={
                            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                            (tourStatus === "booked"
                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                : "bg-[#f7b84b1A] text-[#f7b84b]")
                        }
                    >
                        {tourStatus}
                    </span>
                ) : (
                    <div>
                        <select
                            name=""
                            id=""
                            onChange={(e) => {
                                if (e.target.value === "booked") {
                                    handleTourStatusUpdate({
                                        status: e.target.value,
                                    });
                                }
                            }}
                        >
                            <option value="" hidden>
                                Not Booked
                            </option>
                            <option value="booked">Booked</option>
                        </select>
                    </div>
                )}
            </td>
            <td className="p-3">
                <div className="flex justify-center gap-[15px]">
                    <Link
                        to={`/vouchers/v2/${voucher?._id}/tours/${voucher?.voucherAmendment?.tours?.tourItems?._id}/transfer`}
                    >
                        <button className="h-auto bg-transparent text-[#444] text-lg">
                            <FaCar />
                        </button>
                    </Link>
                    <button
                        className="h-auto bg-transparent text-blue-500 text-lg"
                        onClick={() => downloadVoucherPdf(voucher?.voucherAmendment?._id)}
                    >
                        <FiDownload />
                    </button>
                    {/* <Link to={`${blog?._id}/edit`}>
            <button className="h-auto bg-transparent text-green-500 text-xl">
                <BiEditAlt />
            </button>
            </Link> */}
                </div>
            </td>
        </tr>
    );
}
