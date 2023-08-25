import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { useHandleClickOutside, useImageChange } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import {
    addDestination,
    updateDestination,
} from "../../../redux/slices/generalSlice";
import { config } from "../../../constants";

export default function AddDestinationModal({
    destinationModal,
    setDestinationModal,
    selectedDestination,
}) {
    const [data, setData] = useState({
        name: (destinationModal?.isEdit && selectedDestination?.name) || "",
        country:
            (destinationModal?.isEdit && selectedDestination?.country?._id) ||
            "",
        imageUrl:
            (destinationModal?.isEdit && selectedDestination?.image) || "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const { countries } = useSelector((state) => state.general);
    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();
    const dispatch = useDispatch();
    useHandleClickOutside(wrapperRef, () =>
        setDestinationModal({ isEdit: false, isOpen: false })
    );
    const { image, handleImageChange, error: imageError } = useImageChange();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("image", image);
            formData.append("name", data.name);
            formData.append("country", data.country);

            if (destinationModal?.isEdit) {
                const response = await axios.patch(
                    `/destinations/update/${selectedDestination?._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                dispatch(updateDestination(response?.data));
            } else {
                const response = await axios.post(
                    "/destinations/add",
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                dispatch(addDestination(response?.data));
            }
            setIsLoading(false);
            setDestinationModal({ isOpen: false, isEdit: false });
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
                    <h2 className="font-medium mb-2">
                        {destinationModal?.isEdit
                            ? "Update Destination"
                            : "Add Destination"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setDestinationModal({
                                isOpen: false,
                                isEdit: false,
                            })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <form className="p-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={data.name || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Image</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            required={destinationModal?.isEdit === false}
                        />
                        {imageError && (
                            <span className="text-sm block text-red-500 mt-2">
                                {imageError}
                            </span>
                        )}
                        {(image || destinationModal?.isEdit) && (
                            <div className="w-[130px] max-h-[80px] rounded overflow-hidden mt-2">
                                <img
                                    src={
                                        image
                                            ? URL.createObjectURL(image)
                                            : config.SERVER_URL +
                                              data?.imageUrl
                                    }
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Country</label>
                        <select
                            name="country"
                            value={data?.country || ""}
                            onChange={handleChange}
                            required
                            className="capitalize"
                        >
                            <option value="" hidden>
                                Select Country
                            </option>
                            {countries?.map((country, index) => {
                                return (
                                    <option
                                        value={country?._id}
                                        key={index}
                                        className="capitalize"
                                    >
                                        {country?.countryName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    {error && (
                        <span className="block mt-2 text-sm text-red-500">
                            {error}
                        </span>
                    )}
                    <div className="flex items-center justify-end mt-5">
                        <button className="w-[160px]" disabled={isLoading}>
                            {isLoading ? (
                                <BtnLoader />
                            ) : destinationModal?.isEdit ? (
                                "Update Destination"
                            ) : (
                                "Add Destination"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
