import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";

import {
    removeImage,
    setData,
} from "../../../redux/slices/attractionFormSlice";
import isImageValid from "../../../utils/isImageValid";
import { config } from "../../../constants";

export default function AttrMediaForm({
    section,
    newImages,
    setNewImages,
    logoImg,
    handleLogoImgChange,
    logoImgError,
}) {
    const { data, images, logo } = useSelector((state) => state.attractionForm);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        dispatch(setData({ name: e.target.name, value: e.target.value }));
    };

    const handleImageChange = (e) => {
        for (let i = 0; i < e.target?.files?.length; i++) {
            if (isImageValid(e.target.files[i])) {
                setNewImages([...newImages, e.target.files[i]]);
            } else {
                alert("Upload png, jpg, jpeg or webp");
            }
        }
    };

    const removeNewImage = (index) => {
        const filteredImages = newImages?.filter((_, ind) => {
            return ind !== index;
        });
        setNewImages(filteredImages);
    };

    return (
        <div className={section === 5 ? "block" : "hidden"}>
            <div>
                <label htmlFor="">Youtube Link</label>
                <input
                    type="text"
                    name="youtubeLink"
                    value={data?.youtubeLink || ""}
                    onChange={handleChange}
                />
            </div>
            <div className="mt-4">
                <label htmlFor="">Logo</label>
                <input type="file" onChange={handleLogoImgChange} />
            </div>
            <div className="mt-6">
                <img
                    src={
                        logoImg
                            ? URL.createObjectURL(logoImg)
                            : import.meta.env.VITE_SERVER_URL + logo
                    }
                    className="w-[150px]"
                    alt=""
                />
                {logoImgError && (
                    <span className="block text-sm text-red-500 mt-4">
                        {logoImgError}
                    </span>
                )}
            </div>

            <div className="mt-4">
                <label htmlFor="">Images</label>
                <input type="file" onChange={handleImageChange} />
            </div>

            <div className="flex flex-wrap items-center gap-[1.5em] mt-5">
                {newImages.map((image, index) => {
                    return (
                        <div
                            className="relative group w-[130px] aspect-video rounded overflow-hidden cursor-pointer"
                            key={index}
                            onClick={() => removeNewImage(index)}
                        >
                            <img
                                src={URL.createObjectURL(image)}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            <div className="hidden group-hover:flex absolute inset-0 bg-[#0005] text-xl items-center justify-center cursor-pointer text-red-500">
                                <MdDelete />
                            </div>
                        </div>
                    );
                })}
                {images?.map((image, index) => {
                    return (
                        <div
                            className="relative group w-[130px] aspect-video rounded overflow-hidden cursor-pointer"
                            key={index}
                            onClick={() => dispatch(removeImage(index))}
                        >
                            <img
                                src={import.meta.env.VITE_SERVER_URL + image}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            <div className="hidden group-hover:flex absolute inset-0 bg-[#0005] text-xl items-center justify-center cursor-pointer text-red-500">
                                <MdDelete />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
