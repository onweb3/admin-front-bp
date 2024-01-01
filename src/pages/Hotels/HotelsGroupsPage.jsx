import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { HotelGroupModal } from "../../features/HotelGroup";
import { hasPermission } from "../../utils";

export default function HotelsGroupsPage() {
    const [hotelGroups, setHotelGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hotelGroupModalOpen, setHotelGroupModalOpen] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedHotelGroup, setSelectedHotelGroup] = useState({});
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalHotelGroups: 0,
        searchQuery: "",
    });

    const { jwtToken, admin } = useSelector((state) => state.admin);

    const isCreatePermission = hasPermission({
        roles: admin?.roles,
        name: "hotel-groups",
        permission: "create",
    });
    const isEditPermission = hasPermission({
        roles: admin?.roles,
        name: "hotel-groups",
        permission: "update",
    });
    const isDeletePermission = hasPermission({
        roles: admin?.roles,
        name: "hotel-groups",
        permission: "delete",
    });

    const fetchHotelGroups = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/hotels/groups/all?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setHotelGroups(response?.data?.hotelGroups);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalHotelGroups: response.data?.totalHotelGroups,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteHotelGroup = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");

            if (isConfirm) {
                await axios.delete(`/hotels/groups/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredHotelGroups = hotelGroups.filter((group) => {
                    return group?._id !== id;
                });
                setHotelGroups(filteredHotelGroups);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHotelGroups();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Hotel Groups</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Groups</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Hotel Groups</h1>
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
                                        fetchHotelGroups();
                                    }
                                }}
                                className="flex items-center gap-3"
                            >
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    onChange={(e) => {
                                        return setFilters((prev) => {
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
                            {isCreatePermission && (
                                <button
                                    className="px-3"
                                    onClick={() => {
                                        setHotelGroupModalOpen({
                                            isOpen: true,
                                            isEdit: false,
                                        });
                                    }}
                                >
                                    + Add Group
                                </button>
                            )}
                        </div>

                        {hotelGroupModalOpen?.isOpen && (
                            <HotelGroupModal
                                hotelGroupModalOpen={hotelGroupModalOpen}
                                setHotelGroupModalOpen={setHotelGroupModalOpen}
                                selectedHotelGroup={selectedHotelGroup}
                                setHotelGroups={setHotelGroups}
                                hotelGroups={hotelGroups}
                            />
                        )}
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : hotelGroups?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Hotel Groups Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Group Code</th>
                                        <th className="font-[500] p-3">Group Name</th>
                                        {(isEditPermission || isDeletePermission) && (
                                            <th className="font-[500] p-3">Action</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {hotelGroups?.map((group, index) => {
                                        return (
                                            <tr key={index} className="border-b border-tableBorderColor">
                                                <td className="p-3">{group?.groupCode}</td>
                                                <td className="p-3 capitalize">{group?.groupName}</td>
                                                {(isEditPermission || isDeletePermission) && (
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            {isDeletePermission && (
                                                                <button
                                                                    className="h-auto bg-transparent text-red-500 text-xl"
                                                                    onClick={() =>
                                                                        deleteHotelGroup(group?._id)
                                                                    }
                                                                >
                                                                    <MdDelete />
                                                                </button>
                                                            )}
                                                            {isEditPermission && (
                                                                <button
                                                                    className="h-auto bg-transparent text-green-500 text-xl"
                                                                    onClick={() => {
                                                                        setSelectedHotelGroup(group);
                                                                        setHotelGroupModalOpen({
                                                                            isOpen: true,
                                                                            isEdit: true,
                                                                        });
                                                                    }}
                                                                >
                                                                    <BiEditAlt />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalHotelGroups}
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
