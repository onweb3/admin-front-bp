import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useOutletContext, useParams } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { formatDate, hasPermission } from "../../utils";

export default function HotelAddOnsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [addOns, setAddOns] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalAddOns: 0,
        searchQuery: "",
    });

    const { id } = useParams();
    const { jwtToken, admin } = useSelector((state) => state.admin);
    const { setSelectedSection } = useOutletContext();

    const isCreatePermission = hasPermission({
        roles: admin?.roles,
        name: "contracts",
        permission: "create",
    });
    const isDeletePermission = hasPermission({
        roles: admin?.roles,
        name: "contracts",
        permission: "delete",
    });

    const fetchAddOns = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/hotels/add-ons/all/hotel/${id}?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setAddOns(response.data?.addOns);
            setFilters((prev) => {
                return { ...prev, totalAddOns: response?.data?.totalAddOns };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteAddOn = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/hotels/add-ons/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredData = addOns.filter((data) => {
                    return data?._id !== id;
                });
                setAddOns(filteredData);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        setSelectedSection("add-ons");
    }, []);

    useEffect(() => {
        fetchAddOns();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            <div className="flex items-center justify-between border-b border-dashed p-4">
                <h1 className="font-medium">Add Ons</h1>
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
                                fetchAddOns();
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
                        <Link to={`/hotels/${id}/add-ons/add`}>
                            <button className="px-3">+ Add Add Ons</button>
                        </Link>
                    )}
                </div>
            </div>
            {isLoading ? (
                <PageLoader />
            ) : !addOns || addOns?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm text-grayColor block mt-[6px]">Oops.. No AddOns Found</span>
                </div>
            ) : (
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                <tr>
                                    <th className="font-[500] p-3">From Date</th>
                                    <th className="font-[500] p-3">To Date</th>
                                    <th className="font-[500] p-3">Add On Name</th>
                                    <th className="font-[500] p-3">Apply On</th>
                                    <th className="font-[500] p-3">Edit</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {addOns?.map((addOn, index) => {
                                    return (
                                        <tr className="border-b border-tableBorderColor" key={index}>
                                            <td className="p-3 capitalize">{formatDate(addOn?.fromDate)}</td>
                                            <td className="p-3 capitalize">{formatDate(addOn?.toDate)}</td>
                                            <td className="p-3 ">{addOn?.addOnName}</td>
                                            <td className="p-3 ">{addOn?.applyOn}</td>
                                            <td className="p-3">
                                                <div className="flex gap-[10px]">
                                                    {isDeletePermission && (
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() => {
                                                                deleteAddOn(addOn?._id);
                                                            }}
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                    )}
                                                    <Link to={`${addOn?._id}/edit`}>
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
                            total={filters?.totalAddOns}
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
