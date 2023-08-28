import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { PageLoader, Pagination } from "../../components";
import { A2AIndexTable, AddA2AModal } from "../../features/A2A";
import axios from "../../axios";

export default function InsuranceListingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState([]);
    const [isAddA2AModalOpen, setIsAddA2AModalOpen] = useState(false);
    const [airports, setAirports] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        searchInput: "",
        totalA2aList: 0,
    });

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Insurance</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Insurance</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Insurance</h1>
                        <div className="flex items-center gap-[15px]">
                            <form
                                action=""
                                // onSubmit={(e) => {
                                //     e.preventDefault();
                                //     fetchA2A({ ...filters });
                                //     let params = prevSearchParams();
                                //     setSearchParams({
                                //         ...params,
                                //         search: filters.searchInput,
                                //         skip: 0,
                                //     });
                                // }}
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
                            {/* <div>
                                <Link to={`add`}>
                                    <button
                                        className="w-[160px] bg-orange-500"
                                        // onClick={() => setIsAddA2AModalOpen(true)}
                                    >
                                        + Add A2A
                                    </button>
                                </Link>
                                {isAddA2AModalOpen && (
                                    <AddA2AModal
                                        setIsAddA2AModalOpen={
                                            setIsAddA2AModalOpen
                                        }
                                        isAddA2AModalOpen={isAddA2AModalOpen}
                                        airports={airports}
                                        result={result}
                                        setResult={setResult}
                                    />
                                )}
                            </div> */}
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : result?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm  text-grayColor block mt-[6px]">
                                Oops.. No Enquiries found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">#</th>
                                        <th className="font-[500] p-3">
                                            Depart Destination
                                        </th>
                                        <th className="font-[500] p-3">
                                            Return Destination
                                        </th>
                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {result?.map((a2a, index) => {
                                        return (
                                            <A2AIndexTable
                                                key={a2a?._id}
                                                a2a={a2a}
                                                index={index}
                                                setResult={setResult}
                                                result={result}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalA2aList}
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
                            </div> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
