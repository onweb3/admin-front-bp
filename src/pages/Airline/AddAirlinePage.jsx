import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader } from "../../components";
import { useImageChange } from "../../hooks";

export default function AddAirlinePage() {
    const [data, setData] = useState({
        airlineName: "",
        icaoCode: "",
        iataCode: "",
        airlineCode: "",
        api: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [apis, setApis] = useState([]);

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

            const formData = new FormData();
            formData.append("airlineName", data.airlineName);
            formData.append("airlineCode", data.airlineCode);
            formData.append("iataCode", data.iataCode);
            formData.append("icaoCode", data.icaoCode);
            formData.append("api", data.api);
            formData.append("image", image);

            await axios.post("/airlines/add", formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/airlines");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchFlightApis = async () => {
        try {
            const response = await axios.get(`/api-master/all/flight`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setApis(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchFlightApis();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">ADD AIRLINE</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/airports" className="text-textColor">
                        Airlines{" "}
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
                                <label htmlFor="">Airline Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter airline name"
                                    name="airlineName"
                                    value={data.airlineName || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Airline Code</label>
                                <input
                                    type="number"
                                    placeholder="Enter airline code"
                                    name="airlineCode"
                                    value={data.airlineCode || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">IATA Code</label>
                                <input
                                    type="text"
                                    placeholder="Enter IATA code"
                                    name="iataCode"
                                    value={data.iataCode || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">ICAO Code</label>
                                <input
                                    type="text"
                                    placeholder="Enter ICAO code"
                                    name="icaoCode"
                                    value={data.icaoCode || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">API</label>
                                <select
                                    name="api"
                                    value={data.api || ""}
                                    onChange={handleChange}
                                    id=""
                                    required
                                    className="capitalize"
                                >
                                    <option value="" hidden>
                                        Select API
                                    </option>
                                    {apis?.map((api, index) => {
                                        return (
                                            <option
                                                value={api?._id}
                                                key={index}
                                            >
                                                {api?.apiName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Image</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                required
                            />
                            {imageError && (
                                <span className="block text-sm text-red-500 mt-2">
                                    {imageError}
                                </span>
                            )}
                            {image && (
                                <div className="mt-4 w-[50px] h-[50px]">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt=""
                                        className="w-[100%] h-[100%] object-cover"
                                    />
                                </div>
                            )}
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
                                {isLoading ? <BtnLoader /> : "Add Airline"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
