import React, { useRef } from "react";
import { BiLogOut } from "react-icons/bi";
import { FiSettings, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import { useHandleClickOutside } from "../../hooks";
import { logoutAdmin } from "../../redux/slices/adminSlice";
import { Link } from "react-router-dom";

export default function AdminDropdown({ setIsAdminDropdownOpen }) {
    const { admin } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsAdminDropdownOpen(false));

    return (
        <div
            className="absolute z-10 right-0 bg-white shadow-[0_5px_10px_rgb(30_32_37_/_12%)] rounded min-w-[180px] py-2"
            ref={wrapperRef}
        >
            <span className="block px-4 py-2 text-[13px] font-medium text-grayColor">
                Welcome {admin?.name}
            </span>
            <Link
                to="/profile"
                className="flex items-center gap-[10px] text-sm py-[6px] px-4 cursor-pointer hover:bg-[#f3f6f9]"
                onClick={() => setIsAdminDropdownOpen(false)}
            >
                <FiUser />
                Profile
            </Link>
            <Link
                to="/profile/edit"
                className="flex items-center gap-[10px] text-sm py-[6px] px-4 cursor-pointer hover:bg-[#f3f6f9]"
                onClick={() => setIsAdminDropdownOpen(false)}
            >
                <FiSettings />
                Settings
            </Link>
            <span
                className="flex items-center gap-[10px] text-sm py-[6px] px-4 cursor-pointer hover:bg-[#f3f6f9]"
                onClick={() => dispatch(logoutAdmin())}
            >
                <BiLogOut />
                Logout
            </span>
        </div>
    );
}
