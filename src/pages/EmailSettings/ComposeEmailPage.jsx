import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { BtnLoader, PageLoader, RichTextEditor } from "../../components";

export default function ComposeEmailPage() {
    const [data, setData] = useState({
        emailType: "",
        subject: "",
        html: "",
        sendTo: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [emailSettings, setEmailSettings] = useState([]);

    const navigate = useNavigate();
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

            await axios.post("/email-settings/send", data, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate(-1);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchEmailSettings = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get("/email-settings/all", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setEmailSettings(response.data);
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEmailSettings();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Compose Email
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email-settings" className="text-textColor">
                        Email Settings{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Compose </span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        <form action="" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="">Email Type *</label>
                                <select
                                    name="emailType"
                                    value={data.emailType || ""}
                                    onChange={handleChange}
                                    id=""
                                    required
                                >
                                    <option value="" hidden>
                                        Select Email Type
                                    </option>
                                    {emailSettings?.map(
                                        (emailSetting, index) => {
                                            return (
                                                <option
                                                    value={emailSetting?.emailType}
                                                    key={index}
                                                    className="capitalize"
                                                >
                                                    {emailSetting?.emailType}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="">Send To *</label>
                                <select
                                    name="sendTo"
                                    value={data.sendTo || ""}
                                    onChange={handleChange}
                                    id=""
                                    required
                                >
                                    <option value="" hidden>
                                        Select Email Type
                                    </option>
                                    <option value="subscribers">Subscribers</option>
                                    <option value="b2c">B2C</option>
                                    <option value="b2b">B2B</option>
                                </select>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="">Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={data.subject || ""}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter subject"
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="">Body *</label>
                                <RichTextEditor
                                    initialValue={data.html || ""}
                                    getValue={(value) =>
                                        setData((prev) => {
                                            return { ...prev, html: value };
                                        })
                                    }
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
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>
                                <button className="w-[160px]">
                                    {isLoading ? (
                                        <BtnLoader />
                                    ) : (
                                        "Compose Email"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
