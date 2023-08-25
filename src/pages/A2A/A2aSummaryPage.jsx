import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { PageLoader, Pagination } from "../../components";
import {
    A2AIndexTable,
    A2ASummaryTable,
    AddA2AModal,
} from "../../features/A2A";
import axios from "../../axios";
import { BiFilter } from "react-icons/bi";

function A2aSummaryPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState([]);
    // const [setSatta]
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        status: "",
        companyName: "",
        referenceNo: "",
        dateFrom: "",
        dateTo: "",
        pnrNumber: "",
        totalOrders: 0,
    });
    const { jwtToken } = useSelector((state) => state.admin);

    const [searchParams, setSearchParams] = useSearchParams();

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
                companyName: "",
                referenceNo: "",
                dateFrom: "",
                dateTo: "",
                pnrNumber: "",
            };
        });
        fetchA2A({
            skip: 0,
            limit: 10,
            status: "",
            companyName: "",
            referenceNo: "",
            dateFrom: "",
            dateTo: "",
            pnrNumber: "",
        });
    };

    const prevSearchParams = (e) => {
        let params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    };

    const fetchA2A = async ({ ...filters }) => {
        try {
            setIsLoading(true);

            console.log(filters, "filters");

            const response = await axios.get(
                `/a2a/orders/summary/all?skip=${filters.skip}&limit=${filters.limit}&referenceNo=${filters.referenceNo}&pnrNumber=${filters.pnrNumber}&companyName=${filters.companyName}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}&status=${filters.status}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            console.log(response.data);
            setResult(response.data?.result?.data);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalOrders: response?.data?.result?.totalOrders,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        let skip =
            Number(searchParams.get("skip")) > 0
                ? Number(searchParams.get("skip")) - 1
                : 0;
        let limit =
            Number(searchParams.get("limit")) > 0
                ? Number(searchParams.get("limit"))
                : 10;

        setFilters((prev) => {
            return { ...prev, skip, limit };
        });
        fetchA2A({ ...filters, skip, limit });
    }, [searchParams, filters.skip]);

    const handleDownload = async () => {
        try {
            const searchQuery = `skip=${filters.skip}&limit=${filters.limit}&referenceNo=${filters.referenceNo}&pnrNumber=${filters.pnrNumber}&companyName=${filters.companyName}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}&status=${filters.status}`;

            const response = await axios({
                url: `/a2a/orders/download/summary?${searchQuery}`,
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

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    A2A SUMMARY
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>A2A Summary</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">A2A SUMMARY</h1>
                        <div className="flex items-center gap-[15px]">
                            <form
                                action=""
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    fetchA2A({ ...filters });
                                    let params = prevSearchParams();
                                    setSearchParams({
                                        ...params,
                                        search: filters.searchInput,
                                        skip: 0,
                                    });
                                }}
                                className="flex items-center gap-[10px]"
                            >
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    value={filters.referenceNo || ""}
                                    onChange={(e) =>
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                referenceNo: e.target.value,
                                            };
                                        })
                                    }
                                />
                                <button className="px-5">Search</button>
                            </form>
                            <div className="">
                                <button
                                    onClick={() => handleDownload()}
                                    className="h-10 bg-green-500 rounded text-white px-5"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    fetchA2A(filters);
                                }}
                                className="grid grid-cols-7 items-end gap-4 border-b border-dashed p-4"
                            >
                                <div className="col-span-2">
                                    <label htmlFor="">PNR Number</label>
                                    <input
                                        type="text"
                                        placeholder="Search Reference No."
                                        className=""
                                        name="pnrNumber"
                                        value={filters.pnrNumber || ""}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="">
                                    <label htmlFor="">Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="Search agent..."
                                        name="companyName"
                                        value={filters.companyName || ""}
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

                                {/* <div className="">
                            <label htmlFor="">Traveller</label>
                            <input
                                type="text"
                                placeholder="Search email..."
                                className=""
                                name="travellerEmail"
                                value={filters.travellerEmail || ""}
                                onChange={handleChange}
                            />
                        </div> */}
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
                                        <option value="confirmed">
                                            Confirmed
                                        </option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
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
                                        {/* <option value="">all</option> */}
                                        <option value="10">10</option>

                                        <option value="25">25</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                        <option value="500">500</option>
                                        <option value="1000">1000</option>
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
                        </div>
                    </div>

                    {isLoading ? (
                        <PageLoader />
                    ) : result?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm  text-grayColor block mt-[6px]">
                                Oops.. No A2A found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">#</th>
                                        <th className="font-[500] p-3">
                                            Ref Number
                                        </th>
                                        <th className="font-[500] p-3">
                                            Passenger
                                        </th>
                                        <th className="font-[500] p-3">
                                            PNR Number
                                        </th>
                                        <th className="font-[500] p-3">
                                            Ordered Date
                                        </th>
                                        <th className="font-[500] p-3">A2A</th>
                                        <th className="font-[500] p-3">
                                            Amount
                                        </th>
                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {result?.map((order, index) => {
                                        return (
                                            <A2ASummaryTable
                                                key={order?._id}
                                                order={order}
                                                index={index}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalOrders}
                                    incOrDecSkip={(number) => {
                                        let params = prevSearchParams();
                                        setSearchParams({
                                            ...params,
                                            skip: filters.skip + number + 1,
                                        });
                                    }}
                                    updateSkip={(skip) => {
                                        let params = prevSearchParams();
                                        setSearchParams({
                                            ...params,
                                            skip: skip + 1,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default A2aSummaryPage;
