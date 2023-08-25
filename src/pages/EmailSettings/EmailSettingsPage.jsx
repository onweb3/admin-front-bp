import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { BtnLoader, PageLoader } from "../../components";

export default function EmailSettingsPage() {
    const [emailServices, setEmailServices] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [data, setData] = useState({
        emailService: "",
        sendOfferMails: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchEmailSettings = async () => {
        try {
            const response = await axios.get("/email-settings", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setData((prev) => {
                return {
                    ...prev,
                    emailService: response.data?.emailService,
                    sendOfferMails: response.data?.sendOfferMails,
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchEmailServices = async () => {
        try {
            const response = await axios.get("/email-services/all", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setEmailServices(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.patch(
                "/email-settings/update",
                {
                    emailService: data.emailService,
                    sendOfferMails: data.sendOfferMails,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmailSettings();
        fetchEmailServices();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Email Settings
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Email Settings </span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="p-4 bg-white rounded shadow-sm">
                        <form action="" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="">Email Service *</label>
                                <select
                                    name="emailService"
                                    value={data.emailService || ""}
                                    onChange={handleChange}
                                    id=""
                                    required
                                >
                                    <option value="" hidden>
                                        Select Email Service
                                    </option>
                                    {emailServices?.map(
                                        (emailService, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={emailService?._id}
                                                >
                                                    {
                                                        emailService?.serviceProvider
                                                    }
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            <div className="flex items-center gap-[10px] mt-4">
                                <input
                                    type="checkbox"
                                    name=""
                                    id=""
                                    className="w-[16px] h-[16px]"
                                    checked={data.sendOfferMails || false}
                                    onChange={(e) =>
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                sendOfferMails:
                                                    e.target.checked,
                                            };
                                        })
                                    }
                                />
                                <label htmlFor="" className="mb-0">
                                    Send Offer Updates
                                </label>
                            </div>
                            {error && (
                                <span className="text-sm text-red-500 block mt-3">
                                    {error}
                                </span>
                            )}
                            <div className="flex items-center justify-end mt-4">
                                <button className="w-[140px]">
                                    {isLoading ? <BtnLoader /> : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
