import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";

export default function EmailModal({
    emailsModal,
    setEmailsModal,
    selectedEmail,
    emails,
    setEmails,
}) {
    const [data, setData] = useState({
        email: (emailsModal?.isEdit && selectedEmail?.email) || "",
        emailType: (emailsModal?.isEdit && selectedEmail?.emailType) || "",
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
        setEmailsModal({ isEdit: false, isOpen: false })
    );

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            if (emailsModal?.isEdit) {
                const response = await axios.patch(
                    `/emails/update/${selectedEmail?._id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                let tempEmails = emails;
                const objIndex = emails?.findIndex((emailSetting) => {
                    return emailSetting?._id === response.data?._id;
                });

                tempEmails[objIndex] = response.data;
                setEmails(tempEmails);
            } else {
                const response = await axios.post("/emails/add", data, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setEmails((prev) => {
                    return [response.data, ...prev];
                });
            }
            setIsLoading(false);
            setEmailsModal({ isOpen: false, isEdit: false });
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
                        {emailsModal?.isEdit ? "Update Email" : "Add Email"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setEmailsModal({
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
                        <label htmlFor="">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={data.email || ""}
                            onChange={handleChange}
                            required
                            placeholder="Ex: support@compnayname.com"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Email Type *</label>
                        <select
                            name="emailType"
                            value={data.emailType || ""}
                            onChange={handleChange}
                            id=""
                        >
                            <option value="" hidden>Select Email Type</option>
                            <option value="support">Support</option>
                            <option value="promotion">Promotion</option>
                        </select>
                    </div>
                    {error && (
                        <span className="block mt-2 text-sm text-red-500">
                            {error}
                        </span>
                    )}
                    <div className="flex items-center justify-end mt-5">
                        <button className="w-[180px]" disabled={isLoading}>
                            {isLoading ? (
                                <BtnLoader />
                            ) : emailsModal?.isEdit ? (
                                "Update Email"
                            ) : (
                                "Add Email"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
