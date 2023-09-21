import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function InsuranceProfileRow({
    plan,
    index,
    a2a,
    setA2a,
    type,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        insuranceId: plan?.insuranceId,
        markupType: plan?.markupType || "falt",
        markup: plan?.markup || 0,
        isEdit: plan?.isEdit || false,
    });
    const { id } = useParams();

    const [isPageLoading, setIsPageLoading] = useState(false);
    const { profileId, marketId } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

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
                    `/market/update-insurance-profile/${marketId}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                setIsModalOpen(false);
            } else {
                const response = await axios.post(
                    `/market/b2b/update-insurance-profile/${id}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                setIsModalOpen(false);
            }
        } else {
            if (profileId) {
                const response = await axios.post(
                    `/profile/update-insurance-profile/${profileId}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                setIsModalOpen(false);
            } else {
                const response = await axios.post(
                    `/profile/b2b/update-insurance-profile/${id}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                setIsModalOpen(false);
            }
        }

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
                <td className="p-3 "> {plan?.planName} </td>
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
