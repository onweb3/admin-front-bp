import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { ResellersTableRow } from "../../features/Resellers";
import A2aQuotaTable from "../../features/A2A/components/A2aQuotaTable";

export default function A2aQuotaPage() {
    const [resellers, setResellers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalResellers: 0,
        companyName: "",
        status: "",
    });
    const [ticketData, setTicketData] = useState({});

    const { ticketId } = useParams();

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
        let params = prevSearchParams();
        setSearchParams({
            ...params,
            [e.target.name]: e.target.value,
            skip: 0,
        });
    };

    const fetchResellers = async ({ skip, limit, status, companyName }) => {
        try {
            console.log("fetching resellers");
            setIsLoading(true);

            const response = await axios.get(
                `/a2a/quota/${ticketId}/all?skip=${skip}&limit=${limit}&status=${status}&companyName=${companyName}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setResellers(response.data?.resellers);
            setTicketData(response.data.ticket);
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
        let skip =
            Number(searchParams.get("skip")) > 0
                ? Number(searchParams.get("skip")) - 1
                : 0;
        let limit =
            Number(searchParams.get("limit")) > 0
                ? Number(searchParams.get("limit"))
                : 10;
        let companyName = searchParams.get("companyName") || "";
        let status = searchParams.get("status") || "";

        setFilters((prev) => {
            return { ...prev, skip, limit, companyName, status };
        });
        fetchResellers({ skip, limit, companyName, status });
    }, [searchParams]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">A2a Quota</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/" className="text-textColor">
                        A2a Ticket{" "}
                    </Link>
                    <span>{">"} </span>

                    <span>A2a Quota </span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <div className="flex items-center justify-between gap-5">
                            <h1 className="font-medium">A2a Quota</h1>
                            <h1 className="font-medium">
                                PNR NO ({ticketData.pnrNo})
                            </h1>
                        </div>
                        <div className="flex items-center gap-[10px]">
                            <input
                                type="text"
                                placeholder="company name..."
                                className="min-w-[200px]"
                                name="companyName"
                                onChange={handleChange}
                                value={filters.companyName || ""}
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : resellers?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                Oops.. No Resellers found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Agent Code
                                            </th>
                                            <th className="font-[500] p-3">
                                                Title
                                            </th>
                                            <th className="font-[500] p-3">
                                                User
                                            </th>
                                            <th className="font-[500] p-3">
                                                Country
                                            </th>
                                            <th className="font-[500] p-3">
                                                Used seat{" "}
                                            </th>
                                            <th className="font-[500] p-3">
                                                Seat Allocated{" "}
                                            </th>
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {resellers?.map((reseller, index) => {
                                            return (
                                                <A2aQuotaTable
                                                    setResellers={setResellers}
                                                    reseller={reseller}
                                                    index={index}
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
