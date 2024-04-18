import React from "react";
import { MdDelete } from "react-icons/md";

import { isImageValid } from "../../../utils";
import { config } from "../../../constants";

export default function RoomTypesImageForm({
    newImages,
    setNewImages,
    images,
    removeImage,
    isEditPermission = true,
}) {
    const handleImageChange = (e) => {
        for (let i = 0; i < e.target?.files?.length; i++) {
            if (isImageValid(e.target.files[i])) {
                setNewImages((prev) => {
                    return [...prev, e.target.files[i]];
                });
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
        <div>
            <div className="mt-4">
                <label htmlFor="">Image</label>
                <input
                    type="file"
                    onChange={handleImageChange}
                    multiple={true}
                    disabled={!isEditPermission}
                />
            </div>

            <div className="flex flex-wrap items-center gap-[1.5em] mt-5">
                {images?.map((image, index) => {
                    return (
                        <div
                            className="relative group w-[130px] aspect-video rounded overflow-hidden cursor-pointer"
                            key={index}
                            onClick={() => {
                                if (isEditPermission) removeImage(index);
                            }}
                        >
                            <img
                                src={
                                    image?.isRelative === true
                                        ? import.meta.env.VITE_SERVER_URL +
                                          image?.path
                                        : image?.path
                                }
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            {isEditPermission && (
                                <div className="hidden group-hover:flex absolute inset-0 bg-[#0005] text-xl items-center justify-center cursor-pointer text-red-500">
                                    <MdDelete />
                                </div>
                            )}
                        </div>
                    );
                })}
                {newImages.map((image, index) => {
                    return (
                        <div
                            className="relative group w-[130px] aspect-video rounded overflow-hidden cursor-pointer"
                            key={index}
                            onClick={() => {
                                if (isEditPermission) removeNewImage(index);
                            }}
                        >
                            <img
                                src={URL.createObjectURL(image)}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            {isEditPermission && (
                                <div className="hidden group-hover:flex absolute inset-0 bg-[#0005] text-xl items-center justify-center cursor-pointer text-red-500">
                                    <MdDelete />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
