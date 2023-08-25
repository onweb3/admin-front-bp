import React, { useRef, useState } from "react";
import { useHandleClickOutside } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import { MdClose } from "react-icons/md";
import { BtnLoader } from "../../../components";
import { addCountry, updateCountry } from "../../../redux/slices/generalSlice";

export default function AddCountryModal({
    countryModal,
    setCountryModal,
    selectedCountry,
}) {
    const [data, setData] = useState({
        countryName:
            (countryModal?.isEdit && selectedCountry?.countryName) || "",
        isocode: (countryModal?.isEdit && selectedCountry?.isocode) || "",
        phonecode: (countryModal?.isEdit && selectedCountry?.phonecode) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setCountryModal({ isEdit: false, isOpen: false })
    );
    const { jwtToken } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

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

            if (countryModal?.isEdit) {
                const response = await axios.patch(
                    `/countries/update/${selectedCountry?._id}`,
                    {
                        ...data,
                        flag: `https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/${data.isocode?.toLowerCase()}.svg`,
                    },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                dispatch(updateCountry(response.data));
            } else {
                const response = await axios.post(
                    "/countries/add",
                    {
                        ...data,
                        flag: `https://cdn.jsdelivr.net/npm/svg-country-flags@1.2.10/svg/${data.isocode?.toLowerCase()}.svg`,
                    },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                dispatch(addCountry(response.data));
            }
            setCountryModal({ isOpen: false, isEdit: false });
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
                        {countryModal?.isEdit
                            ? "Update Country"
                            : "Add Country"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setCountryModal({ isOpen: false, isEdit: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Country Name</label>
                            <input
                                type="text"
                                placeholder="Ex: India"
                                name="countryName"
                                value={data.countryName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">ISO Code</label>
                            <input
                                type="text"
                                id=""
                                placeholder="Ex: IN"
                                name="isocode"
                                value={data.isocode || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Phone Code</label>
                            <input
                                type="text"
                                id=""
                                placeholder="Ex: +91"
                                name="phonecode"
                                value={data.phonecode || ""}
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
                                    setCountryModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[140px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : countryModal?.isEdit ? (
                                    "Update Country"
                                ) : (
                                    "Add Country"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
