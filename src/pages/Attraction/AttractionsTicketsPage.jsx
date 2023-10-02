import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineTicket } from "react-icons/hi";

import axios from "../../axios";
import { PageLoader } from "../../components";
import Pagination from "../../components/Pagination";
import { SingleAttractionTicketTableRow, UploadTicketModal } from "../../features/Attractions";

export default function AttractionsTicketsPage() {
    const [isUploadTicketModalOpen, setIsUploadTicketModalOpen] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [activity, setActivity] = useState({});
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalTickets: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [statistics, setStatistics] = useState({
        totalTickets: 0,
        soldTickets: 0,
        expiredTickets: 0,
        availableTickets: 0,
        totalAdultTickets: 0,
        adultSoldTickets: 0,
        adultExpiredTickets: 0,
        adultAvailableTickets: 0,
        totalChildTickets: 0,
        childSoldTickets: 0,
        childExpiredTickets: 0,
        childAvailableTickets: 0,
        totalCommonTickets: 0,
        commonSoldTickets: 0,
        commonExpiredTickets: 0,
        commonAvailableTickets: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);
    const { id, activityId } = useParams();

    const fetchTickets = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/attractions/tickets/activity/${activityId}?skip=${filters?.skip}&limit=${filters?.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setTickets(response?.data?.tickets);
            setFilters((prev) => {
                return { ...prev, totalTickets: response?.data?.totalTickets };
            });
            setActivity(response.data?.activity);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const addTickets = async (newTickets) => {
        setTickets((prev) => {
            return [...newTickets, ...prev];
        });
        setFilters((prev) => {
            return {
                ...prev,
                totalTickets: prev.totalTickets + newTickets?.length,
            };
        });
    };

    const updateTicketStatus = async (ticketId) => {
        try {
            const isConfirm = window.confirm("Are you sure to change status?");
            if (isConfirm) {
                const response = await axios.patch(
                    `/attractions/tickets/update/status/${ticketId}`,
                    {},
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                let tempTickets = tickets;
                const objIndex = tempTickets.findIndex((ticket) => {
                    return ticket?._id === ticketId;
                });
                tempTickets[objIndex].status = response?.data?.status;
                setTickets(() => {
                    return [...tempTickets];
                });
                
            }
        } catch (err) {
            console.log(err);
        }
    };

    const deleteTicket = (id) => {
        const filteredTickets = tickets.filter((ticket) => {
            return ticket?._id !== id;
        });
        setTickets(filteredTickets);
    };

    const fetchStatistics = async () => {
        try {
            const response = await axios.get(
                `/attractions/tickets/activities/${activityId}/statistics`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            const {
                totalTickets,
                soldTickets,
                expiredTickets,
                availableTickets,
                totalAdultTickets,
                adultSoldTickets,
                adultExpiredTickets,
                adultAvailableTickets,
                totalChildTickets,
                childSoldTickets,
                childExpiredTickets,
                childAvailableTickets,
                totalCommonTickets,
                commonSoldTickets,
                commonExpiredTickets,
                commonAvailableTickets,
            } = response.data;

            setStatistics((prev) => {
                return {
                    ...prev,
                    totalTickets,
                    soldTickets,
                    expiredTickets,
                    availableTickets,
                    totalAdultTickets,
                    adultSoldTickets,
                    adultExpiredTickets,
                    adultAvailableTickets,
                    totalChildTickets,
                    childSoldTickets,
                    childExpiredTickets,
                    childAvailableTickets,
                    totalCommonTickets,
                    commonSoldTickets,
                    commonExpiredTickets,
                    commonAvailableTickets,
                };
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [filters.skip, filters.limit]);

    useEffect(() => {
        fetchStatistics();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Tickets</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/attractions" className="text-textColor">
                        Attractions{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 2)}...{id?.slice(-3)}
                    </span>
                    <span>{">"} </span>
                    <Link to={`/attractions/${id}/edit`} className="text-textColor">
                        Edit
                    </Link>
                    <span>{">"} </span>
                    <span>Activities</span>
                    <span>{">"} </span>
                    <span>
                        {activityId?.slice(0, 2)}...{activityId?.slice(-3)}
                    </span>
                    <span>{">"} </span>
                    <span>Tickets</span>
                </div>
            </div>

            {isUploadTicketModalOpen && (
                <UploadTicketModal
                    setIsUploadTicketModalOpen={setIsUploadTicketModalOpen}
                    activityId={activityId}
                    addTickets={addTickets}
                    activityName={activity?.name}
                />
            )}

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">{activity?.name}</h1>
                        <button className="px-3" onClick={() => setIsUploadTicketModalOpen(true)}>
                            + Upload Ticket
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-4 min-w-[100%] p-4">
                        <div className="bg-[#f3f6f9] p-4 rounded flex items-center justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Total Tickets
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {statistics?.totalTickets || 0}
                                </span>
                                <span className="text-sm block mt-1">
                                    Adults: {statistics?.totalAdultTickets || 0}, Children:{" "}
                                    {statistics?.totalChildTickets || 0},
                                </span>
                                <span className="text-sm block mt-1">
                                    Common: {statistics?.totalCommonTickets || 0}
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-primaryColor text-white rounded-full flex items-center justify-center">
                                <HiOutlineTicket />
                            </span>
                        </div>
                        <div className="bg-[#f3f6f9] p-4 rounded flex items-center justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Sold Tickets
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {statistics?.soldTickets || 0}
                                </span>
                                <span className="text-sm block mt-1">
                                    Adults: {statistics?.adultSoldTickets || 0}, Children:{" "}
                                    {statistics?.childSoldTickets || 0},
                                </span>
                                <span className="text-sm block mt-1">
                                    Common: {statistics?.commonSoldTickets || 0}
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-blue-500 text-white rounded-full flex items-center justify-center">
                                <HiOutlineTicket />
                            </span>
                        </div>
                        <div className="bg-[#f3f6f9] p-4 rounded flex items-center justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Expired Tickets
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {statistics?.expiredTickets || 0}
                                </span>
                                <span className="text-sm block mt-1">
                                    Adults: {statistics?.adultExpiredTickets || 0}, Children:{" "}
                                    {statistics?.childExpiredTickets},
                                </span>
                                <span className="text-sm block mt-1">
                                    Common: {statistics?.commonExpiredTickets}
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-red-500 text-white rounded-full flex items-center justify-center">
                                <HiOutlineTicket />
                            </span>
                        </div>
                        <div className="bg-[#f3f6f9] p-4 rounded flex items-center justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Available Tickets
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {statistics?.availableTickets || 0}
                                </span>
                                <span className="text-sm block mt-1">
                                    Adults: {statistics?.adultAvailableTickets || 0}, Children:{" "}
                                    {statistics?.childAvailableTickets || 0},
                                </span>
                                <span className="text-sm block mt-1">
                                    Common: {statistics?.commonAvailableTickets || 0}
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-green-500 text-white rounded-full flex items-center justify-center">
                                <HiOutlineTicket />
                            </span>
                        </div>
                    </div>

                    {isLoading ? (
                        <PageLoader />
                    ) : tickets?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Tickets found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Ticket No</th>
                                        <th className="font-[500] p-3">Lot No</th>
                                        <th className="font-[500] p-3">Ticket For</th>
                                        <th className="font-[500] p-3">Details</th>
                                        <th className="font-[500] p-3">Validity</th>
                                        <th className="font-[500] p-3">Ticket Cost</th>
                                        <th className="font-[500] p-3">Status</th>
                                        <th className="font-[500] p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {tickets?.map((ticket, index) => {
                                        return (
                                            <SingleAttractionTicketTableRow
                                                key={index}
                                                ticket={ticket}
                                                updateTicketStatus={updateTicketStatus}
                                                deleteTicket={deleteTicket}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalTickets}
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
