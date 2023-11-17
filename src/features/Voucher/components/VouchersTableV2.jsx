import React from "react";
import { useSelector } from "react-redux";
import { FiDownload } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";

import { formatDate, hasPermission } from "../../../utils";
import { Pagination } from "../../../components";
import axios from "../../../axios";

export default function VouchersTableV2({ vouchers, setVouchers, filters, setFilters }) {
    const { jwtToken, admin } = useSelector((state) => state?.admin);

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

    const deleteVoucher = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/vouchers/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filterdVouchers = vouchers?.filter((item) => {
                    return item?._id !== id;
                });
                setVouchers(filterdVouchers);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">#</th>
                            <th className="font-[500] p-3">Id</th>
                            <th className="font-[500] p-3">Created At</th>
                            <th className="font-[500] p-3">Ref Number</th>
                            <th className="font-[500] p-3">Passenger Name</th>
                            <th className="font-[500] p-3">Pax</th>
                            <th className="font-[500] p-3">Basis Of Transfer</th>
                            <th className="font-[500] p-3">Daily Buffet Breakfast</th>
                            <th className="font-[500] p-3">Paging Name</th>
                            <th className="font-[500] p-3">Airport Name</th>
                            <th className="font-[500] p-3">Arrival Date</th>
                            <th className="font-[500] p-3">Arrival Note</th>
                            <th className="font-[500] p-3">Departure Date</th>
                            <th className="font-[500] p-3">Departure Note</th>
                            <th className="font-[500] p-3">Contact Name</th>
                            <th className="font-[500] p-3">Contact Number</th>
                            <th className="font-[500] p-3">Cancellation Status</th>
                            <th className="font-[500] p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {vouchers?.map((voucher, index) => {
                            return (
                                <tr key={index} className="border-b border-tableBorderColor">
                                    <td className="p-3">
                                        {filters.skip * filters.limit + (index + 1)}
                                    </td>
                                    <td className="p-3">{voucher?.voucherId}</td>
                                    <td className="p-3 whitespace-nowrap">
                                        {formatDate(voucher?.createdAt)}
                                    </td>
                                    <td className="p-3">
                                        <Link
                                            to={`${voucher?._id}`}
                                            className="underline text-blue-500"
                                        >
                                            {voucher?.voucherAmendment?.referenceNumber}
                                        </Link>
                                    </td>
                                    <td className="p-3">
                                        {voucher?.voucherAmendment?.passengerName}
                                    </td>
                                    <td className="p-3 min-w-[150px]">
                                        {voucher?.voucherAmendment?.noOfAdults} Adults
                                        {voucher?.voucherAmendment?.noOfChildren
                                            ? ` + ${
                                                  voucher?.voucherAmendment?.noOfChildren
                                              } Children (${voucher?.voucherAmendment?.childrenAges
                                                  ?.map(
                                                      (age, index) =>
                                                          `${age}${
                                                              index !==
                                                              voucher?.voucherAmendment
                                                                  ?.childrenAges?.length -
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
                                                              voucher?.voucherAmendment?.infantAges
                                                                  ?.length -
                                                                  1
                                                                  ? ", "
                                                                  : ""
                                                          }`
                                                  )
                                                  .join("")})`
                                            : ""}
                                    </td>
                                    <td className="p-3">
                                        {voucher?.voucherAmendment?.basisOfTransfer || "N/A"}
                                    </td>
                                    <td className="p-3">
                                        {voucher?.voucherAmendment?.buffetBreakfast || "N/A"}
                                    </td>
                                    <td className="p-3 min-w-[200px]">
                                        {voucher?.voucherAmendment?.pagingName || "N/A"}
                                    </td>
                                    <td className="p-3 min-w-[200px]">
                                        {voucher?.voucherAmendment?.arrivalAirportName || "N/A"}
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {voucher?.voucherAmendment?.arrivalDate
                                            ? formatDate(voucher?.voucherAmendment?.arrivalDate)
                                            : "N/A"}
                                    </td>
                                    <td className="p-3 min-w-[200px]">
                                        {voucher?.voucherAmendment?.arrivalNote || "N/A"}
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                        {voucher?.voucherAmendment?.departureDate
                                            ? formatDate(voucher?.voucherAmendment?.departureDate)
                                            : "N/A"}
                                    </td>
                                    <td className="p-3 min-w-[200px]">
                                        {voucher?.voucherAmendment?.departureNote || "N/A"}
                                    </td>
                                    <td className="p-3 min-w-[200px]">
                                        {voucher?.voucherAmendment?.contactName}
                                    </td>
                                    <td className="p-3 min-w-[200px]">
                                        {voucher?.voucherAmendment?.contactNumber}
                                    </td>
                                    <td className="p-3 min-w-[200px]">
                                        {voucher?.voucherAmendment?.isCancelled}
                                        <span
                                            className={
                                                "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                (voucher?.voucherAmendment?.isCancelled === true
                                                    ? "bg-[#f065481A] text-[#f06548]"
                                                    : "text-[#0ab39c] bg-[#0ab39c1A]")
                                            }
                                        >
                                            {voucher?.voucherAmendment?.isCancelled === true
                                                ? "cancelled"
                                                : "active"}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-center gap-[10px]">
                                            <button
                                                className="h-auto flex items-center justify-center bg-transparent text-blue-500 text-lg"
                                                onClick={() =>
                                                    downloadVoucherPdf(
                                                        voucher?.voucherAmendment?._id
                                                    )
                                                }
                                            >
                                                <FiDownload />
                                            </button>
                                            {hasPermission({
                                                roles: admin?.roles,
                                                name: "tour-schedules",
                                                permission: "delete",
                                            }) && (
                                                <button
                                                    className="h-auto flex items-center justify-center bg-transparent text-red-500 text-xl"
                                                    onClick={() => deleteVoucher(voucher?._id)}
                                                >
                                                    <MdDelete />
                                                </button>
                                            )}
                                            {hasPermission({
                                                roles: admin?.roles,
                                                name: "tour-schedules",
                                                permission: "update",
                                            }) && (
                                                <Link to={`${voucher?._id}/edit`}>
                                                    <button className="h-auto flex items-center justify-center bg-transparent text-green-500 text-xl">
                                                        <BiEditAlt />
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

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
