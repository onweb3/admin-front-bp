import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../../../axios";
import { BtnLoader, PageLoader } from "../../../components";
import ResellerSelectionActivityModal from "../../MarkupProfile/components/ResellerSelectionActivityModal";
import ResellerSelectionModal from "../../MarkupProfile/components/ResellerSelectionModal";

export default function ActivityMarkupRow({
    profile,
    markupUpdate,
    setMarkupUpdate,
    index,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { activityId } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const [updateAllLoader, setUpdateAllLoader] = useState(false);
    const [updateProfileLoader, setUpdateProfileLoader] = useState(false);
    const [updateSelectedModal, setUpdateSelectedModal] = useState(false);
    const [b2b, setB2b] = useState([]);
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
        try {
            e.preventDefault();
            setIsModalOpen(true);
        } catch (e) {
            console.log(e);
        }
    };

    const onHandleSubmit = async () => {
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

    const handleUpdateProfile = async () => {
        try {
            setUpdateProfileLoader(true);
            const response = await axios.post(
                `/profile/update-profile-activity/${profile._id}`,
                {
                    ...data,
                    activityId: activityId,
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            await onHandleSubmit();
            setUpdateProfileLoader(false);
            setIsModalOpen(false);
        } catch (e) {
            console.log(e);
        }
    };

    const handleUpdateAll = async () => {
        try {
            setUpdateAllLoader(true);
            const response = await axios.post(
                `/profile/update-all-b2b-profile-activity/${profile._id}`,
                {
                    ...data,
                    activityId: activityId,
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            await onHandleSubmit();
            setIsModalOpen(false);
            setUpdateAllLoader(false);
        } catch (e) {
            console.log(e);
        }
    };

    const handleUpdateSelected = async (e) => {
        try {
            e.preventDefault();
            setUpdateSelectedModal(true);
        } catch (e) {
            console.log(e);
        }
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
                    <>
                        <td
                            className="p-3 "
                            // onClick={onHandleSubmit}
                        >
                            <button
                                className="w-[150px] bg-green-500 ml-3"
                                onClick={(e) => {
                                    handleUpdateProfile(e);
                                }}
                            >
                                {updateProfileLoader ? (
                                    <BtnLoader />
                                ) : (
                                    "Update Profile"
                                )}
                            </button>
                            <button
                                className="w-[150px] bg-green-500 ml-3"
                                onClick={(e) => {
                                    handleUpdateSelected(e);
                                }}
                            >
                                Update Selected{" "}
                            </button>
                            <button
                                className="w-[100px] bg-green-500 ml-3"
                                onClick={(e) => {
                                    handleUpdateAll(e);
                                }}
                            >
                                {updateAllLoader ? <BtnLoader /> : "Update All"}
                            </button>
                            <button
                                className="bg-white text-red-500 ml-3"
                                onClick={(e) => {
                                    setIsModalOpen(false);
                                }}
                            >
                                <MdClose />
                            </button>
                        </td>
                    </>
                ) : (
                    <td className="p-3" onClick={onHandleEdit}>
                        <button className="w-[50px]">Edit </button>
                    </td>
                )}
            </tr>
            {updateSelectedModal && (
                <ResellerSelectionActivityModal
                    profileId={data.profileId}
                    setIsModalOpen={setIsModalOpen}
                    setUpdateSelectedModal={setUpdateSelectedModal}
                    markup={data.markup}
                    markupType={data.markupType}
                />
            )}
        </>
    );
}
