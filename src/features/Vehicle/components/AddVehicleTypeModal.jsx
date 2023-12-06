import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";
import { useParams } from "react-router-dom";

export default function AddVehicleTypeModal({
    categoryModal,
    setCategoryModal,
    selectedCategory,
    addCategory,
    updateCategory,
}) {
    const [data, setData] = useState({
        name: (categoryModal?.isEdit && selectedCategory?.name) || "",
        normalOccupancy:
            (categoryModal?.isEdit && selectedCategory?.normalOccupancy) || "",
        airportOccupancy:
            (categoryModal?.isEdit && selectedCategory?.airportOccupancy) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setCategoryModal({ isEdit: false, isOpen: false })
    );
    const { jwtToken } = useSelector((state) => state.admin);
    const { categoryId } = useParams();

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

            if (categoryModal?.isEdit) {
                const response = await axios.patch(
                    `/transfers/vehicles/vehicle-type/update/${selectedCategory?._id}`,
                    { ...data, vehicleCategoryId: categoryId },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateCategory(response.data);
            } else {
                const response = await axios.post(
                    "/transfers/vehicles/vehicle-type/add",
                    { ...data, vehicleCategoryId: categoryId },
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
                    <h2 className="font-medium">
                        {categoryModal?.isEdit
                            ? "Update Vehicle Type"
                            : "Add Vehicle Type"}
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
                            <label htmlFor=""> Name</label>
                            <input
                                type="text"
                                placeholder="Ex: 7 Seater"
                                name="name"
                                value={data.name || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor=""> Airport Seating Capacity</label>
                            <input
                                type="number"
                                placeholder="Ex: 5"
                                name="airportOccupancy"
                                value={data.airportOccupancy || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor=""> Normal Seating Capacity</label>
                            <input
                                type="number"
                                placeholder="Ex:7 "
                                name="normalOccupancy"
                                value={data.normalOccupancy || ""}
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
                                    setCategoryModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[180px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : categoryModal?.isEdit ? (
                                    "Update "
                                ) : (
                                    "Add "
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
