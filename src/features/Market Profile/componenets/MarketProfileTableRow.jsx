import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";
// import ResellerSelectionModal from "./ResellerSelectionModal";

function MarketProfileTableRow({ profile, index, profiles, setProfiles }) {
    const { jwtToken } = useSelector((state) => state.admin);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profileId, setProfileId] = useState("");

    const deleteProfile = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/market/delete-profile/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                const filtered = profiles.filter((item) => {
                    return item?._id !== id;
                });

                setProfiles(filtered);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onHandleUpdateReseller = async (profileId) => {
        try {
            setIsLoading(true);
            const isConfirm = window.confirm(
                "Are you sure to update all b2b profiles?"
            );
            if (isConfirm) {
                const response = await axios.patch(
                    `/market/b2b/update-all-profile/${profileId}`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const onHandleUpdateUneditedReseller = async (profileId) => {
        setProfileId(profileId);
        setIsModalOpen(true);
    };

    return (
        <>
            <tr className="border-b border-tableBorderColor">
                <td className="p-3">{index + 1}</td>
                <td className="p-3 capitalize">{profile?.name}</td>
                <td className="p-3 capitalize">{profile?.name}</td>

                {/* <td className="p-3">
                    <button
                        className="px-3 bg-orange-500"
                        onClick={() => onHandleUpdateReseller(profile?._id)}
                    >
                        {isLoading ? <BtnLoader /> : "Update All"}
                    </button>
                </td>
                <td className="p-3">
                    <button
                        className="px-3 bg-orange-500"
                        onClick={() =>
                            onHandleUpdateUneditedReseller(profile?._id)
                        }
                    >
                        {isLoading ? <BtnLoader /> : "Update Selected"}
                    </button>
                </td> */}
                <td className="p-3">
                    <div className="flex items-center gap-[10px]">
                        <button
                            className="h-auto bg-transparent text-red-500 text-xl"
                            onClick={() => deleteProfile(profile?._id)}
                        >
                            <MdDelete />
                        </button>
                        <Link to={`${profile?._id}/edit`}>
                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                <BiEditAlt />
                            </button>
                        </Link>
                    </div>
                </td>
            </tr>
            {/* {isModalOpen ? (
                <ResellerSelectionModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    profileId={profileId}
                />
            ) : (
                ""
            )} */}
        </>
    );
}

export default MarketProfileTableRow;
