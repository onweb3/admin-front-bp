import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BtnLoader, PageLoader } from "../../components";
import { useImageChange } from "../../hooks";
import { config } from "../../constants";
import axios from "axios";

export default function EditInitialDataPage() {
    const [data, setData] = useState({
        PRODUCTION: "production",
        JWT_SECRET: "",
        PAYPAL_CLIENT_ID: "",
        PAYPAL_CLIENT_SECRET: "",
        EMAIL: "",
        PASSWORD: "",
        CCAVENUE_MERCHANT_ID: "",
        CCAVENUE_ACCESS_CODE: "",
        CCAVENUE_WORKING_KEY: "",
        RAZORPAY_KEY_ID: "",
        RAZORPAY_KEY_SECRET: "",
        SERVER_URL: "",
        REACT_APP_URL: "",
        B2B_WEB_URL: "",
        ADMIN_WEB_URL: "",
        BURJ_KHALIFA_USERNAME: "",
        BURJ_KHALIFA_PASSWORD: "",
        INSURANCE_SERVER_URL: "",
        WHATSAPP_SERVER_URL: "",
        CYGNET_USERNAME: "",
        CYGNET_PASSWORD: "",
        CYGNET_TENANT: "",
        CYGNET_AGENCY: "",
        HOTEL_BEDS_URL: "",
        HOTEL_BEDS_API_KEY: "",
        HOTEL_BEDS_SECRET: "",
        FLIGHT_SERVER_URL: "",
        COMPANY_NAME: "",
        COMPANY_REGISTRATION_NAME: "",
        COMPANY_LOGO: "",
        NODE_ENV: "",
        REDIS_REQUIRED: true,
        LOGIN_AGENTCODE_REQUIRED: true,
        NOTIFICATION_KEY: "",
        OTTILA_BASE_URL: "",
        OTTILA_USERNAME: "",
        OTTILA_PASSWORD: "",
        DATA_FEED: "",
        FAV_IMAGE: "",
        COMPANY_SHORT_NAME: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [apis, setApis] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { image, handleImageChange, error: imageError } = useImageChange();
    const {
        image: logoImg,
        handleImageChange: handleLogoImgChange,
        error: logoImgError,
    } = useImageChange();
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

            const formData = new FormData();
            formData.append("PAYPAL_CLIENT_ID", data?.PAYPAL_CLIENT_ID || "");
            formData.append(
                "PAYPAL_CLIENT_SECRET",
                data.PAYPAL_CLIENT_SECRET || ""
            );
            formData.append("EMAIL", data.EMAIL || "");
            formData.append("PASSWORD", data.PASSWORD || "");
            formData.append(
                "CCAVENUE_MERCHANT_ID",
                data.CCAVENUE_MERCHANT_ID || ""
            );
            formData.append(
                "CCAVENUE_ACCESS_CODE",
                data.CCAVENUE_ACCESS_CODE || ""
            );
            formData.append(
                "CCAVENUE_WORKING_KEY",
                data.CCAVENUE_WORKING_KEY || ""
            );
            formData.append("RAZORPAY_KEY_ID", data.RAZORPAY_KEY_ID || "");
            formData.append(
                "RAZORPAY_KEY_SECRET",
                data.RAZORPAY_KEY_SECRET || ""
            );
            formData.append("SERVER_URL", data.SERVER_URL || "");
            formData.append("REACT_APP_URL", data.REACT_APP_URL || "");
            formData.append("B2B_WEB_URL", data.B2B_WEB_URL || "");
            formData.append("ADMIN_WEB_URL", data.ADMIN_WEB_URL || "");
            formData.append(
                "BURJ_KHALIFA_USERNAME",
                data.BURJ_KHALIFA_USERNAME || ""
            );
            formData.append(
                "BURJ_KHALIFA_PASSWORD",
                data.BURJ_KHALIFA_PASSWORD || ""
            );
            formData.append(
                "INSURANCE_SERVER_URL",
                data.INSURANCE_SERVER_URL || ""
            );
            formData.append(
                "WHATSAPP_SERVER_URL",
                data.WHATSAPP_SERVER_URL || ""
            );
            formData.append("CYGNET_USERNAME", data.CYGNET_USERNAME || "");
            formData.append("CYGNET_PASSWORD", data.CYGNET_PASSWORD || "");
            formData.append("CYGNET_TENANT", data.CYGNET_TENANT || "");
            formData.append("CYGNET_AGENCY", data.CYGNET_AGENCY || "");
            formData.append("HOTEL_BEDS_URL", data.HOTEL_BEDS_URL || "");
            formData.append(
                "HOTEL_BEDS_API_KEY",
                data.HOTEL_BEDS_API_KEY || ""
            );
            formData.append("HOTEL_BEDS_SECRET", data.HOTEL_BEDS_SECRET || "");
            formData.append("FLIGHT_SERVER_URL", data.FLIGHT_SERVER_URL || "");
            formData.append("COMPANY_NAME", data.COMPANY_NAME || "");
            formData.append(
                "COMPANY_REGISTRATION_NAME",
                data.COMPANY_REGISTRATION_NAME || ""
            );
            formData.append("COMPANY_LOGO", data.COMPANY_LOGO || "");
            formData.append("NODE_ENV", data.NODE_ENV || "");
            formData.append("REDIS_REQUIRED", data.REDIS_REQUIRED || true);
            formData.append(
                "LOGIN_AGENTCODE_REQUIRED",
                data.LOGIN_AGENTCODE_REQUIRED || false
            );
            formData.append("NOTIFICATION_KEY", data.NOTIFICATION_KEY || "");
            formData.append("OTTILA_BASE_URL", data.OTTILA_BASE_URL || "");
            formData.append("OTTILA_USERNAME", data.OTTILA_USERNAME || "");
            formData.append("OTTILA_PASSWORD", data.OTTILA_PASSWORD || "");
            formData.append("DATA_FEED", data.DATA_FEED || false);
            formData.append("FAV_IMAGE", data.FAV_IMAGE || "");
            formData.append(
                "COMPANY_SHORT_NAME",
                data.COMPANY_SHORT_NAME || ""
            );

            await axios.patch(`${config.SERVER_URL}/initial`, formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/settings");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(
                `${config.SERVER_URL}/initial/company`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const {
                PRODUCTION,
                JWT_SECRET,
                PAYPAL_CLIENT_ID,
                PAYPAL_CLIENT_SECRET,
                EMAIL,
                PASSWORD,
                CCAVENUE_MERCHANT_ID,
                CCAVENUE_ACCESS_CODE,
                CCAVENUE_WORKING_KEY,
                RAZORPAY_KEY_ID,
                RAZORPAY_KEY_SECRET,
                SERVER_URL,
                REACT_APP_URL,
                B2B_WEB_URL,
                ADMIN_WEB_URL,
                BURJ_KHALIFA_USERNAME,
                BURJ_KHALIFA_PASSWORD,
                INSURANCE_SERVER_URL,
                WHATSAPP_SERVER_URL,
                CYGNET_USERNAME,
                CYGNET_PASSWORD,
                CYGNET_TENANT,
                CYGNET_AGENCY,
                HOTEL_BEDS_URL,
                HOTEL_BEDS_API_KEY,
                HOTEL_BEDS_SECRET,
                FLIGHT_SERVER_URL,
                COMPANY_NAME,
                COMPANY_REGISTRATION_NAME,
                COMPANY_LOGO,
                NODE_ENV,
                REDIS_REQUIRED,
                LOGIN_AGENTCODE_REQUIRED,
                NOTIFICATION_KEY,
                OTTILA_BASE_URL,
                OTTILA_USERNAME,
                OTTILA_PASSWORD,
                DATA_FEED,
                FAV_IMAGE,
                COMPANY_SHORT_NAME,
            } = response?.data?.data[0];
            setData((prev) => {
                return {
                    ...prev,
                    PRODUCTION,
                    JWT_SECRET,
                    PAYPAL_CLIENT_ID,
                    PAYPAL_CLIENT_SECRET,
                    EMAIL,
                    PASSWORD,
                    CCAVENUE_MERCHANT_ID,
                    CCAVENUE_ACCESS_CODE,
                    CCAVENUE_WORKING_KEY,
                    RAZORPAY_KEY_ID,
                    RAZORPAY_KEY_SECRET,
                    SERVER_URL,
                    REACT_APP_URL,
                    B2B_WEB_URL,
                    ADMIN_WEB_URL,
                    BURJ_KHALIFA_USERNAME,
                    BURJ_KHALIFA_PASSWORD,
                    INSURANCE_SERVER_URL,
                    WHATSAPP_SERVER_URL,
                    CYGNET_USERNAME,
                    CYGNET_PASSWORD,
                    CYGNET_TENANT,
                    CYGNET_AGENCY,
                    HOTEL_BEDS_URL,
                    HOTEL_BEDS_API_KEY,
                    HOTEL_BEDS_SECRET,
                    FLIGHT_SERVER_URL,
                    COMPANY_NAME,
                    COMPANY_REGISTRATION_NAME,
                    COMPANY_LOGO,
                    NODE_ENV,
                    REDIS_REQUIRED,
                    LOGIN_AGENTCODE_REQUIRED,
                    NOTIFICATION_KEY,
                    OTTILA_BASE_URL,
                    OTTILA_USERNAME,
                    OTTILA_PASSWORD,
                    DATA_FEED,
                    FAV_IMAGE,
                    COMPANY_SHORT_NAME,
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            setIsPageLoading(false);

            console.log(err);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">SETTINGS</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/settings" className="text-textColor">
                        settings{" "}
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
                            <div>
                                {" "}
                                <h1 className="font-[600] text-[15px]">
                                    BASIC DATA
                                </h1>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-5">
                                <div>
                                    <label htmlFor="">Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter company name"
                                        name="COMPANY_NAME"
                                        value={data.COMPANY_NAME || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Company Short Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter airline code"
                                        name="COMPANY_SHORT_NAME"
                                        value={data.COMPANY_SHORT_NAME || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">
                                        Company Registration Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter registration name"
                                        name="COMPANY_REGISTRATION_NAME"
                                        value={
                                            data.COMPANY_REGISTRATION_NAME || ""
                                        }
                                        onChange={handleChange}
                                        required
                                    />
                                </div>{" "}
                                <div className="mt-4">
                                    <label htmlFor="">Company Logo</label>
                                    <input
                                        type="file"
                                        onChange={handleLogoImgChange}
                                    />
                                    {imageError && (
                                        <span className="block text-sm text-red-500 mt-2">
                                            {imageError}
                                        </span>
                                    )}
                                    {(logoImg || data.COMPANY_LOGO) && (
                                        <div className="mt-4 w-[50px] h-[50px]">
                                            <img
                                                src={
                                                    image
                                                        ? URL.createObjectURL(
                                                              logoImg
                                                          )
                                                        : process.env
                                                              .SERVER_URL +
                                                          data.COMPANY_LOGO
                                                }
                                                alt=""
                                                className="w-[100%] h-[100%] object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="">Company Favicon</label>
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                    {imageError && (
                                        <span className="block text-sm text-red-500 mt-2">
                                            {imageError}
                                        </span>
                                    )}
                                    {(image || data.FAV_IMAGE) && (
                                        <div className="mt-4 w-[50px] h-[50px]">
                                            <img
                                                src={
                                                    image
                                                        ? URL.createObjectURL(
                                                              image
                                                          )
                                                        : process.env
                                                              .SERVER_URL +
                                                          data.FAV_IMAGE
                                                }
                                                alt=""
                                                className="w-[100%] h-[100%] object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                {" "}
                                <h1 className="font-[600] text-[15px] mt-5">
                                    CREDENTIALS
                                </h1>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-5">
                                <div>
                                    <label htmlFor="">PayPal Clinet Id</label>
                                    <input
                                        type="text"
                                        placeholder="Enter payPal clinetId"
                                        name="PAYPAL_CLIENT_ID"
                                        value={data.PAYPAL_CLIENT_ID || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">
                                        PayPal Clinet Secret
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter PayPal clinet secret"
                                        name="PAYPAL_CLIENT_SECRET"
                                        value={data.PAYPAL_CLIENT_SECRET || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-5">
                                <div>
                                    <label htmlFor="">
                                        CC Avenue Merchant Id
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter merchant Id"
                                        name="CCAVENUE_MERCHANT_ID"
                                        value={data.CCAVENUE_MERCHANT_ID || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">
                                        CC Avenue Access Code{" "}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter access code"
                                        name="CCAVENUE_ACCESS_CODE"
                                        value={data.CCAVENUE_ACCESS_CODE || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">
                                        CC Avenue Working Key{" "}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter working key"
                                        name="CCAVENUE_WORKING_KEY"
                                        value={data.CCAVENUE_WORKING_KEY || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-5">
                                <div>
                                    <label htmlFor="">Email</label>
                                    <input
                                        type="text"
                                        placeholder="Enter email"
                                        name="EMAIL"
                                        value={data.EMAIL || ""}
                                        onChange={handleChange}
                                    />
                                </div>{" "}
                                <div>
                                    <label htmlFor="">Email Password</label>
                                    <input
                                        type="text"
                                        placeholder="Enter password"
                                        name="PASSWORD"
                                        value={data.PASSWORD || ""}
                                        onChange={handleChange}
                                    />
                                </div>{" "}
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-5">
                                <div>
                                    <label htmlFor="">
                                        Burjkhalifa Username
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter burjkhalifa username"
                                        name="BURJ_KHALIFA_USERNAME"
                                        value={data.BURJ_KHALIFA_USERNAME || ""}
                                        onChange={handleChange}
                                    />
                                </div>{" "}
                                <div>
                                    <label htmlFor="">
                                        Burjkhalifa Password
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter burjkhalifa password"
                                        name="BURJ_KHALIFA_PASSWORD"
                                        value={data.BURJ_KHALIFA_PASSWORD || ""}
                                        onChange={handleChange}
                                    />
                                </div>{" "}
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-5">
                                <div>
                                    <label htmlFor="">Cygnet Username</label>
                                    <input
                                        type="text"
                                        placeholder="Enter username"
                                        name="CYGNET_USERNAME"
                                        value={data.CYGNET_USERNAME || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Cygnet Password </label>
                                    <input
                                        type="number"
                                        placeholder="Enter Password"
                                        name="CYGNET_PASSWORD"
                                        value={data.CYGNET_PASSWORD || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Cygnet Tenant</label>
                                    <input
                                        type="text"
                                        placeholder="Enter tenant"
                                        name="CYGNET_TENANT"
                                        value={data.CYGNET_TENANT || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Cygnet Agency</label>
                                    <input
                                        type="text"
                                        placeholder="Enter agency name"
                                        name="CYGNET_AGENCY"
                                        value={data.CYGNET_AGENCY || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-5">
                                <div>
                                    <label htmlFor="">HotelBeds URL</label>
                                    <input
                                        type="text"
                                        placeholder="Enter url"
                                        name="HOTEL_BEDS_URL"
                                        value={data.HOTEL_BEDS_URL || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">HotelBeds API Key </label>
                                    <input
                                        type="text"
                                        placeholder="Enter api key"
                                        name="HOTEL_BEDS_API_KEY"
                                        value={data.HOTEL_BEDS_API_KEY || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">HotelBeds Secret</label>
                                    <input
                                        type="text"
                                        placeholder="Enter secret"
                                        name="HOTEL_BEDS_SECRET"
                                        value={data.HOTEL_BEDS_SECRET || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-5">
                                <div>
                                    <label htmlFor="">Ottila URL</label>
                                    <input
                                        type="text"
                                        placeholder="Enter url"
                                        name="OTTILA_BASE_URL"
                                        value={data.OTTILA_BASE_URL || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Ottila User Name </label>
                                    <input
                                        type="number"
                                        placeholder="Enter username"
                                        name="OTTILA_USERNAME"
                                        value={data.OTTILA_USERNAME || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Ottila Password</label>
                                    <input
                                        type="text"
                                        placeholder="Enter password"
                                        name="OTTILA_PASSWORD"
                                        value={data.OTTILA_PASSWORD || ""}
                                        onChange={handleChange}
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
                                        "Update Airline"
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
