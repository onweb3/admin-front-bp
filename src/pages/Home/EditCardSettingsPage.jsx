import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { useImageChange } from "../../hooks";
import axios from "../../axios";
import { BtnLoader, PageLoader } from "../../components";
import { config } from "../../constants";

export default function EditCardSettingsPage() {
    const [data, setData] = useState({
        title: "",
        description: "",
        isRelativeUrl: true,
        url: "",
        tag: "",
        backgroundImageUrl: "",
        iconUrl: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);

    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const {
        image: bgImgage,
        handleImageChange: handleBgImageChange,
        error: bgImageError,
    } = useImageChange();
    const {
        image: icon,
        handleImageChange: handleIconChange,
        error: iconError,
    } = useImageChange();
    const { id } = useParams();

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

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("tag", data.tag);
            formData.append("isRelativeUrl", data.isRelativeUrl);
            formData.append("url", data.url);
            formData.append("backgroundImage", bgImgage);
            formData.append("icon", icon);

            await axios.patch(`/home/cards/update/${id}`, formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/home/settings/cards");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchCard = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/home/cards/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            const {
                title,
                description,
                isRelativeUrl,
                url,
                tag,
                icon,
                backgroundImage,
            } = response.data;
            setData({
                title,
                description,
                isRelativeUrl,
                url,
                tag,
                iconUrl: icon,
                backgroundImageUrl: backgroundImage,
            });

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCard();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Cards Setting
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Home </span>
                    <span>{">"} </span>
                    <span>Settings </span>
                    <span>{">"} </span>
                    <span>Cards</span>
                </div>
            </div>

            {isPageLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        <form action="" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="">Title</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Summer Sale"
                                    name="title"
                                    value={data.title || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="">Description</label>
                                <textarea
                                    name="description"
                                    value={data.description || ""}
                                    onChange={handleChange}
                                    placeholder="Enter Description"
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="">Tag</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Tending"
                                    name="tag"
                                    value={data.tag || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="">Background Image</label>
                                <input
                                    type="file"
                                    onChange={handleBgImageChange}
                                />
                                {bgImageError && (
                                    <span className="text-sm block text-red-500 mt-2">
                                        {bgImageError}
                                    </span>
                                )}

                                {(bgImgage || data.backgroundImageUrl) && (
                                    <div className="mt-6 w-[100px] rounded overflow-hidden">
                                        <img
                                            src={
                                                bgImgage
                                                    ? URL.createObjectURL(
                                                          bgImgage
                                                      )
                                                    : import.meta.env
                                                          .VITE_SERVER_URL +
                                                      data.backgroundImageUrl
                                            }
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="">Icon</label>
                                <input
                                    type="file"
                                    onChange={handleIconChange}
                                />
                                {iconError && (
                                    <span className="text-sm block text-red-500 mt-2">
                                        {iconError}
                                    </span>
                                )}

                                {(icon || data.iconUrl) && (
                                    <div className="mt-6 w-[100px] rounded overflow-hidden">
                                        <img
                                            src={
                                                icon
                                                    ? URL.createObjectURL(icon)
                                                    : import.meta.env
                                                          .VITE_SERVER_URL +
                                                      data.iconUrl
                                            }
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex items-center gap-[10px]">
                                <input
                                    type="checkbox"
                                    className="w-[16px] h-[16px]"
                                    checked={data.isRelativeUrl === true}
                                    onChange={(e) =>
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                isRelativeUrl: e.target.checked,
                                            };
                                        })
                                    }
                                />
                                <label htmlFor="" className="mb-0">
                                    Relative URL
                                </label>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="">URL</label>
                                <input
                                    type="text"
                                    placeholder="Enter Url"
                                    name="url"
                                    value={data.url || ""}
                                    onChange={handleChange}
                                    required
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
                                <button className="w-[100px]">
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
