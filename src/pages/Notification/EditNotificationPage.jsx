import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, SelectDropdown } from "../../components";
import { config } from "../../constants";
import { useImageChange } from "../../hooks";

export default function EditNotificationPage() {
    const [data, setData] = useState({
        title: "",
        body: "",
        page: "",
        imgUrl: "",
        slug: "",
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
    const [slugs, setSlugs] = useState([]);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { image, handleImageChange, error: imageError } = useImageChange();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };
    const { id } = useParams();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("body", data.body);
            formData.append("page", data.page);
            formData.append("slug", data.slug);
            formData.append("image", image);

            await axios.patch(`/notification/update/${id}`, formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/notification");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchNotification = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/notification/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            console.log(response);
            const { title, image, body, page, slug } = response.data;
            setData((prev) => {
                return {
                    title,
                    imgUrl: image,
                    body,
                    page,
                    slug,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchNotification();
    }, []);

    const fetchSlug = async () => {
        try {
            let response = await axios.get(`/seo/attraction`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setSlugs(response.data);
        } catch (e) {}
    };

    useEffect(() => {
        fetchSlug();
    }, []);
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
                            <div className="">
                                <label htmlFor="">Slug *</label>
                                <SelectDropdown
                                    data={slugs}
                                    valueName={"slug"}
                                    displayName={"slug"}
                                    placeholder="Select Slug"
                                    selectedData={data.slug || ""}
                                    setSelectedData={(val) => {
                                        setData((prevData) => ({
                                            ...prevData,
                                            ["slug"]: val,
                                        }));
                                    }}
                                    bracketValue={"slug"}
                                    // disabled={categoryModal?.isEdit}
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
                            <input type="file" onChange={handleImageChange} />
                            {imageError && (
                                <span className="block text-sm text-red-500 mt-2">
                                    {imageError}
                                </span>
                            )}
                            {(image || data.imgUrl) && (
                                <div className="mt-4 w-[50px] h-[50px]">
                                    <img
                                        src={
                                            image
                                                ? URL.createObjectURL(image)
                                                : import.meta.env
                                                      .VITE_SERVER_URL +
                                                  data.imgUrl
                                        }
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
                                {isLoading ? <BtnLoader /> : "Update"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
