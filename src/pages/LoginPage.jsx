import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "../axios";
import { setAdmin } from "../redux/slices/adminSlice";
import { logoPng } from "../assets/images";
import { BtnLoader } from "../components";
import { config } from "../constants";

export default function LoginPage() {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const { company } = useSelector((state) => state.admin);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const response = await axios.post("/auth/login", data);

            dispatch(setAdmin(response.data));
            navigate("/");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex items-center gap-[10px] mb-10">
                <img
                    src={`${import.meta.env.VITE_SERVER_URL}/${
                        company.COMPANY_LOGO
                    }`}
                    alt=""
                    className="w-[230px]"
                />
            </div>
            <div className="w-full max-w-[420px] border p-7 rounded bg-white">
                <div className="mb-5">
                    <h1 className="font-[600] text-xl text-center">Login</h1>
                    <span className="block text-center text-sm text-gray-500 mt-1">
                        Welcome back to {company?.COMPANY_NAME}
                    </span>
                </div>
                <form action="" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="">Email</label>
                        <input
                            type="email"
                            placeholder="Ex: example@gmail.com"
                            name="email"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            name="password"
                            onChange={handleChange}
                        />
                    </div>
                    {error && (
                        <span className="block text-sm text-red-500 mt-2">
                            {error}
                        </span>
                    )}
                    <button className="w-full mt-4">
                        {isLoading ? <BtnLoader /> : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
