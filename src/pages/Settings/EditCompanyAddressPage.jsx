import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, PageLoader, SelectDropdown } from "../../components";

export default function EditCompanyAddressPage() {
    const [data, setData] = useState({
        location: "",
        companyName: "",
        country: "",
        state: "",
        address: "",
        phoneNumber: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [error, setError] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries, states } = useSelector((state) => state.general);
    const navigate = useNavigate();
    const { addressId } = useParams();

    const filteredStates = data.country ? states?.filter((state) => state?.country === data?.country) : [];

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleUpdateAddress = async () => {
        try {
            setIsLoading(true);
            setError("");

            await axios.patch(`/company/addresses/update/${addressId}`, data, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            navigate("/company/addresses");
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong");
            setIsLoading(false);
        }
    };

    const fetchCompanyAddress = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/company/addresses/single/${addressId}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setData((prev) => {
                return {
                    ...prev,
                    location: response.data?.location,
                    companyName: response.data?.companyName,
                    country: response.data?.country,
                    state: response.data?.state,
                    address: response.data?.address,
                    phoneNumber: response.data?.phoneNumber,
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCompanyAddress();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">EDIT ADDRESS</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Company </span>
                    <span>{">"} </span>
                    <Link to="/company/addresses" className="text-textColor">
                        Addresses{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {addressId?.slice(0, 3)}...{addressId?.slice(-3)}{" "}
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
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="">Location</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Dubai"
                                    name="location"
                                    value={data.location || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Company Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter company name"
                                    name="companyName"
                                    value={data.companyName || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Country</label>
                                <SelectDropdown
                                    data={countries}
                                    displayName="countryName"
                                    placeholder="Select Country"
                                    valueName={"_id"}
                                    selectedData={data.country || ""}
                                    setSelectedData={(val) => {
                                        setData((prev) => {
                                            return { ...prev, country: val };
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="">State</label>
                                <SelectDropdown
                                    data={filteredStates}
                                    displayName="stateName"
                                    placeholder="Select State"
                                    valueName={"_id"}
                                    selectedData={data.state || ""}
                                    setSelectedData={(val) => {
                                        setData((prev) => {
                                            return { ...prev, state: val };
                                        });
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Address</label>
                                <input
                                    type="text"
                                    placeholder="Enter address"
                                    name="address"
                                    value={data.address || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Phone Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter phone number"
                                    name="phoneNumber"
                                    value={data.phoneNumber || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
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
                            <button className="w-[150px]" onClick={handleUpdateAddress}>
                                {isLoading ? <BtnLoader /> : "Update Address"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
