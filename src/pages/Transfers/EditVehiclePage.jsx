import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader } from "../../components";
import { useImageChange } from "../../hooks";
import { config } from "../../constants";

export default function EditVehiclePage() {
    const [data, setData] = useState({
        name: "",
        normalOccupancy: "",
        airportOccupancy: "",
        image: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [places, setPlaces] = useState([]);
    const { id } = useParams();

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { image, handleImageChange, error: imageError } = useImageChange();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchVehicle = async () => {
        try {
            const response = await axios.get(`/transfer/vehicle/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setData(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVehicle();
    }, []);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("normalOccupancy", data.normalOccupancy);
            formData.append("airportOccupancy", data.airportOccupancy);
            formData.append("image", image);

            await axios.patch(`/transfer/vehicle/update/${id}`, formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/transfers/vehicle");
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
                <h1 className="font-[600] text-[15px]">
                    ADD QUOTATION VEHICLE
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/airports" className="text-textColor">
                        Quotation Vehicle{" "}
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
                                <label htmlFor="">Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter name "
                                    name="name"
                                    value={data.name || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Airport Occupany</label>
                                <input
                                    type="number"
                                    placeholder="Enter occupany "
                                    name="airportOccupancy"
                                    value={data.airportOccupancy || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Normal Occupancy</label>
                                <input
                                    type="text"
                                    placeholder="Enter occupany "
                                    name="normalOccupancy"
                                    value={data.normalOccupancy || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="">
                                <label htmlFor="">Image</label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                {imageError && (
                                    <span className="block text-sm text-red-500 mt-2">
                                        {imageError}
                                    </span>
                                )}
                                {(image || data.image) && (
                                    <div className="mt-4 w-[50px] h-[50px]">
                                        <img
                                            src={
                                                image
                                                    ? URL.createObjectURL(image)
                                                    : config.SERVER_URL +
                                                      data.image
                                            }
                                            alt=""
                                            className="w-[100%] h-[100%] object-cover"
                                        />
                                    </div>
                                )}
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
                                {isLoading ? <BtnLoader /> : "Add Transfer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
