import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import VisaApplicationTable from "../../features/Visa/components/VisaApplicationTable";

export default function B2bListPage() {
    const [visaApplications, setVisaApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalVisaApplications: 0,
        referenceNumber: "",
        status: "",
        orderedBy: "b2b",
    });
    const [orderedBy, setOrderedBy] = useState("b2b");
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

    const fetchResellers = async ({
        skip,
        limit,
        status,
        referenceNumber,
        orderedBy,
    }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/visa/application/all?skip=${skip}&orderedBy=${orderedBy}&limit=${limit}&status=${status}&referenceNumber=${referenceNumber}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setVisaApplications(response.data?.visaApplications);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalVisaApplications: response.data?.totalVisaApplications,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    // const onChangeOrderBy = (value)=>{

    //     setOrderedBy(value)

    // }

    useEffect(() => {
        let skip =
            Number(searchParams.get("skip")) > 0
                ? Number(searchParams.get("skip")) - 1
                : 0;
        let limit =
            Number(searchParams.get("limit")) > 0
                ? Number(searchParams.get("limit"))
                : 10;
        let referenceNumber = searchParams.get("referenceNumber") || "";
        let status = searchParams.get("status") || "";
        let query = searchParams.get("orderedBy") || "b2b";
        if (query) {
            setOrderedBy(query);
        }

        setFilters((prev) => {
            return { ...prev, skip, limit, referenceNumber, status };
        });
        fetchResellers({
            skip,
            limit,
            referenceNumber,
            status,
            orderedBy: query,
        });
    }, [searchParams]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Visa Application
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Visa Application</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Visa Applications</h1>
                        <div className="flex items-center gap-[10px]">
                            <select
                                name="status"
                                value={filters.status || ""}
                                onChange={handleChange}
                                id=""
                            >
                                <option value="">All</option>
                                <option value="initiated">Initiated</option>
                                <option value="approved">Approved</option>
                                <option value="submitted">Submitted</option>
                                <option value="rejected">Rejected</option>
                                <option value="resubmitted">Resubmitted</option>
                            </select>
                            <input
                                type="text"
                                placeholder=" Reference Number..."
                                className="min-w-[200px]"
                                name="referenceNumber"
                                onChange={handleChange}
                                value={filters.referenceNumber || ""}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (orderedBy === "b2b"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return { ...prev, orderedBy: "b2b" };
                                })
                            }
                        >
                            B2b
                        </button>
                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (orderedBy === "subAgent"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return { ...prev, orderedBy: "subAgent" };
                                })
                            }
                        >
                            subAgent
                        </button>
                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (orderedBy === "b2c"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return { ...prev, orderedBy: "b2c" };
                                })
                            }
                        >
                            B2c
                        </button>
                    </div>
                    {/* <div className="flex items-center  w-max gap-[10px] mx-2 my-2">
                        <div name='orderedBy'  value="b2b"  onClick={(e)=>{onChangeOrderBy("b2b")}} className="py-2 px-5 bg-blue-500 rounded-lg" >B2B</div>
                        <div name='orderedBy' value="b2c" onClick={(e)=>{onChangeOrderBy("b2c")}}className="py-2 px-5 bg-blue-500 rounded-lg">B2C</div>
                    </div> */}
                    {isLoading ? (
                        <PageLoader />
                    ) : visaApplications?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                Oops.. No Application found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Reference Number
                                            </th>
                                            <th className="font-[500] p-3">
                                                Visa Title
                                            </th>
                                            {orderedBy == "b2c" ? (
                                                <th className="font-[500] p-3">
                                                    User
                                                </th>
                                            ) : (
                                                <th className="font-[500] p-3">
                                                    Reseller
                                                </th>
                                            )}

                                            <th className="font-[500] p-3">
                                                Traveller
                                            </th>
                                            <th className="font-[500] p-3">
                                                Applied Date
                                            </th>
                                            <th className="font-[500] p-3">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {visaApplications?.map(
                                            (visaApplication, index) => {
                                                return (
                                                    <VisaApplicationTable
                                                        orderedBy={orderedBy}
                                                        visaApplication={
                                                            visaApplication
                                                        }
                                                        key={index}
                                                    />
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalVisaApplications}
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
