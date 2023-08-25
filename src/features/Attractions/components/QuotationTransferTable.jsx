import React from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

export default function QuotationTransferTable({
    vehicles,
    setVehicles,
    data,
    setData,
}) {
    const deleteExtraRow = (e, id) => {
        if (data?.qtnActivityType === "ticket") {
            setData((prev) => ({
                ...prev,
                ticketPricing: {
                    ...prev.ticketPricing,
                    vehicleType: prev.ticketPricing.vehicleType.filter(
                        (vehicle) => vehicle.vehicle !== id
                    ),
                },
            }));
        } else {
            setData((prev) => ({
                ...prev,
                transferPricing: {
                    ...prev?.transferPricing,
                    vehicleType: prev?.transferPricing?.vehicleType.filter(
                        (vehicle) => vehicle?.vehicle !== id
                    ),
                },
            }));
        }
    };

    const addExtraRow = (e, vh) => {
        try {
            console.log("vhkkkkk");

            if (data.qtnActivityType === "ticket") {
                const existingVehicleIndex =
                    data?.ticketPricing?.vehicleType.findIndex(
                        (vehicle) => vehicle.vehicle === vh._id
                    );

                console.log(existingVehicleIndex, "vehicle");

                if (
                    existingVehicleIndex !== -1 &&
                    existingVehicleIndex !== undefined
                ) {
                    console.log("vhkkkkkqqqq");

                    const updatedVehicles =
                        [...data?.ticketPricing?.vehicleType] || [];
                    updatedVehicles[existingVehicleIndex].price = 0;

                    setData((prev) => ({
                        ...prev,
                        vehicles: updatedVehicles,
                    }));
                } else {
                    setData((prev) => ({
                        ...prev,
                        ticketPricing: {
                            ...(prev?.ticketPricing ?? {}),
                            vehicleType: [
                                ...(prev?.ticketPricing?.vehicleType ?? []),
                                {
                                    vehicle: vh?._id,
                                    price: 0,
                                },
                            ],
                        },
                    }));
                }
            } else {
                const existingVehicleIndex =
                    data?.transferPricing?.vehicleType.findIndex(
                        (vehicle) => vehicle.vehicle === vh._id
                    );

                if (existingVehicleIndex !== -1) {
                    const updatedVehicles = [
                        ...data?.transferPricing?.vehicleType,
                    ];
                    updatedVehicles[existingVehicleIndex].price = 0;

                    setData((prev) => ({
                        ...prev,
                        vehicles: updatedVehicles,
                    }));
                } else {
                    console.log("Adding", vh);
                    setData((prev) => ({
                        ...prev,
                        transferPricing: {
                            ...prev?.transferPricing,
                            vehicleType: [
                                ...prev?.transferPricing?.vehicleType,
                                {
                                    vehicle: vh._id,
                                    price: 0,
                                },
                            ],
                        },
                    }));
                }
            }
        } catch (e) {
            console.log("error", e);
        }
    };

    const handleChange = (e, vh) => {
        const existingVehIndex = vehicles.findIndex(
            (vehicle) => vehicle._id === vh._id
        );

        if (existingVehIndex !== -1) {
            const updatedVehicles = [...vehicles];
            updatedVehicles[existingVehIndex][e.target.name] = e.target.value;

            setVehicles(updatedVehicles);
        }
        if (data.qtnActivityType === "ticket") {
            const existingVehicleIndex =
                data.ticketPricing.vehicleType.findIndex(
                    (vehicle) => vehicle.vehicle === vh._id
                );
            if (existingVehicleIndex !== -1) {
                const updatedVehicles = [...data.ticketPricing.vehicleType];

                updatedVehicles[existingVehicleIndex][e.target.name] =
                    e.target.value;

                setData((prev) => ({
                    ...prev,
                    ticketPricing: {
                        ...prev.ticketPricing,
                        vehicleType: updatedVehicles,
                    },
                }));
            }
        } else {
            const existingVehicleIndex =
                data.transferPricing.vehicleType.findIndex(
                    (vehicle) => vehicle.vehicle === vh._id
                );
            if (existingVehicleIndex !== -1) {
                const updatedVehicles = [...data.transferPricing.vehicleType];
                updatedVehicles[existingVehicleIndex].price = vh.price;

                setData((prev) => ({
                    ...prev,
                    transferPricing: {
                        ...prev.transferPricing,
                        vehicleType: updatedVehicles,
                    },
                }));
            }
        }
    };

    return (
        <div className="mt-4">
            {/* <h2 className="font-medium mb-2 underline">Add Price</h2> */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            <th className="p-2 border w-[35px]">
                                <div className="flex items-center justify-center">
                                    {/* <button
                                        className="w-[25px] h-[25px] rounded-full bg-green-500"
                                        onClick={addExtraRow}
                                        type="button"
                                    >
                                        +
                                    </button> */}
                                </div>
                            </th>
                            <th className="font-[500] p-2 border">
                                Vehicle Name
                            </th>
                            <th className="font-[500] p-2 border">
                                Normal Occupancy
                            </th>

                            {data.qtnActivityType === "ticket" ? (
                                <>
                                    <th className="font-[500] p-2 border">
                                        Price
                                    </th>
                                </>
                            ) : (
                                <th className="font-[500] p-2 border">Price</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {vehicles.map((vehicle, index) => (
                            <tr
                                key={index}
                                className="border-b border-tableBorderColor"
                            >
                                <td className="p-2 border w-[35px] min-w-[35px]">
                                    <div className="flex items-center justify-center">
                                        {data?.qtnActivityType === "ticket" &&
                                        data?.ticketPricing?.vehicleType ? (
                                            data?.ticketPricing?.vehicleType.find(
                                                (vh) =>
                                                    vh?.vehicle === vehicle?._id
                                            ) !== undefined ? (
                                                <button
                                                    className="w-[25px] h-[25px] rounded-full bg-green-500 flex justify-center items-center"
                                                    onClick={(e) => {
                                                        deleteExtraRow(
                                                            e,
                                                            vehicle._id
                                                        );
                                                    }}
                                                    type="button"
                                                >
                                                    <AiOutlineCheck className="flex justify-center items-center" />
                                                </button>
                                            ) : (
                                                <button
                                                    className="w-[25px] h-[25px] rounded-full bg-red-500 flex justify-center items-center"
                                                    onClick={(e) => {
                                                        addExtraRow(e, vehicle);
                                                    }}
                                                    type="button"
                                                >
                                                    <RxCross1 className="flex justify-center items-center" />
                                                </button>
                                            )
                                        ) : data?.qtnActivityType ===
                                              "transfer" &&
                                          data?.transferPricing?.vehicleType
                                              .length > 0 ? (
                                            data?.transferPricing?.vehicleType.find(
                                                (vh) =>
                                                    vh?.vehicle === vehicle?._id
                                            ) !== undefined ? (
                                                <button
                                                    className="w-[25px] h-[25px] rounded-full bg-green-500 flex justify-center items-center"
                                                    onClick={(e) => {
                                                        deleteExtraRow(
                                                            e,
                                                            vehicle?._id
                                                        );
                                                    }}
                                                    type="button"
                                                >
                                                    <AiOutlineCheck className="flex justify-center items-center" />
                                                </button>
                                            ) : (
                                                <button
                                                    className="w-[25px] h-[25px] rounded-full bg-red-500 flex justify-center items-center"
                                                    onClick={(e) => {
                                                        addExtraRow(e, vehicle);
                                                    }}
                                                    type="button"
                                                >
                                                    <RxCross1 className="flex justify-center items-center" />
                                                </button>
                                            )
                                        ) : (
                                            <button
                                                className="w-[25px] h-[25px] rounded-full"
                                                onClick={(e) => {
                                                    addExtraRow(e, vehicle);
                                                }}
                                                type="button"
                                            ></button>
                                        )}
                                    </div>
                                </td>

                                <td className="border w-[400px] min-w-[400px]">
                                    <input
                                        type="text"
                                        name="tourName"
                                        value={vehicle?.name || ""}
                                        className="h-[100%]  px-2 border-0"
                                        disabled
                                    />
                                </td>

                                <td className="border w-[400px] min-w-[400px]">
                                    <input
                                        type="text"
                                        name="tourName"
                                        value={vehicle?.normalOccupancy || ""}
                                        className="h-[100%]  px-2 border-0"
                                        disabled
                                    />
                                </td>
                                {data?.qtnActivityType === "ticket" ? (
                                    <>
                                        <td>
                                            <input
                                                type="number"
                                                name="price"
                                                value={
                                                    data?.ticketPricing?.vehicleType?.find(
                                                        (vh) =>
                                                            vh.vehicle ==
                                                            vehicle._id
                                                    )?.price || ""
                                                }
                                                required={data?.ticketPricing?.vehicleType?.find(
                                                    (vh) =>
                                                        vh.vehicle ===
                                                        vehicle._id
                                                )}
                                                onChange={(e) =>
                                                    handleChange(e, vehicle)
                                                }
                                                disabled={
                                                    !data?.ticketPricing?.vehicleType?.find(
                                                        (vh) =>
                                                            vh.vehicle ===
                                                            vehicle._id
                                                    )
                                                }
                                                className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                            />
                                        </td>
                                    </>
                                ) : (
                                    <td>
                                        <input
                                            type="number"
                                            name="price"
                                            value={
                                                data?.transferPricing?.vehicleType.find(
                                                    (vh) =>
                                                        vh.vehicle ==
                                                        vehicle._id
                                                )?.price || ""
                                            }
                                            required={data?.transferPricing?.vehicleType?.find(
                                                (vh) =>
                                                    vh.vehicle === vehicle._id
                                            )}
                                            onChange={(e) =>
                                                handleChange(e, vehicle)
                                            }
                                            disabled={
                                                !data?.transferPricing?.vehicleType?.find(
                                                    (vh) =>
                                                        vh.vehicle ===
                                                        vehicle._id
                                                )
                                            }
                                            className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                        />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
