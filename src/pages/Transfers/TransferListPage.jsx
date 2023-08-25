import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";

export default function TransferListPage() {
    const [transfers, setTransfers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        total: 0,
        transferType: "group-group",
        transferFrom: "",
        transferTo: "",
    });
    const [groups, setGroups] = useState([]);
    const [airports, setAirports] = useState([]);
    const [areas, setAreas] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const prevSearchParams = (e) => {
        let params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    };

    const clearFilters = () => {
        setFilters((prev) => {
            return {
                ...prev,
                skip: 0,
                limit: 10,
                total: 0,
                transferType: "",
                transferFrom: "",
                transferTo: "",
            };
        });

        fetchCategory({
            skip: 0,
            limit: 10,
            total: 0,
            transferType: "group-group",
            transferFrom: "",
            transferTo: "",
        });
    };

    const handleChange = (e) => {
        console.log(e.target.value, "value");
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchCategory = async ({
        skip,
        limit,
        transferFrom,
        transferTo,
        transferType,
    }) => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/transfer/all?skip=${skip}&limit=${limit}&transferFrom=${transferFrom}&transferTo=${transferTo}&transferType=${transferType}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setTransfers(response?.data?.transfers);
            setFilters((prev) => {
                return {
                    ...prev,
                    total: response?.data?.total,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`/transfer/places-airports`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setGroups(response.data.groups);
            setAirports(response.data.airports);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAreas = async () => {
        try {
            const response = await axios.get(`/group-area/area`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            console.log(response, "response");
            setAreas(response.data.areas);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteTransfer = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/transfer/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });
                const filteredTransfers = transfers?.filter((transfer) => {
                    return transfer?._id !== id;
                });
                setTransfers(filteredTransfers);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        let skip =
            Number(searchParams.get("skip")) > 0
                ? Number(searchParams.get("skip")) - 1
                : 0;
        let limit =
            Number(searchParams.get("limit")) > 0
                ? Number(searchParams.get("limit"))
                : 10;
        let transferFrom = searchParams.get("transferFrom") || "";
        let transferTo = searchParams.get("transferTo") || "";
        let transferType = searchParams.get("transferType") || "";

        setFilters((prev) => {
            return {
                ...prev,
                skip,
                limit,
                transferFrom,
                transferTo,
                transferType,
            };
        });
        fetchCategory({ skip, limit, transferFrom, transferTo, transferType });
    }, [searchParams]);

    useEffect(() => {
        fetchData();
        fetchAreas();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    QUOTATION TRANSFER
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Transfers</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Transfers</h1>

                        <Link to="add">
                            <button className="px-3">+ Add Transfers</button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-[15px] justify-start p-6">
                        <form
                            action=""
                            onSubmit={(e) => {
                                e.preventDefault();
                                fetchCategory({ ...filters });
                                let params = prevSearchParams();
                                setSearchParams({
                                    ...params,
                                    transferFrom: filters.transferFrom,
                                    transferTo: filters.transferTo,
                                    transferType: filters.transferType,
                                    skip: 0,
                                });
                            }}
                            className="flex items-center gap-[10px] "
                        >
                            <div className="col-span-2">
                                <label htmlFor="">Transfer Type</label>
                                <div>
                                    <select
                                        name="transferType"
                                        id=""
                                        value={filters?.transferType || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="group-group">
                                            Group - Group
                                        </option>
                                        <option value="group-airport">
                                            Group - Airport
                                        </option>
                                        <option value="airport-group">
                                            Airport - Group
                                        </option>
                                        <option value="airport-airport">
                                            Airport - Airport
                                        </option>
                                        <option value="area-area">
                                            Area - Area
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div div className="col-span-2">
                                <div>
                                    <label htmlFor=""> Transfer From</label>

                                    <select
                                        name="transferFrom"
                                        value={filters?.transferFrom || ""}
                                        onChange={handleChange}
                                        id=""
                                        // required
                                        className="capitalize"
                                    >
                                        <option value="">Select</option>
                                        {(filters.transferType ===
                                            "airport-airport" ||
                                            filters.transferType ===
                                                "airport-group") &&
                                            airports?.map((airport, index) => {
                                                return (
                                                    <>
                                                        <option
                                                            value={airport?._id}
                                                            key={index}
                                                        >
                                                            {
                                                                airport?.airportName
                                                            }
                                                        </option>
                                                    </>
                                                );
                                            })}

                                        {(filters.transferType ===
                                            "group-airport" ||
                                            filters.transferType ===
                                                "group-group") &&
                                            groups?.map((group, index) => {
                                                return (
                                                    <option
                                                        value={group?._id}
                                                        key={index}
                                                    >
                                                        {group?.name}
                                                    </option>
                                                );
                                            })}

                                        {filters.transferType === "area-area" &&
                                            areas?.map((group, index) => {
                                                return (
                                                    <>
                                                        <option
                                                            value={group?._id}
                                                            key={index}
                                                        >
                                                            {group?.areaName}
                                                        </option>
                                                    </>
                                                );
                                            })}
                                    </select>
                                </div>
                            </div>
                            <div div className="col-span-2">
                                <div>
                                    <label htmlFor=""> Transfer To</label>

                                    <select
                                        name="transferTo"
                                        value={filters?.transferTo || ""}
                                        onChange={handleChange}
                                        id=""
                                        // required
                                        className="capitalize"
                                    >
                                        <option value="">Select</option>
                                        {(filters.transferType ===
                                            "airport-airport" ||
                                            filters.transferType ===
                                                "group-airport") &&
                                            airports?.map((airport, index) => {
                                                return (
                                                    <>
                                                        <option
                                                            value={airport?._id}
                                                            key={index}
                                                        >
                                                            {
                                                                airport?.airportName
                                                            }
                                                        </option>
                                                    </>
                                                );
                                            })}

                                        {(filters.transferType ===
                                            "airport-group" ||
                                            filters.transferType ===
                                                "group-group") &&
                                            groups?.map((group, index) => {
                                                return (
                                                    <>
                                                        <option
                                                            value={group?._id}
                                                            key={index}
                                                        >
                                                            {group?.name}
                                                        </option>
                                                    </>
                                                );
                                            })}

                                        {filters.transferType === "area-area" &&
                                            areas?.map((group, index) => {
                                                return (
                                                    <>
                                                        <option
                                                            value={group?._id}
                                                            key={index}
                                                        >
                                                            {group?.areaName}
                                                        </option>
                                                    </>
                                                );
                                            })}
                                    </select>
                                </div>
                            </div>
                            <button className="px-5 mt-6 ">Search</button>
                            <button
                                className="bg-slate-200 text-textColor px-5 mt-6 "
                                onClick={clearFilters}
                                type="button"
                            >
                                Clear
                            </button>
                        </form>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : transfers?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                Oops.. No Transfers Found
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
                                            Transfer From
                                        </th>
                                        <th className="font-[500] p-3">
                                            Transfer To
                                        </th>

                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {transfers?.map((transfer, index) => {
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
                                                    {transfer?.transferFrom}{" "}
                                                    {""}
                                                    {filters?.transferType ===
                                                        "area-area" && (
                                                        <span>
                                                            (
                                                            {
                                                                areas?.find(
                                                                    (area) =>
                                                                        area?._id.toString() ===
                                                                            transfer?.transferFromDetails?.areas?.find(
                                                                                (
                                                                                    ar
                                                                                ) =>
                                                                                    ar.toString() ===
                                                                                    area?._id.toString()
                                                                            ) &&
                                                                        area._id.toString() ===
                                                                            filters.transferFrom.toString()
                                                                )?.areaName
                                                            }
                                                            )
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    {transfer?.transferTo} {""}
                                                    {filters?.transferType ===
                                                        "area-area" && (
                                                        <span>
                                                            (
                                                            {
                                                                areas?.find(
                                                                    (area) =>
                                                                        area?._id.toString() ===
                                                                            transfer?.transferToDetails?.areas?.find(
                                                                                (
                                                                                    ar
                                                                                ) =>
                                                                                    ar.toString() ===
                                                                                    area?._id.toString()
                                                                            ) &&
                                                                        area._id.toString() ===
                                                                            filters.transferTo.toString()
                                                                )?.areaName
                                                            }
                                                            )
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteTransfer(
                                                                    transfer?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link
                                                            to={`${transfer?._id}/edit`}
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
                                    incOrDecSkip={(number) => {
                                        let params = prevSearchParams();
                                        setSearchParams({
                                            ...params,
                                            skip: filters.skip + number + 1,
                                        });
                                    }}
                                    updateSkip={(skip) => {
                                        let params = prevSearchParams();
                                        setSearchParams({
                                            ...params,
                                            skip: skip + 1,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
