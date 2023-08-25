import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { formatDate } from "../../utils";

export default function SentEmailsListPage() {
    const [emails, setEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalEmails: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchEmails = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/email-settings/sent/all?skip=${filters?.skip}&limit=${filters?.limit}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setEmails(response.data?.emails);
            setFilters((prev) => {
                return { ...prev, totalEmails: response.data?.totalEmails };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Sent Emails List
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email-settings" className="text-textColor">
                        Email Settings{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Sent </span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Blogs</h1>
                            <Link to="/email-settings/compose">
                                <button className="px-3">+ Compose</button>
                            </Link>
                        </div>
                        {emails?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Emails found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Sent Email
                                            </th>
                                            <th className="font-[500] p-3">
                                                Email Type
                                            </th>
                                            <th className="font-[500] p-3">
                                                Subject
                                            </th>
                                            <th className="font-[500] p-3">
                                                Date
                                            </th>
                                            <th className="font-[500] p-3">
                                                Sent To
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {emails?.map((email, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        {email?.sentFrom}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {email?.emailType}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {email?.subject}
                                                    </td>
                                                    <td className="p-3">
                                                        {formatDate(
                                                            email?.createdAt
                                                        )}
                                                    </td>
                                                    <td className="p-3 uppercase">
                                                        {email?.sentTo}
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
                                        total={filters?.totalEmails}
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
