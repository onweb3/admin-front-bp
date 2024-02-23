import React, { useState } from "react";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { BtnLoader } from "../../components";

export default function ChangePasswordPage() {
    const [data, setData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);

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

            await axios.patch(`/auth/update/password`, data, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form action="" onSubmit={handleSubmit}>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="">Old Password*</label>
                        <input
                            type="password"
                            placeholder="Enter current password"
                            name="oldPassword"
                            value={data.oldPassword || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="">New Password*</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            name="newPassword"
                            value={data.newPassword || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="">Confirm Password*</label>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            name="confirmPassword"
                            value={data.confirmPassword || ""}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <span className="block text-sm text-grayColor mt-3">
                    Password must be strong. At least one alphabet. At least one
                    digit. At least one special character. Minimum eight in
                    length
                </span>

                {error && (
                    <span className="text-sm text-red-500 block mt-3">
                        {error}
                    </span>
                )}

                <div className="flex items-center justify-end mt-5">
                    <button className="w-[180px]">
                        {isLoading ? <BtnLoader /> : "Change Password"}
                    </button>
                </div>
            </form>
        </div>
    );
}
