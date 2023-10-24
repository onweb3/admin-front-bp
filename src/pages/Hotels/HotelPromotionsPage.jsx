import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useOutletContext, useParams } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { HotelPromotionTableRow } from "../../features/HotelPromotion";

export default function HotelPromotionsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalPromotions: 0,
        searchQuery: "",
    });

    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const { setSelectedSection } = useOutletContext();

    const fetchPromotions = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/hotels/promotions/single/hotel/${id}?skip=${filters?.skip}&limit=${filters?.limit}&searchQuery=${filters?.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setPromotions(response.data?.promotions);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalPromotions: response?.data?.totalPromotions,
                };
            });
            console.log(response.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, [filters.skip, filters.limit]);

    useEffect(() => {
        setSelectedSection("promotions");
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between border-b border-dashed p-4">
                <h1 className="font-medium">Hotel Promotions</h1>
                <div className="flex items-center gap-3">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (filters?.skip !== 0) {
                                setFilters((prev) => {
                                    return {
                                        ...prev,
                                        skip: 0,
                                    };
                                });
                            } else {
                                fetchPromotions();
                            }
                        }}
                        className="flex items-center gap-2"
                    >
                        <input
                            type="text"
                            placeholder="Search here..."
                            onChange={(e) => {
                                setFilters((prev) => {
                                    return {
                                        ...prev,
                                        searchQuery: e.target.value,
                                    };
                                });
                            }}
                        />
                        <button type="submit" className="px-3 bg-primaryColor">
                            Search
                        </button>
                    </form>
                    <Link to={`/hotels/${id}/promotions/add`}>
                        <button className="px-3">+ Add Promotions</button>
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : !promotions || promotions?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm text-grayColor block mt-[6px]">
                        Oops.. No Promotions Found
                    </span>
                </div>
            ) : (
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                <tr>
                                    <th className="font-[500] p-3">SellFrom</th>
                                    <th className="font-[500] p-3">SellTo</th>
                                    <th className="font-[500] p-3">Name</th>
                                    <th className="font-[500] p-3">Promotion Code</th>
                                    <th className="font-[500] p-3">Priority</th>
                                    <th className="font-[500] p-3">Status</th>
                                    <th className="font-[500] p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {promotions?.map((promotion, index) => {
                                    return (
                                        <HotelPromotionTableRow
                                            key={index}
                                            promotion={promotion}
                                            promotions={promotions}
                                            setPromotions={setPromotions}
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
                            total={filters?.totalPromotions}
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
