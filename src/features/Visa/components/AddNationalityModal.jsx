import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader, MultipleSelectDropdown } from "../../../components";

export default function AddNationalityModal({
    nationalityModal,
    setNationalityModal,
    selectedNationality,
    nationalities,
    setNationalities,
    fetchNationality,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [data, setData] = useState({
        nationality: selectedNationality?.nationality?._id || "",
    });

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

    const { countries } = useSelector((state) => state.general);

    const handleAccessChange = (selectedData) => {
        setData((prev) => {
            return { ...prev, selectedCountries: selectedData };
        });
    };

    const handleSubmit = async (e, terminalId) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const response = await axios.post(
                `/visa/nationality/add`,
                {
                    nationality: data.nationality,
                    requestedBy: "b2c",
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );


            setNationalities((prev) => {
                const updatedNationalities = [...prev]; // Create a copy of the previous state array

                let selectedCountry = countries.find((country) => {
                    return (
                        country._id.toString() === data.nationality.toString()
                    );
                });


                updatedNationalities.push({
                    _id: response?.data?._id,
                    nationality: selectedCountry,
                });

                return updatedNationalities;
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

    console.log(selectedNationality, "selectedNationality");

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">
                        {nationalityModal?.isEdit
                            ? "Update Nationality"
                            : "Add Nationality"}
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
                            <label htmlFor="">Country *</label>
                            <select
                                name="nationality"
                                value={data.nationality || ""}
                                onChange={handleChange}
                            >
                                <option hidden>Select Country</option>
                                {countries?.map((countries, index) => {
                                    return (
                                        <option
                                            value={countries?._id}
                                            key={index}
                                        >
                                            {countries?.countryName}
                                        </option>
                                    );
                                })}{" "}
                            </select>
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
                                "Update Nationality"
                            ) : (
                                "Add Nationality"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
