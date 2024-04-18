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
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "",
        CLOUDINARY_API_KEY: "",
        CLOUDINARY_API_SECRET: "",
        GOOGLE_CLIENT_ID: "",
        GOOGLE_CLIENT_SECRET: "",
        NEXTAUTH_SECRET: "",
        NEXTAUTH_URL: "",
        NEXT_PUBLIC_GOOGLE_ANALYTIC_ID: "",
        NEXT_PUBLIC_TABBY_PUBLIC_KEY: "",
        NEXT_PUBLIC_TABBY_MERCHANT_CODE: "",
        NEXT_PUBLIC_TOURS_URL: "",
        NEXT_PUBLIC_PLAYSTORE_URL: "",
        NEXT_PUBLIC_COMPANYADDRESS1: "",
        NEXT_PUBLIC_COMPANYADDRESS2: "",
        CLOUDINARY_FOLDER: "",
        NEXT_PUBLIC_SERVER_URL: "",
        NEXT_PUBLIC_CLIENT_URL: "",
        NEXT_PUBLIC_CDN_URL: "",
        NEXT_PUBLIC_TITLE_NAME: "",
        NEXT_PUBLIC_TITLE_SHORT_NAME: "",
        NEXT_PUBLIC_TITLE_SHORT_CODE: "",
        NEXT_PUBLIC_COMPANY_LOGO: "",
        NEXT_PUBLIC_COMPANY_FAVICON: "",
        NEXT_PUBLIC_BANNER_IMAGE: "",
        NEXT_PUBLIC_BANNER_VIDEO: "",
        NEXT_PUBLIC_BANNER_VIDEO_MOBILE: "",
        NEXT_PUBLIC_BANNER_IMAGE_MOBILE: "",
        NEXT_PUBLIC_MOBILE_APP_IMAGE: "",
        B2C_SERVER_URL: "",
        B2C_CLIENT_URL: "",
        B2C_MAP_API_KEY: "",
        B2C_TITLE_NAME: "",
        B2C_TITLE_SHORT_NAME: "",
        B2C_COMPANY_SHORT_CODE: "",
        B2C_COMPANY_B2B_URL: "",
        B2C_COMPANY_EMAIL: "",
        B2C_FACEBOOK_URL: "",
        B2C_INSTAGRAM_URL: "",
        B2C_MOBILE_APP_IMAGE: "",
        B2C_PLAYSTORE_URL: "",
        B2C_COMPANY_CONTACT_NUMBER_ONE: "",
        B2C_COMPANY_CONTACT_NUMBER_TWO: "",
        B2C_COMPANY_WHATSAPP_NUMBER: "",
        B2C_COMPANY_LOGO: "",
        B2C_COMPANY_FAVICON: "",
        B2C_LOGIN_BANNER: "",
        B2C_SIGNUP_BANNER: "",
        B2C_IS_API_INTEGRATED: "",
        B2C_API_INTEGRATION_URL: "",
        B2C_CONTACTUS_EMAIL: "",
        B2C_ENQUIRY_EMAIL: "",
        B2C_COMPANY_ADDRESS: "",
        B2C_COMPANY_CITY: "",
        B2C_COMPANY_PINCODE: "",
        B2C_COMAPNY_COUNTRY: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [apis, setApis] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [section, setSection] = useState("server");

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { image, handleImageChange, error: imageError } = useImageChange();
    const {
        image: logoImg,
        handleImageChange: handleLogoImgChange,
        error: logoImgError,
    } = useImageChange();
    const {
        image: bannerImg,
        handleImageChange: handleBannerImgChange,
        error: logoBanImgError,
    } = useImageChange();
    const {
        image: bannerImgMob,
        handleImageChange: handleBannerMobImgChange,
        error: logoBanMobImgError,
    } = useImageChange();
    const {
        image: appImg,
        handleImageChange: handleAppImgChange,
        error: logoAppImgError,
    } = useImageChange();
    const {
        image: bannerVid,
        handleImageChange: handleBannerVidChange,
        error: logoBanVidError,
    } = useImageChange();

    const {
        image: bannerMobVid,
        handleImageChange: handleBannerMobVidChange,
        error: logoBanMobVidError,
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

            await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/initial`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate("/settings");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const handleB2bSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();

            formData.append(
                "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
                data?.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
            );
            formData.append(
                "CLOUDINARY_API_KEY",
                data?.CLOUDINARY_API_KEY?.toString() || ""
            );
            formData.append(
                "CLOUDINARY_API_SECRET",
                data?.CLOUDINARY_API_SECRET || ""
            );
            formData.append("CLOUDINARY_FOLDER", data?.CLOUDINARY_FOLDER || "");
            formData.append("GOOGLE_CLIENT_ID", data?.GOOGLE_CLIENT_ID || "");
            formData.append(
                "GOOGLE_CLIENT_SECRET",
                data?.GOOGLE_CLIENT_SECRET || ""
            );
            formData.append("NEXTAUTH_SECRET", data?.NEXTAUTH_SECRET || "");
            formData.append("NEXTAUTH_URL", data?.NEXTAUTH_URL || "");
            formData.append(
                "NEXT_PUBLIC_GOOGLE_ANALYTIC_ID",
                data?.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID || ""
            );
            formData.append(
                "NEXT_PUBLIC_TABBY_PUBLIC_KEY",
                data?.NEXT_PUBLIC_TABBY_PUBLIC_KEY || ""
            );
            formData.append(
                "NEXT_PUBLIC_TABBY_MERCHANT_CODE",
                data?.NEXT_PUBLIC_TABBY_MERCHANT_CODE || ""
            );
            formData.append(
                "NEXT_PUBLIC_TOURS_URL",
                data?.NEXT_PUBLIC_TOURS_URL || ""
            );
            formData.append(
                "NEXT_PUBLIC_SERVER_URL",
                data?.NEXT_PUBLIC_SERVER_URL || ""
            );
            formData.append(
                "NEXT_PUBLIC_CLIENT_URL",
                data?.NEXT_PUBLIC_CLIENT_URL || ""
            );
            formData.append(
                "NEXT_PUBLIC_CDN_URL",
                data?.NEXT_PUBLIC_CDN_URL || ""
            );
            formData.append(
                "NEXT_PUBLIC_TITLE_NAME",
                data?.NEXT_PUBLIC_TITLE_NAME || ""
            );
            formData.append(
                "NEXT_PUBLIC_TITLE_SHORT_NAME",
                data?.NEXT_PUBLIC_TITLE_SHORT_NAME || ""
            );
            formData.append(
                "NEXT_PUBLIC_TITLE_SHORT_CODE",
                data?.NEXT_PUBLIC_TITLE_SHORT_CODE || ""
            );
            formData.append("NEXT_PUBLIC_COMPANY_LOGO", logoImg || "");
            formData.append("NEXT_PUBLIC_COMPANY_FAVICON", image || "");
            formData.append("NEXT_PUBLIC_BANNER_IMAGE", bannerImg || "");
            formData.append("NEXT_PUBLIC_BANNER_VIDEO", bannerVid || "");
            formData.append(
                "NEXT_PUBLIC_BANNER_VIDEO_MOBILE",
                bannerMobVid || ""
            );
            formData.append(
                "NEXT_PUBLIC_BANNER_IMAGE_MOBILE",
                bannerImgMob || ""
            );
            formData.append("NEXT_PUBLIC_MOBILE_APP_IMAGE", appImg || "");
            formData.append(
                "NEXT_PUBLIC_PLAYSTORE_URL",
                data?.NEXT_PUBLIC_PLAYSTORE_URL || ""
            );
            formData.append(
                "NEXT_PUBLIC_COMPANYADDRESS1",
                data?.NEXT_PUBLIC_COMPANYADDRESS1 || ""
            );
            formData.append(
                "NEXT_PUBLIC_COMPANYADDRESS2",
                data?.NEXT_PUBLIC_COMPANYADDRESS2 || ""
            );

            await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/initial`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate("/settings");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const handleB2cSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("B2C_SERVER_URL", data?.B2C_SERVER_URL || "");
            formData.append("B2C_CLIENT_URL", data?.B2C_CLIENT_URL || "");
            formData.append("B2C_MAP_API_KEY", data?.B2C_MAP_API_KEY || "");
            formData.append("B2C_TITLE_NAME", data?.B2C_TITLE_NAME || "");
            formData.append(
                "B2C_TITLE_SHORT_NAME",
                data?.B2C_TITLE_SHORT_NAME || ""
            );
            formData.append(
                "B2C_COMPANY_SHORT_CODE",
                data?.B2C_COMPANY_SHORT_CODE || ""
            );
            formData.append(
                "B2C_COMPANY_B2B_URL",
                data?.B2C_COMPANY_B2B_URL || ""
            );
            formData.append("B2C_COMPANY_EMAIL", data?.B2C_COMPANY_EMAIL || "");
            formData.append("B2C_FACEBOOK_URL", data?.B2C_FACEBOOK_URL || "");
            formData.append("B2C_INSTAGRAM_URL", data?.B2C_INSTAGRAM_URL || "");
            formData.append(
                "B2C_MOBILE_APP_IMAGE",
                data?.B2C_MOBILE_APP_IMAGE || ""
            );
            formData.append("B2C_PLAYSTORE_URL", data?.B2C_PLAYSTORE_URL || "");
            formData.append(
                "B2C_COMPANY_CONTACT_NUMBER_ONE",
                data?.B2C_COMPANY_CONTACT_NUMBER_ONE || ""
            );
            formData.append(
                "B2C_COMPANY_CONTACT_NUMBER_TWO",
                data?.B2C_COMPANY_CONTACT_NUMBER_TWO || ""
            );
            formData.append(
                "B2C_COMPANY_WHATSAPP_NUMBER",
                data?.B2C_COMPANY_WHATSAPP_NUMBER || ""
            );
            formData.append("B2C_COMPANY_LOGO", data?.B2C_COMPANY_LOGO || "");
            formData.append(
                "B2C_COMPANY_FAVICON",
                data?.B2C_COMPANY_FAVICON || ""
            );
            formData.append("B2C_LOGIN_BANNER", data?.B2C_LOGIN_BANNER || "");
            formData.append("B2C_SIGNUP_BANNER", data?.B2C_SIGNUP_BANNER || "");
            formData.append(
                "B2C_IS_API_INTEGRATED",
                data?.B2C_IS_API_INTEGRATED?.toString() || ""
            );
            formData.append(
                "B2C_API_INTEGRATION_URL",
                data?.B2C_API_INTEGRATION_URL || ""
            );
            formData.append(
                "B2C_CONTACTUS_EMAIL",
                data?.B2C_CONTACTUS_EMAIL || ""
            );
            formData.append("B2C_ENQUIRY_EMAIL", data?.B2C_ENQUIRY_EMAIL || "");
            formData.append(
                "B2C_COMPANY_ADDRESS",
                data?.B2C_COMPANY_ADDRESS || ""
            );
            formData.append("B2C_COMPANY_CITY", data?.B2C_COMPANY_CITY || "");
            formData.append(
                "B2C_COMPANY_PINCODE",
                data?.B2C_COMPANY_PINCODE || ""
            );
            formData.append(
                "B2C_COMAPNY_COUNTRY",
                data?.B2C_COMAPNY_COUNTRY || ""
            );

            await axios.patch(
                `${import.meta.env.VITE_SERVER_URL}/initial`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

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
                `${import.meta.env.VITE_SERVER_URL}/initial/company`,
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
                NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                CLOUDINARY_API_KEY,
                CLOUDINARY_API_SECRET,
                GOOGLE_CLIENT_ID,
                GOOGLE_CLIENT_SECRET,
                NEXTAUTH_SECRET,
                NEXTAUTH_URL,
                NEXT_PUBLIC_GOOGLE_ANALYTIC_ID,
                NEXT_PUBLIC_TABBY_PUBLIC_KEY,
                NEXT_PUBLIC_TABBY_MERCHANT_CODE,
                NEXT_PUBLIC_TOURS_URL,
                NEXT_PUBLIC_MOBILE_APP_iMAGE,
                NEXT_PUBLIC_PLAYSTORE_URL,
                NEXT_PUBLIC_COMPANYADDRESS1,
                NEXT_PUBLIC_COMPANYADDRESS2,
                CLOUDINARY_FOLDER,
                NEXT_PUBLIC_SERVER_URL,
                NEXT_PUBLIC_CLIENT_URL,
                NEXT_PUBLIC_CDN_URL,
                NEXT_PUBLIC_TITLE_NAME,
                NEXT_PUBLIC_TITLE_SHORT_NAME,
                NEXT_PUBLIC_TITLE_SHORT_CODE,
                NEXT_PUBLIC_COMPANY_LOGO,
                NEXT_PUBLIC_COMPANY_FAVICON,
                NEXT_PUBLIC_BANNER_IMAGE,
                NEXT_PUBLIC_BANNER_VIDEO,
                NEXT_PUBLIC_BANNER_VIDEO_MOBILE,
                NEXT_PUBLIC_BANNER_IMAGE_MOBILE,
                NEXT_PUBLIC_MOBILE_APP_IMAGE,
                B2C_SERVER_URL,
                B2C_CLIENT_URL,
                B2C_MAP_API_KEY,
                B2C_TITLE_NAME,
                B2C_TITLE_SHORT_NAME,
                B2C_COMPANY_SHORT_CODE,
                B2C_COMPANY_B2B_URL,
                B2C_COMPANY_EMAIL,
                B2C_FACEBOOK_URL,
                B2C_INSTAGRAM_URL,
                B2C_MOBILE_APP_IMAGE,
                B2C_PLAYSTORE_URL,
                B2C_COMPANY_CONTACT_NUMBER_ONE,
                B2C_COMPANY_CONTACT_NUMBER_TWO,
                B2C_COMPANY_WHATSAPP_NUMBER,
                B2C_COMPANY_LOGO,
                B2C_COMPANY_FAVICON,
                B2C_LOGIN_BANNER,
                B2C_SIGNUP_BANNER,
                B2C_IS_API_INTEGRATED,
                B2C_API_INTEGRATION_URL,
                B2C_CONTACTUS_EMAIL,
                B2C_ENQUIRY_EMAIL,
                B2C_COMPANY_ADDRESS,
                B2C_COMPANY_CITY,
                B2C_COMPANY_PINCODE,
                B2C_COMAPNY_COUNTRY,
            } = response?.data?.data[0];

            console.log(
                COMPANY_NAME,
                COMPANY_REGISTRATION_NAME,
                COMPANY_REGISTRATION_NAME,
                "MM"
            );
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
                    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                    CLOUDINARY_API_KEY,
                    CLOUDINARY_API_SECRET,
                    GOOGLE_CLIENT_ID,
                    GOOGLE_CLIENT_SECRET,
                    NEXTAUTH_SECRET,
                    NEXTAUTH_URL,
                    NEXT_PUBLIC_GOOGLE_ANALYTIC_ID,
                    NEXT_PUBLIC_TABBY_PUBLIC_KEY,
                    NEXT_PUBLIC_TABBY_MERCHANT_CODE,
                    NEXT_PUBLIC_TOURS_URL,
                    NEXT_PUBLIC_PLAYSTORE_URL,
                    NEXT_PUBLIC_COMPANYADDRESS1,
                    NEXT_PUBLIC_COMPANYADDRESS2,
                    CLOUDINARY_FOLDER,
                    NEXT_PUBLIC_SERVER_URL,
                    NEXT_PUBLIC_CLIENT_URL,
                    NEXT_PUBLIC_CDN_URL,
                    NEXT_PUBLIC_TITLE_NAME,
                    NEXT_PUBLIC_TITLE_SHORT_NAME,
                    NEXT_PUBLIC_TITLE_SHORT_CODE,
                    NEXT_PUBLIC_COMPANY_LOGO,
                    NEXT_PUBLIC_COMPANY_FAVICON,
                    NEXT_PUBLIC_BANNER_IMAGE,
                    NEXT_PUBLIC_BANNER_VIDEO,
                    NEXT_PUBLIC_BANNER_VIDEO_MOBILE,
                    NEXT_PUBLIC_BANNER_IMAGE_MOBILE,
                    NEXT_PUBLIC_MOBILE_APP_IMAGE,
                    B2C_SERVER_URL,
                    B2C_CLIENT_URL,
                    B2C_MAP_API_KEY,
                    B2C_TITLE_NAME,
                    B2C_TITLE_SHORT_NAME,
                    B2C_COMPANY_SHORT_CODE,
                    B2C_COMPANY_B2B_URL,
                    B2C_COMPANY_EMAIL,
                    B2C_FACEBOOK_URL,
                    B2C_INSTAGRAM_URL,
                    B2C_MOBILE_APP_IMAGE,
                    B2C_PLAYSTORE_URL,
                    B2C_COMPANY_CONTACT_NUMBER_ONE,
                    B2C_COMPANY_CONTACT_NUMBER_TWO,
                    B2C_COMPANY_WHATSAPP_NUMBER,
                    B2C_COMPANY_LOGO,
                    B2C_COMPANY_FAVICON,
                    B2C_LOGIN_BANNER,
                    B2C_SIGNUP_BANNER,
                    B2C_IS_API_INTEGRATED,
                    B2C_API_INTEGRATION_URL,
                    B2C_CONTACTUS_EMAIL,
                    B2C_ENQUIRY_EMAIL,
                    B2C_COMPANY_ADDRESS,
                    B2C_COMPANY_CITY,
                    B2C_COMPANY_PINCODE,
                    B2C_COMAPNY_COUNTRY,
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
    }, [section]);

    const handleSectionChange = (e, value) => {
        e.preventDefault();
        setSection(value);
    };

    console.log(data.COMPANY_REGISTRATION_NAME);
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
                        <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "server"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "server");
                                }}
                            >
                                Server
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "b2b"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "b2b");
                                }}
                            >
                                B2B
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "b2c"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "b2c");
                                }}
                            >
                                B2C
                            </button>
                        </div>
                        <div
                            className={` ${
                                section === "server" ? "" : "hidden"
                            }`}
                        >
                            <form action="" onSubmit={handleSubmit}>
                                <div>
                                    {" "}
                                    <h1 className="font-[600] text-[15px] pt-10">
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
                                        <label htmlFor="">
                                            Company Short Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter airline code"
                                            name="COMPANY_SHORT_NAME"
                                            value={
                                                data.COMPANY_SHORT_NAME || ""
                                            }
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
                                                data.COMPANY_REGISTRATION_NAME ||
                                                ""
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
                                                            ? URL?.createObjectURL(
                                                                  logoImg
                                                              )
                                                            : import.meta.env
                                                                  .VITE_SERVER_URL +
                                                              data.COMPANY_LOGO
                                                    }
                                                    alt=""
                                                    className="w-[100%] h-[100%] object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="">
                                            Company Favicon
                                        </label>
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
                                                            : import.meta.env
                                                                  .VITE_SERVER_URL +
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
                                        <label htmlFor="">
                                            PayPal Clinet Id
                                        </label>
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
                                            type="text"
                                            placeholder="Enter PayPal clinet secret"
                                            name="PAYPAL_CLIENT_SECRET"
                                            value={
                                                data.PAYPAL_CLIENT_SECRET || ""
                                            }
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
                                            value={
                                                data.CCAVENUE_MERCHANT_ID || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            CC Avenue Access Code{" "}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter access code"
                                            name="CCAVENUE_ACCESS_CODE"
                                            value={
                                                data.CCAVENUE_ACCESS_CODE || ""
                                            }
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
                                            value={
                                                data.CCAVENUE_WORKING_KEY || ""
                                            }
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
                                            value={
                                                data.BURJ_KHALIFA_USERNAME || ""
                                            }
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
                                            value={
                                                data.BURJ_KHALIFA_PASSWORD || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>{" "}
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">
                                            Cygnet Username
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter username"
                                            name="CYGNET_USERNAME"
                                            value={data.CYGNET_USERNAME || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Cygnet Password{" "}
                                        </label>
                                        <input
                                            type="text"
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
                                        <label htmlFor="">
                                            HotelBeds API Key{" "}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter api key"
                                            name="HOTEL_BEDS_API_KEY"
                                            value={
                                                data.HOTEL_BEDS_API_KEY || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            HotelBeds Secret
                                        </label>
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
                                        <label htmlFor="">
                                            Ottila User Name{" "}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter username"
                                            name="OTTILA_USERNAME"
                                            value={data.OTTILA_USERNAME || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Ottila Password
                                        </label>
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
                                        {isLoading ? <BtnLoader /> : "Update "}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div
                            className={` ${section === "b2b" ? "" : "hidden"}`}
                        >
                            <form action="" onSubmit={handleB2bSubmit}>
                                <div>
                                    {" "}
                                    <h1 className="font-[600] text-[15px] pt-10">
                                        BASIC DATA
                                    </h1>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">Company Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter company name"
                                            name="NEXT_PUBLIC_TITLE_NAME"
                                            value={
                                                data.NEXT_PUBLIC_TITLE_NAME ||
                                                ""
                                            }
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Company Short Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter airline code"
                                            name="NEXT_PUBLIC_TITLE_SHORT_NAME"
                                            value={
                                                data.NEXT_PUBLIC_TITLE_SHORT_NAME ||
                                                ""
                                            }
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Company Short Code
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter airline code"
                                            name="NEXT_PUBLIC_TITLE_SHORT_CODE"
                                            value={
                                                data.NEXT_PUBLIC_TITLE_SHORT_CODE ||
                                                ""
                                            }
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

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
                                        {(logoImg ||
                                            data.NEXT_PUBLIC_COMPANY_LOGO) && (
                                            <div className="mt-4 w-[50px] h-[50px]">
                                                <img
                                                    src={
                                                        image
                                                            ? URL.createObjectURL(
                                                                  logoImg
                                                              )
                                                            : import.meta.env
                                                                  .VITE_SERVER_URL +
                                                              data.NEXT_PUBLIC_COMPANY_LOGO
                                                    }
                                                    alt=""
                                                    className="w-[100%] h-[100%] object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="">
                                            Company Favicon
                                        </label>
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                        />
                                        {imageError && (
                                            <span className="block text-sm text-red-500 mt-2">
                                                {imageError}
                                            </span>
                                        )}
                                        {(image ||
                                            data.NEXT_PUBLIC_COMPANY_FAVICON) && (
                                            <div className="mt-4 w-[50px] h-[50px]">
                                                <img
                                                    src={
                                                        image
                                                            ? URL.createObjectURL(
                                                                  image
                                                              )
                                                            : import.meta.env
                                                                  .VITE_SERVER_URL +
                                                              data.NEXT_PUBLIC_COMPANY_FAVICON
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
                                        DATA
                                    </h1>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">
                                            Cloudinary Cloud Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="cloudinary name "
                                            name="NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"
                                            value={
                                                data.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
                                                ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Cloudinary API Key
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="cloudinary key "
                                            name="CLOUDINARY_API_KEY"
                                            value={
                                                data.CLOUDINARY_API_KEY || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Cloudinary Api Secret
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter api secret"
                                            name="CLOUDINARY_API_SECRET"
                                            value={
                                                data.CLOUDINARY_API_SECRET || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Cloudinary Folder
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter password"
                                            name="CLOUDINARY_FOLDER"
                                            value={data.CLOUDINARY_FOLDER || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">
                                            Google Client ID
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter google analytics ID"
                                            name="GOOGLE_CLIENT_ID"
                                            value={data.GOOGLE_CLIENT_ID || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Google Client Secret
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter google analytics ID"
                                            name="GOOGLE_CLIENT_SECRET"
                                            value={
                                                data.GOOGLE_CLIENT_SECRET || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>{" "}
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">Auth Secret</label>
                                        <input
                                            type="text"
                                            placeholder="Enter secret"
                                            name="NEXTAUTH_SECRET"
                                            value={data.NEXTAUTH_SECRET || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">Auth URL</label>
                                        <input
                                            type="text"
                                            placeholder="Enter .."
                                            name="NEXTAUTH_URL"
                                            value={data.NEXTAUTH_URL || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>{" "}
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">
                                            Google Analytic ID
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter google analytics ID"
                                            name="NEXT_PUBLIC_GOOGLE_ANALYTIC_ID"
                                            value={
                                                data.NEXT_PUBLIC_GOOGLE_ANALYTIC_ID ||
                                                ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>{" "}
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">
                                            Tabby Public Key
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby public key"
                                            name="NEXT_PUBLIC_TABBY_PUBLIC_KEY"
                                            value={
                                                data.NEXT_PUBLIC_TABBY_PUBLIC_KEY ||
                                                ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            {" "}
                                            Tabby Merchant Code
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby merchant code"
                                            name="NEXT_PUBLIC_TABBY_MERCHANT_CODE"
                                            value={
                                                data.NEXT_PUBLIC_TABBY_MERCHANT_CODE ||
                                                ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>{" "}
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">Tours URL</label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby public key"
                                            name="NEXT_PUBLIC_TOURS_URL"
                                            value={
                                                data.NEXT_PUBLIC_TOURS_URL || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor=""> Server URL </label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby merchant code"
                                            name="NEXT_PUBLIC_TABBY_MERCHANT_CODE"
                                            value={
                                                data.NEXT_PUBLIC_SERVER_URL ||
                                                ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>{" "}
                                    <div>
                                        <label htmlFor=""> Client URL </label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby merchant code"
                                            name="NEXT_PUBLIC_CLIENT_URL"
                                            value={
                                                data.NEXT_PUBLIC_CLIENT_URL ||
                                                ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>{" "}
                                    <div>
                                        <label htmlFor=""> CDN URL </label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby merchant code"
                                            name="NEXT_PUBLIC_CDN_URL"
                                            value={
                                                data.NEXT_PUBLIC_CDN_URL || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            {" "}
                                            Playstore URL{" "}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby merchant code"
                                            name="NEXT_PUBLIC_PLAYSTORE_URL"
                                            value={
                                                data.NEXT_PUBLIC_PLAYSTORE_URL ||
                                                ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>{" "}
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">
                                            Company Address 1
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="NEXT_PUBLIC_COMPANYADDRESS1"
                                            value={
                                                data.NEXT_PUBLIC_COMPANYADDRESS1 ||
                                                ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Company Address 2
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="NEXT_PUBLIC_COMPANYADDRESS2"
                                            value={
                                                data.NEXT_PUBLIC_COMPANYADDRESS2 ||
                                                ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="">Banner Image </label>
                                    <input
                                        type="file"
                                        onChange={handleBannerImgChange}
                                    />
                                    {logoBanImgError && (
                                        <span className="block text-sm text-red-500 mt-2">
                                            {logoBanImgError}
                                        </span>
                                    )}
                                    {(bannerImg ||
                                        data.NEXT_PUBLIC_BANNER_IMAGE) && (
                                        <div className="mt-4 w-[50px] h-[50px]">
                                            <img
                                                src={
                                                    image
                                                        ? URL.createObjectURL(
                                                              logoImg
                                                          )
                                                        : import.meta.env
                                                              .VITE_SERVER_URL +
                                                          data.NEXT_PUBLIC_BANNER_IMAGE
                                                }
                                                alt=""
                                                className="w-[100%] h-[100%] object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="">
                                        Banner Image Mobile
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleBannerMobImgChange}
                                    />
                                    {logoBanMobImgError && (
                                        <span className="block text-sm text-red-500 mt-2">
                                            {logoBanMobImgError}
                                        </span>
                                    )}
                                    {(bannerImgMob ||
                                        data.NEXT_PUBLIC_BANNER_IMAGE_MOBILE) && (
                                        <div className="mt-4 w-[50px] h-[50px]">
                                            <img
                                                src={
                                                    image
                                                        ? URL.createObjectURL(
                                                              image
                                                          )
                                                        : import.meta.env
                                                              .VITE_SERVER_URL +
                                                          data.NEXT_PUBLIC_BANNER_IMAGE_MOBILE
                                                }
                                                alt=""
                                                className="w-[100%] h-[100%] object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="">App Image </label>
                                    <input
                                        type="file"
                                        onChange={handleAppImgChange}
                                    />
                                    {logoAppImgError && (
                                        <span className="block text-sm text-red-500 mt-2">
                                            {logoAppImgError}
                                        </span>
                                    )}
                                    {(appImg ||
                                        data.NEXT_PUBLIC_BANNER_IMAGE) && (
                                        <div className="mt-4 w-[50px] h-[50px]">
                                            <img
                                                src={
                                                    appImg
                                                        ? URL.createObjectURL(
                                                              appImg
                                                          )
                                                        : import.meta.env
                                                              .VITE_SERVER_URL +
                                                          data?.NEXT_PUBLIC_MOBILE_APP_IMAGE
                                                }
                                                alt=""
                                                className="w-[100%] h-[100%] object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="mt-4">
                                        <label htmlFor="">Banner Video</label>
                                        <input
                                            type="file"
                                            onChange={handleBannerVidChange}
                                        />
                                    </div>
                                    {(bannerVid ||
                                        data.NEXT_PUBLIC_BANNER_VIDEO) && (
                                        <div className="mt-4 w-[50px] h-[50px]">
                                            <video
                                                src={
                                                    bannerVid
                                                        ? URL.createObjectURL(
                                                              bannerVid
                                                          )
                                                        : config?.SERVER_URL +
                                                          data.NEXT_PUBLIC_BANNER_VIDEO
                                                }
                                                className="w-[100%] h-[100%] object-cover"
                                                controls // Add controls to allow user to play/pause the video
                                            >
                                                Your browser does not support
                                                the video tag.
                                            </video>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="mt-4">
                                        <label htmlFor="">
                                            Banner Video Mobile
                                        </label>
                                        <input
                                            type="file"
                                            onChange={handleBannerMobVidChange}
                                        />
                                    </div>
                                    {(bannerMobVid ||
                                        data.NEXT_PUBLIC_BANNER_VIDEO_MOBILE) && (
                                        <div className="mt-4 w-[50px] h-[50px]">
                                            <video
                                                src={
                                                    bannerMobVid
                                                        ? URL.createObjectURL(
                                                              bannerMobVid
                                                          )
                                                        : config?.SERVER_URL +
                                                          data.NEXT_PUBLIC_BANNER_VIDEO_MOBILE
                                                }
                                                className="w-[100%] h-[100%] object-cover"
                                                controls // Add controls to allow user to play/pause the video
                                            >
                                                Your browser does not support
                                                the video tag.
                                            </video>
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
                                    <button className="w-[130px]">
                                        {isLoading ? (
                                            <BtnLoader />
                                        ) : (
                                            "Update B2b"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div
                            className={` ${section === "b2c" ? "" : "hidden"}`}
                        >
                            <form action="" onSubmit={handleB2cSubmit}>
                                <div>
                                    {" "}
                                    <h1 className="font-[600] text-[15px] pt-10">
                                        BASIC DATA
                                    </h1>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">Company Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter company name"
                                            name="B2C_TITLE_NAME"
                                            value={data.B2C_TITLE_NAME || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Company Short Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter airline code"
                                            name="B2C_TITLE_SHORT_NAME"
                                            value={
                                                data.B2C_TITLE_SHORT_NAME || ""
                                            }
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Company Short Code
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter registration name"
                                            name="B2C_COMPANY_SHORT_CODE"
                                            value={
                                                data.B2C_COMPANY_SHORT_CODE ||
                                                ""
                                            }
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>{" "}
                                </div>
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
                                    {(logoImg || data?.B2C_COMPANY_LOGO) && (
                                        <div className="mt-4 w-[50px] h-[50px]">
                                            <img
                                                src={
                                                    image
                                                        ? URL?.createObjectURL(
                                                              logoImg
                                                          )
                                                        : import.meta.env
                                                              .VITE_SERVER_URL +
                                                          data.B2C_COMPANY_LOGO
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
                                    {(image || data.B2C_COMPANY_FAVICON) && (
                                        <div className="mt-4 w-[50px] h-[50px]">
                                            <img
                                                src={
                                                    image
                                                        ? URL.createObjectURL(
                                                              image
                                                          )
                                                        : import.meta.env
                                                              .VITE_SERVER_URL +
                                                          data.B2C_COMPANY_FAVICON
                                                }
                                                alt=""
                                                className="w-[100%] h-[100%] object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor=""> Server URL </label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby merchant code"
                                            name="B2C_SERVER_URL"
                                            value={data.B2C_SERVER_URL || ""}
                                            onChange={handleChange}
                                        />
                                    </div>{" "}
                                    <div>
                                        <label htmlFor=""> Client URL </label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby merchant code"
                                            name="B2C_CLIENT_URL"
                                            value={data.B2C_CLIENT_URL || ""}
                                            onChange={handleChange}
                                        />
                                    </div>{" "}
                                    <div>
                                        <label htmlFor=""> CDN URL </label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby merchant code"
                                            name="NEXT_PUBLIC_CDN_URL"
                                            value={
                                                data.NEXT_PUBLIC_CDN_URL || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>{" "}
                                    <div>
                                        <label htmlFor="">
                                            {" "}
                                            Company B2B URL{" "}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby merchant code"
                                            name="B2C_COMPANY_B2B_URL"
                                            value={
                                                data.B2C_COMPANY_B2B_URL || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor=""> PlayStore URL</label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby merchant code"
                                            name="B2C_PLAYSTORE_URL"
                                            value={data.B2C_PLAYSTORE_URL || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor=""> Map API key</label>
                                        <input
                                            type="text"
                                            placeholder="Enter tabby merchant code"
                                            name="B2C_MAP_API_KEY"
                                            value={data.B2C_MAP_API_KEY || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>{" "}
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">Company Email</label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="B2C_COMPANY_EMAIL"
                                            value={data.B2C_COMPANY_EMAIL || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Contact Us Email
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="B2C_CONTACTUS_EMAIL"
                                            value={
                                                data.B2C_CONTACTUS_EMAIL || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>{" "}
                                    <div>
                                        <label htmlFor="">Enquiry Email</label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="B2C_ENQUIRY_EMAIL"
                                            value={data.B2C_ENQUIRY_EMAIL || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Company Facebook
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="B2C_FACEBOOK_URL"
                                            value={data.B2C_FACEBOOK_URL || ""}
                                            onChange={handleChange}
                                        />
                                    </div>{" "}
                                    <div>
                                        <label htmlFor="">
                                            Company Instagram
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="B2C_INSTAGRAM_URL"
                                            value={data.B2C_INSTAGRAM_URL || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">
                                            Company Number 1
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="B2C_COMPANY_CONTACT_NUMBER_ONE"
                                            value={
                                                data.B2C_COMPANY_CONTACT_NUMBER_ONE ||
                                                ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Company Number 2
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="B2C_COMPANY_CONTACT_NUMBER_TWO"
                                            value={
                                                data.B2C_COMPANY_CONTACT_NUMBER_TWO ||
                                                ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>{" "}
                                    <div>
                                        <label htmlFor="">
                                            Company Whatsapp
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="B2C_COMPANY_WHATSAPP_NUMBER"
                                            value={
                                                data.B2C_COMPANY_WHATSAPP_NUMBER ||
                                                ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-5">
                                    <div>
                                        <label htmlFor="">
                                            Company Address
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="B2C_COMPANY_ADDRESS"
                                            value={
                                                data.B2C_COMPANY_ADDRESS || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">Company City</label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="B2C_COMPANY_CITY"
                                            value={data.B2C_COMPANY_CITY || ""}
                                            onChange={handleChange}
                                        />
                                    </div>{" "}
                                    <div>
                                        <label htmlFor="">
                                            Company Pincode
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="B2C_COMPANY_PINCODE"
                                            value={
                                                data.B2C_COMPANY_PINCODE || ""
                                            }
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Company Country
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="company address"
                                            name="B2C_COMAPNY_COUNTRY"
                                            value={
                                                data.B2C_COMAPNY_COUNTRY || ""
                                            }
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
                                            "Update B2c"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
