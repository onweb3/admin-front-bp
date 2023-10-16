import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";

export default function AddAccountModal({ data, setData, setIsModal }) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        accountName: "",
        date: "",
        openingBalance: "",
        description: "",
        accountNumber: "",
        currency: "",
    });

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => {
        setIsModal(false);
    });
    const { id, marketId, profileId } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const response = await axios.post(
            `/transactions/add-account`,
            formData,
            {
                headers: { authorization: `Bearer ${jwtToken}` },
            }
        );

        console.log(response.data.newAccount);

        setData((prevData) => {
            console.log("Previous Data:", prevData); // Add this line to console.log prevData
            return [
                ...prevData,
                {
                    ...response?.data?.newAccount,
                },
            ];
        });

        setIsLoading(false);

        setIsModal(false);
    };

    console.log(data, "dattttaddad");

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-40 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2"> Add New Account </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <div className="mt-4">
                        <label htmlFor="">Account Name *</label>
                        <input
                            type="accountName"
                            placeholder="Enter Account Name"
                            name="accountName"
                            onChange={handleChange}
                            value={formData.accountName || ""}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Opening Date *</label>
                        <input
                            type="date"
                            placeholder="Enter Date"
                            name="date"
                            onChange={handleChange}
                            value={formData.date || ""}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Account Number *</label>
                        <input
                            type="number"
                            placeholder="Enter Account Number"
                            name="accountNumber"
                            onChange={handleChange}
                            value={formData.accountNumber || ""}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Opening Balance *</label>
                        <input
                            type="number"
                            placeholder="Enter Opening Balance"
                            name="openingBalance"
                            onChange={handleChange}
                            value={formData.openingBalance || ""}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="">Currency</label>
                        <select
                            name="currency"
                            value={formData.currency || ""}
                            onChange={handleChange}
                            id=""
                            required
                            className="capitalize"
                        >
                            <option value="" hidden>
                                Select Type
                            </option>

                            <option value="aed">AED</option>
                            <option value="usd">USD</option>
                        </select>
                    </div>{" "}
                    <div className="mt-4">
                        <label htmlFor="">Description *</label>
                        <input
                            type="text"
                            placeholder="Enter Description"
                            name="description"
                            onChange={handleChange}
                            value={formData.description || ""}
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
                            onClick={() => setIsModal(false)}
                        >
                            Cancel
                        </button>
                        <button className="w-[160px]" onClick={handleSubmit}>
                            {isLoading ? <BtnLoader /> : "Add Markup"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
