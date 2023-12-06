import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, PageLoader } from "../../components";

export default function EditVehiclePage() {
    const [data, setData] = useState({
        vehicleMake: "",
        vehicleModel: "",
        vehicleTrim: "",
        vehicleCategory: "",
        vehicleType: "",
        year: "",
        airportSeatingCapacity: "",
        normalSeatingCapacity: "",
        registrationNumber: "",
        registrationExpDate: "",
        insuranceNumber: "",
        insuranceExpDate: "",
        vinNumber: "",
        transmissionType: "automatic",
        vehicleColor: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [initialData, setInitialData] = useState({
        vehicleMakes: [],
        vehicleModels: [],
        vehicleTrims: [],
        vehicleCategories: [],
        vehicleTypes: [],
    });
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { vehicleId } = useParams();

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

            await axios.patch(`/transfers/vehicles/update/${vehicleId}`, data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/transfers/vehicles");
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const filteredVehicleModels = data.vehicleMake
        ? initialData.vehicleModels?.filter((item) => {
              return item?.vehicleMake === data.vehicleMake;
          })
        : [];
    const filteredVehicleTrims = data.vehicleModel
        ? initialData.vehicleTrims?.filter((item) => {
              return item?.vehicleModel === data.vehicleModel;
          })
        : [];
    const filteredVehicleTypes = data.vehicleCategory
        ? initialData.vehicleTypes?.filter((item) => {
              return item?.vehicleCategoryId === data.vehicleCategory;
          })
        : [];

    const fetchVehicleDetails = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/transfers/vehicles/single/${vehicleId}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setData((prev) => {
                return {
                    ...prev,
                    vehicleMake: response?.data?.vehicleMake,
                    vehicleModel: response?.data?.vehicleModel,
                    vehicleTrim: response?.data?.vehicleTrim || "",
                    vehicleCategory: response?.data?.vehicleCategory || "",
                    vehicleType: response?.data?.vehicleType || "",
                    insuranceNumber: response?.data?.insuranceNumber || "",
                    insuranceExpDate: response?.data?.insuranceExpDate || "",
                    normalSeatingCapacity: response?.data?.normalSeatingCapacity || "",
                    airportSeatingCapacity: response?.data?.airportSeatingCapacity || "",
                    registrationNumber: response?.data?.registrationNumber || "",
                    registrationExpDate: response?.data?.registrationExpDate || "",
                    transmissionType: response?.data?.transmissionType || "automatic",
                    vehicleColor: response?.data?.vehicleColor || "",
                    vinNumber: response?.data?.vinNumber || "",
                    year: response?.data?.year || "",
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVehicleDetails();
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await axios.get(`/transfers/vehicles/initial-data`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                setInitialData((prev) => {
                    return {
                        ...prev,
                        vehicleMakes: response?.data?.vehicleMakes,
                        vehicleModels: response?.data?.vehicleModels,
                        vehicleTrims: response?.data?.vehicleTrims,
                        vehicleCategories: response?.data?.vehicleCategories,
                        vehicleTypes: response?.data?.vehicleTypes,
                    };
                });
            } catch (err) {
                console.log(err);
            }
        };

        fetchInitialData();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">UPDATE VEHICLE</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/vehicles" className="text-textColor">
                        Transfers{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/transfers/vehicles" className="text-textColor">
                        Vehicles{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {vehicleId?.slice(0, 3)}...{vehicleId?.slice(-3)}
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
                                    <label htmlFor="">Vehicle Make *</label>
                                    <select
                                        name="vehicleMake"
                                        id=""
                                        value={data.vehicleMake || ""}
                                        onChange={(e) => {
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    vehicleMake: e.target.value,
                                                    vehicleModel: "",
                                                    vehicleTrim: "",
                                                };
                                            });
                                        }}
                                        required
                                    >
                                        <option value="" hidden>
                                            Select Vehicle Make
                                        </option>
                                        {initialData.vehicleMakes?.map((item, index) => {
                                            return (
                                                <option value={item?._id} key={index}>
                                                    {item?.companyName}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">Vehicle Model *</label>
                                    <select
                                        name="vehicleModel"
                                        id=""
                                        value={data.vehicleModel || ""}
                                        onChange={(e) => {
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    vehicleModel: e.target.value,
                                                    vehicleTrim: "",
                                                };
                                            });
                                        }}
                                        required
                                    >
                                        <option value="" hidden>
                                            Select Vehicle Model
                                        </option>
                                        {filteredVehicleModels?.map((item, index) => {
                                            return (
                                                <option value={item?._id} key={index}>
                                                    {item?.modelName}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">Vehicle Trim *</label>
                                    <select
                                        name="vehicleTrim"
                                        id=""
                                        value={data.vehicleTrim || ""}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" hidden>
                                            Select Vehicle Trim
                                        </option>
                                        {filteredVehicleTrims?.map((item, index) => {
                                            return (
                                                <option value={item?._id} key={index}>
                                                    {item?.trimName}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">Vehcile Category *</label>
                                    <select
                                        name="vehicleCategory"
                                        id=""
                                        value={data.vehicleCategory || ""}
                                        onChange={(e) => {
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    vehicleCategory: e.target.value,
                                                    vehicleType: "",
                                                };
                                            });
                                        }}
                                        required
                                    >
                                        <option value="" hidden>
                                            Select Vehicle Category
                                        </option>
                                        {initialData?.vehicleCategories?.map((item, index) => {
                                            return (
                                                <option value={item?._id} key={index}>
                                                    {item?.categoryName}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">Vehcile Type *</label>
                                    <select
                                        name="vehicleType"
                                        id=""
                                        value={data.vehicleType || ""}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" hidden>
                                            Select Vehicle Type
                                        </option>
                                        {filteredVehicleTypes?.map((item, index) => {
                                            return (
                                                <option value={item?._id} key={index}>
                                                    {item?.name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">Year *</label>
                                    <input
                                        type="text"
                                        name="year"
                                        value={data.year || ""}
                                        onChange={handleChange}
                                        placeholder="Ex: 2010"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Airport Seating Capacity *</label>
                                    <input
                                        type="number"
                                        name="airportSeatingCapacity"
                                        value={data.airportSeatingCapacity || ""}
                                        onChange={handleChange}
                                        placeholder="Enter Airport Seating Capacity"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Normal Seating Capacity *</label>
                                    <input
                                        type="number"
                                        name="normalSeatingCapacity"
                                        value={data.normalSeatingCapacity || ""}
                                        onChange={handleChange}
                                        placeholder="Enter Normal Seating Capacity"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Registration Number</label>
                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        value={data.registrationNumber || ""}
                                        placeholder="Enter Reg Number"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Registration Expiry Date</label>
                                    <input
                                        type="date"
                                        name="registrationExpDate"
                                        value={data.registrationExpDate || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Insurance Number</label>
                                    <input
                                        type="text"
                                        name="insuranceNumber"
                                        value={data.insuranceNumber || ""}
                                        placeholder="Enter Insurance Number"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Insurance Expiry Date</label>
                                    <input
                                        type="date"
                                        name="insuranceExpDate"
                                        value={data.insuranceExpDate || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Vin Number</label>
                                    <input
                                        type="text"
                                        name="vinNumber"
                                        value={data.vinNumber || ""}
                                        placeholder="Enter Vin Number"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Transmission Type *</label>
                                    <select
                                        id=""
                                        name="transmissionType"
                                        value={data.transmissionType || ""}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" hidden>
                                            Select Transmission Type
                                        </option>
                                        <option value="automatic">Automatic</option>
                                        <option value="manual">Manual</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">Vehicle Color</label>
                                    <input
                                        type="text"
                                        name="vehicleColor"
                                        value={data.vehicleColor || ""}
                                        placeholder="Ex: Blue"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {error && (
                                <span className="text-sm block text-red-500 mt-2">{error}</span>
                            )}
                            <div className="mt-4 flex items-center justify-end gap-[12px]">
                                <button
                                    className="bg-slate-300 text-textColor px-[15px]"
                                    type="button"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>
                                <button className="w-[140px]">
                                    {isLoading ? <BtnLoader /> : "Update Vehicle"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
