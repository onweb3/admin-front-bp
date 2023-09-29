import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";

import {
    addExcSupplement,
    changeExcSupplementPerPersonPrice,
    changeExcSupplementTransferData,
    changeExcSupplementType,
    removeSelectedExcSupplement,
    updateSupplVehicleTransfer,
} from "../../redux/slices/quotationSlice";

export default function SingleExcSupplement({
    excursion,
    excSupplementTransferType,
}) {
    const [globalExcursion, setGlobalExcursion] = useState({});

    const {
        selectedExcSupplementIds,
        excursions,
        checkInDate,
        noOfAdults,
        noOfChildren,
    } = useSelector((state) => state.quotations);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { jwtToken } = useSelector((state) => state.admin);
    const [vehicles, setVehicles] = useState([]);

    const dispatch = useDispatch();
    useEffect(() => {
        const selectedExc = excursions.find(
            (obj) => obj?.activityId === excursion?.excursionId
        );
        setGlobalExcursion(selectedExc);
    }, [excursions, excursion.excursionId]);

    const onTransferChange = async (type) => {
        try {
            console.log("type ", type);
            if (type === "private" || excSupplementTransferType === "private") {
                console.log("type ", type);

                setIsLoading(true);
                setError("");

                console.log("Fetching vehicles");
                const response = await axios.post(
                    "/quotations/inital/transfer/excursion",
                    {
                        excursionId: excursion.excursionId,
                        noOfPax: noOfAdults + noOfChildren,
                        date: checkInDate,
                    },
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                setVehicles(response?.data);
                dispatch(
                    updateSupplVehicleTransfer({
                        excursionId: excursion.excursionId,
                        vehicleType: response.data,
                    })
                );

                setIsLoading(false);
            }
        } catch (err) {
            setIsLoading(false);
            setError(
                err?.response?.data?.error ||
                    "Something went wrong! try again.."
            );
            console.log(err);
        }
    };

    useEffect(() => {
        onTransferChange(excursion?.value);
    }, [excSupplementTransferType, excursion?.value]);

    console.log(excursion, "excursion");

    useEffect(() => {
        if (
            excursion &&
            excursion.value &&
            globalExcursion &&
            Object.keys(globalExcursion)?.length > 0
        ) {
            let totalPax =
                (!isNaN(noOfAdults) ? Number(noOfAdults) : 0) +
                (!isNaN(noOfChildren) ? Number(noOfChildren) : 0);

            let calculatedAdultPrice = 0;
            let calculatedChildPrice = 0;

            if (excursion?.excursionType === "transfer") {
                if (excursion?.value === "private") {
                    let totalPvtTransferPrice = 0;

                    for (let i = 0; i < excursion?.vehicleType?.length; i++) {
                        let vehicleType = excursion?.vehicleType[i];
                        totalPvtTransferPrice +=
                            vehicleType?.price * vehicleType?.count;
                    }
                    let divVal = 1;

                    divVal = totalPax;

                    calculatedAdultPrice = totalPvtTransferPrice / divVal;
                    calculatedChildPrice = totalPvtTransferPrice / divVal;
                } else if (excursion?.value === "shared") {
                    calculatedAdultPrice = globalExcursion?.sicPrice?.price;
                    calculatedChildPrice = globalExcursion?.sicPrice?.price;
                }
            } else if (excursion?.excursionType === "ticket") {
                if (excursion?.value === "ticket") {
                    calculatedAdultPrice =
                        globalExcursion?.ticketPrice?.adultPrice;
                    calculatedChildPrice =
                        globalExcursion?.ticketPrice?.childPrice;
                } else if (excursion?.value === "shared") {
                    calculatedAdultPrice =
                        globalExcursion?.sicWithTicket?.adultPrice;
                    calculatedChildPrice =
                        globalExcursion?.sicWithTicket?.childPrice;
                } else if (excursion?.value === "private") {
                    let totalPvtTransferPrice = 0;

                    for (let i = 0; i < excursion?.vehicleType?.length; i++) {
                        let vehicleType = excursion?.vehicleType[i];
                        totalPvtTransferPrice +=
                            vehicleType?.price * vehicleType?.count;
                    }
                    let divVal = 1;

                    divVal = totalPax;

                    let totalPvtPrice = totalPvtTransferPrice / divVal;

                    calculatedAdultPrice =
                        totalPvtPrice +
                        (globalExcursion?.ticketPricing?.adultPrice
                            ? globalExcursion?.ticketPricing?.adultPrice
                            : 0);
                    calculatedChildPrice =
                        totalPvtPrice +
                        (globalExcursion?.ticketPricing?.childPrice
                            ? globalExcursion?.ticketPricing?.childPrice
                            : 0);
                }
            }

            dispatch(
                changeExcSupplementPerPersonPrice({
                    _id: excursion?.excursionId,
                    perPersonAdultPrice: calculatedAdultPrice,
                    perPersonChildPrice: calculatedChildPrice,
                })
            );
        }
    }, [excursion.value, noOfAdults, noOfChildren, globalExcursion, vehicles]);

    return (
        <div className="mb-6 bg-[#f6f6f6] p-4">
            <div className="flex items-start gap-[10px] ">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px] min-w-[16px] min-h-[16px] mt-[4px]"
                    onChange={() => {
                        if (
                            selectedExcSupplementIds?.includes(
                                excursion?.excursionId
                            )
                        ) {
                            dispatch(
                                removeSelectedExcSupplement(
                                    excursion?.excursionId
                                )
                            );
                        } else {
                            dispatch(addExcSupplement({ excursion }));
                        }
                    }}
                    checked={selectedExcSupplementIds?.includes(
                        excursion?.excursionId
                    )}
                />

                <label htmlFor="" className="mb-0 font-[500]">
                    {excursion?.excursionName} -{" "}
                    <span className="capitalize text-orange-500 leading-[24px]">
                        {excursion?.excursionType === "ticket"
                            ? "Ticket With Transfer"
                            : excursion?.excursionType}
                    </span>
                    {excursion?.excursionType === "regular" &&
                        " - " + excursion?.prices?.price1 + " AED"}
                </label>
            </div>

            {excursion?.excursionType !== "regular" && (
                <div className="flex items-center gap-4 flex-wrap mt-4">
                    {excursion?.excursionType === "transfer" && (
                        <select
                            className="w-full"
                            value={excursion?.value.toLowerCase() || ""}
                            onChange={(e) => {
                                dispatch(
                                    changeExcSupplementType({
                                        value: e.target.value,
                                        _id: excursion?.excursionId,
                                    })
                                );

                                onTransferChange(
                                    excursion?.excursionId,
                                    e.target.value
                                );
                            }}
                        >
                            <option value="" hidden>
                                Select Type
                            </option>
                            {globalExcursion?.sicPrice && (
                                <option value="shared">Shared</option>
                            )}

                            {globalExcursion?.privateTransfer?.vehicleType
                                .length > 0 && (
                                <option value="private">Private</option>
                            )}
                        </select>
                    )}

                    {excursion?.value?.toLowerCase() === "private" &&
                        excursion?.excursionType?.toLowerCase() ===
                            "transfer" &&
                        (isLoading ? (
                            "Loading..."
                        ) : (
                            <div className="grid grid-cols-2 gap-[1.5em] w-full">
                                {globalExcursion?.privateTransfer?.vehicleType?.map(
                                    (vehTY) => (
                                        <div>
                                            <div className="flex items-center gap-[10px]">
                                                <input
                                                    type="checkbox"
                                                    className="w-[16px] h-[16px]"
                                                    name="is7SeaterTransfer"
                                                    checked={
                                                        excursion?.vehicleType?.find(
                                                            (vt) => {
                                                                return (
                                                                    vt?.vehicle?.toString() ===
                                                                    vehTY.vehicle?._id?.toString()
                                                                );
                                                            }
                                                        ) !== undefined || false
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            changeExcSupplementTransferData(
                                                                {
                                                                    name1: "vehicleType",
                                                                    value: vehTY
                                                                        ?.vehicle
                                                                        ?._id,
                                                                    _id: excursion?.excursionId,
                                                                    name2: "vehicle",
                                                                    vehicleId:
                                                                        vehTY
                                                                            ?.vehicle
                                                                            ._id,
                                                                    price: globalExcursion?.privateTransfer?.vehicleType?.find(
                                                                        (
                                                                            vt
                                                                        ) => {
                                                                            return (
                                                                                vt?.vehicle?._id.toString() ===
                                                                                vehTY?.vehicle?._id?.toString()
                                                                            );
                                                                        }
                                                                    ).price,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                />

                                                <label
                                                    htmlFor=""
                                                    className="mb-0"
                                                >
                                                    {vehTY.vehicle.name}
                                                </label>
                                            </div>
                                            {excursion?.vehicleType?.find(
                                                (vt) => {
                                                    return (
                                                        vt?.vehicle?.toString() ===
                                                        vehTY?.vehicle?._id?.toString()
                                                    );
                                                }
                                            ) && (
                                                <select
                                                    type="number"
                                                    className="w-full mt-3"
                                                    name="sevenSeaterCount"
                                                    value={
                                                        excursion?.vehicleType?.find(
                                                            (vt) => {
                                                                return (
                                                                    vt?.vehicle?.toString() ===
                                                                    vehTY?.vehicle?._id?.toString()
                                                                );
                                                            }
                                                        ).count || ""
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            changeExcSupplementTransferData(
                                                                {
                                                                    name1: "vehicleType",
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                    _id: excursion?.excursionId,
                                                                    name2: "count",
                                                                    vehicleId:
                                                                        vehTY
                                                                            ?.vehicle
                                                                            ?._id,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                >
                                                    {Array.from(
                                                        { length: 10 },
                                                        (_, index) => (
                                                            <option
                                                                key={index}
                                                                value={
                                                                    index + 1
                                                                }
                                                            >
                                                                {index + 1}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            )}
                                        </div>
                                    )
                                )}{" "}
                            </div>
                        ))}

                    {/* TICKET TYPE START HERE  */}
                    {excursion?.excursionType?.toLowerCase() === "ticket" && (
                        <div className="flex items-center gap-2 w-full">
                            <select
                                className="w-full"
                                name=""
                                onChange={(e) => {
                                    dispatch(
                                        changeExcSupplementType({
                                            _id: excursion?.excursionId,
                                            value: e.target.value,
                                        })
                                    );

                                    onTransferChange(
                                        excursion?.excursionId,
                                        e.target.value
                                    );
                                }}
                                value={excursion?.value?.toLowerCase() || ""}
                            >
                                <option value="" hidden>
                                    Select Type
                                </option>
                                <option value="ticket">Ticket Only</option>
                                {globalExcursion?.sicWithTicket?.adultPrice && (
                                    <option value="shared">Shared</option>
                                )}
                                {globalExcursion?.privateTransferTicket
                                    ?.vehicleType?.length > 0 && (
                                    <option value="private">Private</option>
                                )}
                            </select>
                        </div>
                    )}
                    {excursion?.value?.toLowerCase() === "private" &&
                        excursion?.excursionType?.toLowerCase() === "ticket" &&
                        (isLoading ? (
                            "Loading..."
                        ) : (
                            <div className="grid grid-cols-2 gap-[1.5em] w-full">
                                {globalExcursion?.privateTransferTicket?.vehicleType?.map(
                                    (vehTY) => (
                                        <div>
                                            <div className="flex items-center gap-[10px]">
                                                <input
                                                    type="checkbox"
                                                    className="w-[16px] h-[16px]"
                                                    name="is7SeaterTransfer"
                                                    checked={
                                                        excursion?.vehicleType?.find(
                                                            (vt) => {
                                                                return (
                                                                    vt?.vehicle?.toString() ===
                                                                    vehTY?.vehicle?._id?.toString()
                                                                );
                                                            }
                                                        ) !== undefined || false
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            changeExcSupplementTransferData(
                                                                {
                                                                    name1: "vehicleType",
                                                                    value: vehTY
                                                                        ?.vehicle
                                                                        ?._id,
                                                                    _id: excursion?.excursionId,
                                                                    name2: "vehicle",
                                                                    vehicleId:
                                                                        vehTY
                                                                            ?.vehicle
                                                                            ?._id,
                                                                    price: globalExcursion?.ticketPricing?.vehicleType?.find(
                                                                        (
                                                                            vt
                                                                        ) => {
                                                                            return (
                                                                                vt?.vehicle?.toString() ===
                                                                                vehTY?.vehicle?._id?.toString()
                                                                            );
                                                                        }
                                                                    ).price,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                />
                                                <label
                                                    htmlFor=""
                                                    className="mb-0"
                                                >
                                                    {vehTY?.vehicle.name}
                                                </label>
                                            </div>
                                            {excursion?.vehicleType.find(
                                                (vt) => {
                                                    return (
                                                        vt?.vehicle?.toString() ===
                                                        vehTY?.vehicle?._id?.toString()
                                                    );
                                                }
                                            ) && (
                                                <select
                                                    type="number"
                                                    className="w-full mt-3"
                                                    name="count"
                                                    value={
                                                        excursion?.vehicleType?.find(
                                                            (vt) => {
                                                                return (
                                                                    vt?.vehicle?.toString() ===
                                                                    vehTY?.vehicle?._id?.toString()
                                                                );
                                                            }
                                                        )?.count || ""
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            changeExcSupplementTransferData(
                                                                {
                                                                    name1: "vehicleType",
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                    _id: excursion?.excursionId,
                                                                    name2: "count",
                                                                    vehicleId:
                                                                        vehTY
                                                                            ?.vehicle
                                                                            ?._id,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                >
                                                    {Array.from(
                                                        { length: 10 },
                                                        (_, index) => (
                                                            <option
                                                                key={index}
                                                                value={
                                                                    index + 1
                                                                }
                                                            >
                                                                {index + 1}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                </div>
            )}
            <div className="mt-5 text-sm grid grid-cols-2">
                <span className="block">
                    Adult Price:{" "}
                    <span className="font-medium">
                        {excursion?.perPersonAdultPrice?.toFixed(2)} AED
                    </span>
                </span>
                <span className="block">
                    Child Price:{" "}
                    <span className="font-medium">
                        {excursion?.perPersonChildPrice?.toFixed(2)} AED
                    </span>
                </span>
            </div>
        </div>
    );
}
