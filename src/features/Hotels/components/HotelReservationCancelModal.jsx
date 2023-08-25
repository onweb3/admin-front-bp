import React, { useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";

function HotelReservationCancelModal({
    setIsCancelModal,
    orderId,
    setOrderData,
    netPrice,
}) {
    const [data, setData] = useState({
        cancellationCharge: netPrice || "",
        cancellationRemark: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsCancelModal(false));
    const { jwtToken } = useSelector((state) => state.admin);

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
                `/hotels/orders/b2b/cancel/${orderId}`,
                data,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setOrderData((prev) => {
                return {
                    ...prev,
                    status: "cancelled",
                    lastStatusChange: response?.data?.lastStatusChange,
                    cancellationCharge: response?.data?.cancellationCharge,
                    cancellationRemark: response?.data?.cancellationRemark,
                    cancelledBy: response?.data?.cancelledBy,
                };
            });
            setIsLoading(false);
            setIsCancelModal(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, try again"
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
                    <h2 className="font-medium mb-2">Cancel Reservation</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsCancelModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Cancellation Charge *</label>
                            <input
                                type="number"
                                placeholder="0"
                                name="cancellationCharge"
                                value={data.cancellationCharge || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="">Cancellation Remark</label>
                            <textarea
                                placeholder="Enter cancellation remark"
                                name="cancellationRemark"
                                value={data.cancellationRemark || ""}
                                onChange={handleChange}
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
                                onClick={() => setIsCancelModal(false)}
                            >
                                Cancel
                            </button>
                            <button className="w-[140px]">
                                {isLoading ? <BtnLoader /> : "Cancel Order"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default HotelReservationCancelModal;
