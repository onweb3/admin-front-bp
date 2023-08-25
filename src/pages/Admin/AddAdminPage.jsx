import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { BtnLoader, MultipleSelectDropdown, SelectDropdown } from "../../components";
import { useImageChange } from "../../hooks";
import axios from "../../axios";

export default function AddAdminPage() {
    const [data, setData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        designation: "",
        description: "",
        joinedDate: "",
        country: "",
        city: "",
        roles: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [roles, setRoles] = useState([]);

    const {
        image: avatar,
        handleImageChange: handleAvatarChange,
        error: avatarError,
    } = useImageChange();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("designation", data.designation);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("joinedDate", data.joinedDate);
            formData.append("city", data.city);
            formData.append("country", data.country);
            formData.append("description", data.description);
            formData.append("avatar", avatar);
            formData.append("roles", JSON.stringify(data.roles));

            await axios.post("/auth/add", formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/admins");
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`/roles/all/role-names`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setRoles(response?.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    console.log(data);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Add Admin</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/admins" className="text-textColor">
                        Admins{" "}
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
                                <label htmlFor="">Name *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: John"
                                    name="name"
                                    value={data.name || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Email Address *</label>
                                <input
                                    type="email"
                                    placeholder="Ex: john@gmail.com"
                                    name="email"
                                    value={data.email || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Phone Number *</label>
                                <input
                                    type="text"
                                    placeholder="Enter phone number"
                                    name="phoneNumber"
                                    value={data.phoneNumber || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Designation *</label>
                                <input
                                    type="text"
                                    placeholder="Ex: General Manager"
                                    name="designation"
                                    value={data.designation || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Joined Date</label>
                                <input
                                    type="date"
                                    name="joinedDate"
                                    value={data.joinedDate || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Country *</label>
                                <SelectDropdown
                                    data={countries}
                                    displayName={"countryName"}
                                    valueName={"isocode"}
                                    placeholder={"Select Country"}
                                    selectedData={data.country || ""}
                                    setSelectedData={(val) => {
                                        setData((prev) => {
                                            return { ...prev, country: val };
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="">City</label>
                                <input
                                    type="text"
                                    placeholder="Enter city"
                                    name="city"
                                    value={data.city || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Roles *</label>
                                <MultipleSelectDropdown
                                    data={roles}
                                    valueName={"_id"}
                                    displayName={"roleName"}
                                    selectedData={data.roles}
                                    setSelectedData={(selRoles) => {
                                        setData((prev) => {
                                            return { ...prev, roles: selRoles };
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Avatar</label>
                            <input type="file" onChange={handleAvatarChange} />
                            {avatarError && (
                                <span className="text-sm block text-red-500 mt-2">
                                    {avatarError}
                                </span>
                            )}

                            {avatar && (
                                <div className="mt-4 w-[60px] h-[60px] rounded-full overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(avatar)}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Description</label>
                            <textarea
                                name="description"
                                placeholder="Enter description"
                                id=""
                                value={data.description || ""}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button className="w-[120px]">
                                {isLoading ? <BtnLoader /> : "Add Admin"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
