import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";

export default function EmailServicesModal({
    emailServicesModal,
    setEmailServicesModal,
    selectedEmailService,
    emailServices,
    setEmailServices,
}) {
    const [data, setData] = useState({
        serviceProvider:
            (emailServicesModal?.isEdit &&
                selectedEmailService?.serviceProvider) ||
            "",
        apiKey:
            (emailServicesModal?.isEdit && selectedEmailService?.apiKey) || "",
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
        setEmailServicesModal({ isEdit: false, isOpen: false })
    );

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            if (emailServicesModal?.isEdit) {
                const response = await axios.patch(
                    `/email-services/update/${selectedEmailService?._id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                let tempEmailServices = emailServices;
                const objIndex = emailServices?.findIndex((emailService) => {
                    return emailService?._id === response.data?._id;
                });

                tempEmailServices[objIndex] = response.data;
                setEmailServices(tempEmailServices);
            } else {
                const response = await axios.post("/email-services/add", data, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setEmailServices((prev) => {
                    return [response.data, ...prev];
                });
            }
            setIsLoading(false);
            setEmailServicesModal({ isOpen: false, isEdit: false });
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
                        {emailServicesModal?.isEdit
                            ? "Update Email Service"
                            : "Add Email Service"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setEmailServicesModal({
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
                        <label htmlFor="">Service Provider *</label>
                        <select
                            name="serviceProvider"
                            value={data.serviceProvider || ""}
                            onChange={handleChange}
                            id=""
                        >
                            <option value="" hidden>
                                Select Service Provider
                            </option>
                            <option value="twilio">Twilio</option>
                        </select>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">API Key *</label>
                        <input
                            type="text"
                            name="apiKey"
                            value={data?.apiKey || ""}
                            onChange={handleChange}
                            required
                            placeholder="Enter API key"
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
                            ) : emailServicesModal?.isEdit ? (
                                "Update Email Service"
                            ) : (
                                "Add Email Service"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
