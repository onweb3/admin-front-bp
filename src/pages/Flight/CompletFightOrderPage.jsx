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
import {
    handleInitalDataChange,
    clearAllData,
} from "../../redux/slices/FlightOrderSlice";
import FlightContactDetails from "../../features/Flight/components/FligthContactDetails";
export default function CompleteFlightOrderPage() {
    const { singleFlightDetails, flightAncillaries } = useSelector(
        (state) => state.flightOrder
    );
    const { jwtToken } = useSelector((state) => state.admin);
    const [isLoading, setIsLoading] = useState(false);
    const { tbId, resellerId } = useParams();
    const [showContacts, setShowContacts] = useState(false);
    const [prices, setPrices] = useState({
        totalSeatPrice: 0,
        totalMealPrice: 0,
        totalBaggagePrice: 0,
        totalPrice: 0,
    });
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const fetchAncillariesData = async () => {
        try {
            const response = await axios.get(
                `/orders/flight/details/${tbId}/ancillaries/${resellerId}`,
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
            const response = await axios.get(
                `/orders/flight/details/${tbId}/${resellerId}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

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

    useEffect(() => {
        return () => dispatch(clearAllData());
    }, []);

    useEffect(() => {
        let totalSeatPrice = 0;
        let totalBaggagePrice = 0;
        let totalMealPrice = 0;
        let totalPrice = 0;

        if (flightAncillaries?.seatSsr) {
            for (const seatSsr of flightAncillaries?.seatSsr) {

                if (seatSsr && seatSsr?.selectedSeats) {
                    for (const seat of seatSsr?.selectedSeats) {
                        totalSeatPrice += Number(seat?.price) || 0;
                    }
                }
            }
        }
        if (flightAncillaries?.baggageSsr) {
            for (const baggageSsr of flightAncillaries?.baggageSsr) {

                if (baggageSsr && baggageSsr?.selectedBaggage) {
                    for (const baggage of baggageSsr?.selectedBaggage) {
                        totalBaggagePrice +=
                            Number(baggage?.price) * Number(baggage?.count) ||
                            0;
                    }
                }
            }
        }

        if (flightAncillaries?.mealsSsr) {
            for (const mealsSsr of flightAncillaries?.mealsSsr) {

                if (mealsSsr && mealsSsr?.selectedMeals) {
                    for (const meal of mealsSsr?.selectedMeals) {
                        totalMealPrice +=
                            Number(meal?.price) * Number(meal?.count) || 0;
                    }
                }
            }
        }

        totalPrice =
            Number(totalSeatPrice) +
            Number(totalMealPrice) +
            Number(totalBaggagePrice) +
            Number(singleFlightDetails?.netFare);

        setPrices({
            totalSeatPrice,
            totalMealPrice,
            totalBaggagePrice,
            totalPrice,
        });

       
    }, [flightAncillaries]);

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
                <div className="bg-white rounded p-6 shadow-sm flex justify-between ">
                    {singleFlightDetails?.trips ? (
                        <div>
                            {singleFlightDetails?.trips?.map((trip) => {
                                return <FlightItinerary trip={trip} />;
                            })}
                        </div>
                    ) : (
                        <PageLoader />
                    )}
                    {singleFlightDetails?.trips && (
                        <div className="w-[350px]  border p-5 h-[250px]">
                            <div className="w-full  flex flex-col gap-2 ">
                                <div className="flex items-center justify-between ">
                                    <div>Base Fare</div>
                                    <div>{singleFlightDetails.baseFare}</div>
                                </div>{" "}
                                <div className="flex items-center justify-between ">
                                    <div>Tax And Fees </div>
                                    <div>
                                        {Number(singleFlightDetails.totalTax) +
                                            Number(
                                                singleFlightDetails.totalFee
                                            )}
                                    </div>
                                </div>{" "}
                                <div className="flex items-center justify-between ">
                                    <div>Seats</div>
                                    <div>
                                        {Number(prices?.totalSeatPrice || 0)}
                                    </div>
                                </div>{" "}
                                <div className="flex items-center justify-between ">
                                    <div>Baggage</div>
                                    <div>{prices?.totalBaggagePrice}</div>
                                </div>{" "}
                                <div className="flex items-center justify-between ">
                                    <div>Meals</div>
                                    <div>{prices?.totalMealPrice}</div>
                                </div>{" "}
                            </div>{" "}
                            <div className="w-full  border-t-2 pt-5">
                                <div className="flex items-center justify-between ">
                                    <div>Total Price</div>
                                    <div>{prices.totalPrice}</div>
                                </div>{" "}
                            </div>{" "}
                        </div>
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
