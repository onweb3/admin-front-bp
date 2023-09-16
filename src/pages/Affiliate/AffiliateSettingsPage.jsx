import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import {
    BtnLoader,
    MultipleSelectDropdown,
    RichTextEditor,
} from "../../components";
import { useImageChange } from "../../hooks";

export default function AffiliateSettingsPage() {
    const [data, setData] = useState({
        termsAndConditions: "",
        redeemOptions: [],
        policy: "",
        pointValue: "",
        deductionFee: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const options = [
        { name: "cash in hand", value: "cashInHand" },
        { name: "cash in bank", value: "cashInBank" },
        { name: "crypto", value: "crypto" },
        { name: "ticket-booking", value: "ticket-booking" },
    ];

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { image, handleImageChange, error: imageError } = useImageChange();

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

            await axios.post(
                "/affiliate/settings/upsert",
                {
                    termsAndConditions: data.termsAndConditions,
                    redeemOptions: data.redeemOptions,
                    policy: data.policy,
                    pointValue: data.pointValue,
                    deductionFee: data.deductionFee,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate("/affiliate/products");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchAffiliateSetting = async () => {
        try {
            const response = await axios.get(`/affiliate/settings/list`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setData(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAccessChange = (selectedData, transferType) => {
        setData((prev) => {
            return { ...prev, [transferType]: selectedData };
        });
    };

    useEffect(() => {
        fetchAffiliateSetting();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">Affiliate</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/affiliate" className="text-textColor">
                        Affiliate{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="">Point Values(1 AED)</label>
                                <input
                                    type="text"
                                    placeholder="Enter points"
                                    name="pointValue"
                                    value={data.pointValue || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Redeem options </label>

                                <MultipleSelectDropdown
                                    data={options}
                                    displayName={"name"}
                                    valueName={"value"}
                                    selectedData={data?.redeemOptions}
                                    setSelectedData={(selAccess) => {
                                        handleAccessChange(
                                            selAccess,
                                            "redeemOptions"
                                        );
                                    }}
                                    randomIndex={"name" + 1}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Deduction Fee %</label>
                                <input
                                    type="text"
                                    placeholder="Enter deduction Fee percentage"
                                    name="deductionFee"
                                    value={data.deductionFee || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="my-10">
                            <h1 className="text-[14px]">
                                Terms And Conditions
                            </h1>
                            <div className="mt-2">
                                <div className="border border-t-0">
                                    <RichTextEditor
                                        getValue={(value) =>
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    termsAndConditions: value,
                                                };
                                            })
                                        }
                                        initialValue={
                                            data?.termsAndConditions || ""
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="my-10">
                            <h1 className="text-[14px]">Policy</h1>
                            <div className="mt-2">
                                <div className="border border-t-0">
                                    <RichTextEditor
                                        getValue={(value) =>
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    policy: value,
                                                };
                                            })
                                        }
                                        initialValue={data?.policy || ""}
                                    />
                                </div>
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
                            <button className="w-[120px]">
                                {isLoading ? <BtnLoader /> : "Add Affiliate"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
