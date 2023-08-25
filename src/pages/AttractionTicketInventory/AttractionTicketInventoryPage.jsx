import React, { useEffect, useState } from "react";
import { HiOutlineTicket } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "../../axios";
import { PageLoader } from "../../components";
import { SingleActivityTicketInfo } from "../../features/AttractionTicketInventory";

export default function AttractionTicketInventoryPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [inventory, setInventory] = useState({});

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchTicketInventory = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(
                `/attractions/tickets/statistics`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setInventory(data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTicketInventory();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Tickets Inventory
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
                    <span>Tickets </span>
                    <span>{">"} </span>
                    <span>Inventory </span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="grid grid-cols-4 gap-4 min-w-[100%]">
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Total Tickets
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {inventory?.totalTickets?.count || 0}
                                </span>
                                <span className="text-sm block mt-1">
                                    Adults:{" "}
                                    {inventory?.totalAdultTickets?.count || 0},
                                    Children:{" "}
                                    {inventory?.totalChildTickets?.count || 0},
                                </span>
                                <span className="text-sm block mt-1">
                                    Common:{" "}
                                    {inventory?.totalCommonTickets?.count || 0}
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-primaryColor text-white rounded-full flex items-center justify-center">
                                <HiOutlineTicket />
                            </span>
                        </div>
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Sold Tickets
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {inventory?.soldTickets?.count || 0}
                                </span>
                                <span className="text-sm block mt-1">
                                    Adults:{" "}
                                    {inventory?.soldAdultTickets?.count || 0},
                                    Children:{" "}
                                    {inventory?.soldChildTickets?.count || 0},
                                </span>
                                <span className="text-sm block mt-1">
                                    Common:{" "}
                                    {inventory?.soldCommonTickets?.count || 0}
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-blue-500 text-white rounded-full flex items-center justify-center">
                                <HiOutlineTicket />
                            </span>
                        </div>
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Expired Tickets
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {inventory?.expiredTickets?.count || 0}
                                </span>
                                <span className="text-sm block mt-1">
                                    Adults:{" "}
                                    {inventory?.expiredAdultTickets?.count || 0}
                                    , Children:{" "}
                                    {inventory?.expiredChildTickets?.count || 0}
                                    ,
                                </span>
                                <span className="text-sm block mt-1">
                                    Common:{" "}
                                    {inventory?.expiredCommonTickets?.count ||
                                        0}
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-red-500 text-white rounded-full flex items-center justify-center">
                                <HiOutlineTicket />
                            </span>
                        </div>
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Available Tickets
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {inventory?.availableTickets?.count || 0}
                                </span>
                                <span className="text-sm block mt-1">
                                    Adults:{" "}
                                    {inventory?.availableAdultTickets?.count ||
                                        0}
                                    , Children:{" "}
                                    {inventory?.availableChildTickets?.count ||
                                        0}
                                    ,
                                </span>
                                <span className="text-sm block mt-1">
                                    Common:{" "}
                                    {inventory?.availableCommonTickets?.count ||
                                        0}
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-green-500 text-white rounded-full flex items-center justify-center">
                                <HiOutlineTicket />
                            </span>
                        </div>
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Total Cost
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {inventory?.totalTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED
                                </span>
                                <span className="text-sm block mt-1">
                                    Adults:{" "}
                                    {inventory?.totalAdultTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED, Children:{" "}
                                    {inventory?.totalChildTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED,
                                </span>
                                <span className="text-sm block mt-1">
                                    Common:{" "}
                                    {inventory?.totalCommonTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-primaryColor text-white rounded-full flex items-center justify-center">
                                $
                            </span>
                        </div>
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Sold Tickets
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {inventory?.soldTickets?.cost?.toFixed(2) ||
                                        0}{" "}
                                    AED
                                </span>
                                <span className="text-sm block mt-1">
                                    Adults:{" "}
                                    {inventory?.soldAdultTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED, Children:{" "}
                                    {inventory?.soldChildTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED ,
                                </span>
                                <span className="text-sm block mt-1">
                                    Common:{" "}
                                    {inventory?.soldCommonTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-blue-500 text-white rounded-full flex items-center justify-center">
                                $
                            </span>
                        </div>
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Expired Tickets
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {inventory?.expiredTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED
                                </span>
                                <span className="text-sm block mt-1">
                                    Adults:{" "}
                                    {inventory?.expiredAdultTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED, Children:{" "}
                                    {inventory?.expiredChildTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED,
                                </span>
                                <span className="text-sm block mt-1">
                                    Common:{" "}
                                    {inventory?.expiredCommonTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-red-500 text-white rounded-full flex items-center justify-center">
                                $
                            </span>
                        </div>
                        <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                            <div>
                                <span className="block text-sm text-grayColor font-medium">
                                    Available Tickets
                                </span>
                                <span className="block text-xl font-[600] mt-1">
                                    {inventory?.availableTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED
                                </span>
                                <span className="text-sm block mt-1">
                                    Adults:{" "}
                                    {inventory?.availableAdultTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED, Children:{" "}
                                    {inventory?.availableChildTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED,
                                </span>
                                <span className="text-sm block mt-1">
                                    Common:{" "}
                                    {inventory?.availableCommonTickets?.cost?.toFixed(
                                        2
                                    ) || 0}{" "}
                                    AED
                                </span>
                            </div>
                            <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-green-500 text-white rounded-full flex items-center justify-center">
                                $
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="col-span-2">
                            <SingleActivityTicketInfo />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
