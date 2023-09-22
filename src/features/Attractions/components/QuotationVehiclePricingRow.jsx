import React, { useRef, useState } from "react";
import { useHandleClickOutside } from "../../../hooks";

export default function QuotationVehiclePricingRow({
    price,
    setPricing,
    index,
    vehicles,
    pricing,
    seasons,
}) {
    const [data, setData] = useState("");
    const handleChange = (e, index) => {
        setPricing((prev) => {
            const updatedPricing = [...prev]; // Create a copy of the previous state array
            updatedPricing[index] = {
                ...updatedPricing[index], // Create a copy of the object at the specified index
                [e.target.name]: e.target.value, // Update the specific property with the new value
            };
            return updatedPricing; // Return the updated array as the new state
        });
    };

    const deleteRow = (ind) => {
        setPricing((prev) => {
            // Create a copy of the previous array without the element at the specified index
            const updatedPricing = prev.filter((_, i) => i !== ind);

            return updatedPricing;
        });
    };

    const deleteExtraRow = (e, vehicle) => {
        setPricing((prev) => {
            const updatedPricing = [...prev]; // Create a copy of the previous state array
            const updatedVehicleType = [...prev[index].vehicleType].filter(
                (vh) => vh.vehicle.toString() !== vehicle._id.toString()
            );

            console.log(updatedVehicleType, "updated vehciletype");

            updatedPricing[index] = {
                ...updatedPricing[index], // Create a copy of the object at the specified index
                vehicleType: updatedVehicleType, // Update the specific property with the new value
            };

            return updatedPricing;
        });
    };

    const addExtraRow = (e, vh) => {
        try {
            console.log(vh?._id, "vhkkkkk", price);

            const existingVehicleIndex = pricing[index]?.vehicleType?.findIndex(
                (vt) => vt?.vehicle.toString() === vh?._id?.toString()
            );

            console.log(existingVehicleIndex, "vehicle");

            if (
                existingVehicleIndex !== -1 &&
                existingVehicleIndex !== undefined
            ) {
                const updatedVehicles = [...price?.vehicleType] || [];
                updatedVehicles[existingVehicleIndex].price = 0;

                setPricing((prev) => {
                    const updatedPricing = [...prev]; // Create a copy of the previous state array
                    updatedPricing[index] = {
                        ...updatedPricing[index], // Create a copy of the object at the specified index
                        vehicleType: updatedVehicles, // Update the specific property with the new value
                    };
                    return updatedPricing; // Return the updated array as the new state
                });
            } else {
                setPricing((prev) => {
                    const updatedPricing = [...prev]; // Create a copy of the previous state array
                    updatedPricing[index] = {
                        ...updatedPricing[index], // Create a copy of the object at the specified index
                        vehicleType: [
                            ...updatedPricing[index].vehicleType,
                            {
                                vehicle: vh._id,
                                price: 0,
                            },
                            // Update the specific property with the new value
                        ],
                    };
                    return updatedPricing; // Return the updated array as the new state
                });
            }
        } catch (e) {
            console.log("error", e);
        }
    };

    const handleVehicleChange = (e, index, vh) => {
        const existingVehicleIndex = price?.vehicleType?.findIndex(
            (vehicle) => vehicle?.vehicle === vh?._id
        );

        console.log(existingVehicleIndex, "existingVehicleIndex");
        if (existingVehicleIndex !== -1) {
            const updatedVehicles = [...price?.vehicleType];

            updatedVehicles[existingVehicleIndex].price = e.target.value;

            setPricing((prev) => {
                const updatedPricing = [...prev]; // Create a copy of the previous state array
                updatedPricing[index] = {
                    ...updatedPricing[index], // Create a copy of the object at the specified index
                    vehicleType: updatedVehicles, // Update the specific property with the new value
                };
                return updatedPricing; // Return the updated array as the new state
            });
        }
    };

    function formatDate(dateString) {
        console.log(dateString, "date string");
        const date = new Date(dateString);

        console.log(date, "date");
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        console.log(formattedDate, "formatted date");
        return formattedDate;
    }
    const handleSeasonChange = (e, index) => {
        const selectedSeason = seasons.find(
            (season) => season._id.toString() === e.target.value.toString()
        );

        if (selectedSeason) {
            setPricing((prev) => {
                const updatedPricing = [...prev]; // Create a copy of the previous state array
                updatedPricing[index] = {
                    ...updatedPricing[index], // Create a copy of the object at the specified index
                    fromDate: formatDate(selectedSeason.fromDate),
                    toDate: formatDate(selectedSeason.toDate),
                };
                return updatedPricing; // Return the updated array as the new state
            });
        }

        setData(selectedSeason._id);
    };

    return (
        <React.Fragment>
            <tr className="border-b border-tableBorderColor">
                <td className="p-2 border w-[35px] min-w-[35px]">
                    <div className="flex prices-center justify-center">
                        <button
                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                            onClick={() => deleteRow(index)}
                            type="button"
                        >
                            -
                        </button>
                    </div>
                </td>
                <td className="p-2 border w-[35px] min-w-[35px]">
                    <select
                        name="country"
                        value={data || ""}
                        onChange={(e) => handleSeasonChange(e, index)}
                        id=""
                        required
                        className="capitalize"
                    >
                        <option value="" hidden>
                            Select Season
                        </option>
                        {seasons?.map((season, index) => {
                            return (
                                <option
                                    value={season?._id}
                                    key={index}
                                    className="capitalize"
                                >
                                    {season?.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
                <td className="border w-[75px] min-w-[75px]">
                    <input
                        type="date"
                        name="fromDate"
                        value={formatDate(price?.fromDate) || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="h-[100%] px-2 border-0"
                    />
                </td>
                <td className="border w-[75px] min-w-[75px]">
                    <input
                        type="date"
                        name="toDate"
                        value={formatDate(price?.toDate) || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="h-[100%]  px-2  border-0"
                    />
                </td>
                <td className="border w-[70px] min-w-[70px]"></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={4}>
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                            <tr>
                                <th className="p-2 border w-[35px]">
                                    <div className="flex prices-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-green-500"
                                            // onClick={() =>
                                            //     addOccupancyCombinationRow(
                                            //         index
                                            //     )
                                            // }
                                            type="button"
                                        >
                                            +
                                        </button>
                                    </div>
                                </th>
                                <th className="font-[500] p-2 border">
                                    Vehicle Name
                                </th>
                                <th className="font-[500] p-2 border">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles?.map((vehicle, vehicleIndex) => {
                                return (
                                    <tr
                                        key={vehicleIndex}
                                        className="border-b border-tableBorderColor"
                                    >
                                        <td className="p-2 border w-[35px] min-w-[35px]">
                                            <div className="flex prices-center justify-center">
                                                {price?.vehicleType?.find(
                                                    (vh) =>
                                                        vh?.vehicle ===
                                                        vehicle?._id
                                                ) !== undefined ? (
                                                    <button
                                                        className="w-[25px] h-[25px] rounded-full bg-green-500"
                                                        onClick={(e) =>
                                                            deleteExtraRow(
                                                                e,
                                                                vehicle
                                                            )
                                                        }
                                                        type="button"
                                                    >
                                                        +
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                        onClick={(e) =>
                                                            addExtraRow(
                                                                e,
                                                                vehicle
                                                            )
                                                        }
                                                        type="button"
                                                    >
                                                        -
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="border min-w-[100px]">
                                            <input
                                                type="text"
                                                className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                                value={vehicle?.name || ""}
                                                name="vehicle"
                                                onChange={(e) =>
                                                    handleVehicleChange(
                                                        e,
                                                        index,
                                                        vehicle
                                                    )
                                                }
                                                placeholder="vehicle name ..."
                                            />
                                        </td>
                                        <td className="border min-w-[100px]">
                                            <input
                                                type="number"
                                                className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                                value={
                                                    price?.vehicleType?.find(
                                                        (vh) =>
                                                            vh?.vehicle ===
                                                            vehicle?._id
                                                    )?.price
                                                }
                                                name="price"
                                                onChange={(e) =>
                                                    handleVehicleChange(
                                                        e,
                                                        index,
                                                        vehicle
                                                    )
                                                }
                                                placeholder="0"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr className="last:hidden">
                <td colSpan={8} className="p-2 border-b-4"></td>
            </tr>
        </React.Fragment>
    );
}
