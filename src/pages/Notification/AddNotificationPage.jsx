import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, SelectDropdown } from "../../components";
import { useImageChange } from "../../hooks";

export default function AddNotificationPage() {
    const [data, setData] = useState({
        title: "",
        body: "",
        page: "",
    });

    const names = [
        { value: "attraction" },
        { value: "visa" },
        { value: "flights" },
        { value: "quotation" },
        { value: "insurance" },
        { value: "a2a" },
        { value: "hotel" },
    ];
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [apis, setApis] = useState([]);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { image, handleImageChange, error: imageError } = useImageChange();

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
            formData.append("body", data.body);
            formData.append("page", data.page);
            formData.append("image", image);

            await axios.post("/notification/add", formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/airlines");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">ADD NOTIFICATION</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/notification" className="text-textColor">
                        Notification{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="">Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter title"
                                    name="title"
                                    value={data.title || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Page</label>

                                <SelectDropdown
                                    data={names}
                                    valueName={"value"}
                                    displayName={"value"}
                                    placeholder="Select name"
                                    selectedData={data.page || ""}
                                    setSelectedData={(val) => {
                                        setData((prevData) => ({
                                            ...prevData,
                                            ["page"]: val,
                                        }));
                                    }}
                                    // bracketValue={"chainCode"}
                                    // disabled={!isEditPermission}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="">Body</label>
                            <input
                                type="text"
                                placeholder="Enter Body"
                                name="body"
                                value={data.body || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Image</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                required
                            />
                            {imageError && (
                                <span className="block text-sm text-red-500 mt-2">
                                    {imageError}
                                </span>
                            )}
                            {image && (
                                <div className="mt-4 w-[50px] h-[50px]">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt=""
                                        className="w-[100%] h-[100%] object-cover"
                                    />
                                </div>
                            )}
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
                            <button className="w-[120px]">
                                {isLoading ? <BtnLoader /> : "Add"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
