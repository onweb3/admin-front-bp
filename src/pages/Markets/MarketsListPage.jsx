import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { BiEditAlt } from "react-icons/bi";

import { PageLoader, Pagination } from "../../components";
import axios from "../../axios";
import MaketModal from "../../features/Markets/components/MarketModal";

export default function MarketsListPage() {
    const [markets, setMarkets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalMarkets: 0,
    });
    const [marketModal, setMarketModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedMarket, setSelectedMarket] = useState({});

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchMarkets = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/markets/all?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setMarkets(response?.data?.markets);
            setFilters((prev) => {
                return { ...prev, totalMarkets: response?.data?.totalMarkets };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteMarket = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/markets/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const tempMarkets = markets?.filter((item) => {
                    return item?._id !== id;
                });
                setMarkets(tempMarkets);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchMarkets();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Markets</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Markets</span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Markets</h1>
                            <button
                                className="px-3"
                                onClick={() => {
                                    setMarketModal({
                                        isOpen: true,
                                        isEdit: false,
                                    });
                                }}
                            >
                                + Add Market
                            </button>
                            {marketModal?.isOpen && (
                                <MaketModal
                                    marketModal={marketModal}
                                    setMarketModal={setMarketModal}
                                    selectedMarket={selectedMarket}
                                    markets={markets}
                                    setMarkets={setMarkets}
                                />
                            )}
                        </div>
                        {markets?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Markets Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Id
                                            </th>
                                            <th className="font-[500] p-3">
                                                Market Name
                                            </th>
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {markets?.map((market, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        #{market?.marketId}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {market?.marketName}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteMarket(
                                                                        market?._id
                                                                    )
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <button
                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                onClick={() => {
                                                                    setSelectedMarket(
                                                                        market
                                                                    );
                                                                    setMarketModal(
                                                                        {
                                                                            isOpen: true,
                                                                            isEdit: true,
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                <BiEditAlt />
                                                            </button>
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
                                        total={filters?.totalMarkets}
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
