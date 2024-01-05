import React from "react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { useSelector } from "react-redux";

import { formatDate, hasPermission } from "../../../utils";
import axios from "../../../axios";

export default function HotelPromotionTableRow({ promotion, promotions, setPromotions }) {
    const { jwtToken, admin } = useSelector((state) => state.admin);

    // const isEditPermission = hasPermission({
    //     roles: admin?.roles,
    //     name: "contracts",
    //     permission: "update",
    // });
    const isDeletePermission = hasPermission({
        roles: admin?.roles,
        name: "contracts",
        permission: "delete",
    });

    const deletePromotion = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/hotels/promotions/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredPromotions = promotions?.filter((item) => {
                    return item?._id !== id;
                });
                setPromotions(filteredPromotions);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <tr className="border-b border-tableBorderColor">
            <td className="p-3 capitalize">{formatDate(promotion?.sellFrom)}</td>
            <td className="p-3 capitalize">{formatDate(promotion?.sellTo)}</td>
            <td className="p-3 ">{promotion?.name}</td>
            <td className="p-3 ">{promotion?.promotionCode}</td>
            <td className="p-3 ">{promotion?.priority}</td>
            <td className="p-3">
                <div className="flex items-center gap-[10px]">
                    <span
                        className={
                            "block w-[10px] h-[10px] min-w-[10px] min-h-[10px] rounded-full " +
                            (promotion?.isActive === true ? "bg-green-500" : "bg-red-500")
                        }
                    ></span>
                    {promotion?.isActive === true ? "Active" : "Inactive"}
                </div>
            </td>

            <td className="p-3">
                <div className="flex gap-[10px]">
                    {isDeletePermission && (
                        <button
                            className="h-auto bg-transparent text-red-500 text-xl"
                            onClick={() => {
                                deletePromotion(promotion?._id);
                            }}
                        >
                            <MdDelete />
                        </button>
                    )}
                    <Link to={`${promotion?._id}/edit`}>
                        <button className="h-auto bg-transparent text-green-500 text-xl">
                            <BiEditAlt />
                        </button>
                    </Link>
                </div>
            </td>
        </tr>
    );
}
