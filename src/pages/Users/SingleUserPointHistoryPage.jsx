import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BiFilter } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../../axios";
import { PageLoader } from "../../components";
import PointHistoryTable from "../../features/Affiliate/components/PointHistoryTable";
import { AttractionBookingOrdersTable } from "../../features/Orders";

export default function SingleUserPointHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalOrders: 0,
        status: "",
    });

    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const clearFilters = () => {
        setFilters((prev) => {
            return {
                ...prev,
                limit: 10,
                skip: 0,
                status: "",
            };
        });
        fetchAttractionTicketOrders({
            limit: 10,
            skip: 0,
        });
    };

    const fetchPointsTransation = async ({ ...filters }) => {
        try {
            setIsLoading(true);
            const searchQuery = `userId=${id}&skip=${filters?.skip}&limit=${filters.limit}&status=${filters.status}`;
            const response = await axios.get(
                `/affiliate/reports/single/user?${searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setOrders(response?.data?.pointHistory || []);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalOrders: response?.data?.totalPointHistory,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPointsTransation({ ...filters });
    }, [filters.skip]);

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    fetchPointsTransation({ ...filters });
                }}
                className="grid grid-cols-7 items-end gap-4 border-b border-dashed p-6"
            >
                <div>
                    <label htmlFor="">Status</label>
                    <select
                        name="status"
                        id=""
                        value={filters.status || ""}
                        onChange={handleChange}
                    >
                        <option value="">All</option>
                        <option value="booked">Booked</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <button className="flex items-center justify-center gap-[10px]">
                    <BiFilter /> Filter
                </button>
                <button
                    className="bg-slate-200 text-textColor"
                    onClick={clearFilters}
                    type="button"
                >
                    Clear
                </button>
                <div></div>
                <div></div>
                {/* <button
                    className="px-3 bg-[#299cdb] flex items-center justify-center gap-[10px]"
                    onClick={handleDownload}
                >
                    <FiDownload /> Download
                </button> */}
            </form>

            {isLoading ? (
                <PageLoader />
            ) : orders?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm text-grayColor block mt-[6px]">
                        Oops.. No Points History Found
                    </span>
                </div>
            ) : (
                <PointHistoryTable
                    orders={orders}
                    filters={filters}
                    setFilters={setFilters}
                />
            )}
        </div>
    );
}
