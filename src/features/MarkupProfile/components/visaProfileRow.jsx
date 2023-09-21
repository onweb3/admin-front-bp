import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../axios";

import { Pagination } from "../../../components";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function VisaProfileRow({
    visaType,
    index,
    visa,
    setVisa,
    type,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { profileId, marketId } = useParams();
    const { id } = useParams();

    const { jwtToken } = useSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        visa: visaType._id,
        markupType: visaType.markupType || "flat",
        markup: visaType.markup,
        isEdit: visaType?.isEdit || false,
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
                    `/market/update-visa-profile/${marketId}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            } else {
                const response = await axios.post(
                    `/market/b2b/update-visa-profile/${id}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
        } else {
            if (profileId) {
                const response = await axios.post(
                    `/profile/update-visa-profile/${profileId}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            } else {
                const response = await axios.post(
                    `/profile/b2b/update-visa-profile/${id}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
        }

        setIsModalOpen(false);
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
                <td className="p-3 "> {visaType.visaName} </td>
                <td className="p-3"> {visaType.visa.name} </td>
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
