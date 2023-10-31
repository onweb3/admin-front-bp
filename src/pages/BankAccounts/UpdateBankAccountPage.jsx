import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { BtnLoader, PageLoader, SelectDropdown } from "../../components";
import axios from "../../axios";

export default function UpdateBankAccountPage() {
    const [data, setData] = useState({
        countryCode: "",
        bankName: "",
        branchAddress: "",
        accountNumber: "",
        ifscCode: "",
        ibanCode: "",
        swiftCode: "",
        accountHolderName: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);

    const navigate = useNavigate();
    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            await axios.patch(`/company/bank-info/update/${id}`, data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/bank-accounts");
        } catch (err) {
            setError(err?.response?.data?.error || "something went wrong, try again");
            setIsLoading(false);
        }
    };

    const fetchSingleBankAccount = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/company/bank-info/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setData((prev) => {
                return {
                    ...prev,
                    countryCode: response?.data?.countryCode,
                    bankName: response?.data?.bankName,
                    branchAddress: response?.data?.branchAddress,
                    ifscCode: response?.data?.ifscCode,
                    ibanCode: response?.data?.ibanCode,
                    swiftCode: response?.data?.swiftCode,
                    accountNumber: response?.data?.accountNumber,
                    accountHolderName: response?.data?.accountHolderName,
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchSingleBankAccount();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">Update Bank Account</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/bank-accounts" className="text-textColor">
                        Bank Accounts{" "}
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
                            <div className="grid grid-cols-4 gap-3">
                                <div>
                                    <label htmlFor="">Country</label>
                                    <SelectDropdown
                                        data={countries}
                                        displayName={"countryName"}
                                        valueName={"isocode"}
                                        placeholder={"Select Country"}
                                        selectedData={data.countryCode}
                                        setSelectedData={(val) => {
                                            setData((prev) => {
                                                return { ...prev, countryCode: val };
                                            });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Bank Name</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Abc Bank"
                                        name="bankName"
                                        value={data.bankName || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Bank Address</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Bank Address"
                                        name="branchAddress"
                                        value={data.branchAddress || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Account Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Account Number"
                                        name="accountNumber"
                                        value={data.accountNumber || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">IFSC Code</label>
                                    <input
                                        type="text"
                                        placeholder="Enter IFSC Code"
                                        name="ifscCode"
                                        value={data.ifscCode || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">IBAN Code</label>
                                    <input
                                        type="text"
                                        placeholder="Enter IBAN Code"
                                        name="ibanCode"
                                        value={data.ibanCode || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Swift Code</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Swift Code"
                                        name="swiftCode"
                                        value={data.swiftCode || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Holder Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Account Holder Name"
                                        name="accountHolderName"
                                        value={data.accountHolderName || ""}
                                        onChange={handleChange}
                                        required
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
                                <button className="w-[170px]">
                                    {isLoading ? <BtnLoader /> : "Update Bank Account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
