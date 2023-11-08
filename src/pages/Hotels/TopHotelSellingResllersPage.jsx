import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { PageLoader, Pagination } from "../../components";
import { Link } from "react-router-dom";
import { config } from "../../constants";
import { avatarImg } from "../../assets/images";

export default function TopHotelSellingResllersPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [resellers, setResellers] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalResellers: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchTopResellers = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/hotels/orders/b2b/all/top-resellers?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setResellers(response?.data?.topResellers || []);
            setFilters((prev) => {
                return { ...prev, totalResellers: response?.data?.totalResellers };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTopResellers();
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Hotel Order Top Resellers</h1>
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
                    <span>Top Resellers </span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Hotel Order Top Resellers List</h1>
                        {/* <button
                    className="px-3 bg-[#299cdb] flex items-center justify-center gap-[10px]"
                    // onClick={handleDownload}
                >
                    <FiDownload /> Download
                </button> */}
                    </div>

                    {isLoading ? (
                        <PageLoader />
                    ) : !resellers || resellers?.length < 1 ? (
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
                                            <th className="font-[500] p-3">Reseller</th>
                                            <th className="font-[500] p-3">Total Orders</th>
                                            <th className="font-[500] p-3">Total Volume</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {resellers?.map((item, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9]"
                                                    onClick={() =>
                                                        navigate(
                                                            `/b2b/${item?.reseller?._id}/details`
                                                        )
                                                    }
                                                >
                                                    <td className="p-3">
                                                        {filters.skip * filters.limit + (index + 1)}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-[35px] w-[35px] min-w-[35px] min-h-[35px] overflow-hidden rounded-full">
                                                                <img
                                                                    src={
                                                                        item?.reseller?.companyLogo
                                                                            ? config.SERVER_URL +
                                                                              item?.reseller
                                                                                  ?.companyLogo
                                                                            : avatarImg
                                                                    }
                                                                    alt=""
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <span>
                                                                    {item?.reseller?.companyName} (
                                                                    {item?.reseller?.agentCode})
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
                                    total={filters?.totalResellers}
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
