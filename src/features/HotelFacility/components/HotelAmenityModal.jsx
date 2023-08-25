import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { BtnLoader } from "../../../components";
import { useHandleClickOutside, useImageChange } from "../../../hooks";
import axios from "../../../axios";
import { config } from "../../../constants";

export default function HotelAmenityModal({
    hotelAmenityModal,
    setHotelAmenityModal,
    selectedHotelAmenity,
    addHotelAmenity,
    updateHotelAmenity,
    subAmenity,
}) {
    const [data, setData] = useState({
        name: (hotelAmenityModal?.isEdit && selectedHotelAmenity?.name) || "",
        iconUrl:
            (hotelAmenityModal?.isEdit && selectedHotelAmenity?.icon) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams();
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setHotelAmenityModal({ isEdit: false, isOpen: false })
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
            formData.append("name", data.name);
            formData.append("icon", iconImg);

            let rUrl;
            if (subAmenity) {
                formData.append("parent", id);
                rUrl = `/hotels/amenities`;
            } else {
                rUrl = `/hotels/amenities/groups`;
            }

            if (hotelAmenityModal?.isEdit) {
                const response = await axios.patch(
                    `${rUrl}/update/${selectedHotelAmenity?._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateHotelAmenity(response.data);
            } else {
                const response = await axios.post(`${rUrl}/add`, formData, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                addHotelAmenity(response.data);
            }
            setHotelAmenityModal({ isOpen: false, isEdit: false });
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
                        {hotelAmenityModal?.isEdit
                            ? "Update Amenity"
                            : "Add Amenity"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setHotelAmenityModal({
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
                            <label htmlFor="">Category Name *</label>
                            <input
                                type="text"
                                placeholder="Ex: Free Wifi"
                                name="name"
                                value={data.name || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Icon</label>
                            <input type="file" onChange={handleIconImgChange} />
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
                                    setHotelAmenityModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[150px]" disabled={isLoading}>
                                {isLoading ? (
                                    <BtnLoader />
                                ) : hotelAmenityModal?.isEdit ? (
                                    "Update Amenity"
                                ) : (
                                    "Add Amenity"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
