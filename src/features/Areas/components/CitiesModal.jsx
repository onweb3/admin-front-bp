import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";

export default function CitiesModal({
    citiesModal,
    setCitiesModal,
    selectedCity,
    addNewCity,
    updateCityInfo,
}) {
    const [data, setData] = useState({
        cityCode: (citiesModal?.isEdit && selectedCity?.cityCode) || "",
        cityName: (citiesModal?.isEdit && selectedCity?.cityName) || "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setCitiesModal({ isEdit: false, isOpen: false })
    );
    const { countryId, stateId } = useParams();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            if (citiesModal?.isEdit) {
                const response = await axios.patch(
                    `/cities/update/${selectedCity?._id}`,
                    { ...data, country: countryId, state: stateId },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                updateCityInfo(response?.data);
            } else {
                const response = await axios.post(
                    "/cities/add",
                    { ...data, country: countryId, state: stateId },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                addNewCity(response?.data);
            }
            setIsLoading(false);
            setCitiesModal({ isOpen: false, isEdit: false });
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
                        {citiesModal?.isEdit ? "Update City" : "Add City"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setCitiesModal({
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
                        <label htmlFor="">City Name *</label>
                        <input
                            type="text"
                            name="cityName"
                            value={data.cityName || ""}
                            onChange={handleChange}
                            placeholder="Ex: Dubai"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">City Code *</label>
                        <input
                            type="text"
                            name="cityCode"
                            value={data.cityCode || ""}
                            onChange={handleChange}
                            placeholder="Ex: DXB"
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
                            {isLoading ? (
                                <BtnLoader />
                            ) : citiesModal?.isEdit ? (
                                "Update City"
                            ) : (
                                "Add City"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
