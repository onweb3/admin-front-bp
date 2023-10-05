import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { BtnLoader, PageLoader, RichTextEditor } from "../../components";
import axios from "../../axios";

export default function VoucherSettingsPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        termsAndCondition: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const updateVoucherSettings = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.patch("/vouchers/settings/update", data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get("/vouchers/settings", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setData((prev) => {
                return { ...prev, termsAndCondition: response?.data?.termsAndCondition || "" };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Voucher Settings</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/vouchers" className="text-textColor">
                        Vouchers{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Settings</span>
                </div>
            </div>
            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm p-4">
                        <form action="" onSubmit={updateVoucherSettings}>
                            <div className="mt-4">
                                <label htmlFor="">Terms And Conditions *</label>
                                <RichTextEditor
                                    initialValue={data.termsAndCondition || ""}
                                    getValue={(value) =>
                                        setData((prev) => {
                                            return { ...prev, termsAndCondition: value };
                                        })
                                    }
                                />
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
                                <button className="w-[200px]">
                                    {isLoading ? <BtnLoader /> : "Update Voucher Settings"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
