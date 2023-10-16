import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "../../../axios";
import { PageLoader, Pagination } from "../../../components";
import SingleActivityTicketRow from "./SingleActivityTicketRow";

export default function SingleActivityTicketInfo() {
    const [isLoading, setIsLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalActivities: 0,
        search: "",
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchActivities = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/attractions/tickets/activities/info?skip=${filters.skip}&limit=${filters.limit}&search=${filters.search}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setActivities(response.data?.activitiesTicketInfo?.data);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalActivities:
                        response.data?.activitiesTicketInfo?.totalActivities,
                };
            });

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [filters.skip, filters.limit, filters.search]);

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="p-4 flex items-start justify-between">
                <h1 className="font-[600]">Tickets Availability</h1>
                <div className="flex items-center gap-[15px]">
                    <input
                        type="text"
                        placeholder="Search here..."
                        onChange={(e) => {
                            setFilters((prev) => {
                                return {
                                    ...prev,
                                    skip: 0,
                                    search: e.target.value,
                                };
                            });
                        }}
                    />
                </div>
            </div>
            {isLoading ? (
                <PageLoader />
            ) : !activities || activities?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm text-grayColor block mt-[6px]">
                        Oops.. No Items Found
                    </span>
                </div>
            ) : (
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                <tr>
                                    <th className="font-[500] p-3">
                                        Attraction
                                    </th>
                                    <th className="font-[500] p-3">Total</th>
                                    <th className="font-[500] p-3">Sold</th>
                                    <th className="font-[500] p-3">Expired</th>
                                    <th className="font-[500] p-3">
                                        Availalbe
                                    </th>
                                    <th className="font-[500] p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {activities?.map((activity, index) => {
                                    return (
                                        <SingleActivityTicketRow
                                            key={index}
                                            activity={activity}
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
                            total={filters?.totalActivities}
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
    );
}
