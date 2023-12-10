import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../../axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function AttractionsTableSingleRow({
    setAttractions,
    attractions,
    code,
    title,
    bookingType,
    isOffer,
    offerAmount,
    offerAmountType,
    destination,
    markup,
    averageRating,
    totalReviews,
    _id,
    isActive,
}) {
    const [isActiveStatus, setIsActiveStatus] = useState(isActive);

    const { jwtToken } = useSelector((state) => state.admin);

    const deleteAttraction = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/attractions/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                const filteredAttractions = attractions.filter((attr) => {
                    return attr?._id !== id;
                });
                setAttractions(filteredAttractions);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const changeActiveStatus = async () => {
        try {
            const response = await axios.patch(
                `/attractions/update/${_id}/is-active`,
                { isActive: !isActiveStatus },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setIsActiveStatus(response?.data?.isActive);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <tr className="border-b border-tableBorderColor">
            <td className="p-3">{code}</td>
            <td className="p-3">{title}</td>
            <td className="p-3 capitalize">{bookingType}</td>
            <td className="p-3 capitalize">
                {isOffer ? `${offerAmount} ${offerAmountType === "flat" ? "AED" : "%"}` : "N/A"}
            </td>
            <td className="p-3 capitalize">{destination?.name}</td>
            <td className="p-3">
                <Link to={`/attractions/${_id}/reviews`} className="text-blue-500 underline">
                    {totalReviews}
                </Link>{" "}
                ({averageRating?.toFixed(1)}) &#9734;
            </td>
            {/* <th className="font-[500] p-3 text-left">
                <div className="flex items-center gap-[15px]">
                    {b2cmarkup?.markup
                        ? b2cmarkup?.markup +
                          (b2cmarkup?.markupType === "percentage"
                              ? "%"
                              : " AED")
                        : "N/A"}

                    <button
                        className="h-auto bg-transparent text-blue-500 text-sm underline font-normal "
                        onClick={() => setIsMarkupModalOpen(true)}
                    >
                        Edit
                    </button>

                    {isMarkupModalOpen && (
                        <B2cAttractionMarkupEditModal
                            b2cmarkup={b2cmarkup}
                            setB2cMarkup={setB2cMarkup}
                            setIsMarkupModalOpen={setIsMarkupModalOpen}
                            attraction={_id}
                        />
                    )}
                </div>
            </th> */}
            <td className="p-3">
                <div className="flex gap-[10px]">
                    <button
                        className="h-auto bg-transparent text-grayColor text-xl"
                        onClick={changeActiveStatus}
                    >
                        {isActiveStatus === true ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </button>
                    <button
                        className="h-auto bg-transparent text-red-500 text-xl"
                        onClick={() => {
                            deleteAttraction(_id);
                        }}
                    >
                        <MdDelete />
                    </button>
                    <Link to={`${_id}/edit`}>
                        <button className="h-auto bg-transparent text-green-500 text-xl">
                            <BiEditAlt />
                        </button>
                    </Link>
                </div>
            </td>
        </tr>
    );
}
