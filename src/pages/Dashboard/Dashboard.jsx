import React from "react";
import { useSelector } from "react-redux";

import {
    bookingCancelledPng,
    bookingConfirmedPng,
    bookingReceivedPng,
    ticketBoughtPng,
    ticketCancelledPng,
    ticketConfirmedPng,
    totalRevenuePng,
    usersPng,
} from "../../assets/images";
import { TopCard } from "../../features/Dashboard";

export default function Dashboard() {
    const { admin } = useSelector((state) => state.admin);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between gap-[10px] mb-5">
                <div>
                    <span className="font-medium text-textColor">
                        Good morning, {admin?.name}
                    </span>
                    <span className="block mt-1 text-[13px] text-grayColor">
                        Here's what's happening with your website today.
                    </span>
                </div>
                <div>
                    <select name="" id="" className="w-[150px]">
                        <option value="">All Time</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
                <TopCard
                    title={"Total Revenue"}
                    value={300}
                    link="/"
                    linkText="View all details"
                    icon={totalRevenuePng}
                    isAmount={true}
                />
                <TopCard
                    title={"Total Booking Received"}
                    value={3}
                    link="/"
                    linkText="View all booking"
                    icon={bookingReceivedPng}
                />
                <TopCard
                    title={"Total Booking Confimed"}
                    value={2}
                    link="/"
                    linkText="View all booking"
                    icon={bookingConfirmedPng}
                />
                <TopCard
                    title={"Total Booking Cancelled"}
                    value={1}
                    link="/"
                    linkText="View all booking"
                    icon={bookingCancelledPng}
                />
                <TopCard
                    title={"Total Users Signed"}
                    value={20}
                    link="/"
                    linkText="View all booking"
                    icon={usersPng}
                />
                <TopCard
                    title={"Total Ticket Bought"}
                    value={10}
                    link="/"
                    linkText="View all booking"
                    icon={ticketBoughtPng}
                />
                <TopCard
                    title={"Total Ticket Confirmed"}
                    value={6}
                    link="/"
                    linkText="View all booking"
                    icon={ticketConfirmedPng}
                />
                <TopCard
                    title={"Total Ticket Cancelled"}
                    value={4}
                    link="/"
                    linkText="View all booking"
                    icon={ticketCancelledPng}
                />
            </div>

            <div className="bg-white rounded shadow-sm mt-6">
                <div className="flex items-center justify-between border-b border-dashed p-4">
                    <h1 className="font-medium">Recent Orders</h1>
                </div>
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Ref.No</th>
                            <th className="font-[500] p-3">Activity</th>
                            <th className="font-[500] p-3">Bookig Type</th>
                            <th className="font-[500] p-3">Adults</th>
                            <th className="font-[500] p-3">Children</th>
                            <th className="font-[500] p-3">Infant</th>
                            <th className="font-[500] p-3">Price</th>
                            <th className="font-[500] p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr className="border-b border-tableBorderColor">
                            <td className="p-3">#63b2cc</td>
                            <td className="p-3">
                                Pearl Heli Tour (12 Mins. Ride)
                            </td>
                            <td className="p-3">January 3, 2023</td>
                            <td className="p-3">
                                <span className="block text-sm capitalize">
                                    Test
                                </span>
                                <span>test@email.com</span>
                            </td>
                            <td className="p-3 ">1</td>
                            <td className="p-3">0</td>
                            <td className="p-3">0</td>
                            <td className="p-3">153 AED</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
