import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { MdClose } from "react-icons/md";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";

export default function HotelReservationCancelRequestStatusChangeModal({
    setIsCancelModalOpen,
    hotelOrder,
    setHotelOrder,
    netPrice,
    cancellationId,
    cancellationPolicies,
}) {
    const [data, setData] = useState({
        cancellationCharge: netPrice || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsCancelModalOpen(false));
    const { jwtToken } = useSelector((state) => state.admin);

    // const handleChange = (e) => {
    //     setData((prev) => {
    //         return { ...prev, [e.target.name]: e.target.value };
    //     });
    // };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const response = await axios.post(
                `/hotels/orders/b2b/cancel-request/approve/${cancellationId}`,
                data,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            let tempCancellations = hotelOrder?.cancellations;
            const objIndex = tempCancellations?.findIndex((item) => {
                return item?._id === cancellationId;
            });
            tempCancellations[objIndex] = response.data?.orderCancellation;

            setHotelOrder((prev) => {
                return {
                    ...prev,
                    status: response.data.status,
                    cancellations: tempCancellations,
                };
            });
            setIsLoading(false);
            setIsCancelModalOpen(false);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, try again");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (cancellationPolicies?.length > 0) {
            for (let i = 0; i < cancellationPolicies?.length; i++) {
                const policy = cancellationPolicies[i];
                if (new Date(policy?.from) <= new Date()) {
                    setData((prev) => {
                        return { ...prev, cancellationCharge: policy?.amount };
                    });
                    break;
                }

                if (i === cancellationPolicies?.length - 1) {
                    setData((prev) => {
                        return { ...prev, cancellationCharge: 0 };
                    });
                }
            }
        }
    }, [cancellationPolicies]);

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
                        onClick={() => setIsCancelModalOpen(false)}
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
                                onChange={(e) => {
                                    if (Number(e.target.value) > netPrice) {
                                        setData((prev) => {
                                            return { ...prev, cancellationCharge: netPrice };
                                        });
                                    } else {
                                        setData((prev) => {
                                            return { ...prev, cancellationCharge: e.target.value };
                                        });
                                    }
                                }}
                                required
                            />
                            <span className="block text-sm text-grayColor mt-2">
                                Cancellation amount will be deducted from the paid amount and the
                                balance{" "}
                                <span className="font-medium text-[#333]">
                                    {netPrice - Number(data.cancellationCharge)} AED
                                </span>{" "}
                                will be refunded to the wallet.
                            </span>
                        </div>

                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => setIsCancelModalOpen(false)}
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
