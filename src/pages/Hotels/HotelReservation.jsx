import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { PageLoader, Pagination } from "../../components";
import { B2bHotelReservationSingleRow } from "../../features/Hotels";
import axios from "../../axios";
import { BiFilter } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";

function HotelReservation() {
    const [isLoading, setIsLoading] = useState(true);
    const [hotelOrders, setHotelOrders] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalHotels: 0,
        referenceNumber: "",
        hotelBookingId: "",
        agentCode: "",
        supplier: "",
        checkInDate: "",
        checkOutDate: "",
        orderedDateFrom: "",
        orderedDateTo: "",
        hotel: "",
        status: "",
    });

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
                skip: 0,
                limit: 10,
                referenceNumber: "",
                hotelBookingId: "",
                agentCode: "",
                supplier: "",
                checkInDate: "",
                checkOutDate: "",
                orderedDateFrom: "",
                orderedDateTo: "",
                hotel: "",
                status: "",
            };
        });
        fetchHotelOrders({
            skip: 0,
            limit: 10,
            referenceNumber: "",
            hotelBookingId: "",
            agentCode: "",
            supplier: "",
            checkInDate: "",
            checkOutDate: "",
            orderedDateFrom: "",
            orderedDateTo: "",
            hotel: "",
            status: "",
        });
    };

    const fetchHotelOrders = async ({ ...filters }) => {
        try {
            console.log("fetching orders...");
            setIsLoading(true);
            const response = await axios.get(
                `/hotels/orders/b2b/all?skip=${filters.skip}&limit=${filters.limit}&referenceNumber=${filters.referenceNumber}&hotelBookingId=${filters.hotelBookingId}&agentCode=${filters.agentCode}&supplier=${filters.supplier}&checkInDate=${filters.checkInDate}&checkOutDate=${filters.checkOutDate}&orderedDateFrom=${filters.orderedDateFrom}&orderedDateTo=${filters.orderedDateTo}&hotel=${filters.hotel}&status=${filters.status}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setHotelOrders(response?.data?.hotelOrders?.data || []);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalHotels: response?.data?.hotelOrders?.totalHotelOrders,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHotelOrders({ ...filters });
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Hotel Orders</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        hotels
                    </Link>
                    <span>{">"} </span>
                    <span>Reservation</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Hotel Orders</h1>
                        <button
                            className="px-3 bg-[#299cdb] flex items-center justify-center gap-[10px]"
                            // onClick={handleDownload}
                        >
                            <FiDownload /> Download
                        </button>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (filters.skip !== 0) {
                                setFilters({ ...filters, skip: 0 });
                            } else {
                                fetchHotelOrders({ ...filters });
                            }
                        }}
                        className="grid grid-cols-7 items-end gap-4 border-b border-dashed p-4"
                    >
                        <div className="col-span-2">
                            <label htmlFor="">Reference Number</label>
                            <input
                                type="text"
                                placeholder="Search Reference No."
                                name="referenceNumber"
                                value={filters.referenceNumber || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Booking Number</label>
                            <input
                                type="text"
                                placeholder="Enter booking number"
                                name="hotelBookingId"
                                value={filters.hotelBookingId || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Agent Code</label>
                            <input
                                type="number"
                                placeholder="Search agent..."
                                name="agentCode"
                                value={filters.agentCode || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Supplier</label>
                            <select
                                id=""
                                name="supplier"
                                value={filters.supplier}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="tctt">TCTT</option>
                                <option value="hotel-beds">Hotel Bed</option>
                            </select>
                        </div>
                        <div className="">
                            <label htmlFor="">Check-in Date From</label>
                            <input
                                type="date"
                                name="checkInDate"
                                value={filters.checkInDate || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Check-in Date To</label>
                            <input
                                type="date"
                                name="checkInDate"
                                value={filters.checkInDate || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Check-out Date From</label>
                            <input
                                type="date"
                                className=""
                                name="checkOutDate"
                                value={filters.checkOutDate || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Check-out Date To</label>
                            <input
                                type="date"
                                className=""
                                name="checkOutDate"
                                value={filters.checkOutDate || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Ordered From</label>
                            <input
                                type="date"
                                name="orderedDateFrom"
                                value={filters.orderedDateFrom || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Ordered To</label>
                            <input
                                type="date"
                                className=""
                                name="orderedDateTo"
                                value={filters.orderedDateTo || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Hotel</label>
                            <input
                                type="text"
                                placeholder="Search hotel..."
                                name="hotel"
                                value={filters.hotel || ""}
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
                                <option value="pending">Pending</option>
                                <option value="booked">Booked</option>
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
                    </form>

                    {isLoading ? (
                        <PageLoader />
                    ) : !hotelOrders || hotelOrders?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Orders Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Ref. No.</th>
                                            <th className="font-[500] p-3">Created At</th>
                                            <th className="font-[500] p-3">Hotel Name</th>
                                            <th className="font-[500] p-3">Reseller</th>
                                            <th className="font-[500] p-3">Booking Date</th>
                                            <th className="font-[500] p-3">Pax</th>
                                            <th className="font-[500] p-3">Price</th>
                                            <th className="font-[500] p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {hotelOrders?.map((order, index) => {
                                            return (
                                                <B2bHotelReservationSingleRow
                                                    key={index}
                                                    order={order}
                                                />
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalHotels}
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

export default HotelReservation;
