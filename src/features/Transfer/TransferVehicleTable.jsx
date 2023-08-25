import React from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

export default function TransferVehicleTable({
    vehicles,
    data,
    setData,
    setVehicles,
}) {
    const deleteExtraRow = (e, id) => {
        console.log(id, "delete");
        setData((prev) => ({
            ...prev,
            vehicles: prev.vehicles.filter((vehicle) => vehicle.vehicle !== id),
        }));
    };

    const addExtraRow = (e, vh) => {
        const existingVehicleIndex = data.vehicles.findIndex(
            (vehicle) => vehicle.vehicle === vh._id
        );

        if (existingVehicleIndex !== -1) {
            const updatedVehicles = [...data.vehicles];
            updatedVehicles[existingVehicleIndex].price = vh.price;

            setData((prev) => ({
                ...prev,
                vehicles: updatedVehicles,
            }));
        } else {
            console.log("Adding", vh);
            setData((prev) => ({
                ...prev,
                vehicles: [
                    ...prev.vehicles,
                    { vehicle: vh._id, price: vh.price },
                ],
            }));
        }
    };

    const handleChange = (e, vh) => {
        const existingVehIndex = vehicles.findIndex(
            (vehicle) => vehicle._id === vh._id
        );

        if (existingVehIndex !== -1) {
            console.log(vh, "vhkkkkk");
            const updatedVehicles = [...vehicles];
            updatedVehicles[existingVehIndex].price = e.target.value;

            setVehicles(updatedVehicles);
        }

        const existingVehicleIndex = data.vehicles.findIndex(
            (vehicle) => vehicle.vehicle === vh._id
        );

        if (existingVehicleIndex !== -1) {
            const updatedVehicles = [...data.vehicles];
            updatedVehicles[existingVehicleIndex].price = vh.price;

            setData((prev) => ({
                ...prev,
                vehicles: updatedVehicles,
            }));
        }
    };

    return (
        <div className="mt-4">
            <h2 className="font-medium mb-2 underline">Add Price</h2>
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
                            {/* <th className="font-[500] p-2 border">
                                {data.transferType === "city-city"
                                    ? "Normal Occupancy"
                                    : "Airport Occupancy"}
                            </th> */}

                            <th className="font-[500] p-2 border">Price</th>
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
                                        {data.vehicles.find(
                                            (vh) => vh.vehicle === vehicle._id
                                        ) ? (
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
                                                <AiOutlineCheck className="flex justify-center items-center " />
                                            </button>
                                        ) : (
                                            <button
                                                className="w-[25px] h-[25px] rounded-full bg-red-500 flex justify-center items-center"
                                                onClick={(e) => {
                                                    addExtraRow(e, vehicle);
                                                }}
                                                type="button"
                                            >
                                                {" "}
                                                <RxCross1 className="flex justify-center items-center" />
                                            </button>
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
                                {/* {data.transferType === "city-city" ? (
                                    <td className="border w-[400px] min-w-[400px]">
                                        <input
                                            type="text"
                                            name="tourName"
                                            value={
                                                vehicle?.normalOccupancy || ""
                                            }
                                            className="h-[100%]  px-2 border-0"
                                            disabled
                                        />
                                    </td>
                                ) : (
                                    <td className="border w-[400px] min-w-[400px]">
                                        <input
                                            type="text"
                                            name="tourName"
                                            value={
                                                vehicle?.airportOccupancy || ""
                                            }
                                            className="h-[100%]  px-2 border-0"
                                            disabled
                                        />
                                    </td>
                                )} */}

                                <td>
                                    <input
                                        type="number"
                                        name="price"
                                        value={
                                            data.vehicles.find(
                                                (vh) =>
                                                    vh.vehicle == vehicle._id
                                            )?.price || ""
                                        }
                                        required={data.vehicles.find(
                                            (vh) => vh.vehicle === vehicle._id
                                        )}
                                        onChange={(e) =>
                                            handleChange(e, vehicle)
                                        }
                                        disabled={
                                            !data.vehicles.find(
                                                (vh) =>
                                                    vh.vehicle === vehicle._id
                                            )
                                        }
                                        className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
