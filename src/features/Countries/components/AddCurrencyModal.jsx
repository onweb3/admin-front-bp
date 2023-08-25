import React, { useRef, useState } from "react";
import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { useDispatch, useSelector } from "react-redux";
import {
    addCurrency,
    updateCurrency,
} from "../../../redux/slices/generalSlice";
import { MdClose } from "react-icons/md";
import { BtnLoader } from "../../../components";

export default function AddCurrencyModal({
    currencyModal,
    setCurrencyModal,
    selectedCurrency,
}) {
    const [data, setData] = useState({
        country: (currencyModal?.isEdit && selectedCurrency?.country?._id) || "",
        currencyName:
            (currencyModal?.isEdit && selectedCurrency?.currencyName) || "",
        currencySymbol:
            (currencyModal?.isEdit && selectedCurrency?.currencySymbol) || "",
        isocode: (currencyModal?.isEdit && selectedCurrency?.isocode) || "",
        conversionRate:
            (currencyModal?.isEdit && selectedCurrency?.conversionRate) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setCurrencyModal({ isEdit: false, isOpen: false })
    );
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

            if (currencyModal?.isEdit) {
                const response = await axios.patch(
                    `/currencies/update/${selectedCurrency?._id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                dispatch(updateCurrency(response.data));
            } else {
                const response = await axios.post("/currencies/add", data, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                dispatch(addCurrency(response.data));
            }
            setCurrencyModal({ isOpen: false, isEdit: false });
        } catch (err) {
            console.log(err);
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
                        {currencyModal?.isEdit
                            ? "Update Cuurency"
                            : "Add Cuurency"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setCurrencyModal({ isOpen: false, isEdit: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Country *</label>
                            <select
                                name="country"
                                value={data.country || ""}
                                onChange={handleChange}
                                id=""
                                className="capitalize"
                                required
                            >
                                <option value="" hidden>
                                    Select Country
                                </option>
                                {countries?.map((country, index) => {
                                    return (
                                        <option
                                            value={country?._id}
                                            key={index}
                                        >
                                            {country?.countryName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Currency Name *</label>
                            <input
                                type="text"
                                id=""
                                placeholder="Ex: Ruppee"
                                name="currencyName"
                                value={data.currencyName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Currency Symbol *</label>
                            <input
                                type="text"
                                id=""
                                placeholder="Ex: ₹"
                                name="currencySymbol"
                                value={data.currencySymbol || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">ISO Code *</label>
                            <input
                                type="text"
                                id=""
                                placeholder="Ex: INR"
                                name="isocode"
                                value={data.isocode || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Conversion Rate (AED) *</label>
                            <input
                                type="number"
                                id=""
                                placeholder="Enter conversion rate"
                                name="conversionRate"
                                value={data.conversionRate || ""}
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
                                    setCurrencyModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[160px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : currencyModal?.isEdit ? (
                                    "Update Cuurency"
                                ) : (
                                    "Add Cuurency"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
