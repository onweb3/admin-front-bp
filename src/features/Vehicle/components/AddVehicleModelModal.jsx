import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside, useImageChange } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";
import { config } from "../../../constants";

export default function AddVehicleModelModal({
    vehicleModelModal,
    setVehicleModelModal,
    selectedVehicleModel,
    addVehicleModel,
    updateVehicleModel,
    bodyTypes,
}) {
    const [data, setData] = useState({
        modelName: (vehicleModelModal?.isEdit && selectedVehicleModel?.modelName) || "",
        bodyType: (vehicleModelModal?.isEdit && selectedVehicleModel?.bodyType?._id) || "",
        vehicleImage: (vehicleModelModal?.isEdit && selectedVehicleModel?.vehicleImage) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setVehicleModelModal({ isEdit: false, isOpen: false }));
    const { jwtToken } = useSelector((state) => state.admin);
    const {
        image: vehicleImage,
        handleImageChange: handleVehicleImgChange,
        error: vehicleImgError,
    } = useImageChange();
    const { makeId } = useParams();

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
            formData.append("modelName", data.modelName);
            formData.append("vehicleMake", makeId);
            formData.append("bodyType", data.bodyType);
            if (vehicleImage) {
                formData.append("vehicleImage", vehicleImage);
            }

            if (vehicleModelModal?.isEdit) {
                const response = await axios.patch(
                    `/transfers/vehicles/models/update/${selectedVehicleModel?._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateVehicleModel(response.data);
            } else {
                const response = await axios.post("/transfers/vehicles/models/add", formData, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                addVehicleModel(response.data);
            }
            setVehicleModelModal({ isOpen: false, isEdit: false });
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
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
                        {vehicleModelModal?.isEdit ? "Update Vehicle Model" : "Add Vehicle Model"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setVehicleModelModal({ isOpen: false, isEdit: false })}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Model Name *</label>
                            <input
                                type="text"
                                placeholder="Enter Model Name"
                                name="modelName"
                                value={data.modelName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Body Type *</label>
                            <select
                                name="bodyType"
                                id=""
                                value={data.bodyType}
                                onChange={handleChange}
                            >
                                <option value="" hidden>
                                    Select Body Type
                                </option>
                                {bodyTypes?.map((item, index) => {
                                    return (
                                        <option value={item?._id} key={index}>
                                            {item?.bodyType}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Image *</label>
                            <input type="file" onChange={handleVehicleImgChange} />
                            {vehicleImgError && (
                                <span className="block text-sm mt-2 text-red-500">
                                    {vehicleImgError}
                                </span>
                            )}
                            {(vehicleImage || data.vehicleImage) && (
                                <div className="mt-2">
                                    <img
                                        src={
                                            vehicleImage
                                                ? URL.createObjectURL(vehicleImage)
                                                : config.SERVER_URL + data.vehicleImage
                                        }
                                        className="w-[100px] max-h-[100px]"
                                    />
                                </div>
                            )}
                        </div>
                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() =>
                                    setVehicleModelModal({
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
                                ) : vehicleModelModal?.isEdit ? (
                                    "Update Model"
                                ) : (
                                    "Add Model"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
