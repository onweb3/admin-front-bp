import React, { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { formatDate } from "../../utils";

export default function AttractionItinerariesPage() {
    const [itineraries, setItineraries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalItineraries: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchItineraries = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/attractions/itineraries/all`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setItineraries(response?.data?.attrctionItineraries);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalItineraries: response.data?.totalAttractionItineraries,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteAttractionItinerary = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/attractions/itineraries/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });
                const filteredItineraries = itineraries.filter((itinerary) => {
                    return itinerary?._id !== id;
                });
                setItineraries(filteredItineraries);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchItineraries();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Attraction Itineraries
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/attractions" className="text-textColor">
                        Attractions{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Itineraries</span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Itineraries</h1>
                            <Link to="add">
                                <button className="px-3">
                                    + Add Itinerary
                                </button>
                            </Link>
                        </div>
                        {itineraries?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Itineraries Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Agent Details
                                            </th>
                                            <th className="font-[500] p-3">
                                                Query Details
                                            </th>
                                            <th className="font-[500] p-3">
                                                Created Date
                                            </th>
                                            <th className="font-[500] p-3">
                                                View
                                            </th>
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {itineraries?.map(
                                            (itinerary, index) => {
                                                return (
                                                    <tr
                                                        key={index}
                                                        className="border-b border-tableBorderColor"
                                                    >
                                                        <td className="p-3">
                                                            <span className="block">
                                                                {
                                                                    itinerary?.agentName
                                                                }
                                                            </span>
                                                            <span className="block">
                                                                {
                                                                    itinerary?.agentEmail
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="p-3">
                                                            {itinerary?.queryDetails}
                                                        </td>
                                                        <td className="p-3">
                                                            {formatDate(
                                                                itinerary?.createdAt
                                                            )}
                                                        </td>
                                                        <td className="p-3">
                                                            <Link
                                                                to={`${itinerary?._id}/preview`}
                                                                className="text-lg"
                                                            >
                                                                <AiFillEye />
                                                            </Link>
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex gap-[10px]">
                                                                <button
                                                                    className="h-auto bg-transparent text-red-500 text-xl"
                                                                    onClick={() =>
                                                                        deleteAttractionItinerary(
                                                                            itinerary?._id
                                                                        )
                                                                    }
                                                                >
                                                                    <MdDelete />
                                                                </button>
                                                                <Link
                                                                    to={`${itinerary?._id}/edit`}
                                                                >
                                                                    <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                        <BiEditAlt />
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>

                                <div className="p-4">
                                    <Pagination
                                        limit={filters?.limit}
                                        skip={filters?.skip}
                                        total={filters?.totalItineraries}
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
