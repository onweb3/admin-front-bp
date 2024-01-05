import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import AccommodationTypeModal from "../../features/AccommodationTypes/components/AccommodationTypeModal";
import { hasPermission } from "../../utils";

export default function AccommodationTypesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [accommodationTypes, setAccommodationTypes] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalAccommodationTypes: 0,
        searchQuery: "",
    });
    const [accTypeModal, setAccTypeModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedAccType, setSelectedAccType] = useState({});

    const { jwtToken, admin } = useSelector((state) => state.admin);

    const isCreatePermission = hasPermission({
        roles: admin?.roles,
        name: "accommodation-types",
        permission: "create",
    });
    const isEditPermission = hasPermission({
        roles: admin?.roles,
        name: "accommodation-types",
        permission: "update",
    });
    const isDeletePermission = hasPermission({
        roles: admin?.roles,
        name: "accommodation-types",
        permission: "delete",
    });

    const fetchAccommodationTypes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/hotels/accommodation-types/all?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setAccommodationTypes(response?.data?.accommodationTypes);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalAccommodationTypes: response?.data?.totalAccommodationTypes,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const updateAccType = (data) => {
        const tempAccTypes = accommodationTypes;
        const objIndex = tempAccTypes?.findIndex((item) => {
            return item?._id === data?._id;
        });
        if (objIndex !== -1) {
            tempAccTypes[objIndex] = data;
        }
    };

    const addAccType = (data) => {
        setAccommodationTypes((prev) => {
            return [data, ...prev];
        });
    };

    const deleteAccType = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                axios.delete(`/hotels/accommodation-types/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredAccTypes = accommodationTypes?.filter((item) => {
                    return item?._id !== id;
                });
                setAccommodationTypes(filteredAccTypes);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAccommodationTypes();
    }, [filters.limit, filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Accommodation Types</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Accommodation Types</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Accommodation Types</h1>
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
                                        fetchAccommodationTypes();
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
                            {isCreatePermission && (
                                <button
                                    className="px-3"
                                    onClick={() => {
                                        setAccTypeModal({
                                            isOpen: true,
                                            isEdit: false,
                                        });
                                    }}
                                >
                                    + Add Accommodation Type
                                </button>
                            )}
                        </div>

                        {accTypeModal.isOpen && (
                            <AccommodationTypeModal
                                setAccTypeModal={setAccTypeModal}
                                accTypeModal={accTypeModal}
                                selectedAccType={selectedAccType}
                                updateAccType={updateAccType}
                                addAccType={addAccType}
                            />
                        )}
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : accommodationTypes?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Accommodation Types Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Code</th>
                                        <th className="font-[500] p-3">Accommodation Type Name</th>
                                        {(isEditPermission || isDeletePermission) && (
                                            <th className="font-[500] p-3">Action</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {accommodationTypes?.map((acc, index) => {
                                        return (
                                            <tr key={index} className="border-b border-tableBorderColor">
                                                <td className="p-3 uppercase">
                                                    {acc?.accommodationTypeCode}
                                                </td>
                                                <td className="p-3">{acc?.accommodationTypeName}</td>
                                                {(isEditPermission || isDeletePermission) && (
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            {isDeletePermission && (
                                                                <button
                                                                    className="h-auto bg-transparent text-red-500 text-xl"
                                                                    onClick={() => deleteAccType(acc?._id)}
                                                                >
                                                                    <MdDelete />
                                                                </button>
                                                            )}
                                                            {isEditPermission && (
                                                                <button
                                                                    className="h-auto bg-transparent text-green-500 text-xl"
                                                                    onClick={() => {
                                                                        setSelectedAccType(acc);
                                                                        setAccTypeModal({
                                                                            isEdit: true,
                                                                            isOpen: true,
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
                                    total={filters?.totalAccommodationTypes}
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
