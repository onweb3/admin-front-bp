import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { BtnLoader, PageLoader, SelectDropdown } from "../../components";
import axioss from "axios";
import FlightAvailabiltyModal from "../../features/Flight/components/FlightAvailabilityModal";
import FlightItinerary from "../../features/Flight/components/FlightItinerary";
import FlightSeatSelection from "../../features/Flight/components/FlightSeatSelection";
import FlightAddOns from "../../features/Flight/components/FlightAddOns";
import { handleInitalDataChange } from "../../redux/slices/FlightOrderSlice";
import FlightContactDetails from "../../features/Flight/components/FligthContactDetails";
export default function CompleteFlightOrderPage() {
    const { singleFlightDetails, flightAncillaries } = useSelector(
        (state) => state.flightOrder
    );
    const { jwtToken } = useSelector((state) => state.admin);
    const [isLoading, setIsLoading] = useState(false);
    const { tbId } = useParams();
    const [showContacts, setShowContacts] = useState(false);

    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const fetchAncillariesData = async () => {
        try {
            const response = await axios.get(
                `/orders/flight/details/${tbId}/ancillaries`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            dispatch(
                handleInitalDataChange({
                    name: `flightAncillaries`,
                    value: response.data,
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    const fetchInitialData = async () => {
        try {
            const response = await axios.get(`/orders/flight/details/${tbId}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            dispatch(
                handleInitalDataChange({
                    name: `singleFlightDetails`,
                    value: response.data,
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAncillariesData();
        fetchInitialData();
    }, []);

    console.log(`flight`, singleFlightDetails);
    return (
        <div>
            {" "}
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">
                    Complete Flight Order
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/order" className="text-textColor">
                        Orders{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Flight</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    {singleFlightDetails?.trips ? (
                        singleFlightDetails?.trips?.map((trip) => {
                            return <FlightItinerary trip={trip} />;
                        })
                    ) : (
                        <PageLoader />
                    )}
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <FlightAddOns
                        flightAncillaries={flightAncillaries}
                        setShowContacts={setShowContacts}
                    />
                </div>
            </div>
            {showContacts && (
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        <FlightContactDetails
                            flightAncillaries={flightAncillaries}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
