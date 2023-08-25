import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";

import {
    addExcusrsion,
    changeExcursionPerPersonPrice,
    changeExcursionTransferData,
    changeExcursionType,
    removeSelectedExcursion,
    updateVehicleTransfer,
} from "../../redux/slices/quotationSlice";

export default function SingleExcursion({ excursion, excursionTransferType }) {
    const [globalExcursion, setGlobalExcursion] = useState({});

    const {
        selectedExcursionsIds,
        selectedExcursions,
        excursions,
        noOfAdults,
        noOfChildren,
    } = useSelector((state) => state.quotations);

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { jwtToken } = useSelector((state) => state.admin);
    const [vehicles, setVehicles] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        const objIndex = excursions.findIndex(
            (obj) => obj?._id === excursion?.excursionId
        );
        setGlobalExcursion(excursions[objIndex]);
    }, [excursions, excursion.excursionId]);

    console.log(excursionTransferType, "excursionTransferType");

    const onTransferChange = async (excursionId, type) => {
        try {
            console.log("type ", type);
            if (
                type === "private" ||
                excursionTransferType === "private" ||
                (excursionTransferType === "all" &&
                    excursion.excursionType === "transfer")
            ) {
                console.log("type ", type);

                setIsLoading(true);
                setError("");

                console.log("Fetching vehicles");
                const response = await axios.post(
                    "/quotations/inital/transfer/excursion",
                    {
                        excursionId: excursion.excursionId,
                        noOfPax: noOfAdults + noOfChildren,
                    },
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                setVehicles(response?.data);
                dispatch(
                    updateVehicleTransfer({
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
        onTransferChange({ type: "private" });
    }, [excursionTransferType]);

    return (
        <div className="mb-6 bg-[#f6f6f6] p-4">
            <div className="flex items-start gap-[10px] ">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px] min-w-[16px] min-h-[16px] mt-[4px]"
                    onChange={() => {
                        if (
                            selectedExcursionsIds?.includes(
                                excursion?.excursionId
                            )
                        ) {
                            dispatch(
                                removeSelectedExcursion(excursion?.excursionId)
                            );
                        } else {
                            dispatch(addExcusrsion({ excursion }));
                        }
                    }}
                    checked={selectedExcursionsIds?.includes(
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
                                    changeExcursionType({
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
                            {globalExcursion?.transferPricing?.sicPrice && (
                                <option value="shared">Shared</option>
                            )}

                            {globalExcursion?.transferVehicleType?.length >
                                0 && <option value="private">Private</option>}
                        </select>
                    )}

                    {excursion?.value?.toLowerCase() === "private" &&
                        excursion?.excursionType?.toLowerCase() ===
                            "transfer" &&
                        (isLoading ? (
                            "Loading..."
                        ) : (
                            <div className="grid grid-cols-2 gap-[1.5em] w-full">
                                {globalExcursion?.transferVehicleType?.map(
                                    (vehicle) => (
                                        <div key={vehicle?._id}>
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
                                                                    vehicle?._id?.toString()
                                                                );
                                                            }
                                                        ) !== undefined || false
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            changeExcursionTransferData(
                                                                {
                                                                    name1: "vehicleType",
                                                                    value: vehicle._id,
                                                                    _id: excursion.excursionId,
                                                                    name2: "vehicle",
                                                                    vehicleId:
                                                                        vehicle._id,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                />
                                                <label
                                                    htmlFor="is7SeaterTransfer"
                                                    className="mb-0"
                                                >
                                                    {vehicle.name}
                                                </label>
                                            </div>
                                            {excursion?.vehicleType?.find(
                                                (vt) => {
                                                    return (
                                                        vt?.vehicle?.toString() ===
                                                        vehicle?._id?.toString()
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
                                                                    vehicle?._id?.toString()
                                                                );
                                                            }
                                                        ).count || ""
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            changeExcursionTransferData(
                                                                {
                                                                    name1: "vehicleType",
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                    _id: excursion?.excursionId,
                                                                    name2: "count",
                                                                    vehicleId:
                                                                        vehicle?._id,
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

                    {/* TICKET TYPE START HERE  */}
                    {excursion?.excursionType?.toLowerCase() === "ticket" && (
                        <div className="flex items-center gap-2 w-full">
                            <select
                                className="w-full"
                                name=""
                                onChange={(e) => {
                                    dispatch(
                                        changeExcursionType({
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
                                {globalExcursion?.ticketPricing
                                    ?.sicWithTicketAdultPrice && (
                                    <option value="shared">Shared</option>
                                )}
                                {globalExcursion?.ticketVehicleType?.length >
                                    0 && (
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
                                {globalExcursion?.ticketVehicleType?.map(
                                    (vehicle) => (
                                        <div key={vehicle?._id}>
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
                                                                    vehicle?._id?.toString()
                                                                );
                                                            }
                                                        ) !== undefined || false
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            changeExcursionTransferData(
                                                                {
                                                                    name1: "vehicleType",
                                                                    value: vehicle?._id,
                                                                    _id: excursion?.excursionId,
                                                                    name2: "vehicle",
                                                                    vehicleId:
                                                                        vehicle?._id,
                                                                }
                                                            )
                                                        );
                                                    }}
                                                />
                                                <label
                                                    htmlFor="is7SeaterTransfer"
                                                    className="mb-0"
                                                >
                                                    {vehicle?.name}
                                                </label>
                                            </div>
                                            {excursion?.vehicleType?.find(
                                                (vt) => {
                                                    return (
                                                        vt?.vehicle?.toString() ===
                                                        vehicle?._id?.toString()
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
                                                                    vehicle?._id.toString()
                                                                );
                                                            }
                                                        )?.count || ""
                                                    }
                                                    onChange={(e) => {
                                                        dispatch(
                                                            changeExcursionTransferData(
                                                                {
                                                                    name1: "vehicleType",
                                                                    value: e
                                                                        .target
                                                                        .value,
                                                                    _id: excursion?.excursionId,
                                                                    name2: "count",
                                                                    vehicleId:
                                                                        vehicle?._id,
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
        </div>
    );
}
