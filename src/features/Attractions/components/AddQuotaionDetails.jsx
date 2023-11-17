import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import QuotationPricingTransferTable from "./QuotationPricingTransferTable";

import QuotationTransferTable from "./QuotationTransferTable";
import QuotationVehiclePricingTable from "./QuotationVehiclePricngTable";
import QuotationPricingTable from "./QuotatoinPricingTable";

export default function AddQuotationDetails({}) {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [data, setData] = useState({
        isQuotation: true,
        isCarousel: true,
        carouselPosition: "",
        excursionType: "transfer",
    });
    const [seasons, setSeasons] = useState([]);

    const { id, activityId } = useParams();

    const [ticketPrice, setTicketPrice] = useState([]);
    const [sicWithTicket, setSicWithTicket] = useState([]);
    const [privateTransfer, setPrivateTransfer] = useState([]);
    const [sicPrice, setSicPrice] = useState([]);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleDataChange = (e, name) => {
        setData((prev) => ({
            ...prev,
            [name]: {
                ...prev[name],
                [e.target.name]: e.target.value,
            },
        }));
    };

    const submitHandler = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            await axios.patch(
                `/quotations/excursion/update/${activityId}`,
                {
                    ...data,
                    ticketPrice,
                    sicWithTicket,
                    privateTransfer,
                    sicPrice,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(true);
            setError("");

            navigate(-1);

            // navigate("/attractions");
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.error || "something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await axios.get(`/transfer/veh/all`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setVehicles(
                response.data.map((vh) => {
                    return {
                        ...vh,
                        price: 0,
                    };
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    const fetchSeasons = async () => {
        try {
            const response = await axios.get(`/season/all`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setSeasons(response.data.seasons);
        } catch (err) {}
    };

    const fetchQuoatationData = async () => {
        try {
            const response = await axios.get(
                `/quotations/excursion/single/${activityId}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const {
                excursionType,
                isQuotation,
                isCarousel,
                carouselPosition,
                ticketPricing,
                transferPricing,
            } = response.data;

            setData({
                excursionType,
                isQuotation,
                isCarousel,
                carouselPosition,
            });

            setTicketPrice(ticketPricing?.ticketPrice || []);

            setSicWithTicket(ticketPricing?.sicWithTicket || []);
            setSicPrice(transferPricing?.sicPrice || []);
            if (excursionType === "ticket") {
                setPrivateTransfer(ticketPricing.privateTransfer || []);
            } else if (excursionType === "transfer") {
                setPrivateTransfer(transferPricing.privateTransfer || []);
            }
        } catch (err) {}
    };

    useEffect(() => {
        fetchVehicles();
        fetchQuoatationData();
        fetchSeasons();
    }, []);

    return (
        <div className="">
            <div className="bg-white rounded p-6 shadow-sm">
                <form>
                    <div className="flex items-center gap-[10px] pb-6">
                        <input
                            type="checkbox"
                            name="isQuotation"
                            checked={data?.isQuotation || false}
                            onChange={(e) => {
                                setData((prev) => {
                                    return {
                                        ...prev,
                                        isQuotation: e.target.checked,
                                    };
                                });
                            }}
                            className="w-[17px] h-[17px]"
                            id="isQuotation"
                        />
                        <label
                            htmlFor="isQuotation"
                            className="mb-0 font-[600px]"
                        >
                            Do you need to add this activity to quotation ??
                        </label>
                    </div>
                    <div>
                        <div className="flex items-center gap-[10px] pb-6">
                            <input
                                type="checkbox"
                                name="isCarousel"
                                checked={data?.isCarousel || false}
                                onChange={(e) => {
                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            isCarousel: e.target.checked,
                                        };
                                    });
                                }}
                                className="w-[17px] h-[17px]"
                                id="isCarousel"
                            />

                            <label
                                htmlFor="isCarousel"
                                className="mb-0 font-[600px]"
                            >
                                Do you need to add this to carousel ??
                            </label>
                        </div>
                        {data.isCarousel && (
                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <div className="price mb-5">
                                    <label htmlFor="input-price">
                                        Carousel Position{" "}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter position of carousel"
                                        id="input-price"
                                        name="carouselPosition"
                                        value={data?.carouselPosition || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {data?.isQuotation ? (
                        <>
                            <h1 className="text-[16px] py-2 font-[600] underline pb-4">
                                Select Excursion Type
                            </h1>

                            <div className="grid grid-cols-3 gap-4 mb-5">
                                <div>
                                    <label htmlFor="input-descriptions">
                                        Excursion Type
                                    </label>
                                    <select
                                        className="w-full"
                                        name="excursionType"
                                        onChange={(e) => {
                                            setData((prev) => {
                                                return {
                                                    ...prev,
                                                    excursionType:
                                                        e.target.value,
                                                };
                                            });
                                        }}
                                        value={data.excursionType}
                                        required
                                    >
                                        <option value={"transfer"}>
                                            Transfer
                                        </option>
                                        <option value={"ticket"}>Ticket</option>
                                        {/* <option value={"regular"}>Regular</option> */}
                                    </select>
                                </div>
                            </div>
                            {data.excursionType === "transfer" && (
                                <>
                                    <h1 className="text-[16px] py-2 font-[600] underline pb-4">
                                        Shared Transfer Price
                                    </h1>
                                    <QuotationPricingTransferTable
                                        setPricing={setSicPrice}
                                        pricing={sicPrice}
                                        seasons={seasons}
                                    />
                                </>
                            )}

                            {data.excursionType === "ticket" && (
                                <>
                                    <h1 className="text-[16px] py-2 font-[600] underline pb-4">
                                        Ticket Price
                                    </h1>
                                    <QuotationPricingTable
                                        setPricing={setTicketPrice}
                                        pricing={ticketPrice}
                                        seasons={seasons}
                                    />

                                    <h1 className="text-[16px] py-2 font-[600] underline  pb-4">
                                        Shared Transfer With Ticket Price
                                    </h1>
                                    <QuotationPricingTable
                                        setPricing={setSicWithTicket}
                                        pricing={sicWithTicket}
                                        seasons={seasons}
                                    />
                                </>
                            )}

                            <h1 className="text-[16px] py-2 font-[600] underline pb-4">
                                Private Transfer Price
                            </h1>

                            <QuotationVehiclePricingTable
                                vehicles={vehicles}
                                pricing={privateTransfer}
                                setPricing={setPrivateTransfer}
                                seasons={seasons}

                                // setVehicles={setVehicles}
                                // data={data}
                                // setData={setData}
                            />
                        </>
                    ) : (
                        ""
                    )}

                    {error && (
                        <span className="text-sm block text-red-500 mt-2">
                            {error}
                        </span>
                    )}
                    <div className="mt-4 flex items-center justify-end gap-[12px]">
                        <button
                            className="bg-slate-300 text-textColor px-[15px]"
                            type="button"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                        {isLoading ? (
                            <button className="w-[170px]">
                                <BtnLoader />
                            </button>
                        ) : (
                            <button
                                className="w-[170px]"
                                onClick={(e) => {
                                    submitHandler(e);
                                }}
                            >
                                Update Quotation
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
