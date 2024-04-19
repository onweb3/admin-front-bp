import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { avatarImg } from "../../../assets/images";
import axios from "../../../axios";
import AddMarkupModal from "./AddMarkupModal";
import AddApproveMarkupModal from "./AddApproveMarkUp";
import AddApproveProfileMarkupModa from "./AddApproveProfileMarkupModal";
// import { config } from "../../../constants";

export default function ResellersTableRow({ reseller }) {
  console.log("ResellersTableRow", reseller);
  const [status, setStatus] = useState(reseller?.status);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleApprove = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <tr
        className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
        onClick={() => navigate(`${reseller?._id}/details`)}
      >
        <td className="p-3">{reseller?.agentCode}</td>
        <td className="p-3">
          <div className="flex items-center gap-[10px]">
            <img
              src={
                reseller?.avatar
                  ? import.meta.env.VITE_SERVER_URL + reseller?.avatar
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
          <span className="text-grayColor block">{reseller?.email}</span>
        </td>
        <td className="p-3 capitalize">{reseller?.country?.countryName}</td>
        <td className="p-3">
          {reseller?.country?.phonecode} {reseller?.phoneNumber}
        </td>
        <td className="p-3" onClick={(e) => e.stopPropagation()}>
          {isStatusLoading ? (
            <div>
              <div className="w-[25px] h-[25px] rounded-full border-4 border-primaryColor border-r-transparent animate-spin"></div>
            </div>
          ) : status === "pending" ? (
            <div className="flex items-center gap-[10px]">
              <button
                className="h-[35px] w-[35px] bg-green-500 flex items-center justify-center text-xl"
                onClick={handleApprove}
              >
                <FiCheck />
              </button>
              <button
                className="h-[35px] w-[35px] bg-red-500 flex items-center justify-center text-xl"
                onClick={() => handleStatusChange("cancelled")}
              >
                <MdClose />
              </button>
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
      {/* {isModalOpen ? (
                <AddApproveMarkupModal
                    setStatus={setStatus}
                    status={status}
                    resellerId={reseller._id}
                    setIsModalOpen={setIsModalOpen}
                />
            ) : null} */}

      {isModalOpen ? (
        <AddApproveProfileMarkupModa
          setStatus={setStatus}
          status={status}
          resellerId={reseller._id}
          setIsModalOpen={setIsModalOpen}
        />
      ) : null}
    </>
  );
}
