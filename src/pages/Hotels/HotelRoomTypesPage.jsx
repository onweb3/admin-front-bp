import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useOutletContext, useParams } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";

export default function HotelRoomTypePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [roomTypes, setRoomTypes] = useState();
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        searchQuery: "",
        totalRoomTypes: 0,
    });

    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const { setSelectedSection } = useOutletContext();

    const fetchData = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/room-types/hotel/${id}?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setRoomTypes(response.data?.roomTypes);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalRoomTypes: response.data?.totalRoomTypes,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteRoomType = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/room-types/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredData = roomTypes.filter((data) => {
                    return data?._id !== id;
                });
                setRoomTypes(filteredData);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters.skip, filters.limit]);

    useEffect(() => {
        setSelectedSection("room-types");
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between border-b border-dashed p-4">
                <h1 className="font-medium">Room Types</h1>
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
                                fetchData();
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
                    <Link to={`/hotels/${id}/room-types/add`}>
                        <button className="px-3">+ Add Room Types</button>
                    </Link>
                </div>
            </div>
            {isLoading ? (
                <PageLoader />
            ) : roomTypes?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm text-grayColor block mt-[6px]">
                        Oops.. No Room Types Found
                    </span>
                </div>
            ) : (
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                <tr>
                                    <th className="font-[500] p-3">Room Name</th>
                                    <th className="font-[500] p-3">Service By</th>
                                    <th className="font-[500] p-3">Area In ㎡</th>
                                    <th className="font-[500] p-3">Occupancies</th>
                                    <th className="font-[500] p-3">Status</th>
                                    <th className="font-[500] p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {roomTypes?.map((data, index) => {
                                    return (
                                        <tr
                                            className="border-b border-tableBorderColor"
                                            key={index}
                                        >
                                            <td className="p-3 capitalize">{data?.roomName}</td>
                                            <td className="p-3 ">{data?.serviceBy}</td>
                                            <td className="p-3">
                                                {data?.areaInM2 ? `${data?.areaInM2} ㎡` : "N/A"}
                                            </td>
                                            {data?.roomOccupancies?.length > 0 ? (
                                                <td className="p-3">
                                                    {data?.roomOccupancies?.map((item, index) => {
                                                        return (
                                                            <span key={index}>
                                                                {item?.shortName}
                                                                {index <
                                                                data?.roomOccupancies?.length - 1
                                                                    ? ", "
                                                                    : ""}
                                                            </span>
                                                        );
                                                    })}
                                                </td>
                                            ) : (
                                                <td className="p-3">N/A</td>
                                            )}
                                            <td className="p-3">
                                                <div className="flex items-center gap-[10px]">
                                                    <span
                                                        className={
                                                            "block w-[10px] h-[10px] rounded-full " +
                                                            (data?.isActive
                                                                ? "bg-green-500"
                                                                : "bg-red-500")
                                                        }
                                                    ></span>
                                                    {data?.isActive ? "Active" : "Inactive"}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex gap-[10px]">
                                                    <button
                                                        className="h-auto bg-transparent text-red-500 text-xl"
                                                        onClick={() => {
                                                            deleteRoomType(data?._id);
                                                        }}
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                    <Link to={`${data?._id}/edit`}>
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
                            total={filters?.totalRoomTypes}
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
