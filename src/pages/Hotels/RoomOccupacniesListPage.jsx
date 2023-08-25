import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";

export default function RoomOccupacniesListPage() {
    const [roomOccupancies, setRoomOccupacies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalRoomOccupancies: 0,
        searchQuery: "",
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchRoomOccupancies = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/hotels/room-occupancies/all?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setRoomOccupacies(response?.data?.roomOccupancies);
            setFilters((prev) => {
                return { ...prev, totalRoomOccupancies: response?.data?.totalRoomOccupancies };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteRoomOccupancy = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure you want to delete?");
            if (isConfirm) {
                await axios.delete(`/hotels/room-occupancies/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredRoomOccupancies = roomOccupancies?.filter((item) => {
                    return item._id !== id;
                });
                setRoomOccupacies(filteredRoomOccupancies);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchRoomOccupancies();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Room Occupancies</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Room Occupancies</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div>
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">Room Occupancies</h1>
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
                                            fetchRoomOccupancies();
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
                                <Link to="add">
                                    <button
                                        className="px-3"
                                        onClick={() => setIsAddBoardTypeModal(true)}
                                    >
                                        + Add Room Occupancy
                                    </button>
                                </Link>
                            </div>
                        </div>
                        {isLoading ? (
                            <PageLoader />
                        ) : roomOccupancies?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Room Occupancies Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                            <tr>
                                                <th className="font-[500] p-3">Occupancy Name</th>
                                                <th className="font-[500] p-3">Short Name</th>
                                                <th className="font-[500] p-3">Max Count</th>
                                                <th className="font-[500] p-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {roomOccupancies?.map((occupancy, index) => {
                                                return (
                                                    <tr
                                                        className="border-b border-tableBorderColor"
                                                        key={index}
                                                    >
                                                        <td className="p-3 capitalize">
                                                            {occupancy?.occupancyName}
                                                        </td>
                                                        <td className="p-3 capitalize">
                                                            {occupancy?.shortName}
                                                        </td>
                                                        <td className="p-3 capitalize">
                                                            {occupancy?.maxCount}
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex gap-[10px]">
                                                                <button
                                                                    className="h-auto bg-transparent text-red-500 text-xl"
                                                                    onClick={() =>
                                                                        deleteRoomOccupancy(
                                                                            occupancy?._id
                                                                        )
                                                                    }
                                                                >
                                                                    <MdDelete />
                                                                </button>

                                                                <Link to={`${occupancy?._id}/edit`}>
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
                                </div>

                                <div className="p-4">
                                    <Pagination
                                        limit={filters?.limit}
                                        skip={filters?.skip}
                                        total={filters?.totalRoomOccupancies}
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
        </div>
    );
}
