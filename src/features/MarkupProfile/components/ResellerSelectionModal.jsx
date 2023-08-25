import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";

export default function ResellerSelectionModal({ profileId, setIsModalOpen }) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedId, setSelectedId] = useState([]);
    const [resellers, setResellers] = useState([]);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => {
        setIsModalOpen(false);
    });
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchReseller = async (profileId) => {
        try {
            setError("");

            setIsLoading(true);

            const response = await axios.get(
                `/profile/b2b/resellers/${profileId}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            console.log(response, "response");

            setResellers(response.data);

            setIsLoading(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const handleDataChange = (e, resellerId) => {
        setSelectedId((prevIds) => {
            const isIdSelected = prevIds.find(
                (selected) => selected?.toString() === resellerId?.toString()
            );

            if (isIdSelected) {
                // Remove the resellerId from the array
                return prevIds.filter(
                    (selected) =>
                        selected?.toString() !== resellerId?.toString()
                );
            } else {
                // Add the resellerId to the array
                return [...prevIds, resellerId];
            }
        });
    };

    console.log(selectedId, "selectedId");

    const handleSubmit = async (e, profileId) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            const isConfirm = window.confirm(
                "Are you sure to update all b2b profiles?"
            );
            if (isConfirm) {
                const response = await axios.patch(
                    `/profile/b2b/update-all-profile/edit/${profileId}`,
                    { selectedId },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSelectAllChange = (e) => {
        if (e.target.checked) {
            const allResellerIds = resellers.map(
                (reseller) => reseller.resellerId._id
            );
            setSelectedId(allResellerIds);
        } else {
            setSelectedId([]);
        }
    };

    useEffect(() => {
        fetchReseller(profileId);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[70vh] max-w-[300px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Select Reseller</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-6">
                    <form
                        action=""
                        onSubmit={(e) => {
                            handleSubmit(e, profileId);
                        }}
                    >
                        <label className="flex items-center gap-[10px] px-[0.9rem] hover:bg-[#f3f6f9] py-[2px] cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-[15px] h-[15px]"
                                onChange={handleSelectAllChange}
                            />
                            <span className="capitalize">Select All</span>
                        </label>

                        <div className="px-3 py-2">
                            <span className="capitalize">Resellers</span>
                        </div>

                        {resellers?.map((reseller, index) => {
                            return (
                                <label
                                    //    htmlFor={`multi-select-${item[valueName]}-${randomIndex}`}
                                    //    key={item[valueName]}
                                    className="flex items-center gap-[10px] px-[0.9rem] hover:bg-[#f3f6f9] py-[5px] cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        className="w-[15px] h-[15px]"
                                        //    id={`multi-select-${item[valueName]}-${randomIndex}`}
                                        onChange={(e) => {
                                            handleDataChange(
                                                e,
                                                reseller.resellerId._id
                                            );
                                        }}
                                        checked={
                                            selectedId?.find((selected) => {
                                                return (
                                                    selected?.toString() ===
                                                    reseller?.resellerId?._id?.toString()
                                                );
                                            }) !== undefined || false
                                        }
                                    />
                                    <span className="capitalize">
                                        {reseller?.resellerId?.name} -{" "}
                                        {reseller?.resellerId?.companyName}
                                    </span>
                                </label>
                            );
                        })}

                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="w-[160px]">
                                {isLoading ? <BtnLoader /> : "Update"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
