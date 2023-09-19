import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";

import axios from "../../../axios";
import {
    deleteAttractionActivity,
    isActiveActivity,
} from "../../../redux/slices/attractionFormSlice";
import UploadTicketModal from "./UploadTicketModal";
import { priceConversion } from "../../../utils";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import B2cAttractionMarkupEditModal from "./B2cAttractionMarkupEditModal";

export default function SingleActivityRow({ activity }) {
    const { data } = useSelector((state) => state.attractionForm);
    const { jwtToken } = useSelector((state) => state.admin);
    const [isActiveStatus, setIsActiveStatus] = useState(activity?.isActive);
    const { selectedCurrency } = useSelector((state) => state.general);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [b2cmarkup, setB2cMarkup] = useState({
        childMarkup: activity.markup?.childMarkup,
        childMarkupType: activity.markup?.childMarkupType,
        adultMarkup: activity.markup?.adultMarkup,
        adultMarkupType: activity.markup?.adultMarkupType,
        infantMarkup: activity?.markup?.infantMarkup,
        infantMarkupType: activity?.markup?.infantMarkupType,
    });
    const [isMarkupModalOpen, setIsMarkupModalOpen] = useState(false);

    const deleteActivity = async () => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/attractions/activities/delete/${activity?._id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });
                dispatch(deleteAttractionActivity(activity?._id));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const changeActiveStatus = async () => {
        try {
            let response = await axios.patch(
                `/attractions/update/activities/${activity?._id}/is-active`,
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
            <td className="p-3">
                <span className="block">{activity?.name}</span>
            </td>
            <td className="p-3 capitalize">
                {activity?.activityType} ({activity?.base})
            </td>
            <td className="p-3">
                {activity?.adultCost
                    ? priceConversion(activity?.adultCost, selectedCurrency, true)
                    : "N/A"}
            </td>
            <td className="p-3">
                {activity?.childCost
                    ? priceConversion(activity?.childCost, selectedCurrency, true)
                    : "N/A"}
            </td>
            <td className="p-3">
                {activity?.infantCost
                    ? priceConversion(activity?.infantCost, selectedCurrency, true)
                    : "N/A"}
            </td>
            <td className="p-3">
                {activity?.hourlyCost
                    ? priceConversion(activity?.hourlyCost, selectedCurrency, true)
                    : "N/A"}
            </td>
            {/* <td className="p-3">{activity?.isVat ? activity?.vat + "%" : "N/A"}</td>
            <td className="p-3">
                {activity?.sharedTransferPrice ? activity?.sharedTransferPrice + " AED" : "N/A"}
            </td>
            <td className="p-3">
                {activity?.privateTransferPrice ? activity?.privateTransferPrice + " AED" : "N/A"}
            </td> */}
            {data?.bookingType === "ticket" && (
                <td className="p-3">
                    <Link
                        to={`/attractions/${id}/activities/${activity?._id}/tickets`}
                        className="block font-medium text-blue-500 underline"
                    >
                        View Tickets
                    </Link>
                </td>
            )}
            {/* <td className="p-3 items-center">
                {activity.isPromoCode ? (
                    <>
                        <span className="block">{activity?.promoCode || "N/A"}</span>
                        <span className="block">
                            ({activity?.promoAmount + "AED" || "N/A"})
                        </span>{" "}
                    </>
                ) : (
                    <span className="block">{"N/A"}</span>
                )}
            </td> */}
            <td className="font-[500] p-3 text-left">
                <div className="flex items-center gap-[15px]">
                    {b2cmarkup?.adultMarkup
                        ? b2cmarkup?.adultMarkup +
                          (b2cmarkup?.adultMarkupType === "percentage" ? "%" : " AED")
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
                            activity={activity?._id}
                        />
                    )}
                </div>
            </td>
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
                        onClick={() => deleteActivity(activity?._id)}
                    >
                        <MdDelete />
                    </button>
                    <Link to={`activities/${activity?._id}/edit`}>
                        <button className="h-auto bg-transparent text-green-500 text-xl">
                            <BiEditAlt />
                        </button>
                    </Link>
                </div>
            </td>
        </tr>
    );
}
