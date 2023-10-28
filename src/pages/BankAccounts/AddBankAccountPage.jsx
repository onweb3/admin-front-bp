import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { BtnLoader, SelectDropdown } from "../../components";
import axios from "../../axios";

export default function AddBankAccountPage() {
    const [data, setData] = useState({
        countryCode: "",
        bankName: "",
        branchAddress: "",
        accountNumber: "",
        ifscCode: "",
        ibanCode: "",
        accountHolderName: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
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

            await axios.post(`/company/bank-info/add`, data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/bank-accounts");
        } catch (err) {
            setError(err?.response?.data?.error || "something went wrong, try again");
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">ADD Bank Account</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/bank-accounts" className="text-textColor">
                        Bank Accounts{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>
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
                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button className="w-[170px]">
                                {isLoading ? <BtnLoader /> : "Add Bank Account"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
