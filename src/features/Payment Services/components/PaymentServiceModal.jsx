import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";

export default function PaymentServiceModal({
    paymentServiceModal,
    setPaymentServiceModal,
    selectedPaymentService,
    paymentServices,
    setPaymentServices,
}) {
    const [data, setData] = useState({
        name:
            (paymentServiceModal?.isEdit && selectedPaymentService?.name) || "",
        paymentProcessor:
            (paymentServiceModal?.isEdit &&
                selectedPaymentService?.paymentProcessor) ||
            "",
        clientId:
            (paymentServiceModal?.isEdit && selectedPaymentService?.clientId) ||
            "",
        clientSecret:
            (paymentServiceModal?.isEdit &&
                selectedPaymentService?.clientSecret) ||
            "",
        processingFee:
            (paymentServiceModal?.isEdit &&
                selectedPaymentService?.processingFee) ||
            "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setPaymentServiceModal({ isEdit: false, isOpen: false })
    );

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            if (paymentServiceModal?.isEdit) {
                const response = await axios.patch(
                    `/payment-services/update/${selectedPaymentService?._id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                let tempPaymentServices = paymentServices;
                const objIndex = paymentServices?.findIndex(
                    (paymentService) => {
                        return paymentService?._id === response.data?._id;
                    }
                );

                tempPaymentServices[objIndex] = response.data;
                setPaymentServices(tempPaymentServices);
            } else {
                const response = await axios.post(
                    "/payment-services/add",
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                setPaymentServices((prev) => {
                    return [response.data, ...prev];
                });
            }
            setIsLoading(false);
            setPaymentServiceModal({ isOpen: false, isEdit: false });
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
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">
                        {paymentServiceModal?.isEdit
                            ? "Update Payment Service"
                            : "Add Payment Service"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setPaymentServiceModal({
                                isOpen: false,
                                isEdit: false,
                            })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <form className="p-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="">Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={data.name || ""}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Paypal"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Proccessor *</label>
                        <select
                            name="paymentProcessor"
                            id=""
                            value={data.paymentProcessor || ""}
                            onChange={handleChange}
                        >
                            <option value="" hidden>
                                Select Payment Processor
                            </option>
                            <option value="paypal">Paypal</option>
                            <option value="razorpay">Razorpay</option>
                            <option value="stripe">Stripe</option>
                        </select>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Client Id *</label>
                        <input
                            type="text"
                            name="clientId"
                            value={data.clientId || ""}
                            onChange={handleChange}
                            required
                            placeholder="Enter client id"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Client Secret *</label>
                        <input
                            type="text"
                            name="clientSecret"
                            value={data.clientSecret || ""}
                            onChange={handleChange}
                            required
                            placeholder="Enter client secret"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Proccessing Fee *</label>
                        <input
                            type="text"
                            name="processingFee"
                            value={data.processingFee || ""}
                            onChange={handleChange}
                            required
                            placeholder="Enter processing fee"
                        />
                    </div>
                    {error && (
                        <span className="block mt-2 text-sm text-red-500">
                            {error}
                        </span>
                    )}
                    <div className="flex items-center justify-end mt-5">
                        <button className="w-[200px]" disabled={isLoading}>
                            {isLoading ? (
                                <BtnLoader />
                            ) : paymentServiceModal?.isEdit ? (
                                "Update Payment Service"
                            ) : (
                                "Add Payment Service"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
