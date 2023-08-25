import React from "react";
import { AiFillCamera } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";

import { avatarImg } from "../assets/images";
import { useImageChange } from "../hooks";
import { config } from "../constants";

export default function EditProfileLayout() {
    const { admin } = useSelector((state) => state.admin);
    const location = useLocation();

    const {
        image: avatar,
        handleImageChange: handleAvatarChange,
        error: avatarError,
        setImage: setAvatar,
    } = useImageChange();

    return (
        <div className="relative">
            <div className="absolute top-0 left-0 w-full h-[250px]">
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
                <div className="flex justify-end">
                    <Link to="/profile">
                        <button className="bg-white text-textColor px-3">
                            Go To Profile
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-[280px_1fr] gap-6 pt-[7.5em]">
                    <div className="p-4 bg-white rounded shadow-sm text-center h-max">
                        <div className="relative w-[90px] h-[90px] mx-auto">
                            <div className=" w-full h-full rounded-full overflow-hidden border-4 border-[#f3f6f9]">
                                <img
                                    src={
                                        avatar
                                            ? URL.createObjectURL(avatar)
                                            : admin?.avatar
                                            ? config.SERVER_URL + admin?.avatar
                                            : avatarImg
                                    }
                                    alt=""
                                    className="w-full h-full object-cover "
                                />
                            </div>
                            {location?.pathname === "/profile/edit" && (
                                <div className="absolute right-0 bottom-0 w-[30px] h-[30px] bg-[#f3f6f9] cursor-pointer rounded-full overflow-hidden">
                                    <div className="relative h-full w-full">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <AiFillCamera />
                                        </div>
                                        <input
                                            type="file"
                                            className="opacity-0 h-full w-full"
                                            onChange={handleAvatarChange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-3">
                            <span className="block font-[500]">
                                {admin?.name}
                            </span>
                            <span className="block text-sm text-grayColor mt-1">
                                {admin?.designation}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white shadow-sm rounded">
                        <div className="flex items-center gap-[30px] text-sm text-[#405189] border-b px-4 font-medium">
                            <Link
                                to="/profile/edit"
                                className={
                                    "py-4 cursor-pointer " +
                                    (location?.pathname === "/profile/edit"
                                        ? "border-b border-b-primaryColor"
                                        : "")
                                }
                            >
                                Personal Details
                            </Link>
                            <Link
                                to="/profile/edit/password"
                                className={
                                    "py-4 cursor-pointer " +
                                    (location?.pathname ===
                                    "/profile/edit/password"
                                        ? "border-b border-b-primaryColor"
                                        : "")
                                }
                            >
                                Change Password
                            </Link>
                        </div>

                        <div className="p-4">
                            <Outlet context={{ avatar, setAvatar }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
