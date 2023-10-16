import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import VisaApplicationTable from "../../features/Visa/components/VisaApplicationTable";
import RefundRequestSingleRow from "../../features/Refund/components/RefundRequestTables";

export default function RefundPage() {
    const [refundList, setRefundList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totallistRefund: 0,
        referenceNumber: "",
        status: "",
        category: "attraction",
    });
    const [category, setCategory] = useState("b2b");
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
        category,
    }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/refund/all?skip=${skip}&category=${category}&limit=${limit}&status=${status}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setRefundList(response.data?.listRefund);
            setFilters((prev) => {
                return {
                    ...prev,
                    totallistRefund: response.data?.totallistRefund,
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
        let query = searchParams.get("category") || "attraction";
        if (query) {
            setCategory(query);
        }

        setFilters((prev) => {
            return { ...prev, skip, limit, referenceNumber, status };
        });
        fetchResellers({
            skip,
            limit,
            referenceNumber,
            status,
            category: query,
        });
    }, [searchParams]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Refund Request
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Refund Request</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Refund Request</h1>
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
                                (category === "attraction"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return { ...prev, category: "attraction" };
                                })
                            }
                        >
                            Attraction
                        </button>
                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (category === "flight"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return { ...prev, category: "flight" };
                                })
                            }
                        >
                            Flight
                        </button>
                        {/* <button
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
                        </button> */}
                    </div>
                    {/* <div className="flex items-center  w-max gap-[10px] mx-2 my-2">
                        <div name='orderedBy'  value="b2b"  onClick={(e)=>{onChangeOrderBy("b2b")}} className="py-2 px-5 bg-blue-500 rounded-lg" >B2B</div>
                        <div name='orderedBy' value="b2c" onClick={(e)=>{onChangeOrderBy("b2c")}}className="py-2 px-5 bg-blue-500 rounded-lg">B2C</div>
                    </div> */}
                    {isLoading ? (
                        <PageLoader />
                    ) : refundList?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
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
                                                Reseller Name
                                            </th>
                                            <th className="font-[500] p-3">
                                                Amount
                                            </th>
                                            <th className="font-[500] p-3">
                                                Order Refrence No
                                            </th>
                                            <th className="font-[500] p-3">
                                                Date
                                            </th>
                                            <th className="font-[500] p-3">
                                                View
                                            </th>
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {refundList?.map(
                                            (refundList, index) => {
                                                return (
                                                    <RefundRequestSingleRow
                                                        category={category}
                                                        request={refundList}
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
                                    total={filters?.totallistRefund}
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
