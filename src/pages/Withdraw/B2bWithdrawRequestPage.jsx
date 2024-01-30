import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiFilter } from "react-icons/bi";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import WithdrawRequestSingleRow from "../../features/WithdrawRequests/components/WithdrawRequestSingleRow";

export default function WithdrawRequestPage() {
    const [withdrawRequests, setWithdrawRequests] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        referenceNo: "",
        agentCode: "",
        dateFrom: "",
        dateTo: "",
        status: "",
        totalWithdrawRequests: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [banks, setBanks] = useState([]);

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchWithdrawalRequests = async ({
        skip,
        limit,
        referenceNo,
        agentCode,
        dateFrom,
        dateTo,
        status,
    }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/wallets/b2b/withdraw-request/all?skip=${skip}&limit=${limit}&referenceNo=${referenceNo}&agentCode=${agentCode}&dateFrom=${dateFrom}&dateTo=${dateTo}&status=${status}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setWithdrawRequests(response.data.walletWithdrawRequests || []);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalWithdrawRequests: response.data.totalWithdrawRequests,
                };
            });

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

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
                agentCode: "",
                status: "",
                totalWithdrawals: 0,
            };
        });

        if (filters.skip === 0) {
            fetchWithdrawalRequests({
                skip: 0,
                limit: 15,
                dateFrom: "",
                dateTo: "",
                referenceNo: "",
                agentCode: "",
                status: "",
            });
        }
    };

    useEffect(() => {
        fetchWithdrawalRequests({ ...filters });
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
                <h1 className="font-[600] text-[15px] uppercase">Withdraw Requests</h1>

                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Withdraw Requests</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Withdraw Requests</h1>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (filters.skip !== 0) {
                                setFilters({ ...filters, skip: 0 });
                            } else {
                                fetchWithdrawalRequests({ ...filters });
                            }
                        }}
                        className="grid grid-cols-7 items-end gap-4 border-b border-dashed p-4"
                    >
                        <div className="col-span-2">
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
                            <label htmlFor="">Agent Code</label>
                            <input
                                type="text"
                                placeholder="Enter Agent Code"
                                className=""
                                name="agentCode"
                                value={filters.agentCode || ""}
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
                            <label htmlFor="">Status</label>
                            <select name="status" id="" value={filters.status || ""} onChange={handleChange}>
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Limit</label>
                            <select id="" name="limit" value={filters.limit} onChange={handleChange}>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <button className="flex items-center justify-center gap-[10px]">
                            <BiFilter /> Filter
                        </button>
                        <button className="bg-slate-200 text-textColor" onClick={clearFilters} type="button">
                            Clear
                        </button>
                    </form>

                    {isLoading ? (
                        <PageLoader />
                    ) : withdrawRequests?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Withdrawal Requests Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Refrence No</th>
                                        <th className="font-[500] p-3">Reseller Name</th>
                                        <th className="font-[500] p-3">Amount</th>
                                        <th className="font-[500] p-3">Date</th>
                                        <th className="font-[500] p-3">View</th>
                                        <th className="font-[500] p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {withdrawRequests?.map((request, index) => {
                                        return (
                                            <WithdrawRequestSingleRow
                                                key={index}
                                                request={request}
                                                banks={banks}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalWithdrawRequests}
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
