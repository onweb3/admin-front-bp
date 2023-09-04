import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import { BiFilter } from "react-icons/bi";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { FlightBookingsTableRow } from "../../features/Flight";

export default function FlightBookingsListPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        referenceNumber: "",
        agentCode: "",
        departureDateFrom: "",
        departureDateTo: "",
        bookingDateFrom: "",
        bookingDateTo: "",
        airlineCode: "",
        fromAirportCode: "",
        toAirportCode: "",
        status: "",
        totalFlightBookings: 0,
    });
    const [initialData, setInitialData] = useState({
        airports: [],
        airlines: [],
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchFlightBookings = async (filters) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/flights/bookings/all?skip=${filters.skip}&limit=${filters.limit}&referenceNumber=${filters.referenceNumber}&agentCode=${filters.agentCode}&departureDateFrom=${filters.departureDateFrom}&departureDateTo=${filters.departureDateTo}&bookingDateFrom=${filters.bookingDateFrom}&bookingDateTo=${filters.bookingDateTo}&airlineCode=${filters.airlineCode}&fromAirportCode=${filters.fromAirportCode}&toAirportCode=${filters.toAirportCode}&status=${filters.status}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setBookings(response?.data?.flightBookings?.data);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalFlightBookings: response?.data?.flightBookings?.totalFlightBookings,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchInitialData = async () => {
        try {
            const response = await axios.get("/flights/bookings/initial-data", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setInitialData((prev) => {
                return {
                    ...prev,
                    airlines: response?.data?.airlines,
                    airports: response?.data?.airports,
                };
            });
        } catch (err) {
            console.log(err);
        }
    };

    const clearFilters = () => {
        setFilters((prev) => {
            return {
                ...prev,
                skip: 0,
                limit: 10,
                referenceNumber: "",
                agentCode: "",
                departureDateFrom: "",
                departureDateTo: "",
                bookingDateFrom: "",
                bookingDateTo: "",
                airlineCode: "",
                fromAirportCode: "",
                toAirportCode: "",
                status: "",
            };
        });
        if (filters.skip === 0) {
            fetchFlightBookings({
                skip: 0,
                limit: 10,
                referenceNumber: "",
                agentCode: "",
                departureDateFrom: "",
                departureDateTo: "",
                bookingDateFrom: "",
                bookingDateTo: "",
                airlineCode: "",
                fromAirportCode: "",
                toAirportCode: "",
                status: "",
                totalFlightBookings: 0,
            });
        }
    };

    useEffect(() => {
        fetchFlightBookings({ ...filters });
    }, [filters.skip]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Flight Bookings</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Flights </span>
                    <span>{">"} </span>
                    <span>Bookings</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Flight Bookings</h1>
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
                                fetchFlightBookings({ ...filters });
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
                            <label htmlFor="">Agent Code</label>
                            <input
                                type="number"
                                placeholder="Search agent..."
                                name="agentCode"
                                value={filters.agentCode || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Departure Date From</label>
                            <input
                                type="date"
                                name="departureDateFrom"
                                value={filters.departureDateFrom || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Departure Date To</label>
                            <input
                                type="date"
                                name="departureDateTo"
                                value={filters.departureDateTo || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Booking Date From</label>
                            <input
                                type="date"
                                name="bookingDateFrom"
                                value={filters.bookingDateFrom || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="">
                            <label htmlFor="">Booking Date To</label>
                            <input
                                type="date"
                                name="bookingDateTo"
                                value={filters.bookingDateTo || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="">Airline</label>
                            <select
                                id=""
                                name="airlineCode"
                                value={filters.airlineCode}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                {initialData?.airlines?.map((item, index) => {
                                    return (
                                        <option value={item?.airlineCode} key={index}>
                                            {item?.airlineName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">From Airport</label>
                            <select
                                id=""
                                name="fromAirportCode"
                                value={filters.fromAirportCode}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                {initialData?.airports?.map((item, index) => {
                                    return (
                                        <option value={item?.iataCode} key={index}>
                                            {item?.iataCode}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">To Airport</label>
                            <select
                                id=""
                                name="toAirportCode"
                                value={filters.toAirportCode}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                {initialData?.airports?.map((item, index) => {
                                    return (
                                        <option value={item?.iataCode} key={index}>
                                            {item?.iataCode}
                                        </option>
                                    );
                                })}
                            </select>
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
                                <option value="completed">Completed</option>
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
                    ) : !bookings || bookings?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Flight Bookings Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Ref. No.</th>
                                            <th className="font-[500] p-3">Flight</th>
                                            <th className="font-[500] p-3">Departure</th>
                                            <th className="font-[500] p-3">Type</th>
                                            <th className="font-[500] p-3">Airlines</th>
                                            <th className="font-[500] p-3">Pax</th>
                                            <th className="font-[500] p-3">Booking Date</th>
                                            <th className="font-[500] p-3">Reseller</th>
                                            <th className="font-[500] p-3">Price</th>
                                            <th className="font-[500] p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {bookings?.map((booking, index) => {
                                            return (
                                                <FlightBookingsTableRow
                                                    booking={booking}
                                                    key={index}
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
                                    total={filters?.totalFlightBookings}
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
