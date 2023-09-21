import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function TransferProfileRow({
    setTransfers,
    transfer,
    index,
    type,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        transferId: transfer?.transferId,
        markupType: transfer?.markupType || "flat",
        markup: transfer?.markup || 0,
        isEdit: transfer?.isEdit || false,
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
                    `/market/update-transfer-profile/${marketId}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                setIsModalOpen(false);
            } else {
                const response = await axios.post(
                    `/market/b2b/update-transfer-profile/${id}`,
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
                    `/profile/update-transfer-profile/${profileId}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                setIsModalOpen(false);
            } else {
                const response = await axios.post(
                    `/profile/b2b/update-transfer-profile/${id}`,
                    formData,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                setIsModalOpen(false);
            }
        }

        setTransfers((prev) => {
            return prev.map((transfer) => {
                if (
                    transfer?.transferId?.toString() ===
                    formData?.transferId?.toString()
                ) {
                    return {
                        ...transfer,
                        markupType: formData?.markupType,
                        markup: formData?.markup,
                        isEdit: true,
                    };
                } else {
                    return transfer;
                }
            });
        });

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
                <td className="p-3 "> {transfer?.transferFrom} </td>
                <td className="p-3 "> {transfer?.transferTo} </td>
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
                            {transfer?.markupType ? transfer.markupType : "N/A"}{" "}
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
                        <span>{transfer?.markup}</span>
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
