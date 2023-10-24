import React, { useState, useRef } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";

function HotelReservationConfirmModal({ setIsConfirmModal, orderId, setOrderData }) {
    const [data, setData] = useState({
        hotelBookingId: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsConfirmModal(false));
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

            const response = await axios.post(`/hotels/orders/b2b/confirm/${orderId}`, data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setOrderData((prev) => {
                return {
                    ...prev,
                    status: "confirmed",
                    hotelBookingId: response?.data?.hotelBookingId,
                };
            });
            setIsLoading(false);
            setIsConfirmModal(false);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, try again");
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
                    <h2 className="font-medium mb-2">Confirm Reservation</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsConfirmModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Booking Id</label>
                            <input
                                type="text"
                                placeholder="Enter booking id"
                                name="hotelBookingId"
                                value={data.hotelBookingId || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => setIsConfirmModal(false)}
                            >
                                Cancel
                            </button>
                            <button className="w-[140px]">
                                {isLoading ? <BtnLoader /> : "Confirm Order"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default HotelReservationConfirmModal;
