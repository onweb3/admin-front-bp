import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function A2aProfileRow({ a2aType, index, a2a, setA2a }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        atoa: a2aType._id,
        markupType: a2aType.markupType || "falt",
        markup: a2aType.markup || 0,
        isEdit: a2aType?.isEdit || false,
    });
    const { id } = useParams();

    const [isPageLoading, setIsPageLoading] = useState(false);
    const { profileId } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (profileId) {
            const response = await axios.post(
                `/profile/update-a2a-profile/${profileId}`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setIsModalOpen(false);
        } else {
            const response = await axios.post(
                `/profile/b2b/update-a2a-profile/${id}`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setIsModalOpen(false);
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
                <td className="p-3 "> {a2aType?.airportFrom?.airportName} </td>
                <td className="p-3"> {a2aType?.airportTo?.airportName} </td>
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
