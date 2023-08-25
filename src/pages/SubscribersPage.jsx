import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { PageLoader, Pagination } from "../components";
import formatDate from "../utils/formatDate";
import axios from "../axios";

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        limit: 10,
        skip: 0,
        totalSubscribers: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchSubscribers = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/subscribers/all?subscribed=true&skip=${filters?.skip}&limit=${filters?.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setSubscribers(response.data?.subscribers);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalSubscribers: response?.data?.totalSubscribers,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, [filters.limit, filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Subscribers
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Home{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Subscribers</span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Subscribers</h1>
                        </div>
                        {subscribers?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm  text-grayColor block mt-[6px]">
                                    Oops.. No Subscribers found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Email
                                            </th>
                                            <th className="font-[500] p-3">
                                                Subscribed Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {subscribers?.map((user, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        {user?.email}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {formatDate(
                                                            user?.createdAt
                                                        )}
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
                                        total={filters?.totalSubscribers}
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
            )}
        </div>
    );
}
