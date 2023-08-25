import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { BtnLoader } from "../../../components";
import { useHandleClickOutside, useImageChange } from "../../../hooks";
import axios from "../../../axios";
import { config } from "../../../constants";

export default function AddAttrCategoryModal({
    categoryModal,
    setCategoryModal,
    selectedCategory,
    addCategory,
    updateCategory,
}) {
    const [data, setData] = useState({
        categoryName:
            (categoryModal?.isEdit && selectedCategory?.categoryName) || "",
        description:
            (categoryModal?.isEdit && selectedCategory?.description) || "",
        iconUrl: (categoryModal?.isEdit && selectedCategory?.icon) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setCategoryModal({ isEdit: false, isOpen: false })
    );
    const { jwtToken } = useSelector((state) => state.admin);
    const {
        image: iconImg,
        handleImageChange: handleIconImgChange,
        error: iconError,
    } = useImageChange();

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

            const formData = new FormData();
            formData.append("categoryName", data.categoryName)
            formData.append("description", data.description)
            formData.append("icon", iconImg)

            if (categoryModal?.isEdit) {
                const response = await axios.patch(
                    `/attractions/categories/update/${selectedCategory?._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateCategory(response.data);
            } else {
                const response = await axios.post(
                    "/attractions/categories/add",
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                addCategory(response.data);
            }
            setCategoryModal({ isOpen: false, isEdit: false });
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
                        {categoryModal?.isEdit
                            ? "Update Category"
                            : "Add Category"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setCategoryModal({ isOpen: false, isEdit: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Category Name *</label>
                            <input
                                type="text"
                                placeholder="Ex: Travel"
                                name="categoryName"
                                value={data.categoryName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Icon *</label>
                            <input
                                type="file"
                                onChange={handleIconImgChange}
                                required={categoryModal?.isEdit === false}
                            />
                            {iconError && (
                                <span className="text-sm text-red-500 block mt-2">
                                    {iconError}
                                </span>
                            )}
                            {(iconImg || data.iconUrl) && (
                                <img
                                    src={
                                        iconImg
                                            ? URL.createObjectURL(iconImg)
                                            : config.SERVER_URL +
                                              data.iconUrl
                                    }
                                    alt=""
                                    className="w-[40px] max-h-[40px] mt-3"
                                />
                            )}
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Description</label>
                            <textarea
                                id=""
                                placeholder="Enter Description"
                                name="description"
                                value={data.description || ""}
                                onChange={handleChange}
                            ></textarea>
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
                                    setCategoryModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[150px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : categoryModal?.isEdit ? (
                                    "Update Category"
                                ) : (
                                    "Add Category"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
