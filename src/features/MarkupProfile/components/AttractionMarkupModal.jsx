import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";

export default function AttracitonMarkupModal({
    setIsModalOpen,
    data,
    setData,
    setActivity,
    activity,
    activities,
}) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        activity: activities._id,
        markupType: "",
        markup: "",
    });

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => {
        setIsModalOpen(false);
    });
    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = () => {
        // Find the index of the existing activity in the `activity` array
        const existingActivityIndex = activity.findIndex(
            (act) => act.activity === formData.activity
        );

        // If an existing activity was found, update it with the new `formData`
        if (existingActivityIndex !== -1) {
            const updatedActivity = {
                ...activity[existingActivityIndex],
                markupType: formData.markupType,
                markup: formData.markup,
            };

            const updatedActivityList = [...activity];
            updatedActivityList[existingActivityIndex] = updatedActivity;

            setActivity(updatedActivityList);
        } else {
            // If the `formData` corresponds to a new activity, add it to the `activity` array
            setActivity([
                ...activity,
                {
                    activity: formData.activity,
                    markupType: formData.markupType,
                    markup: formData.markup,
                },
            ]);
        }

        setData(formData);
        setIsModalOpen(false);
    };



    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Add Markup</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModalOpen(false)}
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
                                Select Markupup Type
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
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className="w-[160px]" onClick={handleSubmit}>
                            {isLoading ? <BtnLoader /> : "Add Markup"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
