import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { avatarImg } from "../../assets/images";

import { config } from "../../constants";

export default function ResellersQuotationLisitingRow({
    reseller,
    totalQuotation,
}) {
    const [status, setStatus] = useState(reseller?.status);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    return (
        <>
            <tr
                className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                onClick={() => navigate(`${reseller?._id}`)}
            >
                <td className="p-3">{reseller?.agentCode}</td>
                <td className="p-3">
                    <div className="flex items-center gap-[10px]">
                        <img
                            src={
                                reseller?.avatar
                                    ? import.meta.env.VITE_SERVER_URL +
                                      reseller?.avatar
                                    : avatarImg
                            }
                            alt=""
                            className="w-[40px] rounded-full h-[40px]"
                        />
                        <div>
                            <span>{reseller?.companyName}</span>
                            <span className="block text-sm text-grayColor">
                                {reseller?.website}
                            </span>
                        </div>
                    </div>
                </td>
                <td className="p-3">
                    <span className="block">{reseller?.name}</span>
                    <span className="text-grayColor block">
                        {reseller?.email}
                    </span>
                </td>
                <td className="p-3 capitalize">
                    {reseller?.country?.countryName}
                </td>
                <td className="p-3">
                    {reseller?.country?.phonecode} {reseller?.phoneNumber}
                </td>
                <td className="p-3">{totalQuotation}</td>
            </tr>
        </>
    );
}
