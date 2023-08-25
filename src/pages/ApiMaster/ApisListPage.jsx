import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";

export default function ApisListPage() {
    const [apis, setApis] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        totalApis: 0,
        skip: 0,
        limit: 10,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchApisList = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/api-master/all`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setApis(response?.data?.apis);
            setFilters((prev) => {
                return { ...prev, totalApis: response?.data?.totalApis };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteApi = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/api-master/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredApis = apis.filter((api) => {
                    return api?._id !== id;
                });
                setApis(filteredApis);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchApisList();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">API Master</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>API Master</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All API List</h1>
                        <Link to="add">
                            <button className="px-3">+ Add API</button>
                        </Link>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : apis?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                Oops.. No API's found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Code</th>
                                        <th className="font-[500] p-3">Name</th>
                                        <th className="font-[500] p-3">Type</th>
                                        <th className="font-[500] p-3">
                                            Running Mode
                                        </th>
                                        <th className="font-[500] p-3">
                                            Status
                                        </th>
                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {apis?.map((api, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">
                                                    {api?.apiCode}
                                                </td>
                                                <td className="p-3">
                                                    {api?.apiName}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {api?.type}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    <div className="flex items-center gap-[6px]">
                                                        <span
                                                            className={
                                                                "block w-[10px] min-w-[10px] h-[10px] min-h-[10px] rounded-full " +
                                                                (api?.runningMode ===
                                                                "live"
                                                                    ? "bg-red-500"
                                                                    : "bg-gray-500")
                                                            }
                                                        ></span>
                                                        {api?.runningMode}
                                                    </div>
                                                </td>
                                                <td className="p-3 capitalize">
                                                    <span
                                                        className={
                                                            "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                            (api?.isActive ===
                                                            true
                                                                ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                                : "bg-[#f065481A] text-[#f06548]")
                                                        }
                                                    >
                                                        {api?.isActive === true
                                                            ? "active"
                                                            : "not-active"}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteApi(
                                                                    api?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link
                                                            to={`${api?._id}/edit`}
                                                        >
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
                                    total={filters?.totalApis}
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
