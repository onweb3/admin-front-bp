import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import axios from "../../../axios";
import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import { useNavigate, useParams } from "react-router-dom";

export default function HotelStarCategoryMarkupModal({
    setIsModalOpen,
    category,
    setCategories,
}) {
    const [formData, setFormData] = useState({
        name: category.name || "",
        markupType: "flat",
        markup: 0,
        markupTypeApi: "flat",
        markupApi: 0,
        isEdit: false,
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const { profileId } = useParams();
    const navigate = useNavigate();
    const { id } = useParams();

    const wrapperRef = useRef();
    // useHandleClickOutside(wrapperRef, () => setIsMarkupModalView(false));
    const { jwtToken } = useSelector((state) => state.admin);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (profileId) {
            const response = await axios.post(
                `/profile/update-starCategory-profile/${profileId}`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
        } else {
            const response = await axios.post(
                `/profile/b2b/update-starCategory-profile/${id}`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
        }

        setCategories((previous) => {
            const existingIndex = previous.findIndex(
                (a) => a.name.toString() === category.name.toString()
            );

            if (existingIndex !== -1) {
                const updatedType = {
                    ...previous[existingIndex],
                    markupType: formData.markupType,
                    markup: formData.markup,
                    markupTypeApi: formData.markupTypeApi,
                    markupApi: formData.markupApi,
                    isEdit: true,
                };

                const newType = [...previous];
                newType.splice(existingIndex, 1, updatedType);

                console.log(newType, "newType");
                return newType;
            } else {
                return previous;
            }
        });

        setIsModalOpen(false);
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
                                onClick={() => setIsMarkupModalView(false)}
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
