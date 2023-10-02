import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import axios from "../../axios";
import { useHandleClickOutside } from "../../hooks";
import { BtnLoader } from "../../components";

export default function QuotationConfirmModal({
    amendment,
    setQuotation,
    index,
    setIsModal,
}) {
    const [data, setData] = useState({
        comments: "",
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
                `/quotations/confirm/${amendment._id}`,
                {
                    comments: data.comments,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setQuotation((prev) => {
                return {
                    ...prev,
                    confirmedAmendment: amendment._id,
                    status: "confirmed",
                };
            });
            setIsLoading(false);
            setIsModal(false);
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
                    <h2 className="font-medium mb-2">Confirm Modal </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="">
                            <label htmlFor="">Comments *</label>
                            <textarea
                                type="text"
                                value={data.comments || ""}
                                name="comments"
                                onChange={handleChange}
                                placeholder="Enter Comments"
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
                            <button className="w-[160px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : (
                                    "Confirm Quotation"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
