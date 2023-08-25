import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";

export default function GroupAreaListPage() {
    const [groupArea, setGroupArea] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        total: 0,
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

    const fetchGroupArea = async ({ skip, limit, groupName }) => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/group-area/all?skip=${skip}&limit=${limit}&groupName=${groupName}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setGroupArea(response?.data?.groups);
            setFilters((prev) => {
                return {
                    ...prev,
                    total: response?.data?.total,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteGroupArea = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/group-area/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });
                const filteredAirlines = groupArea?.filter((group) => {
                    return group?._id !== id;
                });
                setGroupArea(filteredAirlines);
            }
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
        let groupName = searchParams.get("groupName") || "";
        let status = searchParams.get("status") || "";

        setFilters((prev) => {
            return { ...prev, skip, limit, groupName, status };
        });
        fetchGroupArea({ skip, limit, groupName, status });
    }, [searchParams]);

    // useEffect(() => {
    //     fetchGroupArea();
    // }, []);

    console.log(groupArea, "group area");

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">TRANSFER</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Area Group</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Area Group </h1>
                        <div className="flex items-center gap-[15px]">
                            <form
                                action=""
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    fetchGroupArea({ ...filters });
                                    let params = prevSearchParams();
                                    setSearchParams({
                                        ...params,
                                        groupName: filters.groupName,
                                        skip: 0,
                                    });
                                }}
                                className="flex items-center gap-[10px]"
                            >
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    value={filters.groupName || ""}
                                    onChange={(e) =>
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                groupName: e.target.value,
                                            };
                                        })
                                    }
                                />
                                <button className="px-5">Search</button>
                            </form>
                            <Link to="add">
                                <button className="px-3">
                                    + Add Area Group{" "}
                                </button>
                            </Link>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : groupArea?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                Oops.. No Transfers Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Index
                                        </th>
                                        <th className="font-[500] p-3">Name</th>
                                        <th className="font-[500] p-3">
                                            No of Areas
                                        </th>

                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {groupArea?.map((group, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                {" "}
                                                <td className="p-3">
                                                    {index + 1}
                                                </td>
                                                <td className="p-3">
                                                    {group?.name}
                                                </td>
                                                <td className="p-3">
                                                    {group?.areas.length}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteGroupArea(
                                                                    group._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link
                                                            to={`${group?._id}/edit`}
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
                                    total={filters?.total}
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
