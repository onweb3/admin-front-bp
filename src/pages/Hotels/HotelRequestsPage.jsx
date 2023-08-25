import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { HotelRequestTableRow } from "../../features/HotelRequest";

export default function HotelRequestsPage() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalHotelRequests: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchHotelRequests = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/hotels/requests/b2b/all?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setRequests(response?.data?.hotelRequests);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalHotelRequests: response?.data?.totalHotelRequests,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHotelRequests();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Hotel Requests
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        hotels
                    </Link>
                    <span>{">"} </span>
                    <span>Requests</span>
                </div>
            </div>

            {isLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">Hotel Requests</h1>
                            {/* <div className="flex items-center gap-[15px]">
                                <form
                                    action=""
                                    className="flex items-center gap-[10px]"
                                >
                                    <input
                                        type="text"
                                        placeholder="Search here..."
                                    />
                                    <button className="px-5">Search</button>
                                </form>
                            </div> */}
                        </div>
                        {requests?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Requests Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                            <tr>
                                                <th className="font-[500] p-3">
                                                    Hotel Name
                                                </th>
                                                <th className="font-[500] p-3">
                                                    CheckIn Date
                                                </th>
                                                <th className="font-[500] p-3">
                                                    CheckOut Date
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Pax
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Requested By
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {requests?.map((request, index) => {
                                                return (
                                                    <HotelRequestTableRow
                                                        key={index}
                                                        request={request}
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
                                        total={filters?.totalHotelRequests}
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
