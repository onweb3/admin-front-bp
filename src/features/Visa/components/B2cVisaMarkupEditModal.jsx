import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import axios from "../../../axios";
import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";

export default function B2cVisaMarkupEditModal({
    setIsMarkupModalOpen,
    b2cmarkup,
    setB2cMarkup,
    visaList,
}) {
    const [data, setData] = useState({
        markup: b2cmarkup?.markup || "",
        markupType: b2cmarkup?.markupType || "percentage",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsMarkupModalOpen(false));
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            const response = await axios.patch(
                "/visa/markup/upsert",
                { ...data, visaType : visaList },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setB2cMarkup(response.data);
            setIsLoading(false);
            setIsMarkupModalOpen(false);
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
                    <h2 className="font-medium mb-2">Add B2C Markup</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsMarkupModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Markup Type *</label>
                            <select
                                name="markupType"
                                value={data.markupType || ""}
                                onChange={handleChange}
                                id=""
                                required
                            >
                                <option value="percentage">Percentage</option>
                                <option value="flat">Flat</option>
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Markup *</label>
                            <input
                                type="number"
                                value={data.markup || ""}
                                name="markup"
                                onChange={handleChange}
                                placeholder="Enter B2C Markup"
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
                                onClick={() => setIsMarkupModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button className="w-[160px]">
                                {isLoading ? <BtnLoader /> : "Add Markup"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
