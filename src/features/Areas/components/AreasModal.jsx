import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";

export default function AreasModal({
    areasModal,
    setAreasModal,
    selectedArea,
    addNewArea,
    updateAreaInfo,
}) {
    const [data, setData] = useState({
        areaCode: (areasModal?.isEdit && selectedArea?.areaCode) || "",
        areaName: (areasModal?.isEdit && selectedArea?.areaName) || "",
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
        setAreasModal({ isEdit: false, isOpen: false })
    );
    const { countryId, stateId, cityId } = useParams();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            if (areasModal?.isEdit) {
                const response = await axios.patch(
                    `/areas/update/${selectedArea?._id}`,
                    {
                        ...data,
                        country: countryId,
                        state: stateId,
                        city: cityId,
                    },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                updateAreaInfo(response?.data);
            } else {
                const response = await axios.post(
                    "/areas/add",
                    {
                        ...data,
                        country: countryId,
                        state: stateId,
                        city: cityId,
                    },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                addNewArea(response?.data);
            }
            setIsLoading(false);
            setAreasModal({ isOpen: false, isEdit: false });
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
                        {areasModal?.isEdit ? "Update Area" : "Add Area"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setAreasModal({
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
                        <label htmlFor="">Area Name *</label>
                        <input
                            type="text"
                            name="areaName"
                            value={data.areaName || ""}
                            onChange={handleChange}
                            placeholder="Ex: Downtown Dubai"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Area Code *</label>
                        <input
                            type="text"
                            name="areaCode"
                            value={data.areaCode || ""}
                            onChange={handleChange}
                            placeholder="Ex: DTD"
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
                            ) : areasModal?.isEdit ? (
                                "Update Area"
                            ) : (
                                "Add Area"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
