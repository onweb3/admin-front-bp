import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

import { PageLoader, Pagination } from "../../components";
import axios from "../../axios";
import { HotelContractGroupModal } from "../../features/HotelContractGroups";
import { hasPermission } from "../../utils";

export default function HotelContractGroupsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [hotelContractGroups, setHotelContractGroups] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalContractGroups: 0,
        searchQuery: "",
    });
    const [contractGroupModal, setContractGroupModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedContractGroup, setSelectedContractGroup] = useState({});

    const { id } = useParams();
    const { jwtToken, admin } = useSelector((state) => state.admin);
    const { setSelectedSection } = useOutletContext();

    const isCreatePermission = hasPermission({
        roles: admin?.roles,
        name: "contracts",
        permission: "create",
    });
    const isEditPermission = hasPermission({
        roles: admin?.roles,
        name: "contracts",
        permission: "update",
    });
    const isDeletePermission = hasPermission({
        roles: admin?.roles,
        name: "contracts",
        permission: "delete",
    });

    const fetchHotelContractGroups = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/hotels/contract-groups/hotel/${id}?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setHotelContractGroups(response?.data?.hotelContractGroups);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalContractGroups: response?.data?.totalContractGroups,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteContractGroup = async (contractGroupId) => {
        try {
            const isConfirm = window.confirm("Are you sure you want to delete?");
            if (isConfirm) {
                await axios.delete(`/hotels/contract-groups/delete/${contractGroupId}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredContractGroups = hotelContractGroups.filter((item) => {
                    return item?._id !== contractGroupId;
                });
                setHotelContractGroups(filteredContractGroups);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHotelContractGroups();
    }, [filters.skip, filters.limit]);

    useEffect(() => {
        setSelectedSection("contract-groups");
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between border-b border-dashed p-4">
                <h1 className="font-medium">Hotel Contract Groups</h1>
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
                                fetchHotelContractGroups();
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
                    {isCreatePermission && (
                        <button
                            className="px-3"
                            onClick={() =>
                                setContractGroupModal({
                                    isOpen: true,
                                    isEdit: false,
                                })
                            }
                        >
                            + Add Contract Group
                        </button>
                    )}
                </div>
                {contractGroupModal.isOpen && (
                    <HotelContractGroupModal
                        contractGroupModal={contractGroupModal}
                        setContractGroupModal={setContractGroupModal}
                        hotelContractGroups={hotelContractGroups}
                        setHotelContractGroups={setHotelContractGroups}
                        setSelectedContractGroup={selectedContractGroup}
                    />
                )}
            </div>

            {isLoading ? (
                <PageLoader />
            ) : !hotelContractGroups || hotelContractGroups?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm text-grayColor block mt-[6px]">
                        Oops.. No Contract Groups Found
                    </span>
                </div>
            ) : (
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                <tr>
                                    <th className="font-[500] p-3">Contract Code</th>
                                    <th className="font-[500] p-3">Contract Name</th>
                                    <th className="font-[500] p-3">Contracts & Rate Promotions</th>
                                    {(isEditPermission || isDeletePermission) && (
                                        <th className="font-[500] p-3">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {hotelContractGroups?.map((contractGroup, index) => {
                                    return (
                                        <tr key={index} className="border-b border-tableBorderColor">
                                            <td className="p-3">{contractGroup?.contractCode}</td>
                                            <td className="p-3">{contractGroup?.contractName}</td>
                                            <td className="p-3">
                                                ({contractGroup?.totalContracts || 0}){" "}
                                                <Link
                                                    to={`${contractGroup?._id}/contracts`}
                                                    className="text-blue-500 underline"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                            {(isEditPermission || isDeletePermission) && (
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        {isDeletePermission && (
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() => {
                                                                    deleteContractGroup(contractGroup?._id);
                                                                }}
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                        )}
                                                        {isEditPermission && (
                                                            <button
                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                onClick={() => {
                                                                    setSelectedContractGroup(contractGroup);
                                                                    setContractGroupModal({
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
                    </div>

                    <div className="p-4">
                        <Pagination
                            limit={filters?.limit}
                            skip={filters?.skip}
                            total={filters?.totalContractGroups}
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
