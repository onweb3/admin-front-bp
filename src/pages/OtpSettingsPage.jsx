import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";
import { useSelector } from "react-redux";
import { BtnLoader, PageLoader } from "../components";

export default function OtpSettingsPage() {
    const [data, setData] = useState({
        twilioSID: "",
        twilioAuthToken: "",
    });
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchOtpSettings = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get("/otp-settings", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setData((prev) => {
                return {
                    ...prev,
                    twilioSID: response.data?.twilioSID,
                    twilioAuthToken: response?.data?.twilioAuthToken,
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.patch("/otp-settings/update", data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setIsLoading(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
        }
    };

    useEffect(() => {
        fetchOtpSettings();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    OTP Settings
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>OTP Settings </span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="p-4 bg-white rounded shadow-sm">
                        <form action="" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="">Twilio Account SID *</label>
                                <input
                                    type="text"
                                    name="twilioSID"
                                    value={data.twilioSID || ""}
                                    onChange={handleChange}
                                    placeholder="Enter twilio account sid"
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="">Twilio Auth Token *</label>
                                <input
                                    type="text"
                                    name="twilioAuthToken"
                                    value={data.twilioAuthToken || ""}
                                    onChange={handleChange}
                                    placeholder="Enter twilio auth token"
                                />
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
