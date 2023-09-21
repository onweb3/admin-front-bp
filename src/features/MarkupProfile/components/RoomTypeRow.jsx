import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import axios from "../../../axios";

import { Pagination } from "../../../components";
import { useParams } from "react-router-dom";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function RoomTypeRow({
    index,
    hotelId,
    roomType,
    setRoomTypes,
    type,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const { profileId, marketId } = useParams();
    const { id } = useParams();

    const wrapperRef = useRef();
    // useHandleClickOutside(wrapperRef, () => setIsMarkupModalView(false));
    const { jwtToken } = useSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        hotelId: hotelId,
        roomTypeId: roomType.roomTypeId,
        markupType: roomType.markupType,
        markup: roomType.markup,
        markupTypeApi: roomType.markupTypeApi,
        markupApi: roomType.markupApi,
    });

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (type === "market") {
            if (marketId) {
                const response = await axios.post(
                    `/market/update-roomType-profile/${marketId}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            } else {
                const response = await axios.post(
                    `/market/b2b/update-roomType-profile/${id}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
        } else {
            if (profileId) {
                const response = await axios.post(
                    `/profile/update-roomType-profile/${profileId}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            } else {
                const response = await axios.post(
                    `/profile/b2b/update-roomType-profile/${id}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
        }

        setRoomTypes((previous) => {
            const existingIndex = previous.findIndex(
                (a) =>
                    a.roomTypeId.toString() === roomType.roomTypeId.toString()
            );

            if (existingIndex !== -1) {
                const updatedType = {
                    ...previous[existingIndex],
                    markupType: formData.markupType,
                    markup: formData.markup,
                    markupTypeApi: formData.markupTypeApi,
                    markupApi: formData.markupApi,
                    isEdit: true,
                };

                const newType = [...previous];
                newType.splice(existingIndex, 1, updatedType);

                console.log(newType, "newType");
                return newType;
            } else {
                return previous;
            }
        });
        setIsModalOpen(false);
        // setData(formData);
    };
    return (
        <>
            <tr
                className={
                    "border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9] "
                }
            >
                {" "}
                <td className="p-3 "> {index + 1} </td>
                <td className="p-3 "> {roomType.roomName} </td>
                {isModalOpen ? (
                    <td className="p-3">
                        <select
                            name="markupTypeApi"
                            value={formData?.markupTypeApi || ""}
                            onChange={handleChange}
                        >
                            <option value="" hidden>
                                Markup Type
                            </option>
                            <option value="flat">flat</option>
                            <option value="percentage">percentage</option>
                        </select>{" "}
                    </td>
                ) : (
                    <td className="p-3 capitalize">
                        <span>
                            {formData?.markupTypeApi
                                ? formData.markupTypeApi
                                : "N/A"}{" "}
                        </span>
                    </td>
                )}
                {isModalOpen ? (
                    <td className="p-3">
                        <input
                            type="number"
                            name="markupApi"
                            value={formData?.markupApi || ""}
                            onChange={handleChange}
                            className="h-[100%] arrow-hidden p-0 px-2 border-1 w-[150px]"
                        />
                    </td>
                ) : (
                    <td className="p-3 capitalize">
                        <span>{formData?.markupApi}</span>
                    </td>
                )}
                {isModalOpen ? (
                    <td className="p-3">
                        <select
                            name="markupType"
                            value={formData?.markupType || ""}
                            onChange={handleChange}
                        >
                            <option value="" hidden>
                                Markup Type
                            </option>
                            <option value="flat">flat</option>
                            <option value="percentage">percentage</option>
                        </select>{" "}
                    </td>
                ) : (
                    <td className="p-3 capitalize">
                        <span>
                            {formData?.markupType ? formData.markupType : "N/A"}{" "}
                        </span>
                    </td>
                )}
                {isModalOpen ? (
                    <td className="p-3">
                        <input
                            type="number"
                            name="markup"
                            value={formData?.markup || ""}
                            onChange={handleChange}
                            className="h-[100%] arrow-hidden p-0 px-2 border-1 w-[150px]"
                        />
                    </td>
                ) : (
                    <td className="p-3 capitalize">
                        <span>{formData?.markup}</span>
                    </td>
                )}
                {isModalOpen ? (
                    <td className="p-3" onClick={handleSubmit}>
                        <button className="w-[50px] bg-green-500">
                            Apply{" "}
                        </button>
                    </td>
                ) : (
                    <td className="p-3" onClick={() => setIsModalOpen(true)}>
                        <button className="w-[50px]">Edit </button>
                    </td>
                )}
            </tr>
        </>
    );
}
