import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { HotelChainModal } from "../../features/HotelChain";

export default function HotelChainsListPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [chains, setChains] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalChains: 0,
        searchQuery: "",
    });
    const [hotelChainModal, setHotelChainModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedChain, setSelectedChain] = useState({});
    const [hotelGroups, setHotelGroups] = useState([]);

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchChains = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/hotels/chains/all?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setChains(response?.data?.hotelChains);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalChains: response?.data?.totalHotelChains,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteChain = async (id) => {
        try {
            const isConfrm = window.confirm("Are you sure to delete?");
            if (isConfrm) {
                await axios.delete(`/hotels/chains/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredChains = chains?.filter((item) => {
                    return item?._id !== id;
                });
                setChains(filteredChains);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchChains();
    }, [filters.skip, filters.limit]);

    const fetchHotelGroups = async () => {
        try {
            const response = await axios.get(`/hotels/groups/all/names`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setHotelGroups(response?.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHotelGroups();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Chains</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Chains</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Chains</h1>
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
                                        fetchChains();
                                    }
                                }}
                                className="flex items-center gap-3"
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
                                    value={filters.searchQuery || ""}
                                />
                                <button type="submit" className="px-3 bg-primaryColor">
                                    Search
                                </button>
                            </form>
                            <button
                                className="px-3"
                                onClick={() => {
                                    setHotelChainModal({
                                        isOpen: true,
                                        isEdit: false,
                                    });
                                }}
                            >
                                + Add Chain
                            </button>
                        </div>

                        {hotelChainModal?.isOpen && (
                            <HotelChainModal
                                hotelChainModal={hotelChainModal}
                                setHotelChainModal={setHotelChainModal}
                                selectedChain={selectedChain}
                                setChains={setChains}
                                chains={chains}
                                hotelGroups={hotelGroups}
                            />
                        )}
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : chains?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Chains Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Chain Code</th>
                                        <th className="font-[500] p-3">Chain Name</th>
                                        <th className="font-[500] p-3">Group Name</th>
                                        <th className="font-[500] p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {chains?.map((chain, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">{chain?.chainCode}</td>
                                                <td className="p-3 capitalize">
                                                    {chain?.chainName}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {chain?.hotelGroup?.groupName || "N/A"}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() => deleteChain(chain?._id)}
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <button
                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                            onClick={() => {
                                                                setSelectedChain(chain);
                                                                setHotelChainModal({
                                                                    isOpen: true,
                                                                    isEdit: true,
                                                                });
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
                                    total={filters?.totalChains}
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
