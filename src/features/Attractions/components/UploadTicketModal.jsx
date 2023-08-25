import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { useCsvFileChange, useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useNavigate } from "react-router-dom";

export default function UploadTicketModal({
    setIsUploadTicketModalOpen,
    activityId,
    addTickets,
    isNavigation = false,
    attractionId,
    activityName,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();
    const navigate = useNavigate();
    useHandleClickOutside(wrapperRef, () => setIsUploadTicketModalOpen(false));
    const { file, error: fileError, handleCsvFileChange } = useCsvFileChange();

    const handleUploadTicket = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();

            formData.append("tickets", file);
            formData.append("activity", activityId);

            const response = await axios.post(
                "/attractions/tickets/upload",
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            if (isNavigation === false) {
                addTickets(response.data?.newTickets);
            } else {
                navigate(
                    `/attractions/${attractionId}/activities/${activityId}/tickets`
                );
            }

            if (response?.data?.status === "error") {
                setError(
                    response?.data?.message || "Something went wrong, Try again"
                );
            } else {
                setIsUploadTicketModalOpen(false);
            }

            setIsLoading(false);
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
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px] rounded shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">
                        Upload Ticket - {activityName}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsUploadTicketModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <form onSubmit={handleUploadTicket} className="p-4">
                    <label htmlFor="">CSV File</label>
                    <input
                        type="file"
                        onChange={handleCsvFileChange}
                        required
                    />
                    <span className="block mt-2 text-sm text-grayColor">
                        Please upload only csv file. You can{" "}
                        <a
                            href="https://drive.google.com/file/d/1Lo1q8cjsr2PlXQyMO09-1I_06uG3Couw/view?usp=share_link"
                            target="blank"
                            className="text-blue-500 font-medium cursor-pointer"
                        >
                            Download
                        </a>{" "}
                        file formate from here
                    </span>
                    {fileError && (
                        <span className="text-sm text-red-500 block mt-2">
                            {fileError}
                        </span>
                    )}

                    {error && (
                        <span className="text-sm text-red-500 block mt-2">
                            {error}
                        </span>
                    )}

                    <div className="flex items-center justify-end mt-5">
                        <button disabled={isLoading} className="w-[140px]">
                            {isLoading ? <BtnLoader /> : "Upload Ticket"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
