import React from "react";
import { BsBuilding } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { FaSkype, FaWhatsapp } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

export default function SingleUserDetailsPage() {
    const { user } = useOutletContext();

    return (
        <div>
            <div className="p-4 grid grid-cols-2 gap-[20px]">
                <div>
                    <div className="flex items-center gap-[8px] mb-3">
                        <span>
                            <FiUser />
                        </span>
                        <span className="font-[600] text-[15px]">
                            Profile Details
                        </span>
                    </div>
                    <div className="">
                        <span className="block text-[12px] text-grayColor">
                            Name
                        </span>
                        <span className="block text-[15px]">{user?.name}</span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Email
                        </span>
                        <span className="block text-[15px]">{user?.email}</span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Phone Number
                        </span>
                        <span className="block text-[15px]">
                            {user?.country?.phonecode} {user?.phoneNumber}
                        </span>
                    </div>

                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Affiliate Status
                        </span>
                        <span className="block text-[15px]">
                            {user?.affiliateDetails?.isActive
                                ? "Appilied"
                                : "N/A"}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className="block text-[12px] text-grayColor">
                            Affiliate Code
                        </span>
                        <span className="block text-[15px]">
                            {user?.affiliateDetails?.affiliateCode || "N/A"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
