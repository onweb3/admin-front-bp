import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "../../axios";
import AddA2aMarkupModal from "../../features/Resellers/components/AddA2aMArkupModal";
import AddMarkupModal from "../../features/Resellers/components/AddMarkupModal";
import AddVisaMarkupModal from "../../features/Resellers/components/AddVisaMarkupModal";
import { priceConversion } from "../../utils";
import EditB2bMarkupProfilePage from "../Markup Profile/EditB2bMarkupProfilePage";

export default function SpecialMarkupPage() {
    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
    const [isA2aModalOpen, setIsA2aModalOpen] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [attractionData, setAttractionData] = useState({});
    const [visaData, setVisaData] = useState({});
    const [a2aData, setA2aData] = useState({});
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);

    const { selectedCurrency } = useSelector((state) => state.general);

    const handleChange = (e) => {
        setSelectedProfile(e.target.value);
    };

    const fetchData = async () => {
        try {
            setError("");
            setIsLoading(true);

            const response = await axios.get(`/markup/b2b/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            console.log(response.data, "response.data");

            setAttractionData(response.data.attractionMarkup);
            setVisaData(response.data.visaMarkup);
            setA2aData(response?.data?.a2aMarkup);

            setIsLoading(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchProfiles = async () => {
        try {
            console.log("fetching resellers");
            setIsLoading(true);

            const response = await axios.get(`/profile/get-all-profiles`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            console.log(response.data, "data");

            setProfiles(response?.data);
            // setFilters((prev) => {
            //     return {
            //         ...prev,
            //         totalResellers: response.data?.totalResellers,
            //     };
            // });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchActiveProfile = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/profile/b2b/get-selected/${id}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            console.log(response.data, "active profile");

            setSelectedProfile(response.data.selectedProfile);

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    useEffect(() => {
        fetchProfiles();
    }, [id]);

    useEffect(() => {
        fetchActiveProfile();
    }, [id]);

    const handleSubmit = async () => {
        try {
            console.log("fetching resellers");
            setIsLoading(true);

            const data = {
                profileId: selectedProfile,
                resellerId: id,
            };

            const response = await axios.post(
                `/profile/b2b/applyProfile`,
                data,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsProfileOpen(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="p-4">
            <div className="mb-5 shadow-sm">
                <div className="bg-[#f3f6f9] p-3 ">
                    <h1>Link Markup Profile</h1>
                </div>

                <div className="flex justify-start gap-10 p-5   ">
                    <select
                        name="markupType"
                        value={selectedProfile || ""}
                        onChange={handleChange}
                        className="w-[200px] h-[40px]"
                        disabled={!isProfileOpen}
                    >
                        <option value="" hidden>
                            Choose Profile
                        </option>

                        {profiles?.map((profile, index) => {
                            return (
                                <option value={profile?._id}>
                                    {profile?.name}
                                </option>
                            );
                        })}
                    </select>{" "}
                    <div className="flex justify-between">
                        {isProfileOpen ? (
                            <button
                                className="w-[50px] bg-green-500"
                                onClick={handleSubmit}
                            >
                                Apply{" "}
                            </button>
                        ) : (
                            <button
                                className="w-[150px]"
                                onClick={() => setIsProfileOpen(true)}
                            >
                                Change Profile{" "}
                            </button>
                        )}{" "}
                        {/* {selectedProfile !== "" && !isProfileOpen ? (
                            <div className="pl-3">
                                <Link to={`profile/edit`}>
                                    <button className="w-[50px]">Edit </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="pl-3">
                                <button
                                    className="w-[70px]"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    Cancel{" "}
                                </button>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
            {selectedProfile && !isProfileOpen ? (
                <div>
                    <EditB2bMarkupProfilePage
                        selectedProfile={selectedProfile}
                    />
                </div>
            ) : (
                ""
            )}

            {/* <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Module</th>
                            <th className="font-[500] p-3">MarkupType</th>
                            <th className="font-[500] p-3">markup</th>
                            <th className="font-[500] p-3">Updated Date</th>
                            <th className="font-[500] p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-b border-tableBorderColor">
                            <td className="p-3">Attraction</td>
                            <td className="p-3 capitalize">
                                {attractionData?.markupType
                                    ? attractionData?.markupType
                                    : "N/A"}{" "}
                            </td>
                            <td className="p-3 capitalize">
                                <span>
                                    {attractionData?.markup
                                        ? priceConversion(
                                              attractionData?.markup,
                                              selectedCurrency,
                                              true
                                          )
                                        : "N/A"}{" "}
                                </span>
                            </td>
                            <td className="p-3">
                                {attractionData?.updatedAt
                                    ? attractionData?.updatedAt?.slice(0, 10)
                                    : "N/A"}{" "}
                            </td>
                            <td
                                className="p-3 capitalize underline text-blue-500 cursor-pointer"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Edit
                            </td>
                        </tr>
                        <tr className="border-b border-tableBorderColor">
                            <td className="p-3">Visa</td>
                            <td className="p-3 capitalize">
                                {visaData?.markupType
                                    ? visaData?.markupType
                                    : "N/A"}{" "}
                            </td>
                            <td className="p-3 capitalize">
                                <span>
                                    {visaData?.markup
                                        ? priceConversion(
                                              visaData?.markup,
                                              selectedCurrency,
                                              true
                                          )
                                        : "N/A"}{" "}
                                </span>
                            </td>
                            <td className="p-3">
                                {visaData?.updatedAt
                                    ? visaData?.updatedAt?.slice(0, 10)
                                    : "N/A"}{" "}
                            </td>
                            <td
                                className="p-3 capitalize underline text-blue-500 cursor-pointer"
                                onClick={() => setIsVisaModalOpen(true)}
                            >
                                Edit
                            </td>
                        </tr>
                        <tr className="border-b border-tableBorderColor">
                            <td className="p-3">A2A</td>
                            <td className="p-3 capitalize">
                                {a2aData?.markupType
                                    ? a2aData?.markupType
                                    : "N/A"}{" "}
                            </td>
                            <td className="p-3 capitalize">
                                <span>
                                    {a2aData?.markup
                                        ? priceConversion(
                                              a2aData?.markup,
                                              selectedCurrency,
                                              true
                                          )
                                        : "N/A"}{" "}
                                </span>
                            </td>
                            <td className="p-3">
                                {a2aData?.updatedAt
                                    ? a2aData?.updatedAt?.slice(0, 10)
                                    : "N/A"}{" "}
                            </td>
                            <td
                                className="p-3 capitalize underline text-blue-500 cursor-pointer"
                                onClick={() => setIsA2aModalOpen(true)}
                            >
                                Edit
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <AddMarkupModal
                    setIsModalOpen={setIsModalOpen}
                    data={attractionData}
                    setData={setAttractionData}
                />
            )}

            {isVisaModalOpen && (
                <AddVisaMarkupModal
                    setIsVisaModalOpen={setIsVisaModalOpen}
                    data={visaData}
                    setData={setVisaData}
                />
            )}

            {isA2aModalOpen && (
                <AddA2aMarkupModal
                    setIsA2aModalOpen={setIsA2aModalOpen}
                    data={a2aData}
                    setData={setA2aData}
                />
            )} */}
        </div>
    );
}
