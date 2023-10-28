import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import axios from "../../../axios";
import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import { useParams } from "react-router-dom";

export default function HotelMarkupModal({
    setIsModalOpen,
    type,
    hotelId,
    roomTypes,
    setRoomTypes,
    setDropdownVisible,
}) {
    console.log("roomTypes", roomTypes);
    const [formData, setFormData] = useState({
        hotelId: hotelId,
        markupType: "flat",
        markup: 0,
        markupTypeApi: "flat",
        markupApi: 0,
        isEdit: false,
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { profileId, marketId } = useParams();

    const wrapperRef = useRef();
    // useHandleClickOutside(wrapperRef, () => setIsMarkupModalView(false));
    const { jwtToken } = useSelector((state) => state.admin);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (type === "market") {
                if (marketId) {
                    const response = await axios.post(
                        `/market/update-hotel-profile/${marketId}`,
                        formData,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );
                } else {
                    const response = await axios.post(
                        `/market/b2b/update-hotel-profile/${id}`,
                        formData,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );
                }
            } else {
                if (profileId) {
                    const response = await axios.post(
                        `/profile/update-hotel-profile/${profileId}`,
                        formData,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );
                } else {
                    const response = await axios.post(
                        `/profile/b2b/update-hotel-profile/${id}`,
                        formData,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );
                }
            }
            setRoomTypes((prev) => {
                return prev.map((room) => {
                    return {
                        ...room, // Spread the existing properties of room
                        markupType: formData.markupType,
                        markup: formData.markup,
                        markupTypeApi: formData.markupTypeApi,
                        markupApi: formData.markupApi,
                        isEdit: false,
                    };
                });
            });
            setDropdownVisible(false)

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

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Apply Markup</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form
                        action=""
                        onSubmit={(e) => {
                            handleSubmit(e);
                        }}
                    >
                        <div>
                            <label htmlFor="">Contract Markup Type *</label>
                            <select
                                name="markupType"
                                value={formData.markupType || ""}
                                onChange={handleChange}
                                id=""
                                required
                            >
                                <option value="percentage">Percentage</option>
                                <option value="flat">Flat</option>
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Contract Markup *</label>
                            <input
                                type="number"
                                value={formData.markup || ""}
                                name="markup"
                                onChange={handleChange}
                                placeholder="Enter Markup"
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Api Markup Type *</label>
                            <select
                                name="markupTypeApi"
                                value={formData.markupTypeApi || ""}
                                onChange={handleChange}
                                id=""
                                required
                            >
                                <option value="percentage">Percentage</option>
                                <option value="flat">Flat</option>
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Api Markup *</label>
                            <input
                                type="number"
                                value={formData.markupApi || ""}
                                name="markupApi"
                                onChange={handleChange}
                                placeholder="Enter Markup"
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
                            <button className="w-[160px]">
                                {isLoading ? <BtnLoader /> : "Apply Markup"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
