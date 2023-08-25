import React, { useEffect, useState } from "react";

import { Pagination } from "../../../components";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function HotelRoomTypeRow({
    room,
    index,
    roomType,
    setRoomType,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.log(room, "room");

    const [formData, setFormData] = useState({
        roomTypeId: room.roomTypeId,
        markupType: room.markupType,
        markup: room.markup,
        markupTypeApi: room.markupTypeApi,
        markupApi: room.markupApi,
    });

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    useEffect(() => {
        setFormData({
            roomTypeId: room.roomTypeId,
            markupType: room.markupType,
            markup: room.markup,
            markupTypeApi: room.markupTypeApi,
            markupApi: room.markupApi,
        });
    }, [room]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Find the index of the existing activity in the `activity` array
        const existingActivityIndex = roomType.findIndex(
            (roomType) => roomType.roomTypeId === formData.roomTypeId
        );

        // If an existing activity was found, update it with the new `formData`
        if (existingActivityIndex !== -1) {
            const updatedActivity = {
                ...roomType[existingActivityIndex],
                markupType: formData.markupType,
                markup: formData.markup,
                markupTypeApi: formData.markupTypeApi,
                markupApi: formData.markupApi,
            };

            const updatedActivityList = [...roomType];
            updatedActivityList[existingActivityIndex] = updatedActivity;

            setRoomType(updatedActivityList);
        } else {
            // If the `formData` corresponds to a new activity, add it to the `activity` array
            setRoomType([
                ...roomType,
                {
                    roomTypeId: formData.roomTypeId,
                    markupType: formData.markupType,
                    markup: formData.markup,
                    markupTypeApi: formData.markupTypeApi,
                    markupApi: formData.markupApi,
                },
            ]);
        }

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
                <td className="p-3 "> {index} </td>
                <td className="p-3 "> {room.roomName} </td>
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
