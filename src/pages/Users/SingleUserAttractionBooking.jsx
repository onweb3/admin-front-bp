import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BiFilter } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "../../axios";
import { PageLoader } from "../../components";
import { AttractionBookingOrdersTable } from "../../features/Orders";

export default function SingleUserAttractionBookingOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalOrders: 0,
        status: "",
        referenceNo: "",
        dateFrom: "",
        dateTo: "",
        attraction: "",
        activity: "",
        travellerEmail: "",
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
                referenceNo: "",
                dateFrom: "",
                dateTo: "",
                attraction: "",
                activity: "",
                travellerEmail: "",
            };
        });
        fetchAttractionTicketOrders({
            limit: 10,
            skip: 0,
            status: "",
            referenceNo: "",
            dateFrom: "",
            dateTo: "",
            attraction: "",
            activity: "",
            travellerEmail: "",
        });
    };

    const fetchAttractionTicketOrders = async ({ ...filters }) => {
        try {
            setIsLoading(true);
            const searchQuery = `userId=${id}&skip=${filters?.skip}&limit=${filters.limit}&referenceNo=${filters.referenceNo}&status=${filters.status}&attraction=${filters.attraction}&activity=${filters.activity}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}&travellerEmail=${filters.travellerEmail}`;
            const response = await axios.get(
                `/attractions/orders/b2c/all?bookingType=booking&${searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setOrders(response?.data?.result?.data || []);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalOrders: response?.data?.result?.totalOrders,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDownload = async () => {
        try {
            const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}&referenceNo=${filters.referenceNo}&status=${filters.status}&attraction=${filters.attraction}&activity=${filters.activity}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}&travellerEmail=${filters.travellerEmail}`;

            const response = await axios({
                url: `/attractions/orders/b2b/reseller/${id}/all/sheet?bookingType=booking&${searchQuery}`,
                method: "GET",
                responseType: "blob",
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            });
            const href = URL.createObjectURL(response.data);

            const link = document.createElement("a");
            link.href = href;
            link.setAttribute("download", "orders.xlsx");
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAttractionTicketOrders({ ...filters });
    }, [filters.skip]);

    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    fetchAttractionTicketOrders({ ...filters });
                }}
                className="grid grid-cols-7 items-end gap-4 border-b border-dashed p-6"
            >
                <div className="col-span-2">
                    <label htmlFor="">Reference Number</label>
                    <input
                        type="text"
                        placeholder="Search Reference No."
                        className=""
                        name="referenceNo"
                        value={filters.referenceNo || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="">
                    <label htmlFor="">Date From</label>
                    <input
                        type="date"
                        className=""
                        name="dateFrom"
                        value={filters.dateFrom || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="">
                    <label htmlFor="">Date To</label>
                    <input
                        type="date"
                        className=""
                        name="dateTo"
                        value={filters.dateTo || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="">
                    <label htmlFor="">Attraction</label>
                    <input
                        type="text"
                        placeholder="Search attraction..."
                        className=""
                        name="attraction"
                        value={filters.attraction || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="">
                    <label htmlFor="">Activity</label>
                    <input
                        type="text"
                        placeholder="Search activity..."
                        className=""
                        name="activity"
                        value={filters.activity || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className="">
                    <label htmlFor="">Traveller</label>
                    <input
                        type="text"
                        placeholder="Search email..."
                        className=""
                        name="travellerEmail"
                        value={filters.travellerEmail || ""}
                        onChange={handleChange}
                    />
                </div>
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
                <div>
                    <label htmlFor="">Limit</label>
                    <select
                        id=""
                        name="limit"
                        value={filters.limit}
                        onChange={handleChange}
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
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
                <button
                    className="px-3 bg-[#299cdb] flex items-center justify-center gap-[10px]"
                    onClick={handleDownload}
                >
                    <FiDownload /> Download
                </button>
            </form>

            {isLoading ? (
                <PageLoader />
            ) : orders?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm text-grayColor block mt-[6px]">
                        Oops.. No Booking Orders Found
                    </span>
                </div>
            ) : (
                <AttractionBookingOrdersTable
                    orders={orders}
                    filters={filters}
                    setFilters={setFilters}
                    section={"b2b"}
                />
            )}
        </div>
    );
}
