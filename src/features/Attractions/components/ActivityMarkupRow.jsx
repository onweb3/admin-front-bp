import React, { useState } from "react";

export default function ActivityMarkupRow({
    profile,
    markupUpdate,
    setMarkupUpdate,
    index,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [data, setData] = useState({
        profileId: profile._id,
        markup: profile.markup,
        markupType: profile.markupType,
    });

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const onHandleEdit = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const onHandleSubmit = (e) => {
        e.preventDefault();
        // Find the index of the existing activity in the `activity` array
        const existingActivityIndex = markupUpdate.findIndex(
            (markups) => markups.profileId === data.profileId
        );

        // If an existing activity was found, update it with the new `formData`
        if (existingActivityIndex !== -1) {
            const updatedActivity = {
                ...markupUpdate[existingActivityIndex],
                markupType: data.markupType,
                markup: data.markup,
            };

            const updatedActivityList = [...markupUpdate];
            updatedActivityList[existingActivityIndex] = updatedActivity;

            setMarkupUpdate(updatedActivityList);
        } else {
            // If the `formData` corresponds to a new activity, add it to the `activity` array
            setMarkupUpdate([
                ...markupUpdate,
                {
                    profileId: data.profileId,
                    markupType: data.markupType,
                    markup: data.markup,
                },
            ]);
        }

        setIsModalOpen(false);
        // setData(formData);
    };

    console.log(data, "data");
    return (
        <>
            <tr
                className={
                    "border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9] "
                }
            >
                {" "}
                <td className="p-3 "> {index + 1} </td>
                <td className="p-3 "> {profile.name} </td>
                {isModalOpen ? (
                    <td className="p-3">
                        <select
                            name="markupType"
                            value={data?.markupType || ""}
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
                            {data?.markupType ? data.markupType : "N/A"}{" "}
                        </span>
                    </td>
                )}
                {isModalOpen ? (
                    <td className="p-3">
                        <input
                            type="number"
                            name="markup"
                            value={data?.markup || ""}
                            onChange={handleChange}
                            className="h-[100%] arrow-hidden p-0 px-2 border-1 w-[150px]"
                        />
                    </td>
                ) : (
                    <td className="p-3 capitalize">
                        <span>{data?.markup}</span>
                    </td>
                )}
                {isModalOpen ? (
                    <td className="p-3" onClick={onHandleSubmit}>
                        <button className="w-[50px] bg-green-500">Add </button>
                    </td>
                ) : (
                    <td className="p-3" onClick={onHandleEdit}>
                        <button className="w-[50px]">Edit </button>
                    </td>
                )}
            </tr>
        </>
    );
}
