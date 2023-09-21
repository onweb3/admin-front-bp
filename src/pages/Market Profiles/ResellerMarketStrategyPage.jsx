import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link, useOutletContext, useParams } from "react-router-dom";
import axios from "../../axios";

export default function ResellerMarketStrategyPage({}) {
    const { id } = useParams();
    const { reseller } = useOutletContext();

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(
        reseller?.marketStrategy || ""
    );
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);

    const { selectedCurrency } = useSelector((state) => state.general);

    const handleChange = (e) => {
        setSelectedProfile(e.target.value);
    };

    const fetchProfiles = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/market/get-all-profiles`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setProfiles(response?.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [id]);

    const handleSubmit = async () => {
        try {
            console.log("fetching resellers");
            setIsLoading(true);

            const data = {
                profileId: selectedProfile,
                resellerId: id,
            };

            const response = await axios.patch(
                `/market/b2b/applyProfile`,
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
                    <h1>Link Market Strategy</h1>
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
                            Choose Market
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
                                Change Market{" "}
                            </button>
                        )}{" "}
                    </div>
                </div>
            </div>
        </div>
    );
}
