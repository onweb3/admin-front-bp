import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { BtnLoader, MultipleSelectDropdown, PageLoader, SelectDropdown } from "../../components";
import axios from "../../axios";

export default function EditDriverPage() {
    const [data, setData] = useState({
        driverName: "",
        nationality: "",
        email: "",
        phoneNumber: "",
        whatsappNumber: "",
        licenseNumber: "",
        licenseExpDate: "",
        availLicenseTypes: [],
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [initialData, setInitialData] = useState({
        licenseTypes: [],
    });
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);
    const { driverId } = useParams();

    const navigate = useNavigate();

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

            await axios.patch(`/drivers/update/${driverId}`, data, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            navigate("/drivers");
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const fetchDriverDetails = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/drivers/single/${driverId}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setData((prev) => {
                return {
                    ...prev,
                    driverName: response?.data?.driverName,
                    nationality: response?.data?.nationality,
                    email: response?.data?.email,
                    phoneNumber: response?.data?.phoneNumber,
                    whatsappNumber: response?.data?.whatsappNumber,
                    licenseNumber: response?.data?.licenseNumber,
                    licenseExpDate: response?.data?.licenseExpDate
                        ? new Date(response?.data?.licenseExpDate).toISOString().substring(0, 10)
                        : "",
                    availLicenseTypes: response?.data?.availLicenseTypes || [],
                };
            });

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchDriverDetails();
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await axios.get(`/drivers/license-types/all`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setInitialData((prev) => {
                    return { ...prev, licenseTypes: response?.data };
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
                <h1 className="font-[600] text-[15px]">Edit Driver</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/drivers" className="text-textColor">
                        Drivers{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {driverId?.slice(0, 3)}...{driverId?.slice(-3)}{" "}
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
                                    <label htmlFor="">Driver Name</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: John Deo"
                                        name="driverName"
                                        value={data.driverName || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Nationality</label>
                                    <SelectDropdown
                                        data={countries}
                                        valueName={"isocode"}
                                        displayName={"countryName"}
                                        placeholder={"Select Nationality"}
                                        selectedData={data.nationality}
                                        setSelectedData={(val) => {
                                            setData((prev) => {
                                                return { ...prev, nationality: val };
                                            });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Ex: example@example.com"
                                        name="email"
                                        value={data.email || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Phone Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Phone Number"
                                        name="phoneNumber"
                                        value={data.phoneNumber || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="block text-sm mt-2 text-grayColor">
                                        Include country code with mobile number
                                    </span>
                                </div>
                                <div>
                                    <label htmlFor="">Whatsapp Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Whatsapp Number"
                                        name="whatsappNumber"
                                        value={data.whatsappNumber || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className="block text-sm mt-2 text-grayColor">
                                        Include country code with mobile number
                                    </span>
                                </div>
                                <div>
                                    <label htmlFor="">License Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter License Number"
                                        name="licenseNumber"
                                        value={data.licenseNumber || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">License Expiry Date</label>
                                    <input
                                        type="date"
                                        name="licenseExpDate"
                                        value={data.licenseExpDate || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">License Types</label>
                                    <MultipleSelectDropdown
                                        data={initialData.licenseTypes || []}
                                        displayName={"licenseType"}
                                        valueName={"_id"}
                                        selectedData={data.availLicenseTypes}
                                        setSelectedData={(val) => {
                                            setData((prev) => {
                                                return { ...prev, availLicenseTypes: val };
                                            });
                                        }}
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
                                    onClick={() =>
                                        setDriverModal({
                                            isOpen: false,
                                            isEdit: false,
                                        })
                                    }
                                >
                                    Cancel
                                </button>
                                <button className="w-[150px]">
                                    {isLoading ? <BtnLoader /> : "Update Driver"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
