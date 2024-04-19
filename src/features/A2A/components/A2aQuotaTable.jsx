import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { MdClose, MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";

import { avatarImg } from "../../../assets/images";
import axios from "../../../axios";
import { BiEditAlt } from "react-icons/bi";
import A2aQuotaModal from "./A2aQuotaModaj";
// import { config } from "../../../constants";

export default function A2aQuotaTable({ reseller, setResellers, index }) {
  // const [seat, setSeat] = useState(reseller?.quota?.ticketCountTotal || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const { ticketId } = useParams();

  const navigate = useNavigate();
  const { jwtToken } = useSelector((state) => state.admin);

  const onHandleDelete = async (id) => {
    try {
      const isConfirm = window.confirm("Are you sure to change?");
      if (isConfirm) {
        await axios.delete(`/a2a/quota/${ticketId}/delete/${reseller._id}`, {
          headers: { authorization: `Bearer ${jwtToken}` },
        });

        setResellers((prev) => {
          const updatedResellers = [...prev];

          updatedResellers[index] = {
            ...prev[index],
            quota: {
              ...prev[index].quota,
              isActive: false,
            },
          };

          return updatedResellers;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(reseller, "reseller");

  return (
    <>
      <tr className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]">
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
        <td className="p-3 capitalize">
          <div>
            <span> {reseller?.country?.countryName}</span>
            <span className="block text-sm text-grayColor">
              {reseller?.country?.phonecode} {reseller?.phoneNumber}{" "}
            </span>
          </div>
        </td>
        <td className="p-3">
          {" "}
          {reseller?.quota?.ticketCountUsed
            ? reseller?.quota?.ticketCountUsed
            : 0}
        </td>
        <td className="p-3">
          {" "}
          {reseller?.quota?.ticketCountTotal !== 0 && reseller?.quota?.isActive
            ? reseller?.quota?.ticketCountTotal
            : "Not Added"}
        </td>

        <td className="p-3">
          {" "}
          <div className="flex gap-[10px]">
            <button
              className="h-auto bg-transparent text-green-500 text-xl"
              onClick={(e) => {
                setIsModalOpen(true);
              }}
            >
              <BiEditAlt />
            </button>
            {reseller?.quota?.isActive ? (
              <button
                className="h-auto bg-transparent text-red-500 text-xl"
                onClick={(e) => {
                  onHandleDelete(reseller?._id);
                }}
              >
                <MdDelete />
              </button>
            ) : (
              ""
            )}
          </div>
        </td>
      </tr>
      {isModalOpen ? (
        <A2aQuotaModal
          reseller={reseller}
          setResellers={setResellers}
          index={index}
          resellerId={reseller._id}
          setIsModalOpen={setIsModalOpen}
        />
      ) : null}
    </>
  );
}
