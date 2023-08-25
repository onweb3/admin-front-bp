import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";

export default function BookingConfirmationModal({
    setIsBookingConfirmationModalOpen,
    setOrderData,
    orderId,
    bookingId,
    orderedBy,
}) {
    const [data, setData] = useState({
        bookingConfirmationNumber: "",
        note:""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setIsBookingConfirmationModalOpen(false)
    );
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

            const response = await axios.patch(
                "/attractions/orders/bookings/confirm",
                {
                    orderId,
                    bookingId,
                    orderedBy,
                    ...data,
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setOrderData((prev) => {
                return {
                    ...prev,
                    status: "confirmed",
                    bookingConfirmationNumber:
                        response.data?.bookingConfirmationNumber,
                        note:
                        response.data?.note,
                };
            });
            setIsLoading(false);
            setIsBookingConfirmationModalOpen(false);
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
                    <h2 className="font-medium mb-2">Update Booking Status</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsBookingConfirmationModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">
                                Booking Confirmation Number
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Confimration Number"
                                name="bookingConfirmationNumber"
                                value={data.bookingConfirmationNumber || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="">
                                Note
                            </label>
                            <textarea
                                type="text"
                                placeholder="Enter Note Here .."
                                name="note"
                                value={data.note || ""}
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
                                onClick={() =>
                                    setIsBookingConfirmationModalOpen(false)
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[150px]">
                                {isLoading ? <BtnLoader /> : "Update Status"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
