import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

import { PageLoader, Pagination } from "../../components";
import axios from "../../axios";
import { formatDate } from "../../utils";

export default function AdminRolesPage() {
    const [adminRoles, setAdminRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalAdminRoles: 0,
        searchQuery: "",
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchAdminRoles = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/roles/all?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setAdminRoles(response.data?.adminRoles);
            setFilters((prev) => {
                {
                    return {
                        ...prev,
                        totalAdminRoles: response?.data?.totalAdminRoles,
                    };
                }
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteAdminRole = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/roles/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredAdminRoles = adminRoles.filter((role) => {
                    return role?._id !== id;
                });
                setAdminRoles(filteredAdminRoles);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAdminRoles();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Admin Roles</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/admins" className="text-textColor">
                        Admins{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Roles</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Admin Roles</h1>
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
                                        fetchAdminRoles();
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
                                <button className="px-3">+ Add Admin Role</button>
                            </Link>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : adminRoles?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Admins Roles Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Role Name</th>
                                        <th className="font-[500] p-3">Created At</th>
                                        <th className="font-[500] p-3">Last Updated</th>
                                        <th className="font-[500] p-3">Admin Count</th>
                                        <th className="font-[500] p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {adminRoles?.map((role) => {
                                        return (
                                            <tr
                                                key={role?._id}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">{role?.roleName}</td>
                                                <td className="p-3">
                                                    {formatDate(role?.createdAt, true)}
                                                </td>
                                                <td className="p-3">
                                                    {formatDate(role?.updatedAt, true)}
                                                </td>
                                                <td className="p-3">{role?.adminsCount}</td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteAdminRole(role?._id)
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link to={`${role?._id}/edit`}>
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

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalAdminRoles}
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
