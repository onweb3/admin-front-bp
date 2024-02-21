import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader } from "../../components";
import { useImageChange } from "../../hooks";

export default function B2cMarkupProfilePage() {
    const [data, setData] = useState({
        profileId: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [profiles, setProfiles] = useState([]);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { image, handleImageChange, error: imageError } = useImageChange();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.post("/profile/b2c/update", data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            // navigate("/airlines");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`/profile/b2c`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setData((prev) => {
                return {
                    ...prev,
                    ["profileId"]: response?.data?.selectedProfile,
                };
            });
        } catch (err) {
            console.log(err);
        }
    };

    const fetchProfiles = async () => {
        try {
            const response = await axios.get(`/profile/get-all-profiles`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setProfiles(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProfiles();
        fetchProfile();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">UPDATE B2C PROFILE </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/profile" className="text-textColor">
                        b2c Profile{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="">profileS</label>
                                <select
                                    name="profileId"
                                    value={data.profileId || ""}
                                    onChange={handleChange}
                                    id=""
                                    required
                                    className="capitalize"
                                >
                                    <option value="" hidden>
                                        Select Profiles
                                    </option>
                                    {profiles?.map((profile, index) => {
                                        return (
                                            <option
                                                value={profile?._id}
                                                key={index}
                                            >
                                                {profile?.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button className="w-[120px]">
                                {isLoading ? <BtnLoader /> : "Update Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
