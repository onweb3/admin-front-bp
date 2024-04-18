import React, { useRef, useState } from "react";
import { useHandleClickOutside } from "../../../hooks";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { config } from "../../../constants";

export default function AttractionTicketImageModal({
    setIsModalOpen,
    isModalOpen,
    image,
}) {
    const wrapperRef = useRef();

    useHandleClickOutside(wrapperRef, () => setIsModalOpen(false));
    return (
        <div
            className={
                "fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 " +
                (isModalOpen ? "block" : "hidden")
            }
        >
            <div
                ref={wrapperRef}
                className="bg-[#fff]  max-h-[100vh] max-w-[900px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Theme </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div>
                    <img
                        src={import.meta.env.VITE_SERVER_URL + image}
                        alt=""
                        className=" object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
