import React, { useEffect, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { PageLoader } from "../../components";
import axios from "../../axios";
import { VoucherDailyReportTable } from "../../features/Voucher";

export default function VouchersDailyReportPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [vouchers, setVouchers] = useState([]);
    const [filters, setFilters] = useState({
        tourName: "",
        fromDate: "",
        toDate: "",
        pickupFrom: "",
        pickupTimeFrom: "",
        pickupTimeTo: "",
        skip: 0,
        limit: 200,
        totalVouchers: 0,
        referenceNumber: "",
        sortBy: "tourName:asc",
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const handleDownloadExcel = async () => {
        try {
            let response = await axios({
                url: `/vouchers/excel/download?skip=${filters.skip}&limit=${filters.limit}&tourName=${filters.tourName}&fromDate=${filters.fromDate}&toDate=${filters.toDate}&pickupFrom=${filters.pickupFrom}&pickupTimeFrom=${filters.pickupTimeFrom}&pickupTimeTo=${filters.pickupTimeTo}&referenceNumber=${filters.referenceNumber}&sortBy=${filters.sortBy}`,
                method: "GET",
                responseType: "blob",
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            });

            const href = URL.createObjectURL(response.data);

            const link = document.createElement("a");
            link.href = href;
            link.setAttribute("download", "vouchers-list.xlsx");
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);
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
                tourName: "",
                fromDate: "",
                toDate: "",
                pickupFrom: "",
                pickupTimeFrom: "",
                pickupTimeTo: "",
                skip: 0,
                limit: 200,
                totalVouchers: 0,
                referenceNumber: "",
                sortBy: "tourName:asc",
            };
        });
        fetchVouchers({
            tourName: "",
            fromDate: "",
            toDate: "",
            pickupFrom: "",
            pickupTimeFrom: "",
            pickupTimeTo: "",
            skip: 0,
            limit: 200,
            totalVouchers: 0,
            referenceNumber: "",
            sortBy: "tourName:asc",
        });
    };

    const fetchVouchers = async ({ ...filters }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/vouchers/daily-reports?skip=${filters.skip}&limit=${filters.limit}&tourName=${filters.tourName}&fromDate=${filters.fromDate}&toDate=${filters.toDate}&pickupFrom=${filters.pickupFrom}&pickupTimeFrom=${filters.pickupTimeFrom}&pickupTimeTo=${filters.pickupTimeTo}&referenceNumber=${filters.referenceNumber}&sortBy=${filters.sortBy}`,
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

    useEffect(() => {
        fetchVouchers({ ...filters });
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Daily Reports
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/vouchers" className="text-textColor">
                        Vouchers{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Daily Reports</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Daily Reports</h1>
                        <div className="flex items-center gap-[10px]">
                            <button
                                className="px-3 bg-[#299cdb] flex items-center justify-center gap-[10px]"
                                onClick={handleDownloadExcel}
                            >
                                <FiDownload /> Download Excel
                            </button>
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
                        <div className="col-span-2">
                            <label htmlFor="">Tour Name</label>
                            <input
                                type="text"
                                placeholder="Search Tour Name"
                                className=""
                                name="tourName"
                                value={filters.tourName || ""}
                                onChange={handleChange}
                            />
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
                        <div className="">
                            <label htmlFor="">Pickup From</label>
                            <input
                                type="text"
                                placeholder="Enter Pickup From"
                                name="pickupFrom"
                                value={filters.pickupFrom || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Pickup From Time</label>
                            <input
                                type="time"
                                className=""
                                name="pickupTimeFrom"
                                value={filters.pickupTimeFrom || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Pickup To Time</label>
                            <input
                                type="time"
                                className=""
                                name="pickupTimeTo"
                                value={filters.pickupTimeTo || ""}
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
                        <div>
                            <label htmlFor="">Sort By</label>
                            <select
                                id=""
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleChange}
                            >
                                <option value="onDate:asc">
                                    On Date Ascending
                                </option>
                                <option value="onDate:desc">
                                    On Date Descending{" "}
                                </option>
                                <option value="tourName:asc">
                                    Tour Name Ascending
                                </option>
                                <option value="tourName:desc">
                                    Tour Name Descending{" "}
                                </option>
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
                    ) : vouchers?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                Oops.. No Vouchers Found
                            </span>
                        </div>
                    ) : (
                        <VoucherDailyReportTable
                            vouchers={vouchers}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
