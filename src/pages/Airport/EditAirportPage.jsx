import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import {
    BtnLoader,
    MultipleSelectDropdown,
    PageLoader,
} from "../../components";

export default function EditAirportPage() {
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
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);
    const navigate = useNavigate();
    const { id } = useParams();

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

            await axios.patch(`/airports/update/${id}`, data, {
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

    const fetchAirports = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get(`/airports/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            const {
                airportName,
                iataCode,
                icaoCode,
                country,
                place,
                latitude,
                longitude,
                access,
            } = response.data;
            setData((prev) => {
                return {
                    ...prev,
                    airportName,
                    iataCode,
                    icaoCode,
                    country,
                    place,
                    latitude,
                    longitude,
                    access,
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAirports();
    }, []);

    const handleAccessChange = (selectedData) => {
        setData((prev) => {
            return { ...prev, access: selectedData };
        });
    };

    console.log(data.access, "access", data.access);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">EDIT AIRPORT</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/airports" className="text-textColor">
                        Airports{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>
            {isPageLoading ? (
                <PageLoader />
            ) : (
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
                                <div className="pt-6">
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
                                <button className="w-[130px]">
                                    {isLoading ? (
                                        <BtnLoader />
                                    ) : (
                                        "Update Airport"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
