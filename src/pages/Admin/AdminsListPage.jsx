import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { avatarImg } from "../../assets/images";
import { formatDate } from "../../utils";
import { config } from "../../constants";

export default function AdminsListPage() {
    const [admins, setAdmins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalAdmins: 0,
        searchQuery: "",
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchAdmins = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/auth/all?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setAdmins(response.data?.admins);
            setFilters((prev) => {
                {
                    return {
                        ...prev,
                        totalAdmins: response?.data?.totalAdmins,
                    };
                }
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteAdmin = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/auth/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredAdmins = admins.filter((adm) => {
                    return adm?._id !== id;
                });
                setAdmins(filteredAdmins);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Admins</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Admins</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Admins</h1>
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
                                        fetchAdmins();
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
                                <button className="px-3">+ Add Admin</button>
                            </Link>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : admins?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Admins found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Admin</th>
                                            <th className="font-[500] p-3">Designation</th>
                                            <th className="font-[500] p-3">PhoneNumber</th>
                                            <th className="font-[500] p-3">Location</th>
                                            <th className="font-[500] p-3">Roles</th>
                                            <th className="font-[500] p-3">Last Logged In</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {admins?.map((adm) => {
                                            return (
                                                <tr
                                                    key={adm?._id}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-[10px]">
                                                            <img
                                                                src={
                                                                    adm?.avatar
                                                                        ? config.SERVER_URL +
                                                                          adm?.avatar
                                                                        : avatarImg
                                                                }
                                                                alt=""
                                                                className="w-[40px] h-[40px] rounded-full object-cover"
                                                            />
                                                            <div>
                                                                <span className="block">
                                                                    {adm?.name}
                                                                </span>
                                                                <span className="block text-grayColor">
                                                                    {adm?.email}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {adm?.designation}
                                                    </td>
                                                    <td className="p-3">{adm?.phoneNumber}</td>
                                                    <td className="p-3 capitalize">
                                                        {adm?.city || "N/A"}
                                                        {", "}
                                                        {adm?.country}
                                                    </td>
                                                    <td className="p-3 max-w-[350px]">
                                                        {adm?.roles?.length > 0
                                                            ? adm?.roles?.map(
                                                                  (item, index) =>
                                                                      `${item?.roleName}${
                                                                          index <
                                                                          adm?.roles?.length - 1
                                                                              ? ", "
                                                                              : ""
                                                                      }`
                                                              )
                                                            : "N/A"}
                                                    </td>
                                                    <td className="p-3">
                                                        {adm?.lastLoggedIn
                                                            ? formatDate(adm?.lastLoggedIn, true)
                                                            : "N/A"}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteAdmin(adm?._id)
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <Link to={`${adm?._id}/edit`}>
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
                                    total={filters?.totalAdmins}
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
