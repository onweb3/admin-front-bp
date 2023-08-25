import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";

export default function AddCreditModal({
    setIsAddCreditModalOpen,
    data,
    setData,
}) {
    const [formData, setFormData] = useState({
        creditAmount: data?.creditAmount || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => {
        setIsAddCreditModalOpen(false);
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

            const response = await axios.patch(
                "/wallets/b2b/upsert/credit",
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
                    creditAmount: response.data?.creditAmount,
                };
            });

            setIsLoading(false);
            setIsAddCreditModalOpen(false);
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
                    <h2 className="font-medium mb-2">Update Credit</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsAddCreditModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        {/* <div className="mt-4">
                            <label htmlFor="">Credit Used</label>
                            <p>{formData.creditUsed || 0}</p>
                        </div> */}
                        <div className="">
                            <label htmlFor="">Amount *</label>
                            <input
                                type="number"
                                placeholder="Enter amount"
                                name="creditAmount"
                                onChange={handleChange}
                                value={formData?.creditAmount || ""}
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
                                onClick={() => setIsAddCreditModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="w-[160px]">
                                {isLoading ? <BtnLoader /> : "Update Credit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
