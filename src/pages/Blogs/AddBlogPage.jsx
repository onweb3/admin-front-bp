import React, { useEffect, useState } from "react";
import { BtnLoader, RichTextEditor } from "../../components";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { useImageChange } from "../../hooks";
import { Link, useNavigate } from "react-router-dom";

export default function AddBlogPage() {
    const [data, setData] = useState({
        title: "",
        body: "",
        category: "",
    });
    const [tags, setTags] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const { jwtToken } = useSelector((state) => state.admin);
    const {
        image: thumbnail,
        handleImageChange: handleThumbnailChange,
        error: thumbnailError,
    } = useImageChange();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            const formData = new FormData();
            formData.append("title", data?.title);
            formData.append("body", data?.body);
            formData.append("category", data?.category);
            formData.append("tags", JSON.stringify(tags));
            formData.append("thumbnail", thumbnail);

            await axios.post("/blogs/add", formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/blogs");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const removeTag = (index) => {
        const filteredTags = tags?.filter((_, ind) => {
            return ind !== index;
        });
        setTags(filteredTags);
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/blogs/categories/all", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setCategories(response?.data?.categories);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">ADD BLOG</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/blogs" className="text-textColor">
                        Blogs{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Title</label>
                            <input
                                type="text"
                                placeholder="Ex: Travel"
                                name="title"
                                value={data.title || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Category</label>
                            <select
                                name="category"
                                value={data.category || ""}
                                onChange={handleChange}
                                id=""
                                required
                            >
                                <option value="" hidden>
                                    Select Category
                                </option>
                                {categories?.map((category, index) => {
                                    return (
                                        <option
                                            value={category?._id}
                                            key={index}
                                        >
                                            {category?.categoryName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Thumbnail</label>
                            <input
                                type="file"
                                name="thumbnail"
                                onChange={handleThumbnailChange}
                                required
                            />
                            {thumbnailError && (
                                <span className="text-sm block text-red-500 mt-2">
                                    {thumbnailError}
                                </span>
                            )}

                            {thumbnail && (
                                <div className="mt-6 w-[200px] rounded overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(thumbnail)}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Body</label>
                            <RichTextEditor
                                initialValue={data.body || ""}
                                getValue={(value) =>
                                    setData((prev) => {
                                        return { ...prev, body: value };
                                    })
                                }
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Tags</label>
                            {tags?.length > 0 && (
                                <div className="flex flex-wrap items-center gap-[10px] mb-2">
                                    {tags?.map((tag, index) => {
                                        return (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-[#f3f3f9] text-sm rounded cursor-pointer"
                                                onClick={() => removeTag(index)}
                                            >
                                                {tag} <span>x</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                            <input
                                type="text"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        if (e.target.value) {
                                            setTags([...tags, e.target.value]);
                                            e.target.value = "";
                                        }
                                    }
                                }}
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
                                {isLoading ? <BtnLoader /> : "Add Blog"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
