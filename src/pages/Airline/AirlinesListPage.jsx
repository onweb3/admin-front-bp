import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { config } from "../../constants";

export default function AirlinesListPage() {
    const [airlines, setAirlines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalAirlines: 0,
        searchQuery: "",
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchAirlines = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/airlines/all?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setAirlines(response?.data?.airlines);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalAirlines: response?.data?.totalAirlines,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteAirline = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/airlines/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredAirlines = airlines.filter((airline) => {
                    return airline?._id !== id;
                });
                setAirlines(filteredAirlines);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAirlines();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Airlines</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Airlines</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Airlines</h1>
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
                                        fetchAirlines();
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
                                <button className="px-3">+ Add Airline</button>
                            </Link>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : airlines?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Airlines Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Airline</th>
                                        <th className="font-[500] p-3">Airline Code</th>
                                        <th className="font-[500] p-3">IATA Code</th>
                                        <th className="font-[500] p-3">ICAO Code</th>
                                        <th className="font-[500] p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {airlines?.map((airline, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">
                                                    <div className="flex items-center gap-[10px]">
                                                        <img
                                                            src={config.SERVER_URL + airline?.image}
                                                            alt=""
                                                            className="w-[40px] h-[40px] rounded object-cover"
                                                        />
                                                        <span>{airline?.airlineName}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">{airline?.airlineCode}</td>
                                                <td className="p-3 uppercase">
                                                    {airline?.iataCode}
                                                </td>
                                                <td className="p-3 uppercase">
                                                    {airline?.icaoCode}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteAirline(airline?._id)
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link to={`${airline?._id}/edit`}>
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
                                    total={filters?.totalAirlines}
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
