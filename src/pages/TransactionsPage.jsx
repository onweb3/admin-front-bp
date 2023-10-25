import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiFilter } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";

import axios from "../axios";
import { PageLoader } from "../components";
import {
    B2bTransactionsTable,
    B2cTransactionsTable,
} from "../features/Transactions"; 

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalTransactions: 0,
        status: "",
        transactionNo: "",
        paymentProcessor: "",
        transactionType: "",
        dateFrom: "",
        dateTo: "",
        agentCode: "",
    });
    const [section, setSection] = useState("reseller");
    const [searchParams, setSearchParams] = useSearchParams();

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
                limit: 10,
                status: "",
                transactionNo: "",
                paymentProcessor: "",
                transactionType: "",
                dateFrom: "",
                dateTo: "",
                agentCode: "",
            };
        });
        fetchTransactions({
            section,
            skip: 0,
            limit: 10,
            status: "",
            transactionNo: "",
            paymentProcessor: "",
            transactionType: "",
            dateFrom: "",
            dateTo: "",
            agentCode: "",
        });
    };

    const fetchTransactions = async ({ section, ...filters }) => {
        try {
            setIsLoading(true);

            let searchQuery = `skip=${filters?.skip}&limit=${filters.limit}&transactionNo=${filters.transactionNo}&status=${filters.status}&paymentProcessor=${filters.paymentProcessor}&transactionType=${filters.transactionType}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}&agentCode=${filters.agentCode}`;

            let response;
            if (section === "b2c") {
                response = await axios.get(
                    `/transactions/b2c/all?${searchQuery}`,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
            } else if (section === "reseller" || section === "sub-agent") {
                response = await axios.get(
                    `/transactions/b2b/all?b2bRole=${section}&${searchQuery}`,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
            } else {
                throw new Error("invalid arguments");
            }
            setTransactions(response?.data?.result?.data || []);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalTransactions:
                        response?.data?.result?.totalTransactions || 0,
                };
            });

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDownload = async () => {
        try {
            const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}&transactionNo=${filters.transactionNo}&status=${filters.status}&paymentProcessor=${filters.paymentProcessor}&transactionType=${filters.transactionType}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}&agentCode=${filters.agentCode}`;

            let response;
            if (section === "b2c") {
                response = await axios({
                    url: `/transactions/b2c/all/sheet?b2bRole=${section}&${searchQuery}`,
                    method: "GET",
                    responseType: "blob",
                    headers: {
                        authorization: `Bearer ${jwtToken}`,
                    },
                });
            } else {
                response = await axios({
                    url: `/transactions/b2b/all/sheet?b2bRole=${section}&${searchQuery}`,
                    method: "GET",
                    responseType: "blob",
                    headers: {
                        authorization: `Bearer ${jwtToken}`,
                    },
                });
            }
            const href = URL.createObjectURL(response.data);

            const link = document.createElement("a");
            link.href = href;
            link.setAttribute("download", "orders.xlsx");
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        let query = searchParams.get("section") || "reseller";

        if (query) {
            setSection(query);
        }
        fetchTransactions({ section: query, ...filters });
    }, [searchParams, filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Transactions
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Home{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Transactions</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Transactions</h1>
                        <button
                            className="px-3 bg-[#299cdb] flex items-center justify-center gap-[10px]"
                            onClick={handleDownload}
                        >
                            <FiDownload /> Download
                        </button>
                    </div>

                    <form
                        className="grid grid-cols-7 items-end gap-4 border-b border-dashed p-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            fetchTransactions({ section, ...filters });
                        }}
                    >
                        <div className="col-span-2">
                            <label htmlFor="">Transaction No</label>
                            <input
                                type="number"
                                placeholder="Search Reference No."
                                className=""
                                name="transactionNo"
                                value={filters.transactionNo || ""}
                                onChange={handleChange}
                            />
                        </div>
                        {/* <div>
                            <label htmlFor="">Transaction Type</label>
                            <select
                                id=""
                                name="transactionType"
                                value={filters.transactionType}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="deposit">Deposit</option>
                                <option value="markup">Markup</option>
                                <option value="withdraw">Withdraw</option>
                                <option value="deduct">Deduct</option>
                                <option value="refund">Refund</option>
                            </select>
                        </div> */}
                        <div>
                            <label htmlFor="">Payment Processor</label>
                            <select
                                id=""
                                name="paymentProcessor"
                                value={filters.paymentProcessor}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="wallet">Wallet</option>
                                <option value="ccavenue">CCAvenue</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Date From</label>
                            <input
                                type="date"
                                name="dateFrom"
                                value={filters.dateFrom || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Date To</label>
                            <input
                                type="date"
                                name="dateTo"
                                value={filters.dateTo || ""}
                                onChange={handleChange}
                            />
                        </div>
                        {section !== "b2c" && (
                            <div>
                                <label htmlFor="">Agent Code</label>
                                <input
                                    type="number"
                                    name="agentCode"
                                    value={filters.agentCode || ""}
                                    onChange={handleChange}
                                    placeholder="Search agent..."
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="">Status</label>
                            <select
                                name="status"
                                id=""
                                value={filters.status || ""}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="success">Success</option>
                                <option value="failed">Failed</option>
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

                    <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (section === "reseller"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return { ...prev, section: "reseller" };
                                })
                            }
                        >
                            B2b
                        </button>
                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (section === "sub-agent"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return {
                                        ...prev,
                                        section: "sub-agent",
                                    };
                                })
                            }
                        >
                            Sub Agent
                        </button>
                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (section === "b2c"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return { ...prev, section: "b2c" };
                                })
                            }
                        >
                            B2C
                        </button>
                    </div>

                    {isLoading ? (
                        <PageLoader />
                    ) : transactions?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Transactions found
                            </span>
                        </div>
                    ) : section !== "b2c" ? (
                        <B2bTransactionsTable
                            transactions={transactions}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    ) : (
                        <B2cTransactionsTable
                            transactions={transactions}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
