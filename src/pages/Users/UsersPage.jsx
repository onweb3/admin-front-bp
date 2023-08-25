import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader } from "../../components";
import { formatDate } from "../../utils";
import Pagination from "../../components/Pagination";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        limit: 10,
        skip: 0,
        totalUsers: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/users/all?skip=${filters?.skip}&limit=${filters?.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setUsers(response?.data?.users);
            setFilters((prev) => {
                return { ...prev, totalUsers: response?.data?.totalUsers };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Users</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Home{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Users</span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Users</h1>
                        </div>
                        {users?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Users found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Name & Email
                                            </th>
                                            <th className="font-[500] p-3">
                                                Phone Number
                                            </th>
                                            <th className="font-[500] p-3">
                                                Country
                                            </th>
                                            <th className="font-[500] p-3">
                                                Joined Date
                                            </th>
                                            {/* <th className="font-[500] p-3">
                                                Action
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {users?.map((user, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-[10px]">
                                                            <img
                                                                src={`https://avatars.dicebear.com/api/identicon/${user?.email}.svg`}
                                                                alt=""
                                                                className="w-[30px] h-[30px] rounded-full"
                                                            />
                                                            <div>
                                                                <span className="block capitalize">
                                                                    {user?.name}
                                                                </span>
                                                                <span className="block">
                                                                    {
                                                                        user?.email
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        {
                                                            user?.country
                                                                ?.phonecode
                                                        }{" "}
                                                        {user?.phoneNumber}
                                                    </td>
                                                    <td className="p-3">
                                                        {
                                                            user?.country
                                                                ?.countryName
                                                        }
                                                    </td>
                                                    <td className="p-3">
                                                        {formatDate(
                                                            user?.createdAt
                                                        )}
                                                    </td>
                                                    {/* <td className="p-3"></td> */}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                <div className="p-4">
                                    <Pagination
                                        limit={filters?.limit}
                                        skip={filters?.skip}
                                        total={filters?.totalUsers}
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
