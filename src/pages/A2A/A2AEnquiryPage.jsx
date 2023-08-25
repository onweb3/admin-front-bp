import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import A2AEnquiryTable from "../../features/A2A/components/A2AEnquiryTable";

function A2AEnquiryPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        searchInput: "",
        totalOrders: 0,
    });

    const [searchParams, setSearchParams] = useSearchParams();

    const prevSearchParams = (e) => {
        let params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    };

    const { jwtToken } = useSelector((state) => state.admin);


    const fetchA2A = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/a2a/orders/enquiry/all?skip=${filters.skip}&limit=${filters.limit}&search=${filters.searchInput}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
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
        let searchInput = searchParams.get("search") || "";

        setFilters((prev) => {
            return { ...prev, skip, limit, searchInput };
        });
        fetchA2A({ skip, limit, searchInput });
    }, [searchParams]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">A2A ENQUIRY</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>A2A-Enquiry</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">A2A ENQUIRY</h1>
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
                                    value={filters.searchInput || ""}
                                    onChange={(e) =>
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                searchInput: e.target.value,
                                            };
                                        })
                                    }
                                />
                                <button className="px-5">Search</button>
                            </form>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : result?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm  text-grayColor block mt-[6px]">
                                Oops.. No A2A Enquiry
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">#</th>
                                        <th className="font-[500] p-3">
                                            Agent
                                        </th>
                                        <th className="font-[500] p-3">
                                            A2A Type
                                        </th>
                                        <th className="font-[500] p-3">
                                            Order Date
                                        </th>
                                        <th className="font-[500] p-3">
                                            Passengers
                                        </th>
                                        <th className="font-[500] p-3">
                                            Markup
                                        </th>
                                        <th className="font-[500] p-3">
                                            price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {result?.map((item, index) => (
                                    <A2AEnquiryTable item={item} index={index} key={index}  />
                                    ))}
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

export default A2AEnquiryPage;
