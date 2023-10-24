import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";

export default function AddApproveMarkupModal({ setIsModalOpen, setStatus, status, resellerId }) {
    const [formData, setFormData] = useState({
        profileId: "",
    });
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState("");
    const [nextSection, setNextSection] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => {
        setIsModalOpen(false);
    });
    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchProfiles = async () => {
        try {
            const response = await axios.get(`/profile/get-all-profiles`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setProfiles(response?.data);
            // setFilters((prev) => {
            //     return {
            //         ...prev,
            //         totalResellers: response.data?.totalResellers,
            //     };
            // });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [id]);

    const handleStatusChange = async (status, e) => {
        try {
            e.preventDefault();

            setIsLoading(true);
            await axios.patch(
                `/resellers/update/${resellerId}/status`,
                { status, formData },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setStatus(status);
            setIsLoading(false);
            setNextSection(false);
            setIsModalOpen(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleNext = (status, e) => {
        e.preventDefault();
        setNextSection(status);
    };

    //   const handleSubmit = async (e) => {
    //     try {
    //       e.preventDefault();
    //       setError("");
    //       setIsLoading(true);

    //       const response = await axios.patch(
    //         "/markup/b2b/attraction/add",
    //         {
    //           resellerId: id,
    //           ...formData,
    //         },
    //         {
    //           headers: { authorization: `Bearer ${jwtToken}` },
    //         }
    //       );

    //       //   setData((prev) => {
    //       //     return {
    //       //       ...prev,
    //       //       markupType: response?.data?.markupType,
    //       //       markup: response?.data?.markup,
    //       //     };
    //       //   });
    //       setIsLoading(false);
    //       setIsModalOpen(false);
    //     } catch (err) {
    //       setError(err?.response?.data?.error || "Something went wrong, Try again");
    //       setIsLoading(false);
    //     }
    //   };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <form action="" onSubmit={(e) => handleStatusChange("ok", e)}>
                    <>
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="font-medium">Add Profile Markup</h2>
                            <button
                                className="h-auto bg-transparent text-textColor text-xl"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <MdClose />
                            </button>
                        </div>
                        <div className="p-4">
                            <div>
                                <label htmlFor="">Profiles *</label>
                                <select
                                    name="profileId"
                                    value={formData?.profileId || ""}
                                    onChange={handleChange}
                                    id=""
                                >
                                    <option value="" hidden>
                                        Select Profile Type
                                    </option>
                                    {profiles.map((profile) => (
                                        <option value={profile._id}>{profile.name}</option>
                                    ))}
                                </select>
                            </div>

                            {error && (
                                <span className="text-sm block text-red-500 mt-2">{error}</span>
                            )}
                            <div className="mt-4 flex items-center justify-end gap-[12px]">
                                <button
                                    className="bg-slate-300 text-textColor px-[15px]"
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="w-[160px]"
                                    onClick={(e) => handleStatusChange("ok", e)}
                                >
                                    {isLoading ? <BtnLoader /> : "Submit"}
                                </button>
                            </div>
                        </div>
                    </>
                </form>
            </div>
        </div>
    );
}
