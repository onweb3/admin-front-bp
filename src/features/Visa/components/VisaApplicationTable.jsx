import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { formatDate } from "../../../utils";

import { avatarImg } from "../../../assets/images";
import axios from "../../../axios";

export default function VisaApplicationTable({ visaApplication, orderedBy }) {
    const [status, setStatus] = useState(visaApplication?.status);
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    return (
        <tr
            className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
            onClick={() =>
                navigate(
                    `/visa/${orderedBy}/${visaApplication?._id}/application/${visaApplication.travellers._id}`
                )
            }
        >
            <td className="p-3">{visaApplication?.referenceNumber}</td>
            <td className="p-3">
                <span className="block">{visaApplication?.visaType}</span>
                <span className="text-grayColor block">
                    {visaApplication?.visa}
                </span>
            </td>

            {/* <td className="p-3">
                <div className="flex items-center gap-[10px]">
                    <img
                        src={
                            visaApplication?.avatar
                                ? process.env.REACT_APP_SERVER_URL +
                                visaApplication?.avatar
                                : avatarImg
                        }
                        alt=""
                        className="w-[40px] rounded-full h-[40px]"
                    />
                    <div>
                        <span>{visaApplication?.companyName}</span>
                        <span className="block text-sm text-grayColor">
                            {visaApplication?.website}
                        </span>
                    </div>
                </div>
            </td> */}
            {orderedBy == "b2c" ? (
                <td className="p-3">
                    <span className="block">
                        {visaApplication?.user?.name}{" "}
                    </span>
                    <span className="text-grayColor block">
                        {visaApplication?.user?.email}
                    </span>
                </td>
            ) : (
                <td className="p-3">
                    <span className="block">
                        {visaApplication?.reseller?.name}{" "}
                    </span>
                    <span className="text-grayColor block">
                        {visaApplication?.reseller?.email}
                    </span>
                </td>
            )}

            <td className="p-3">
                <span className="block">
                    {visaApplication?.travellers?.firstName}{" "}
                    {visaApplication?.travellers?.lastName}{" "}
                </span>
                <span className="text-grayColor block">
                    {visaApplication?.travellers?.email}
                </span>
            </td>
            {/* <td className="p-3 capitalize">{visaApplication?.visaType.visa.country?.countryName}</td> */}
            <td className="p-3">{formatDate(visaApplication?.createdAt)}</td>
            <td className="p-3">
                {visaApplication?.status === "payed" ? (
                    <div>
                        <span className="py-1 px-2 text-[12px] font-medium rounded text-[#008000] bg-[#f065481a]">
                            Paid
                        </span>
                    </div>
                ) : (
                    <div>
                        <span className="py-1 px-2 text-[12px] font-medium rounded text-[#ff0000] bg-[#f065481a]">
                            Initated
                        </span>
                    </div>
                )}
            </td>
        </tr>
    );
}
