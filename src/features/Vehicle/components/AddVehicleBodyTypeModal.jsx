import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { useHandleClickOutside, useImageChange } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";
import { config } from "../../../constants";

export default function AddVehicleBodyTypeModal({
    vehicleBodyTypesModal,
    setVehicleBodyTypesModal,
    selectedVehicleBodyType,
    addVehicleBodyType,
    updateVehicleBodyType,
}) {
    const [data, setData] = useState({
        bodyType:
            (vehicleBodyTypesModal?.isEdit &&
                selectedVehicleBodyType?.bodyType) ||
            "",
        bodyImg:
            (vehicleBodyTypesModal?.isEdit &&
                selectedVehicleBodyType?.bodyImg) ||
            "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setVehicleBodyTypesModal({ isEdit: false, isOpen: false })
    );
    const { jwtToken } = useSelector((state) => state.admin);
    const {
        image: bodyImg,
        handleImageChange: handleBodyImgChange,
        error: bodyImgError,
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
            formData.append("bodyType", data.bodyType);
            if (bodyImg) {
                formData.append("bodyImg", bodyImg);
            }

            if (vehicleBodyTypesModal?.isEdit) {
                const response = await axios.patch(
                    `/transfers/vehicles/body-types/update/${selectedVehicleBodyType?._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateVehicleBodyType(response.data);
            } else {
                const response = await axios.post(
                    "/transfers/vehicles/body-types/add",
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                addVehicleBodyType(response.data);
            }
            setVehicleBodyTypesModal({ isOpen: false, isEdit: false });
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
                        {vehicleBodyTypesModal?.isEdit
                            ? "Update Vehicle Body Type"
                            : "Add Vehicle Body Type"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setVehicleBodyTypesModal({
                                isOpen: false,
                                isEdit: false,
                            })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Body Type *</label>
                            <input
                                type="text"
                                placeholder="Ex: Sedan"
                                name="bodyType"
                                value={data.bodyType || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Image *</label>
                            <input type="file" onChange={handleBodyImgChange} />
                            {bodyImgError && (
                                <span className="block text-sm mt-2 text-red-500">
                                    {bodyImgError}
                                </span>
                            )}
                            {(bodyImg || data.bodyImg) && (
                                <div className="mt-2">
                                    <img
                                        src={
                                            bodyImg
                                                ? URL.createObjectURL(bodyImg)
                                                : import.meta.env
                                                      .VITE_SERVER_URL +
                                                  data.bodyImg
                                        }
                                        className="w-[100px] max-h-[100px]"
                                    />
                                </div>
                            )}
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
                                    setVehicleBodyTypesModal({
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
                                ) : vehicleBodyTypesModal?.isEdit ? (
                                    "Update Body Type"
                                ) : (
                                    "Add Body Type"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
