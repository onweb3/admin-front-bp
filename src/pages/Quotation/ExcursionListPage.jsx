import React, { useCallback, useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";

export default function ExcursionListPage() {
    const [excursions, setExcursions] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        total: 0,
    });
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchExcursions = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/quotation/excursion/all", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setExcursions(response.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/admin/excursions/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                const filteredItems = excursions.filter((item) => {
                    return item?._id !== id;
                });
                setExcursions(filteredItems);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchExcursions();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Excursions</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Excursions</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Excursions </h1>
                        <div className="flex justify-between gap-2  items-center  ">
                            <input
                                type="text"
                                placeholder="Search here..."
                                value={searchText || ""}
                                onChange={(e) => setSearchText(e.target.value)}
                            />

                            <Link to="add">
                                <button className="px-3">+ Add</button>
                            </Link>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : excursions?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Excursion Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Index
                                        </th>
                                        <th className="font-[500] p-3">
                                            Excursion Name
                                        </th>

                                        <th className="font-[500] p-3">
                                            Excursion Type{" "}
                                        </th>

                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {excursions?.map((excursion, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                {" "}
                                                <td className="p-3">
                                                    {index + 1}
                                                </td>
                                                <td className="p-3">
                                                    {excursion?.excursionName}
                                                </td>
                                                <td className="p-3">
                                                    {excursion?.excursionType}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    excursion?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link
                                                            to={`${excursion?._id}/edit`}
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
                                    total={filters?.total}
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
