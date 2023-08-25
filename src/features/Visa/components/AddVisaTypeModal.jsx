import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader, MultipleSelectDropdown } from "../../../components";

export default function AddVisaTypeModal({
    nationalityModal,
    setNationalityModal,
    selectedVisaType,
    visaTypes,
    setVisaTypes,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [visas, setVisas] = useState([]);

    const [data, setData] = useState({
        visaId: selectedVisaType?.visaId || "",
        visaName: selectedVisaType?.visaName || "",
        adultCost: selectedVisaType?.adultCost || "",
        adultPrice: selectedVisaType?.adultPrice || "",
        childCost: selectedVisaType?.childCost || "",
        childPrice: selectedVisaType?.childPrice || "",
    });

    const fetchVisaTypes = async () => {
        try {
            setError("");

            const response = await axios.get(
                `/visa/nationality/visa-type/list`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setVisas(response.data.visas);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
        }
    };

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setNationalityModal({ isEdit: false, isOpen: false })
    );
    const { id } = useParams();

    const handleSubmit = async (e, terminalId) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const { adultPrice, childPrice, adultCost, childCost, visaId } =
                data;

            const response = await axios.patch(
                `/visa/nationality/update`,
                {
                    adultPrice,
                    childPrice,
                    adultCost,
                    childCost,
                    visaType: visaId,
                    nationality: id,
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setVisaTypes((prev) => {
                const updatedVisaTypes = [...prev]; // Create a copy of the previous state array

                let selectedVisaIndex = visaTypes.findIndex((visa) => {
                    return visa?.visaId.toString() === data.visaId.toString();
                });

                if (selectedVisaIndex !== -1) {
                    updatedVisaTypes[selectedVisaIndex] = {
                        ...updatedVisaTypes[selectedVisaIndex],
                        adultPrice,
                        childPrice,
                        adultCost,
                        childCost,
                    };
                } else {
                    let selectedVisa = visas.find((visa) => {
                        return visa._id.toString() === data.visaId.toString();
                    });

                    updatedVisaTypes.push({
                        visaId: selectedVisa?._id,
                        visaName: selectedVisa?.visaName,
                        country: selectedVisa?.visa?.name,
                        adultPrice,
                        childPrice,
                        adultCost,
                        childCost,
                    });
                }

                return updatedVisaTypes;
            });

            setIsLoading(false);
            setNationalityModal({ isOpen: false, isEdit: false });
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVisaTypes();
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">
                        {nationalityModal?.isEdit
                            ? "Update VisaType"
                            : "Add VisaType"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setNationalityModal({
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
                        <div>
                            <label htmlFor="">Visa Types *</label>
                            <select
                                name="visaId"
                                value={data.visaId || ""}
                                onChange={handleChange}
                            >
                                <option hidden>Select Visa</option>
                                {visas?.map((visa, index) => {
                                    return (
                                        <option value={visa?._id} key={index}>
                                            {visa?.visaName} -{" "}
                                            {visa?.visa?.name}
                                        </option>
                                    );
                                })}{" "}
                            </select>
                            <div className="mt-4">
                                <label htmlFor="">B2c Adult Price *</label>
                                <input
                                    type="number"
                                    value={data.adultPrice || ""}
                                    name="adultPrice"
                                    onChange={handleChange}
                                    placeholder="Enter Adult Price"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="">B2c Child Price *</label>
                                <input
                                    type="number"
                                    value={data.childPrice || ""}
                                    name="childPrice"
                                    onChange={handleChange}
                                    placeholder="Enter Child Price"
                                    required
                                />
                            </div>{" "}
                            <div className="mt-4">
                                <label htmlFor="">B2c Adult Cost</label>
                                <input
                                    type="number"
                                    value={data.adultCost || ""}
                                    name="adultCost"
                                    onChange={handleChange}
                                    placeholder="Enter Adult Cost"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="">B2C Child Cost *</label>
                                <input
                                    type="number"
                                    value={data.childCost || ""}
                                    name="childCost"
                                    onChange={handleChange}
                                    placeholder="Enter Child Cost"
                                    required
                                />
                            </div>
                        </div>
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
                            ) : nationalityModal?.isEdit ? (
                                "Update"
                            ) : (
                                "Add"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
