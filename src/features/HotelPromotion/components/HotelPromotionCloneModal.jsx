import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import axios from "../../../axios";
import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";

export default function HotelPromotionCloneModal({
    setIsPromotionCloneModalOpen,
    promotionId,
    addNewPromotion,
}) {
    const [data, setData] = useState({
        promotionName: "",
        promotionCode: "",
        priority: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsPromotionCloneModalOpen(false));

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

            const response = await axios.post(
                `/hotels/promotions/clone`,
                { ...data, promotionId },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            addNewPromotion(response.data);
            setIsLoading(false);
            setIsPromotionCloneModalOpen(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "something went wrong, try again"
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
                    <h2 className="font-medium mb-2">Clone Hotel Promotion</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsPromotionCloneModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Promotion Name</label>
                            <input
                                type="text"
                                placeholder="Enter promotion name"
                                name="promotionName"
                                value={data.promotionName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Promotion Code</label>
                            <input
                                type="text"
                                placeholder="Ex: EXP001"
                                name="promotionCode"
                                value={data.promotionCode || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Priority</label>
                            <input
                                type="number"
                                placeholder="0"
                                name="priority"
                                value={data.priority || ""}
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
                                    setIsPromotionCloneModalOpen(false)
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[150px]">
                                {isLoading ? <BtnLoader /> : "Clone Promotion"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
