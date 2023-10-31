import React from "react";
import { useSelector } from "react-redux";
import { FiDownload } from "react-icons/fi";
import { Link } from "react-router-dom";

import { convertMinutesTo12HourTime, formatDate } from "../../../utils";
import { Pagination } from "../../../components";
import axios from "../../../axios";

export default function VoucherDailyReportTable({ vouchers, filters, setFilters }) {
    const { jwtToken } = useSelector((state) => state?.admin);

    const downloadVoucherPdf = async (id) => {
        try {
            const response = await axios.get(
                `/vouchers/${id}/pdf/download?dateTime=${formatDate(new Date(), true)}`,
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

    return (
        <div className="">
            <table className="w-full">
                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                    <tr>
                        <th className="font-[500] p-3">#</th>
                        <th className="font-[500] p-3">Ref Number</th>
                        <th className="font-[500] p-3">On Date</th>
                        <th className="font-[500] p-3">Passenger Name</th>
                        <th className="font-[500] p-3">Tour Name</th>
                        <th className="font-[500] p-3 whitespace-nowrap">Pickup Time</th>
                        <th className="font-[500] p-3 whitespace-nowrap">Return Time</th>
                        <th className="font-[500] p-3">Pickup From</th>
                        <th className="font-[500] p-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {vouchers?.map((voucher, index) => {
                        return (
                            <tr key={index} className="border-b border-tableBorderColor">
                                <td className="p-3">{filters.skip * filters.limit + (index + 1)}</td>
                                <td className="p-3">
                                    <Link
                                        to={`/vouchers/${voucher?._id}`}
                                        className="text-blue-500 underline"
                                    >
                                        {voucher?.voucherAmendment?.referenceNumber}
                                    </Link>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    {formatDate(voucher?.voucherAmendment?.tours?.date)}
                                </td>
                                <td className="p-3">
                                    <span className="text-blue-500">
                                        {voucher?.voucherAmendment?.passengerName}
                                    </span>{" "}
                                    - ({voucher?.voucherAmendment?.noOfAdults} Adults
                                    {voucher?.voucherAmendment?.noOfChildren
                                        ? ` + ${voucher?.voucherAmendment?.noOfChildren} Children (
                                            ${voucher?.voucherAmendment?.childrenAges
                                                ?.map((item, index) => {
                                                    return `${item}${
                                                        index !==
                                                        voucher?.voucherAmendment?.childrenAges
                                                            ?.length -
                                                            1
                                                            ? ", "
                                                            : ""
                                                    }`;
                                                })
                                                .join("")}
                                            )`
                                        : ""}
                                    {voucher?.voucherAmendment?.noOfInfants
                                        ? ` + ${voucher?.voucherAmendment?.noOfInfants} Infants (
                                    ${voucher?.voucherAmendment?.infantAges
                                        ?.map((item, index) => {
                                            return `${item}${
                                                index !==
                                                voucher?.voucherAmendment?.infantAges?.length - 1
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
                                    {voucher?.voucherAmendment?.tours?.tourName}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                    {!isNaN(voucher?.voucherAmendment?.tours?.pickupTimeFrom) &&
                                    voucher?.voucherAmendment?.tours?.pickupTimeFrom !== null
                                        ? convertMinutesTo12HourTime(
                                              voucher?.voucherAmendment?.tours?.pickupTimeFrom
                                          )
                                        : "N/A"}{" "}
                                    - <br />
                                    {!isNaN(voucher?.voucherAmendment?.tours?.pickupTimeTo) &&
                                    voucher?.voucherAmendment?.tours?.pickupTimeTo !== null
                                        ? convertMinutesTo12HourTime(
                                              voucher?.voucherAmendment?.tours?.pickupTimeTo
                                          )
                                        : "N/A"}
                                </td>
                                <td className="p-3">
                                    {!isNaN(voucher?.voucherAmendment?.tours?.returnTimeFrom) &&
                                    voucher?.voucherAmendment?.tours?.returnTimeFrom !== null
                                        ? convertMinutesTo12HourTime(
                                              voucher?.voucherAmendment?.tours?.returnTimeFrom
                                          )
                                        : "N/A"}
                                </td>
                                <td className="p-3 min-w-[150px]">
                                    {voucher?.voucherAmendment?.tours?.pickupFrom || "N/A"}
                                </td>
                                <td className="p-3">
                                    <div className="flex justify-center gap-[10px]">
                                        <button
                                            className="h-auto bg-transparent text-blue-500 text-lg"
                                            onClick={() =>
                                                downloadVoucherPdf(voucher?.voucherAmendment?._id)
                                            }
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
                    })}
                </tbody>
            </table>

            <div className="p-4">
                <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={filters?.totalVouchers}
                    incOrDecSkip={(number) =>
                        setFilters((prev) => {
                            return {
                                ...prev,
                                skip: prev.skip + number,
                            };
                        })
                    }
                    updateSkip={(skip) =>
                        setFilters((prev) => {
                            return { ...prev, skip };
                        })
                    }
                />
            </div>
        </div>
    );
}
