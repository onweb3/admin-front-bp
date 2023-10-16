import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { BtnLoader, PageLoader, RichTextEditor } from "../../components";
import { useImageChange } from "../../hooks";
import { config } from "../../constants";
import axios from "../../axios";

export default function InvoiceSettingsPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [data, setData] = useState({
        companyName: "",
        email: "",
        phoneNumber: "",
        address: "",
        showTermsAndConditions: true,
        termsAndConditions: "",
        showBankDetails: true,
        bankName: "",
        accountNumber: "",
        branch: "",
        ibanNumber: "",
        swiftCode: "",
        logoUrl: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const {
        image: logoImg,
        handleImageChange: handleLogoImgChange,
        error: logoImgError,
    } = useImageChange();

    const handleDataChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleDataCheckBoxChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.checked };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            const formData = new FormData();
            formData.append("logo", logoImg);
            formData.append("companyName", data.companyName);
            formData.append("email", data.email);
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("address", data.address);
            formData.append("showTermsAndConditions", data.showTermsAndConditions);
            formData.append("termsAndConditions", data.termsAndConditions);
            formData.append("showBankDetails", data.showBankDetails);
            formData.append("bankName", data.bankName);
            formData.append("accountNumber", data.accountNumber);
            formData.append("branch", data.branch);
            formData.append("ibanNumber", data.ibanNumber);
            formData.append("swiftCode", data.swiftCode);

            const response = await axios.patch("/invoice/update", formData, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setData((prev) => {
                return { ...prev, logoUrl: response.data?.companyLogo };
            });

            setIsLoading(false);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, try again");
            setIsLoading(false);
        }
    };

    const fetchInvoiceSettings = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get("/invoice/single", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            const bankDetails = response?.data?.bankDetails;
            setData((prev) => {
                return {
                    ...prev,
                    companyName: response?.data?.companyName,
                    email: response?.data?.email,
                    phoneNumber: response?.data?.phoneNumber,
                    address: response?.data?.address,
                    showTermsAndConditions: response?.data?.showTermsAndConditions || false,
                    termsAndConditions: response?.data?.termsAndConditions,
                    showBankDetails: response?.data?.showBankDetails || false,
                    accountNumber: bankDetails?.accountNumber,
                    bankName: bankDetails?.bankName,
                    branch: bankDetails?.branch,
                    ibanNumber: bankDetails?.ibanNumber,
                    swiftCode: bankDetails?.swiftCode,
                    logoUrl: response?.data?.companyLogo,
                };
            });
        } catch (err) {
            console.log(err);
        } finally {
            setIsPageLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoiceSettings();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Invoice Setting</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Invoice </span>
                    <span>{">"} </span>
                    <span>Settings </span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-3 gap-5">
                                <div>
                                    <label htmlFor="">Company Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Company Name"
                                        name="companyName"
                                        value={data.companyName || ""}
                                        onChange={handleDataChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Company Email *</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: mail@company.com"
                                        name="email"
                                        value={data.email || ""}
                                        onChange={handleDataChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Company Phone *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter phone number"
                                        name="phoneNumber"
                                        value={data.phoneNumber || ""}
                                        onChange={handleDataChange}
                                        required
                                    />
                                </div>
                                <div className="col-span-3">
                                    <div>
                                        <label htmlFor="">Company Logo *</label>
                                        <input type="file" onChange={handleLogoImgChange} />
                                    </div>
                                    {(logoImg || data.logoUrl) && (
                                        <div className="mt-6">
                                            <img
                                                src={
                                                    logoImg
                                                        ? URL.createObjectURL(logoImg)
                                                        : config.SERVER_URL + data.logoUrl
                                                }
                                                className="w-[200px]"
                                                alt=""
                                            />
                                            {logoImgError && (
                                                <span className="block text-sm text-red-500 mt-4">
                                                    {logoImgError}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="">Company Address *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter company Address"
                                        name="address"
                                        value={data.address || ""}
                                        onChange={handleDataChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <h2 className="font-medium tex-[15px] mb-3">→ Bank Details</h2>
                                <div className="flex items-center gap-2 mb-3">
                                    <input
                                        type="checkbox"
                                        id="showBankDetails"
                                        className="w-[15px] h-[15px]"
                                        name="showBankDetails"
                                        checked={data.showBankDetails}
                                        onChange={handleDataCheckBoxChange}
                                    />
                                    <label htmlFor="showBankDetails" className="mb-0">
                                        Show Bank Details *
                                    </label>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="">Bank Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter bank name"
                                            name="bankName"
                                            value={data.bankName || ""}
                                            onChange={handleDataChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">Account Number</label>
                                        <input
                                            type="text"
                                            placeholder="Enter account number"
                                            name="accountNumber"
                                            value={data.accountNumber || ""}
                                            onChange={handleDataChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">Branch</label>
                                        <input
                                            type="text"
                                            placeholder="Enter branch name"
                                            name="branch"
                                            value={data.branch || ""}
                                            onChange={handleDataChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">IBAN Number</label>
                                        <input
                                            type="text"
                                            placeholder="Enter IBAN number"
                                            name="ibanNumber"
                                            value={data.ibanNumber || ""}
                                            onChange={handleDataChange}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">Swift Code</label>
                                        <input
                                            type="text"
                                            placeholder="Enter swift code"
                                            name="swiftCode"
                                            value={data.swiftCode || ""}
                                            onChange={handleDataChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h2 className="font-medium tex-[15px] mb-3">
                                    → Terms And Conditions
                                </h2>
                                <div className="flex items-center gap-2 mb-3">
                                    <input
                                        type="checkbox"
                                        id="showTermsAndConditions"
                                        className="w-[15px] h-[15px]"
                                        name="showTermsAndConditions"
                                        checked={data.showTermsAndConditions}
                                        onChange={handleDataCheckBoxChange}
                                    />
                                    <label htmlFor="showTermsAndConditions" className="mb-0">
                                        Show Terms And Conditions *
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="">Terms And Conditions</label>
                                    <div>
                                        <RichTextEditor
                                            initialValue={data.termsAndConditions || ""}
                                            getValue={(val) => {
                                                setData((prev) => {
                                                    return { ...prev, termsAndConditions: val };
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {error && (
                                <span className="block text-sm text-red-500 mt-4">{error}</span>
                            )}
                            <div className="mt-4 flex items-center justify-end">
                                <button className="w-[100px]" disabled={isLoading}>
                                    {isLoading ? <BtnLoader /> : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
