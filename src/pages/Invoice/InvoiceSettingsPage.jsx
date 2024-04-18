import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
    BtnLoader,
    MultipleSelectDropdown,
    PageLoader,
    RichTextEditor,
} from "../../components";
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
        logoUrl: "",
        bankAccounts: [],
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [banks, setBanks] = useState([]);

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
            formData.append("phoneNumber", data.phoneNumber);
            formData.append("address", data.address);
            formData.append(
                "showTermsAndConditions",
                data.showTermsAndConditions
            );
            formData.append("termsAndConditions", data.termsAndConditions);
            formData.append("showBankDetails", data.showBankDetails);
            formData.append("bankAccounts", JSON.stringify(data.bankAccounts));

            const tempEmailsList = data.email.split(",");
            const emailsList = [];
            tempEmailsList.forEach((element) => {
                const tempEmail = element.trim();
                if (tempEmail) emailsList.push(tempEmail);
            });
            formData.append("emails", JSON.stringify(emailsList));

            const response = await axios.patch("/invoice/update", formData, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setData((prev) => {
                return { ...prev, logoUrl: response.data?.companyLogo };
            });

            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.error || "Something went wrong, try again"
            );
            setIsLoading(false);
        }
    };

    const fetchInvoiceSettings = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get("/invoice/single", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setData((prev) => {
                return {
                    ...prev,
                    companyName: response?.data?.companyName,
                    email:
                        response?.data?.emails?.length > 0
                            ? response?.data?.emails
                                  ?.map((item, index) => {
                                      return `${
                                          index !== 0 ? ", " : ""
                                      }${item}`;
                                  })
                                  ?.join("")
                            : "",
                    phoneNumber: response?.data?.phoneNumber,
                    address: response?.data?.address,
                    showTermsAndConditions:
                        response?.data?.showTermsAndConditions || false,
                    termsAndConditions: response?.data?.termsAndConditions,
                    showBankDetails: response?.data?.showBankDetails || false,
                    logoUrl: response?.data?.companyLogo,
                    bankAccounts: response.data?.bankAccounts || [],
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

    useEffect(() => {
        const fetchBankNames = async () => {
            try {
                const response = await axios.get(
                    "/company/bank-info/all/names",
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                setBanks(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchBankNames();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Invoice Setting
                </h1>
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
                                    <span className="text-sm block mt-1 text-grayColor">
                                        Add multiple emails separated by commas
                                    </span>
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
                                        <input
                                            type="file"
                                            onChange={handleLogoImgChange}
                                        />
                                    </div>
                                    {(logoImg || data.logoUrl) && (
                                        <div className="mt-6">
                                            <img
                                                src={
                                                    logoImg
                                                        ? URL.createObjectURL(
                                                              logoImg
                                                          )
                                                        : import.meta.env
                                                              .VITE_SERVER_URL +
                                                          data.logoUrl
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
                                <h2 className="font-medium tex-[15px] mb-3">
                                    → Bank Details
                                </h2>
                                <div className="flex items-center gap-2 mb-3">
                                    <input
                                        type="checkbox"
                                        id="showBankDetails"
                                        className="w-[15px] h-[15px]"
                                        name="showBankDetails"
                                        checked={data.showBankDetails}
                                        onChange={handleDataCheckBoxChange}
                                    />
                                    <label
                                        htmlFor="showBankDetails"
                                        className="mb-0"
                                    >
                                        Show Bank Details *
                                    </label>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <MultipleSelectDropdown
                                        data={banks}
                                        displayName={"bankName"}
                                        valueName={"_id"}
                                        selectedData={data.bankAccounts}
                                        setSelectedData={(val) => {
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    bankAccounts: val,
                                                };
                                            });
                                        }}
                                        randomIndex={"banksList0"}
                                    />
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
                                    <label
                                        htmlFor="showTermsAndConditions"
                                        className="mb-0"
                                    >
                                        Show Terms And Conditions *
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="">
                                        Terms And Conditions
                                    </label>
                                    <div>
                                        <RichTextEditor
                                            initialValue={
                                                data.termsAndConditions || ""
                                            }
                                            getValue={(val) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        termsAndConditions: val,
                                                    };
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {error && (
                                <span className="block text-sm text-red-500 mt-4">
                                    {error}
                                </span>
                            )}
                            <div className="mt-4 flex items-center justify-end">
                                <button
                                    className="w-[100px]"
                                    disabled={isLoading}
                                >
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
