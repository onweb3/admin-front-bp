import React, { useEffect } from "react";
import { useState } from "react";

import AttracitonMarkupModal from "./AttractionMarkupModal";
import { priceConversion } from "../../../utils";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../../../axios";

export default function ActivityProfileRow({
    activities,
    setAttractionList,
    setInitalAttractionList,
    rowClass,
    index,
    type,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { selectedCurrency } = useSelector((state) => state.general);
    const { profileId, marketId } = useParams();
    const { id } = useParams();

    const { jwtToken } = useSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        activity: activities?._id,
        markupType: activities?.markupType,
        markup: activities?.markup,
        isEdit: activities?.isEdit || false,
    });

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async () => {
        if (type === "market") {
            if (marketId) {
                const response = await axios.post(
                    `/market/update-activities-profile/${marketId}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            } else {
                const response = await axios.post(
                    `/market/b2b/update-activities-profile/${id}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
        } else {
            if (profileId) {
                const response = await axios.post(
                    `/profile/update-activities-profile/${profileId}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            } else {
                const response = await axios.post(
                    `/profile/b2b/update-activities-profile/${id}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
        }

        // Find the index of the existing activity in the `activity` array

        setAttractionList((preAttr) => {
            return preAttr.map((attraction) => {
                return {
                    ...attraction,
                    activities: attraction.activities.map((activity) => {
                        if (
                            activity._id.toString() ===
                            formData.activity.toString()
                        ) {
                            return {
                                ...activity,
                                markupType: formData?.markupType,
                                markup: formData?.markup,
                                isEdit: true,
                            };
                        } else {
                            return activity;
                        }
                    }),
                };
            });
        });

        setInitalAttractionList((preAttr) => {
            return preAttr.map((attraction) => {
                return {
                    ...attraction,
                    activities: attraction.activities.map((activity) => {
                        if (
                            activity._id.toString() ===
                            formData.activity.toString()
                        ) {
                            return {
                                ...activity,
                                markupType: formData?.markupType,
                                markup: formData?.markup,
                                isEdit: true,
                            };
                        } else {
                            return activity;
                        }
                    }),
                };
            });
        });

        setIsModalOpen(false);
    };

    useEffect(() => {
        setFormData({
            activity: activities?._id,
            markupType: activities?.markupType,
            markup: activities?.markup,
        });
    }, [activities]);

    return (
        <>
            <tr
                className={`border-b border-tableBorderColor text-textColor ${rowClass}`}
            >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{activities?.name}</td>
                <td className="p-3">{activities?.activityType}</td>
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
                            {formData?.markupType
                                ? formData?.markupType
                                : "N/A"}{" "}
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
                        <span>{formData.markup.toString()}</span>
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
