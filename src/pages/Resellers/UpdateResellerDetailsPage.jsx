import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { BtnLoader, PageLoader } from "../../components";
import axios from "../../axios";

export default function UpdateResellerDetailsPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [data, setData] = useState({
        companyName: "",
        address: "",
        website: "",
        country: "",
        city: "",
        zipCode: "",
        designation: "",
        name: "",
        phoneNumber: "",
        email: "",
        skypeId: "",
        whatsappNumber: "",
        password: "",
        trnNumber: "",
        companyRegistration: "",
        telephoneNumber: "",
        status: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);
    const [error, setError] = useState("");
    const { id } = useParams();

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);
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

            await axios.patch(`/resellers/update/${id}?sendEmail=${sendEmail}`, data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            navigate(-1);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const fetchResellerData = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/resellers/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            const {
                companyName,
                address,
                website,
                country,
                city,
                zipCode,
                designation,
                name,
                phoneNumber,
                email,
                skypeId,
                whatsappNumber,
                trnNumber,
                companyRegistration,
                telephoneNumber,
                status,
            } = response.data;
            setData((prev) => {
                return {
                    ...prev,
                    companyName,
                    address,
                    website,
                    country,
                    city,
                    zipCode,
                    designation,
                    name,
                    phoneNumber,
                    email,
                    skypeId,
                    whatsappNumber,
                    trnNumber,
                    companyRegistration,
                    telephoneNumber,
                    status,
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchResellerData();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Edit Reseller</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/b2b" className="text-textColor">
                        b2b{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to={`/b2b/${id}`} className="text-textColor">
                        {id?.slice(0, 3)}...{id?.slice(-3)}
                    </Link>
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
                            <h2 className="font-[600] text-lg mb-3">Company Information</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="">Company Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Company Name"
                                        name="companyName"
                                        value={data.companyName || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Address *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Company Address"
                                        name="address"
                                        value={data.address || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Website *</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: www.abc.com"
                                        name="website"
                                        value={data.website || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Country *</label>
                                    <select
                                        name="country"
                                        value={data.country || ""}
                                        onChange={handleChange}
                                        id=""
                                        className="capitalize"
                                    >
                                        <option value="" hidden>
                                            Select Country
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
                                {countries?.find((item) => item?._id === data.country)?.isocode ===
                                    "AE" && (
                                    <>
                                        <div>
                                            <label htmlFor="">TRN Number</label>
                                            <input
                                                type="text"
                                                placeholder="Enter TRN Number"
                                                name="trnNumber"
                                                value={data.trnNumber || ""}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="">Company Registration Number</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Company Registration Number"
                                                name="companyRegistration"
                                                value={data.companyRegistration || ""}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label htmlFor="">City *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter City"
                                        name="city"
                                        value={data.city || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Zipcode</label>
                                    <input
                                        type="number"
                                        placeholder="Enter Zipcode"
                                        name="zipCode"
                                        value={data.zipCode || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <h2 className="font-[600] text-lg mb-3 mt-8">Personal Information</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="">Agent Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: John Deo"
                                        name="name"
                                        value={data.name || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Phone Number *</label>
                                    <div className="flex items-center gap-[10px]">
                                        <input
                                            type="text"
                                            disabled
                                            value={
                                                data.country && countries?.length > 0
                                                    ? countries.find(
                                                          (item) => item?._id === data.country
                                                      )?.phonecode
                                                    : ""
                                            }
                                            className="w-[70px]"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Enter Phone Number"
                                            name="phoneNumber"
                                            value={data.phoneNumber || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="">Telephone Number</label>
                                    <div className="flex items-center gap-[10px]">
                                        <input
                                            type="text"
                                            disabled
                                            value={
                                                data.country && countries?.length > 0
                                                    ? countries.find(
                                                          (item) => item?._id === data.country
                                                      )?.phonecode
                                                    : ""
                                            }
                                            className="w-[70px]"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Enter Telephone Number"
                                            name="telephoneNumber"
                                            value={data.telephoneNumber || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="">Email *</label>
                                    <input
                                        type="email"
                                        placeholder="Ex: john@gmail.com"
                                        name="email"
                                        value={data.email || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Designation *</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Manager"
                                        name="designation"
                                        value={data.designation || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Skype Id</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Skype Id"
                                        name="skypeId"
                                        value={data.skypeId || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Whatsapp *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Whatsapp"
                                        name="whatsappNumber"
                                        value={data.whatsappNumber || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <h2 className="font-[600] text-lg mb-3 mt-8">Other Info</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="">Password</label>
                                    <input
                                        type="password"
                                        placeholder="********"
                                        name="password"
                                        value={data.password || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Status *</label>
                                    <select
                                        name="status"
                                        id=""
                                        value={data.status || ""}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" hidden>
                                            Select Status
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="ok">Ok</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="disabled">Disabled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-8">
                                <input
                                    type="checkbox"
                                    name="sendEmail"
                                    checked={sendEmail || false}
                                    onChange={(e) => setSendEmail(e.target.checked)}
                                    className="w-[15px] h-[15px]"
                                    id="sendEmail"
                                />
                                <label htmlFor="sendEmail" className="mb-0">
                                    Do you want to send email with updated credentials?
                                </label>
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
                                <button className="w-[150px]" disabled={isLoading}>
                                    {isLoading ? <BtnLoader /> : "Update Reseller"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
