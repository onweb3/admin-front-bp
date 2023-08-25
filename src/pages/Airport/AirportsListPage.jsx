import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";

export default function AirportsListPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [airports, setAirports] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalAirports: 0,
    });

    const prevSearchParams = (e) => {
        let params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    };

    const { jwtToken } = useSelector((state) => state.admin);
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchAirports = async ({ skip, limit }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/airports/all?skip=${skip}&limit=${limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setAirports(response?.data?.airports);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalAirports: response?.data?.totalAirports,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteAirport = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/airports/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredAirports = airports.filter((airport) => {
                    return airport?._id !== id;
                });
                setAirports(filteredAirports);
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
        let searchInput = searchParams.get("search") || "";

        setFilters((prev) => {
            return { ...prev, skip, limit, searchInput };
        });
        fetchAirports({ skip, limit });
    }, [searchParams]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Airports</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Airports</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Airports</h1>
                        <Link to="add">
                            <button className="px-3">+ Add Airport</button>
                        </Link>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : airports?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                Oops.. No Airports Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Airport
                                        </th>
                                        <th className="font-[500] p-3">
                                            IATA Code
                                        </th>
                                        <th className="font-[500] p-3">
                                            ICAO Code
                                        </th>
                                        <th className="font-[500] p-3">
                                            Country
                                        </th>
                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {airports?.map((airport, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">
                                                    <span className="block">
                                                        {airport?.airportName}
                                                    </span>
                                                    <span className="block text-grayColor">
                                                        {airport?.place}
                                                    </span>
                                                </td>
                                                <td className="p-3 uppercase">
                                                    {airport?.iataCode}
                                                </td>
                                                <td className="p-3 uppercase">
                                                    {airport?.icaoCode}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {
                                                        airport?.country
                                                            ?.countryName
                                                    }
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <Link
                                                            to={`${airport?._id}/terminal`}
                                                        >
                                                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                <BsEyeFill />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteAirport(
                                                                    airport?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link
                                                            to={`${airport?._id}/edit`}
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
                                    total={filters?.totalAirports}
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
