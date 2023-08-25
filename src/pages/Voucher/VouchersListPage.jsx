import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiFilter } from "react-icons/bi";

import axios from "../../axios";
import { PageLoader } from "../../components";
import { VouchersTable } from "../../features/Voucher";
import { hasPermission } from "../../utils";

export default function VouchersListPage() {
    const [vouchers, setVouchers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 200,
        totalVouchers: 0,
        filterBy: "createdAt",
        fromDate: "",
        toDate: "",
        referenceNumber: "",
    });

    const { jwtToken, admin } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchVouchers = async ({ ...filters }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/vouchers/all?skip=${filters.skip}&limit=${filters.limit}&filterBy=${filters.filterBy}&fromDate=${filters.fromDate}&toDate=${filters.toDate}&referenceNumber=${filters.referenceNumber}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setVouchers(response?.data?.vouchers?.data);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalVouchers: response?.data?.vouchers?.totalItems,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const clearFilters = () => {
        setFilters((prev) => {
            return {
                ...prev,
                skip: 0,
                limit: 200,
                totalVouchers: 0,
                filterBy: "createdAt",
                fromDate: "",
                toDate: "",
                referenceNumber: "",
            };
        });
        fetchVouchers({
            skip: 0,
            limit: 200,
            totalVouchers: 0,
            filterBy: "createdAt",
            fromDate: "",
            toDate: "",
            referenceNumber: "",
        });
    };

    useEffect(() => {
        fetchVouchers({ ...filters });
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Tour Schedules
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Vouchers</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Tour Schedules</h1>
                        <div className="flex items-center gap-[10px]">
                            {/* <button
                                className="px-3 bg-[#299cdb] flex items-center justify-center gap-[10px]"
                                onClick={handleDownloadExcel}
                            >
                                <FiDownload /> Download Excel
                            </button> */}
                            {hasPermission({
                                roles: admin?.roles,
                                name: "tour-schedules",
                                permission: "create",
                            }) && (
                                <Link to={`add`}>
                                    <button className="px-3">
                                        + Add Voucher
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            fetchVouchers({ ...filters });
                        }}
                        className="grid grid-cols-6 items-end gap-4 border-b border-dashed p-4"
                    >
                        <div className="">
                            <label htmlFor="">Reference Number</label>
                            <input
                                type="text"
                                name="referenceNumber"
                                value={filters.referenceNumber || ""}
                                onChange={handleChange}
                                placeholder="Ex: TST001"
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Filter By</label>
                            <select
                                name="filterBy"
                                id=""
                                onChange={handleChange}
                            >
                                <option value="createdAt">Created At</option>
                                <option value="checkInDate">
                                    ChekckIn Date
                                </option>
                                <option value="checkOutDate">
                                    CheckOut Date
                                </option>
                            </select>
                        </div>
                        <div className="">
                            <label htmlFor="">From Date</label>
                            <input
                                type="date"
                                name="fromDate"
                                value={filters.fromDate || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">To Date</label>
                            <input
                                type="date"
                                name="toDate"
                                value={filters.toDate || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Limit</label>
                            <select
                                id=""
                                name="limit"
                                value={filters.limit}
                                onChange={handleChange}
                            >
                                <option value="10000">all</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="200">200</option>
                                <option value="500">500</option>
                            </select>
                        </div>
                        <div></div>
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
                    ) : vouchers?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                Oops.. No Vouchers Found
                            </span>
                        </div>
                    ) : (
                        <VouchersTable
                            vouchers={vouchers}
                            setVouchers={setVouchers}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
