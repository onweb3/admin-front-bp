import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiFilter } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";

import axios from "../../axios";
import { PageLoader } from "../../components";
import {
    B2bTransactionsTable,
    B2cTransactionsTable,
} from "../../features/Transactions";
import AttractionTransactionsTable from "../../features/Attractions/components/AttractionTransactionTable";
import { AiOutlineShoppingCart } from "react-icons/ai";

export default function AttractionTransactionsPage() {
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
    const [data, setData] = useState({
        totalProfit: "",
        totalTransactions: "",
    });

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

            let response = await axios.get(
                `/orders/attraction/transactions/all?${searchQuery}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setTransactions(response?.data?.result?.data || []);
            setData({
                totalProfit: response.data.result?.totalProfit,
                totalTransactions: response.data?.result?.totalTransactions,
                totalPrice: response.data?.result?.totalPrice,
                totalCost: response.data?.result?.totalCost,
            });
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

            let response = await axios({
                url: `/orders/attraction/transactions/all/sheet?b2bRole=${section}&${searchQuery}`,
                method: "GET",
                responseType: "blob",
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            });

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
                    Attraction Transactions
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Home{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Attraction Transactions</span>
                </div>
            </div>
            <div className="p-6">
                {" "}
                <div className="grid grid-cols-4 gap-4 min-w-[100%]">
                    <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                        <div>
                            <span className="block text-sm text-grayColor font-medium">
                                Total Transactions
                            </span>
                            <span className="block text-xl font-[600] mt-1">
                                {data?.totalTransactions || 0}
                            </span>
                        </div>
                        <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-primaryColor text-white rounded-full flex items-center justify-center">
                            <AiOutlineShoppingCart />
                        </span>
                    </div>
                    <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                        <div>
                            <span className="block text-sm text-grayColor font-medium">
                                Total Profit
                            </span>
                            <span className="block text-xl font-[600] mt-1">
                                {data?.totalProfit || 0}
                            </span>
                        </div>
                        <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-blue-500 text-white rounded-full flex items-center justify-center">
                            <AiOutlineShoppingCart />
                        </span>
                    </div>
                    <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                        <div>
                            <span className="block text-sm text-grayColor font-medium">
                                Total Price
                            </span>
                            <span className="block text-xl font-[600] mt-1">
                                {data?.totalPrice || 0}
                            </span>
                        </div>
                        <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-blue-500 text-white rounded-full flex items-center justify-center">
                            <AiOutlineShoppingCart />
                        </span>
                    </div>{" "}
                    <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                        <div>
                            <span className="block text-sm text-grayColor font-medium">
                                Total Cost
                            </span>
                            <span className="block text-xl font-[600] mt-1">
                                {data?.totalCost || 0}
                            </span>
                        </div>
                        <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-blue-500 text-white rounded-full flex items-center justify-center">
                            <AiOutlineShoppingCart />
                        </span>
                    </div>
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
                                type="string"
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
                        {/* <div>
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
                        </div> */}
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
                        {/* <div>
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
                        </div> */}
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

                    {isLoading ? (
                        <PageLoader />
                    ) : transactions?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Transactions found
                            </span>
                        </div>
                    ) : (
                        <AttractionTransactionsTable
                            transactions={transactions}
                            filters={filters}
                            setFilters={setFilters}
                            data={data}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
