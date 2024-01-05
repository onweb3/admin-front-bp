import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";

export default function ResellerSelectionActivityModal({
    profileId,
    setIsModalOpen,
    setUpdateSelectedModal,
    markupType,
    markup,
}) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedId, setSelectedId] = useState([]);
    const [resellers, setResellers] = useState([]);
    const { activityId } = useParams();

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
                `/profile/get-all-b2b-profiles/${profileId}/${activityId}`,
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
                const response = await axios.post(
                    `/profile/update-selected-b2b-profile-activity/${profileId}`,
                    { selectedId, markupType, markup, activityId },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
            setIsLoading(false);
            setUpdateSelectedModal(false);
            setIsModalOpen(false);
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
                className="bg-[#fff] w-full max-h-[70vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Select Reseller</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setUpdateSelectedModal(false)}
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
                        <table className="w-full">
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                <tr>
                                    <th className="font-[500] p-3">Index</th>
                                    <th className="font-[500] p-3">Name</th>
                                    <th className="font-[500] p-3">
                                        Current Markup
                                    </th>

                                    {/* <th className="font-[500] p-3">
                                        Old Markup
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {resellers?.map((reseller, index) => {
                                    return (
                                        <tr
                                            className={
                                                "border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9] "
                                            }
                                        >
                                            {" "}
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    className="w-[15px] h-[15px]"
                                                    //    id={`multi-select-${item[valueName]}-${randomIndex}`}
                                                    onChange={(e) => {
                                                        handleDataChange(
                                                            e,
                                                            reseller.resellerId
                                                                ._id
                                                        );
                                                    }}
                                                    checked={
                                                        selectedId?.find(
                                                            (selected) => {
                                                                return (
                                                                    selected?.toString() ===
                                                                    reseller?.resellerId?._id?.toString()
                                                                );
                                                            }
                                                        ) !== undefined || false
                                                    }
                                                />
                                            </td>
                                            <td className="p-3">
                                                <span className="block">
                                                    {reseller?.resellerId?.name}
                                                </span>
                                                <span className="text-grayColor block">
                                                    {
                                                        reseller?.resellerId
                                                            ?.companyName
                                                    }
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="block">
                                                    {reseller?.markup}
                                                </span>
                                                <span className="text-grayColor block">
                                                    {reseller?.markupType}
                                                </span>
                                            </td>
                                            {/* <td className="p-3">
                                                <span className="block">
                                                    {reseller?.markup}
                                                </span>
                                                <span className="text-grayColor block">
                                                    {reseller?.markupType}
                                                </span>
                                            </td> */}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => setUpdateSelectedModal(false)}
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
