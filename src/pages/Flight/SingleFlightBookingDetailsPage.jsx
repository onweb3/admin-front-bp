import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function SingleFlightBookingDetailsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [flightBooking, setFlightBooking] = useState({});

    const { bookingId } = useParams();

    const fetchFlightBooking = () => {
        try {
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchFlightBooking();
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
                    <Link to="/flights/bookings" className="text-textColor">
                        Bookings
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {bookingId?.slice(0, 3)}...{bookingId?.slice(-3)}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    
                </div>
            </div>
        </div>
    );
}
