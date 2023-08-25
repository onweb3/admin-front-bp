import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import SubAgentsTableRow from "../../features/Resellers/components/SubAgentsTableRow";

export default function SubAgentsListPage() {
    const [resellers, setResellers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalResellers: 0,
        searchQuery: "",
        status: "",
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const prevSearchParams = (e) => {
        let params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    };

    const handleChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleStatusChange = (e) => {
        let params = prevSearchParams();
        setSearchParams({
            ...params,
            [e.target.name]: e.target.value,
            skip: 0,
        });
    };

    const fetchSubAgents = async ({ skip, limit, status, searchQuery }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/resellers/all?role=sub-agent&skip=${skip}&limit=${limit}&status=${status}&searchQuery=${searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setResellers(response.data?.resellers);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalResellers: response.data?.totalResellers,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        let skip = Number(searchParams.get("skip")) > 0 ? Number(searchParams.get("skip")) - 1 : 0;
        let limit = Number(searchParams.get("limit")) > 0 ? Number(searchParams.get("limit")) : 10;
        let searchQuery = searchParams.get("searchQuery") || "";
        let status = searchParams.get("status") || "";

        setFilters((prev) => {
            return { ...prev, skip, limit, searchQuery, status };
        });
        fetchSubAgents({ skip, limit, searchQuery, status });
    }, [searchParams]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">B2B</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>b2b </span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All B2B</h1>
                        <div className="flex items-center gap-[10px]">
                            <select
                                name="status"
                                value={filters.status || ""}
                                onChange={handleStatusChange}
                                id=""
                            >
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="ok">Ok</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="disabled">Disabled</option>
                            </select>
                            <form
                                action=""
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    let params = prevSearchParams();
                                    setSearchParams({
                                        ...params,
                                        searchQuery: filters.searchQuery,
                                        skip: 0,
                                    });
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    className="min-w-[200px]"
                                    name="searchQuery"
                                    onChange={handleChange}
                                    value={filters.searchQuery || ""}
                                />
                            </form>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : resellers?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Resellers found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Agent Code</th>
                                            <th className="font-[500] p-3">Title</th>
                                            <th className="font-[500] p-3">Sub Agent</th>
                                            <th className="font-[500] p-3">Country</th>
                                            <th className="font-[500] p-3">Phone Number</th>
                                            <th className="font-[500] p-3">Parent Reseller</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {resellers?.map((reseller, index) => {
                                            return (
                                                <SubAgentsTableRow
                                                    reseller={reseller}
                                                    key={index}
                                                />
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalResellers}
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
