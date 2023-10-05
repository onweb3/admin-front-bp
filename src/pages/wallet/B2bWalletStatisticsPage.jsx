import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PageLoader } from "../../components";
import { IoWalletOutline } from "react-icons/io5";
import { AiOutlineArrowDown } from "react-icons/ai";

export default function B2bWalletStatisticsPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [data, setData] = useState({
        totalWalletBalance: 0,
        totalDue: 0,
        totalWalletCredit: 0,
        totalDepositedAmount: 0,
        totalCreditedAmount: 0,
        totalFee: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchData = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get("/wallets/b2b/statistics", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setData((prev) => {
                return {
                    ...prev,
                    totalWalletBalance: response?.data?.totalWalletBalance || 0,
                    totalDue: response?.data?.totalDue || 0,
                    totalWalletCredit: response?.data?.totalWalletCredit || 0,
                    totalDepositedAmount: response?.data?.totalDepositedAmount || 0,
                    totalCreditedAmount: response?.data?.totalCreditedAmount || 0,
                    totalFee: response?.data?.totalFee || 0,
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">B2B Wallet Statistics</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/b2b" className="text-textColor">
                        B2B{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Wallet </span>
                    <span>{">"} </span>
                    <span>Statistics </span>
                </div>
            </div>

            {/* <div className="flex items-end justify-start gap-4 p-6">
                <div>
                    <label htmlFor="">From Date</label>
                    <input
                        type="date"
                        name="fromDate"
                        value={filters.fromDate || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="">To Date</label>
                    <input
                        type="date"
                        name="toDate"
                        value={filters.toDate || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="">Type</label>
                    <select
                        name="bookingType"
                        value={filters.bookingType || ""}
                        onChange={handleChange}
                    >
                        <option value="">All</option>
                        <option value="ticket">Ticket</option>
                        <option value="booking">Booking</option>
                    </select>
                </div>
                <button
                    className="px-3 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    onClick={fetchData}
                >
                    Search
                </button>
            </div> */}

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 min-w-[100%]">
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Total Wallet Balance
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {data?.totalWalletBalance?.toFixed(2) || 0} AED
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-primaryColor text-white rounded-full flex items-center justify-center">
                                <IoWalletOutline />
                            </span>
                        </div>
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Total Due
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {data?.totalDue?.toFixed(2)} AED
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-blue-500 text-white rounded-full flex items-center justify-center">
                                <IoWalletOutline />
                            </span>
                        </div>
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Total Wallet Credit
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {data?.totalWalletCredit?.toFixed(2) || 0} AED
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-green-500 text-white rounded-full flex items-center justify-center">
                                <IoWalletOutline />
                            </span>
                        </div>
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Total Deposited Amount
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {data?.totalDepositedAmount?.toFixed(2) || 0} AED
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-primaryColor text-white rounded-full flex items-center justify-center">
                                <AiOutlineArrowDown />
                            </span>
                        </div>
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Total Credited Amount
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {data?.totalCreditedAmount?.toFixed(2) || 0} AED
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-blue-500 text-white rounded-full flex items-center justify-center">
                                <AiOutlineArrowDown />
                            </span>
                        </div>
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Total Deposit Fee
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {data?.totalFee?.toFixed(2) || 0} AED
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-green-500 text-white rounded-full flex items-center justify-center">
                                <AiOutlineArrowDown />
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
