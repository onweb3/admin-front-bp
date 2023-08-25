import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, SelectDropdown } from "../../components";
import { updateAdmin } from "../../redux/slices/adminSlice";

export default function EditProfilePage() {
    const { admin } = useSelector((state) => state.admin);

    const { avatar, setAvatar } = useOutletContext();

    const [data, setData] = useState({
        name: admin?.name || "",
        email: admin?.email || "",
        country: admin?.country || "",
        city: admin?.city || "",
        phoneNumber: admin?.phoneNumber || "",
        designation: admin?.designation || "",
        joinedDate: new Date(admin?.joinedDate)?.toISOString()?.substring(0, 10) || "",
        description: admin?.description || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);
    const dispatch = useDispatch();

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

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("designation", data.designation);
            formData.append("joinedDate", data.joinedDate);
            formData.append("city", data.city);
            formData.append("country", data.country);
            formData.append("description", data.description);
            formData.append("avatar", avatar);

            const response = await axios.patch(`/auth/update`, formData, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            dispatch(updateAdmin(response.data));
            setAvatar("");
            setIsLoading(false);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            name="name"
                            value={data.name || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            value={data.email || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="">Phone Number</label>
                        <input
                            type="text"
                            placeholder="Enter your phone number"
                            name="phoneNumber"
                            value={data.phoneNumber || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="">Designation</label>
                        <input
                            type="text"
                            placeholder="Enter designation"
                            name="designation"
                            value={data.designation || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="">Joined Date</label>
                        <input
                            type="date"
                            name="joinedDate"
                            value={
                                data.joinedDate
                                    ? new Date(data.joinedDate).toISOString().substring(0, 10)
                                    : ""
                            }
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="">City</label>
                        <input
                            type="text"
                            placeholder="Enter your city"
                            name="city"
                            value={data.city || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="">Country</label>
                        <SelectDropdown
                            data={countries}
                            displayName={"countryName"}
                            placeholder={"Select Country"}
                            selectedData={data.country || ""}
                            valueName={"isocode"}
                            setSelectedData={(val) => {
                                return setData((prev) => {
                                    return { ...prev, country: val };
                                });
                            }}
                        />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="">Description</label>
                        <textarea
                            name="description"
                            id=""
                            placeholder="Enter description"
                            value={data.description || ""}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>

                {error && <span className="text-sm text-red-500 block mt-3">{error}</span>}

                <div className="flex items-center justify-end mt-5">
                    <button className="w-[120px]">{isLoading ? <BtnLoader /> : "Update"}</button>
                </div>
            </form>
        </div>
    );
}
