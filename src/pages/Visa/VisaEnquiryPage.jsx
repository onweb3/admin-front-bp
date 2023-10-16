import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import VisaApplicationTable from "../../features/Visa/components/VisaApplicationTable";
import { formatDate } from "../../utils";

export default function VisaEnquiryPage() {
    const [visaEnquiries, setVisaEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalVisaEnquiries: 0,
        requestedBy: "b2c",
        searchQuery: "",
    });

    const [requestedBy, setRequestedBy] = useState("b2c");
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

    const fetchEnquires = async ({ skip, limit, requestedBy, searchQuery }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/visa/enquiry/all?skip=${skip}&requestedBy=${requestedBy}&limit=${limit}&searchQuery=${searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            console.log(response.data, "response");

            setVisaEnquiries(response.data.visaEnquiries);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalVisaEnquiries: response.data?.totalVisaEnquiries,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setVisaEnquiries([]);
            setIsLoading(false);
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
        let searchQuery = searchParams.get("searchQuery") || "";
        let status = searchParams.get("status") || "";
        let query = searchParams.get("requestedBy") || "b2c";
        if (query) {
            setRequestedBy(query);
        }

        setFilters((prev) => {
            return { ...prev, skip, limit, requestedBy, searchQuery };
        });
        fetchEnquires({
            skip,
            limit,
            requestedBy: query,
            searchQuery,
        });
    }, [searchParams]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Visa Enquiries
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Visa Enquiries</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Visa Enquiries</h1>
                        <div className="flex items-center gap-[10px]">
                            <input
                                type="text"
                                placeholder=" Search Query ..."
                                className="min-w-[200px]"
                                name="searchQuery"
                                onChange={handleChange}
                                value={filters.searchQuery || ""}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (requestedBy === "b2c"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return { ...prev, requestedBy: "b2c" };
                                })
                            }
                        >
                            B2c
                        </button>
                        <button
                            className={
                                "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                (requestedBy === "b2b"
                                    ? "border-b border-b-orange-500"
                                    : "")
                            }
                            onClick={() =>
                                setSearchParams((prev) => {
                                    return { ...prev, requestedBy: "b2b" };
                                })
                            }
                        >
                            B2b
                        </button>
                    </div>
                    {/* <div className="flex items-center  w-max gap-[10px] mx-2 my-2">
                <div name='orderedBy'  value="b2b"  onClick={(e)=>{onChangeOrderBy("b2b")}} className="py-2 px-5 bg-blue-500 rounded-lg" >B2B</div>
                <div name='orderedBy' value="b2c" onClick={(e)=>{onChangeOrderBy("b2c")}}className="py-2 px-5 bg-blue-500 rounded-lg">B2C</div>
            </div> */}
                    {isLoading ? (
                        <PageLoader />
                    ) : visaEnquiries?.length < 1 ? (
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
                                                Index
                                            </th>
                                            <th className="font-[500] p-3">
                                                Name
                                            </th>
                                            <th className="font-[500] p-3">
                                                Email
                                            </th>
                                            {requestedBy == "b2c" ? (
                                                <th className="font-[500] p-3">
                                                    User
                                                </th>
                                            ) : (
                                                <th className="font-[500] p-3">
                                                    Reseller
                                                </th>
                                            )}

                                            <th className="font-[500] p-3">
                                                Whatsapp No
                                            </th>
                                            <th className="font-[500] p-3">
                                                Nationality
                                            </th>
                                            <th className="font-[500] p-3">
                                                Created
                                            </th>
                                            {/* <th className="font-[500] p-3">
                                                Status
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {visaEnquiries?.map(
                                            (visaEnquiry, index) => {
                                                return (
                                                    <tr className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]">
                                                        <td className="p-3">
                                                            {index + 1}
                                                        </td>
                                                        <td className="p-3">
                                                            {visaEnquiry?.name}
                                                        </td>
                                                        <td className="p-3">
                                                            <span className="block">
                                                                {
                                                                    visaEnquiry?.email
                                                                }
                                                            </span>
                                                            <span className="text-grayColor block">
                                                                {
                                                                    visaEnquiry?.visa
                                                                }
                                                            </span>
                                                        </td>

                                                        {requestedBy ==
                                                        "b2c" ? (
                                                            <td className="p-3">
                                                                {visaEnquiry?.user ? (
                                                                    <>
                                                                        <span className="block">
                                                                            {
                                                                                visaEnquiry
                                                                                    ?.user
                                                                                    ?.name
                                                                            }{" "}
                                                                        </span>
                                                                        <span className="text-grayColor block">
                                                                            {
                                                                                visaEnquiry
                                                                                    ?.user
                                                                                    ?.email
                                                                            }
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    "N/A"
                                                                )}
                                                            </td>
                                                        ) : (
                                                            <td className="p-3">
                                                                <span className="block">
                                                                    {
                                                                        visaEnquiry
                                                                            ?.reseller
                                                                            ?.name
                                                                    }{" "}
                                                                </span>
                                                                <span className="text-grayColor block">
                                                                    {
                                                                        visaEnquiry
                                                                            ?.reseller
                                                                            ?.email
                                                                    }
                                                                </span>
                                                            </td>
                                                        )}

                                                        <td className="p-3">
                                                            {
                                                                visaEnquiry?.whatsapp
                                                            }{" "}
                                                        </td>
                                                        <td className="p-3 capitalize">
                                                            {
                                                                visaEnquiry
                                                                    ?.nationality
                                                                    ?.countryName
                                                            }{" "}
                                                        </td>
                                                        <td className="p-3">
                                                            {formatDate(
                                                                visaEnquiry?.createdAt
                                                            )}
                                                        </td>
                                                        {/* <td className="p-3">
                                                            {visaEnquiry
                                                                ?.travellers
                                                                ?.isStatus ===
                                                            "approved" ? (
                                                                <div>
                                                                    <span className="py-1 px-2 text-[12px] font-medium rounded text-[#008000] bg-[#f065481a]">
                                                                        Approved
                                                                    </span>
                                                                </div>
                                                            ) : visaApplication
                                                                  ?.travellers
                                                                  ?.isStatus ===
                                                              "rejected" ? (
                                                                <div>
                                                                    <span className="py-1 px-2 text-[12px] font-medium rounded text-[#ff0000] bg-[#f065481a]">
                                                                        Rejected
                                                                    </span>
                                                                </div>
                                                            ) : visaApplication
                                                                  ?.travellers
                                                                  ?.isStatus ===
                                                              "submitted" ? (
                                                                <div>
                                                                    <span className="py-1 px-2 text-[12px] font-medium rounded text-[#f06548] bg-[#f065481a]">
                                                                        Submitted
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <span className="py-1 px-2 text-[12px] font-medium rounded  bg-[#f065481a]">
                                                                        Initiated
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </td> */}
                                                    </tr>
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
                                    total={filters?.totalVisaEnquiries}
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
