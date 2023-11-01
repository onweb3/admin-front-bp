import React, { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "../../../axios";
import { BtnLoader, SelectDropdown } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";

export default function AddMoneyModal({ setIsAddMoneyModalOpen, setData }) {
    const [formData, setFormData] = useState({
        amount: "",
        referenceNo: "",
        paymentProcessor: "",
        companyBankId: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [banks, setBanks] = useState([]);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => {
        setIsAddMoneyModalOpen(false);
    });
    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            const response = await axios.post(
                "/wallets/b2b/add-money",
                {
                    resellerId: id,
                    ...formData,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setData((prev) => {
                return {
                    ...prev,
                    balance: response?.data?.balance,
                    creditAmount: response?.data?.creditAmount,
                    creditUsed: response?.data?.creditUsed,
                };
            });

            setIsLoading(false);
            setIsAddMoneyModalOpen(false);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchBankNames = async () => {
            try {
                const response = await axios.get("/company/bank-info/all/names", {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setBanks(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchBankNames();
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Add Money</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsAddMoneyModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Payment Processor *</label>
                            <select
                                name="paymentProcessor"
                                value={formData?.paymentProcessor || ""}
                                onChange={handleChange}
                                id=""
                            >
                                <option value="" hidden>
                                    Select Payment Processor
                                </option>
                                <option value="bank">Bank</option>
                                <option value="cash-in-hand">Cash In Hand</option>
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Amount *</label>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                name="amount"
                                onChange={handleChange}
                                value={formData.amount || ""}
                                required
                            />
                        </div>
                        {formData.paymentProcessor === "bank" && (
                            <>
                                <div className="mt-4">
                                    <label htmlFor="">Bank Name *</label>
                                    <SelectDropdown
                                        data={banks}
                                        placeholder="Select Bank"
                                        displayName={"bankName"}
                                        valueName="_id"
                                        selectedData={formData.companyBankId}
                                        setSelectedData={(val) => {
                                            setFormData((prev) => {
                                                return { ...prev, companyBankId: val };
                                            });
                                        }}
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="">Reference No *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter reference number"
                                        name="referenceNo"
                                        value={formData.referenceNo || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => setIsAddMoneyModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="w-[160px]">
                                {isLoading ? <BtnLoader /> : "Add Money"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
