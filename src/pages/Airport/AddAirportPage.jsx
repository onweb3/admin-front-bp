import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, MultipleSelectDropdown } from "../../components";

export default function AddAirportPage() {
    const [data, setData] = useState({
        airportName: "",
        iataCode: "",
        icaoCode: "",
        country: "",
        place: "",
        latitude: "",
        longitude: "",
        access: [],
    });
    const [accessArray, setAccessArray] = useState([
        { name: "attraction" },
        { name: "flight" },
        { name: "a2a" },
        { name: "quotation" },
        { name: "visa" },
        { name: "hotel" },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleAccessChange = (selectedData) => {
        setData((prev) => {
            return { ...prev, access: selectedData };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.post("/airports/add", data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/airports");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">ADD AIRPORT</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/airports" className="text-textColor">
                        Airports{" "}
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
                                <label htmlFor="">Airport Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter airport name"
                                    name="airportName"
                                    value={data.airportName || ""}
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
                                <label htmlFor="">Country</label>
                                <select
                                    name="country"
                                    value={data.country || ""}
                                    onChange={handleChange}
                                    id=""
                                    required
                                    className="capitalize"
                                >
                                    <option value="" hidden>
                                        Select Category
                                    </option>
                                    {countries?.map((country, index) => {
                                        return (
                                            <option
                                                value={country?._id}
                                                key={index}
                                                className="capitalize"
                                            >
                                                {country?.countryName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="">Place</label>
                                <input
                                    type="text"
                                    placeholder="Enter place"
                                    name="place"
                                    value={data.place || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Latitude</label>
                                <input
                                    type="text"
                                    placeholder="Ex: 25.276987"
                                    name="latitude"
                                    value={data.latitude || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Longitude</label>
                                <input
                                    type="text"
                                    placeholder="Ex: 55.296249"
                                    name="longitude"
                                    value={data.longitude || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="pt-5">
                                <MultipleSelectDropdown
                                    data={accessArray}
                                    displayName={"name"}
                                    valueName={"name"}
                                    selectedData={data?.access}
                                    setSelectedData={(selAccess) => {
                                        handleAccessChange(selAccess);
                                    }}
                                    randomIndex={"access"}
                                />
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
                                {isLoading ? <BtnLoader /> : "Add Airport"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
