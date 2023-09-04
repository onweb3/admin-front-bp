import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../../axios";
import { avatarImg } from "../../../assets/images";
import { config } from "../../../constants";

export default function SubAgentsTableRow({ reseller, referredBy = true }) {
    const [status, setStatus] = useState(reseller?.status);
    const [isStatusLoading, setIsStatusLoading] = useState(false);

    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleStatusChange = async (status) => {
        try {
            setIsStatusLoading(true);
            await axios.patch(
                `/resellers/update/${reseller?._id}/status`,
                { status },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setStatus(status);
            setIsStatusLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <tr
            className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
            onClick={() => navigate(`/b2b/${reseller?._id}/details`)}
        >
            <td className="p-3">{reseller?.agentCode}</td>
            <td className="p-3">
                <div className="flex items-center gap-[10px]">
                    <img
                        src={reseller?.avatar ? config.SERVER_URL + reseller?.avatar : avatarImg}
                        alt=""
                        className="w-[40px] rounded-full h-[40px]"
                    />
                    <div>
                        <span>{reseller?.companyName}</span>
                        <span className="block text-sm text-grayColor">{reseller?.website}</span>
                    </div>
                </div>
            </td>
            <td className="p-3">
                <span className="block">{reseller?.name}</span>
                <span className="text-grayColor block">{reseller?.email}</span>
            </td>
            <td className="p-3 capitalize">{reseller?.country?.countryName}</td>
            <td className="p-3">
                {reseller?.country?.phonecode} {reseller?.phoneNumber}
            </td>
            {referredBy === true && (
                <td className="p-3">
                    <Link
                        to={`/b2b/${reseller?.referredBy?._id}/details`}
                        className="text-blue-500 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {reseller?.referredBy?.companyName} - ({reseller?.referredBy?.agentCode})
                    </Link>
                </td>
            )}
            <td className="p-3" onClick={(e) => e.stopPropagation()}>
                {isStatusLoading ? (
                    <div>
                        <div className="w-[25px] h-[25px] rounded-full border-4 border-primaryColor border-r-transparent animate-spin"></div>
                    </div>
                ) : status === "cancelled" ? (
                    <div>
                        <span className="py-1 px-2 text-[12px] font-medium rounded text-[#f06548] bg-[#f065481a]">
                            Cancelled
                        </span>
                    </div>
                ) : (
                    <div className="max-w-[120px]">
                        <select
                            name=""
                            id=""
                            value={status || ""}
                            onChange={(e) => handleStatusChange(e.target.value)}
                        >
                            <option value="ok">Enable</option>
                            <option value="disabled">Disable</option>
                        </select>
                    </div>
                )}
            </td>
        </tr>
    );
}
