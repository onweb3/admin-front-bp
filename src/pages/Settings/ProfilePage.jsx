import React from "react";
import { HiOutlineUser } from "react-icons/hi";
import { MdLocationPin } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { avatarImg } from "../../assets/images";
import { formatDate } from "../../utils";
// import { config } from "../../constants";

export default function ProfilePage() {
  const { admin } = useSelector((state) => state.admin);

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full h-[300px]">
        <div className="w-full h-full">
          <img
            src="https://imgak.mmtcdn.com/seo/cms-staticpages/intl-travel/assets/dubai_banner.png"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="bg-primaryColor absolute inset-0 opacity-60"></div>
        </div>
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-[20px]">
            <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-white">
              <img
                src={
                  admin?.avatar
                    ? import.meta.env.VITE_SERVER_URL + admin?.avatar
                    : avatarImg
                }
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-[600] text-lg text-white">{admin?.name}</h1>
              <span className="block text-sm text-[#ffffffbf] mt-[3px]">
                {admin?.designation}
              </span>
              <div className="flex items-center gap-[15px] text-[#ffffffbf] text-sm mt-3">
                <span>{admin?.phoneNumber}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[15px]">
            <span className="flex items-center gap-[10px] text-white">
              <MdLocationPin />
              {admin?.country}
            </span>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between">
          <span className="bg-[#ffffff1a] text-white px-[14px] py-[7px] rounded text-sm">
            Overview
          </span>
          <Link to="edit">
            <button className="bg-[#0ab39c] px-3">Edit Profile</button>
          </Link>
        </div>

        <div className="grid grid-cols-[280px_1fr] gap-6 mt-6">
          <div className="bg-white rounded p-4 shadow-sm h-max">
            <h3 className="font-medium mb-4">Info</h3>
            <div className="flex items-center text-sm gap-[10px] mb-3">
              <span>Name :</span>
              <span className="text-grayColor">{admin?.name}</span>
            </div>
            <div className="flex items-center text-sm gap-[10px] mb-3">
              <span>Email :</span>
              <span className="text-grayColor">{admin?.email}</span>
            </div>
            <div className="flex items-center text-sm gap-[10px] mb-3">
              <span>Phone Number :</span>
              <span className="text-grayColor">{admin?.phoneNumber}</span>
            </div>
            <div className="flex items-center text-sm gap-[10px] mb-3">
              <span>Location :</span>
              <span className="text-grayColor capitalize">
                {admin?.city || "N/A"}, {admin?.country}
              </span>
            </div>
            <div className="flex items-center text-sm gap-[10px] mb-2">
              <span>Joined Date :</span>
              <span className="text-grayColor">
                {admin?.joinedDate ? formatDate(admin?.joinedDate) : "N/A"}
              </span>
            </div>
          </div>
          <div className="bg-white rounded p-4 shadow-sm h-max">
            <h2 className="font-medium mb-3">About</h2>
            <div className="text-sm text-grayColor leading-[28px]">
              <p>{admin?.description || "No description added..."}</p>
            </div>

            <div className="flex items-center gap-[15px] mt-9">
              <div className="bg-[#f3f6f9] w-[30px] h-[30px] text-lg rounded-full text-[#405189] flex items-center justify-center">
                <HiOutlineUser />
              </div>
              <div>
                <span className="block text-sm text-grayColor">
                  Designation
                </span>
                <span className="block text-sm">{admin?.designation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
