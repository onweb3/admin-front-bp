import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";

import axios from "../../axios";
import { PageLoader } from "../../components";
import {
    TopSellingActivitiesCard,
    TopSellingResellersCard,
} from "../../features/AttractionsStatistics";

export default function AttractionOrdersStatistics() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});
    const [filters, setFilters] = useState({
        bookingType: "",
        fromDate: "",
        toDate: "",
    });
    const [visibilty, setVisibility] = useState(false);

    const { jwtToken, admin } = useSelector((state) => state.admin);
    useEffect(() => {
        const access = admin.roles.find((role) => role.roleName == "owner");

        if (access) {
            setVisibility(true);
        } else {
            setVisibility(false);
        }
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/attractions/orders/statistics?fromDate=${filters.fromDate}&toDate=${filters.toDate}&bookingType=${filters.bookingType}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setData(response?.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Attraction Order Info
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
                    <span>Statistics </span>
                </div>
            </div>

            <div className="flex items-end justify-start gap-4 p-6">
                <div>
                    <label htmlFor="">From Date</label>
                    <input
                        type="date"
                        name="fromDate"
                        value={filters.fromDate || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="">To Date</label>
                    <input
                        type="date"
                        name="toDate"
                        value={filters.toDate || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="">Type</label>
                    <select
                        name="bookingType"
                        value={filters.bookingType || ""}
                        onChange={handleChange}
                    >
                        <option value="">All</option>
                        <option value="ticket">Ticket</option>
                        <option value="booking">Booking</option>
                    </select>
                </div>
                <button
                    className="px-3 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    onClick={fetchData}
                >
                    Search
                </button>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    {visibilty && (
                        <div className="grid grid-cols-4 gap-4 min-w-[100%]">
                            <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                                <div>
                                    <span className="block text-sm text-grayColor font-medium">
                                        Total Activities
                                    </span>
                                    <span className="block text-xl font-[600] mt-1">
                                        {data?.attractionOrders?.total || 0}
                                    </span>
                                </div>
                                <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-primaryColor text-white rounded-full flex items-center justify-center">
                                    <AiOutlineShoppingCart />
                                </span>
                            </div>
                            <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                                <div>
                                    <span className="block text-sm text-grayColor font-medium">
                                        Total Volume
                                    </span>
                                    <span className="block text-xl font-[600] mt-1">
                                        {data?.attractionOrders?.volume?.toFixed(
                                            2
                                        ) || 0}{" "}
                                        AED
                                    </span>
                                </div>
                                <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-blue-500 text-white rounded-full flex items-center justify-center">
                                    <AiOutlineShoppingCart />
                                </span>
                            </div>
                            <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                                <div>
                                    <span className="block text-sm text-grayColor font-medium">
                                        Total Cost
                                    </span>
                                    <span className="block text-xl font-[600] mt-1">
                                        {data?.attractionOrders?.cost?.toFixed(
                                            2
                                        ) || 0}{" "}
                                        AED
                                    </span>
                                </div>
                                <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-red-500 text-white rounded-full flex items-center justify-center">
                                    <AiOutlineShoppingCart />
                                </span>
                            </div>
                            <div className="bg-[#fff] p-4 rounded shadow-sm flex items-start justify-between">
                                <div>
                                    <span className="block text-sm text-grayColor font-medium">
                                        Total Profit
                                    </span>
                                    <span className="block text-xl font-[600] mt-1">
                                        {data?.attractionOrders?.profit?.toFixed(
                                            2
                                        ) || 0}{" "}
                                        AED
                                    </span>
                                </div>
                                <span className="text-2xl w-[40px] h-[40px] min-w-[40px] min-h-[40px] bg-green-500 text-white rounded-full flex items-center justify-center">
                                    <AiOutlineShoppingCart />
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 ">
                        <TopSellingActivitiesCard
                            data={data.topSellingActivities || []}
                        />
                    </div>
                    <div className="mt-6">
                        <TopSellingResellersCard
                            data={data.topSellingResellers || []}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
