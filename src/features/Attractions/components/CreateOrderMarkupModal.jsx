import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";

export default function CreateOrderMarkupModal({
    setIsModal,
    selectedActivity,
    resellerId,
    setLoad,
}) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        markupType: "",
        markup: "",
    });

    console.log("modal");

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => {
        setIsModal(false);
    });
    const { id, marketId, profileId } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchMarkup = async () => {
        try {
            const response = await axios.get(
                `/orders/attraction/markup/${resellerId}/${selectedActivity?._id}`,

                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const {
                activity,
                markupType,
                markup,
                isEdit,
                transferMarkup,
                transferMarkupType,
            } = response.data;
            setFormData({
                activity,
                markupType,
                markup,
                isEdit,
                transferMarkup,
                transferMarkupType,
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchMarkup();
    }, []);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);

            const response = await axios.post(
                `/profile/b2b/update-activities-profile/${resellerId}`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setLoad((prev) => {
                return !prev;
            });
            setFormData();
            setIsLoading(false);

            setIsModal(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Change Markup</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <div>
                        <label htmlFor="">Markup Type *</label>
                        <select
                            name="markupType"
                            value={formData?.markupType || ""}
                            onChange={handleChange}
                            id=""
                            required
                        >
                            <option value="" hidden>
                                Select Markup Type *
                            </option>
                            <option value="flat">Flat</option>
                            <option value="percentage">Percentage</option>
                        </select>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Markup *</label>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            name="markup"
                            onChange={handleChange}
                            value={formData.markup || ""}
                            required
                        />
                    </div>
                    {error && (
                        <span className="text-sm block text-red-500 mt-2">
                            {error}
                        </span>
                    )}
                    <div className="mt-4 flex items-center justify-end gap-[12px]">
                        <button
                            className="bg-slate-300 text-textColor px-[15px]"
                            type="button"
                            onClick={() => setIsModal(false)}
                        >
                            Cancel
                        </button>
                        <button className="w-[160px]" onClick={handleSubmit}>
                            {isLoading ? <BtnLoader /> : "Change Markup"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
