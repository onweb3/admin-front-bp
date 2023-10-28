import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader } from "../../components";
import Pagination from "../../components/Pagination";
import { AttractionsTableSingleRow } from "../../features/Attractions";
import { BsEyeFill } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

export default function GuideListPage() {
    const [guides, setGuides] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalGuides: 0,
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

    const fetchGuide = async ({ skip, limit }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/attractions/guide/all?skip=${skip}&limit=${limit}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setGuides(response?.data?.guides);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalGuides: response?.data?.totalGuides,
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
        fetchGuide({ skip, limit });
    }, [searchParams]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Guides</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Guide</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Guide</h1>
                        <div className="flex items-center gap-[15px]">
                            <form
                                action=""
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    fetchAttractions({ ...filters });
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
                            <Link to={`add?q=${searchParams}`}>
                                <button className="w-[150px] bg-orange-500">
                                    + Add Guide
                                </button>
                            </Link>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : guides?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm  text-grayColor block mt-[6px]">
                                Oops.. No Guides found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        {" "}
                                        <th className="font-[500] p-3">
                                            Index
                                        </th>
                                        <th className="font-[500] p-3">Name</th>
                                        <th className="font-[500] p-3">
                                            Duration
                                        </th>
                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {guides?.map((guide, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                {" "}
                                                <td className="p-3 uppercase">
                                                    {index + 1}
                                                </td>
                                                <td className="p-3 uppercase">
                                                    {guide?.name}
                                                </td>
                                                <td className="p-3 uppercase">
                                                    {guide?.duration}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <Link
                                                            to={`${guide?._id}/terminal`}
                                                        >
                                                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                <BsEyeFill />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            // onClick={() =>
                                                            //     deleteAirport(
                                                            //         airport?._id
                                                            //     )
                                                            // }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link
                                                            to={`${guide?._id}/edit`}
                                                        >
                                                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                <BiEditAlt />
                                                            </button>
                                                        </Link>
                                                    </div>
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
                                    total={filters?.totalGuides}
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
