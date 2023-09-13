import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader, MultipleSelectDropdown } from "../../../components";

export default function AddActivityPointModal({
    setIsModal,
    selectedActivity,
    activity,
    setActivities,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        activityId: selectedActivity._id || "",
        adultPoint: selectedActivity?.adultPoint || "",
        childPoint: selectedActivity?.childPoint || "",
    });

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setIsModal({ isEdit: false, isOpen: false })
    );

    const handleSubmit = async (e, terminalId) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const response = await axios.patch(
                `/affiliate/activity/upsert`,

                data,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setActivities((prev) => {
                const updatedActivities = prev.map((activity) => {
                    if (activity._id === data.activityId) {
                        return {
                            ...activity,
                            adultPoint: data?.adultPoint || "",
                            childPoint: data?.childPoint || "",
                            isActive: true,
                        };
                    } else {
                        return activity;
                    }
                });

                return updatedActivities;
            });

            setIsLoading(false);
            setIsModal(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Add Activity Points</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <form className="p-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="">Adult Point *</label>
                        <input
                            type="number"
                            name="adultPoint"
                            value={data.adultPoint || ""}
                            onChange={handleChange}
                            placeholder="Ex: 10"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Child Point *</label>
                        <input
                            type="number"
                            name="childPoint"
                            value={data.childPoint || ""}
                            onChange={handleChange}
                            placeholder="Ex: 5"
                            required
                        />
                    </div>

                    {error && (
                        <span className="block mt-2 text-sm text-red-500">
                            {error}
                        </span>
                    )}
                    <div className="flex items-center justify-end mt-5">
                        <button className="w-[160px]" disabled={isLoading}>
                            {isLoading ? <BtnLoader /> : "Add Points"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
