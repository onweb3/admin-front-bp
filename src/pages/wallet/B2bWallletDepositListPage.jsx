import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import B2bWalletDepositListTableRow from "../../features/Wallet/components/B2bWalletDepositListTableRow";
import { BiFilter } from "react-icons/bi";

export default function B2bWallletDepositListPage() {
    const [walletDeposits, setWalletDeposits] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalDeposits: 0,
        dateFrom: "",
        dateTo: "",
        referenceNo: "",
        paymentProcessor: "",
        bankId: "",
        status: "",
    });
    const [banks, setBanks] = useState([]);

    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const clearFilters = () => {
        setFilters((prev) => {
            return {
                ...prev,
                skip: 0,
                limit: 15,
                dateFrom: "",
                dateTo: "",
                referenceNo: "",
                status: "",
                paymentProcessor: "",
                bankId: "",
                totalDeposits: 0,
            };
        });

        if (filters.skip === 0) {
            fetchB2bWalletDeposits({
                skip: 0,
                limit: 15,
                dateFrom: "",
                dateTo: "",
                referenceNo: "",
                status: "",
                paymentProcessor: "",
                bankId: "",
            });
        }
    };

    const fetchB2bWalletDeposits = async ({
        skip,
        limit,
        dateFrom,
        dateTo,
        referenceNo,
        status,
        paymentProcessor,
        bankId,
    }) => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(
                `/wallets/b2b/deposits/all?status=${status}&paymentProcessor=${paymentProcessor}&dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${limit}&skip=${skip}&bankId=${bankId}&referenceNo=${referenceNo}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setWalletDeposits(response?.data?.walletDeposits);
            setFilters((prev) => {
                return { ...prev, totalDeposits: response?.data?.totalDeposits };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchB2bWalletDeposits({ ...filters });
    }, [filters.skip]);

    useEffect(() => {
        const fetchBankNames = async () => {
            try {
                const response = await axios.get("/company/bank-info/all/names", {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
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
                <h1 className="font-[600] text-[15px] uppercase">Wallet Deposits List</h1>
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
                    <span>Deposits </span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All B2B Wallet Deposits</h1>
                        {/* <button className="px-3">+ Add Driver</button> */}
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (filters.skip !== 0) {
                                setFilters({ ...filters, skip: 0 });
                            } else {
                                fetchB2bWalletDeposits({ ...filters });
                            }
                        }}
                        className="grid grid-cols-7 items-end gap-4 border-b border-dashed p-4"
                    >
                        <div className="">
                            <label htmlFor="">Reference Number</label>
                            <input
                                type="text"
                                placeholder="Search Reference No."
                                className=""
                                name="referenceNo"
                                value={filters.referenceNo || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Date From</label>
                            <input
                                type="date"
                                className=""
                                name="dateFrom"
                                value={filters.dateFrom || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Date To</label>
                            <input
                                type="date"
                                className=""
                                name="dateTo"
                                value={filters.dateTo || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="">paymentProcessor</label>
                            <select
                                name="paymentProcessor"
                                id=""
                                value={filters.paymentProcessor || ""}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="ccavenue">Ccavenue</option>
                                <option value="bank">Bank</option>
                                <option value="cash-in-hand">Cash In Hand</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Bank</label>
                            <select
                                name="bankId"
                                id=""
                                value={filters.bankId || ""}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                {banks?.map((bank, index) => {
                                    return (
                                        <option value={bank?._id} key={index}>
                                            {bank?.bankName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Status</label>
                            <select
                                name="status"
                                id=""
                                value={filters.status || ""}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="booked">Booked</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Limit</label>
                            <select
                                id=""
                                name="limit"
                                value={filters.limit}
                                onChange={handleChange}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <button className="flex items-center justify-center gap-[10px]">
                            <BiFilter /> Filter
                        </button>
                        <button
                            className="bg-slate-200 text-textColor"
                            onClick={clearFilters}
                            type="button"
                        >
                            Clear
                        </button>
                    </form>

                    {isPageLoading ? (
                        <PageLoader />
                    ) : walletDeposits?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Deposits Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Ref.No</th>
                                        <th className="font-[500] p-3">Reseller</th>
                                        <th className="font-[500] p-3">Deposited</th>
                                        <th className="font-[500] p-3">Credited</th>
                                        <th className="font-[500] p-3">Fee</th>
                                        <th className="font-[500] p-3">Payment Processor</th>
                                        <th className="font-[500] p-3">Date</th>
                                        <th className="font-[500] p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {walletDeposits?.map((deposit, index) => {
                                        return (
                                            <B2bWalletDepositListTableRow
                                                key={index}
                                                deposit={deposit}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalDeposits}
                                    incOrDecSkip={(number) =>
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                skip: prev.skip + number,
                                            };
                                        })
                                    }
                                    updateSkip={(skip) =>
                                        setFilters((prev) => {
                                            return { ...prev, skip };
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
