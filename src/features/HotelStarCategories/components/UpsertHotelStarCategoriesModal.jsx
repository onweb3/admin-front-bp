import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";

export default function UpsertHotelStarCategoriesModal({
    starCategoriesModal,
    setStarCategoriesModal,
    selectedStarCategory,
    starCategories,
    setStarCategories,
}) {
    const [data, setData] = useState({
        categoryCode: (starCategoriesModal?.isEdit && selectedStarCategory?.categoryCode) || "",
        categoryName: (starCategoriesModal?.isEdit && selectedStarCategory?.categoryName) || "",
        order: (starCategoriesModal?.isEdit && selectedStarCategory?.order) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setStarCategoriesModal({ isEdit: false, isOpen: false })
    );
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            if (starCategoriesModal?.isEdit) {
                const response = await axios.patch(
                    `/hotels/star-categories/update/${selectedStarCategory?._id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                const tempStarCategories = starCategories;
                const objIndex = tempStarCategories?.findIndex((item) => {
                    return item?._id === response?.data?._id;
                });
                tempStarCategories[objIndex] = response.data;
                setStarCategories(tempStarCategories);
            } else {
                const response = await axios.post("/hotels/star-categories/add", data, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setStarCategories((prev) => {
                    return [response.data, ...prev];
                });
            }
            setStarCategoriesModal({ isOpen: false, isEdit: false });
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
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">
                        {starCategoriesModal?.isEdit ? "Update Star Category" : "Add Star Category"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setStarCategoriesModal({ isOpen: false, isEdit: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Chain Code</label>
                            <input
                                type="text"
                                placeholder="Ex: 1STAR"
                                name="categoryCode"
                                value={data.categoryCode || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Chain Name</label>
                            <input
                                type="text"
                                placeholder="Ex: 1 Star"
                                name="categoryName"
                                value={data.categoryName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Order *</label>
                            <input
                                type="number"
                                placeholder="0"
                                name="order"
                                value={data.order || ""}
                                onChange={handleChange}
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
                                onClick={() =>
                                    setStarCategoriesModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[190px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : starCategoriesModal?.isEdit ? (
                                    "Update Star Category"
                                ) : (
                                    "Add Star Category"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
