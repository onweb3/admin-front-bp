import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { config } from "../../constants";

export default function TopSellingHotelsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [hotels, setHotels] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalHotels: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const fetchTopHotels = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/hotels/orders/b2b/all/top-hotels?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setHotels(response?.data?.topHotels || []);
            setFilters((prev) => {
                return { ...prev, totalHotels: response?.data?.totalHotels };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTopHotels();
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Top Hotels</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        hotels
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels/reservation" className="text-textColor">
                        Reservation
                    </Link>
                    <span>{">"} </span>
                    <span>Top Hotels </span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Top Hotels List</h1>
                        {/* <button
                    className="px-3 bg-[#299cdb] flex items-center justify-center gap-[10px]"
                    // onClick={handleDownload}
                >
                    <FiDownload /> Download
                </button> */}
                    </div>

                    {isLoading ? (
                        <PageLoader />
                    ) : !hotels || hotels?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. Not Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">#</th>
                                            <th className="font-[500] p-3">Hotel</th>
                                            <th className="font-[500] p-3">Total Orders</th>
                                            <th className="font-[500] p-3">Total Volume</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {hotels?.map((item, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                                                    onClick={() =>
                                                        navigate(`/hotels/${item?.hote?._id}/edit`)
                                                    }
                                                >
                                                    <td className="p-3">
                                                        {filters.skip * filters.limit + (index + 1)}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-[40px] min-w-[40px] h-[40px] min-h-[40px] overflow-hidden rounded">
                                                                <img
                                                                    src={
                                                                        item?.hotel?.image
                                                                            ?.isRelative
                                                                            ? config.SERVER_URL +
                                                                              item?.hotel?.image
                                                                                  ?.path
                                                                            : item?.hotel?.image
                                                                                  ?.path
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <span>
                                                                    {item?.hotel?.hotelName}
                                                                </span>
                                                                <span className="block text-[13px] text-grayColor">
                                                                    {item?.hotel?.address}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        {item?.totalOrders || 0}
                                                    </td>
                                                    <td className="p-3">
                                                        {item?.totalVolume?.toFixed(2) || 0} AED
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalHotels}
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
