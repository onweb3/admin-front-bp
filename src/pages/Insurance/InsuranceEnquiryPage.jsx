import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { PageLoader, Pagination } from "../../components";
import axios from "../../axios";
import { formatDate } from "../../utils";

export default function InsursanceEnquiryPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [insuranceContracts, setInsuranceContracts] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalInsuranceContracts: 0,
        referenceNumber: "",
        plan: "",
        fromDateStart: "",
        fromDateEnd: "",
        toDateStart: "",
        toDateEnd: "",
        reseller: "",
        status: "",
    });

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const fetchAllInsuranceEnquiries = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/insurance/contracts/all?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setInsuranceContracts(response?.data?.insuranceContracts);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalInsuranceContracts: response?.data?.totalInsuranceContracts,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAllInsuranceEnquiries();
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Insurance Enquiries</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Insurance </span>
                    <span>{">"} </span>
                    <span>Enquiries</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Insurance Enquiries</h1>
                        {/* <div className="flex items-center gap-[15px]">
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
                        </div> */}
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : insuranceContracts?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm  text-grayColor block mt-[6px]">
                                Oops.. No Insurance Enquiries found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Ref.No</th>
                                        <th className="font-[500] p-3">Plan</th>
                                        <th className="font-[500] p-3">From Date</th>
                                        <th className="font-[500] p-3">To Date</th>
                                        <th className="font-[500] p-3">Destination</th>
                                        <th className="font-[500] p-3">Reseller</th>
                                        <th className="font-[500] p-3">Price</th>
                                        <th className="font-[500] p-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {insuranceContracts?.map((iContract, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                                                onClick={() => navigate(`${iContract?._id}`)}
                                            >
                                                <td className="p-3">
                                                    {iContract?.referenceNumber}
                                                </td>
                                                <td className="p-3">
                                                    {iContract?.planName || "N/A"}
                                                </td>
                                                <td className="p-3">
                                                    {formatDate(iContract?.travelFrom)}
                                                </td>
                                                <td className="p-3">
                                                    {formatDate(iContract?.travelTo)}
                                                </td>
                                                <td className="p-3">{iContract?.destination}</td>
                                                <td className="p-3 capitalize">
                                                    {iContract?.reseller?.companyName} (
                                                    {iContract?.reseller?.agentCode})
                                                </td>
                                                <td className="p-3">
                                                    {iContract?.totalAmount} AED
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={
                                                            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                            (iContract?.status === "cancelled"
                                                                ? "bg-[#f065481A] text-[#f06548]"
                                                                : iContract?.status === "completed"
                                                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                                : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                        }
                                                    >
                                                        {iContract?.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalInsuranceContracts}
                                    incOrDecSkip={(number) =>
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                skip: prev.skip + number,
                                            };
                                        })
                                    }
                                    updateSkip={(skip) =>
                                        setFilters((prev) => {
                                            return { ...prev, skip };
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
