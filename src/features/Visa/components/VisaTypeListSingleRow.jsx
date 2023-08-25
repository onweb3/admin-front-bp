import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../../axios";
import B2cVisaMarkupEditModal from "./B2cVisaMarkupEditModal";

function VisaTypeListSingleRow({ visaList, index, setIsDeleted, isDeleted }) {
    const [isMarkupModalOpen, setIsMarkupModalOpen] = useState(false);
    const [b2cmarkup, setB2cMarkup] = useState({
        markup: visaList?.B2cMarkup?.markup,
        markupType: visaList?.B2cMarkup?.markupType,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const deleteVisaList = async (id) => {
        try {
            const response = await axios.delete(
                `/visa/delete/${id}/visa-type`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsDeleted(!isDeleted);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <tr className="border-b border-tableBorderColor">
            <td className="p-3">{index + 1}</td>
            <td className="p-3 capitalize">{visaList.visaName}</td>
            <td className="p-3 capitalize">{visaList.visa}</td>
            {/* <td className="p-3 capitalize">{visaList.visaPrice}AED</td>
            <td className="p-3 font-[500]">{visaList.purchaseCost}AED</td>

            <th className="font-[500] p-3 text-left">
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
                        <B2cVisaMarkupEditModal
                            b2cmarkup={b2cmarkup}
                            setB2cMarkup={setB2cMarkup}
                            setIsMarkupModalOpen={setIsMarkupModalOpen}
                            visaList={visaList._id}
                        />
                    )}
                </div>
            </th> */}
            <td className="p-3">
                <div className="flex items-center gap-[10px]">
                    {/* <Link to={`/visa/${visaList._id}/nationality`}>
                        <button className="h-auto bg-transparent text-green-500 text-xl">
                            <BsEyeFill />
                        </button>
                    </Link> */}
                    <button
                        className="h-auto bg-transparent text-red-500 text-xl"
                        onClick={() => {
                            if (window.confirm("Are you sure to delete?")) {
                                deleteVisaList(visaList._id);
                            }
                        }}
                    >
                        <MdDelete />
                    </button>
                    <Link to={`/visa/${visaList._id}/edit`}>
                        <button className="h-auto bg-transparent text-green-500 text-xl">
                            <BiEditAlt />
                        </button>
                    </Link>
                </div>
            </td>
        </tr>
    );
}

export default VisaTypeListSingleRow;
