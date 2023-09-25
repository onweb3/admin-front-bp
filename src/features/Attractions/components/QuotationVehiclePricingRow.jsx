import React, { useRef, useState } from "react";
import { useHandleClickOutside } from "../../../hooks";

export default function QuotationVehiclePricingRow({
    price,
    setPricing,
    index,
    vehicles,
}) {
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

                <td className="border w-[75px] min-w-[75px]">
                    <input
                        type="date"
                        name="fromDate"
                        value={price?.fromDate || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="h-[100%] px-2 border-0"
                    />
                </td>
                <td className="border w-[75px] min-w-[75px]">
                    <input
                        type="date"
                        name="toDate"
                        value={price?.toDate || ""}
                        onChange={(e) => handleChange(e, index)}
                        className="h-[100%]  px-2  border-0"
                    />
                </td>
                <td className="border w-[70px] min-w-[70px]">
                    <div className="flex prices-center justify-center">
                        <input
                            type="number"
                            className="h-[100%] arrow-hidden px-2 border-0"
                            value={price?.extraBed}
                            name="extraBed"
                            onChange={(e) =>
                                handleChangeRoomOccupancyInp(e, index)
                            }
                            placeholder="Ex Bed"
                        />
                    </div>
                </td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td colSpan={1}>
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
                            {vehicles?.map((vehcile, vehicleIndex) => {
                                return (
                                    <tr
                                        key={vehicleIndex}
                                        className="border-b border-tableBorderColor"
                                    >
                                        <td className="p-2 border w-[35px] min-w-[35px]">
                                            <div className="flex prices-center justify-center">
                                                <button
                                                    className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                    // onClick={() =>
                                                    //     removeOccupancyCombinationRow(
                                                    //         index,
                                                    //         combinationIndex
                                                    //     )
                                                    // }
                                                    type="button"
                                                >
                                                    -
                                                </button>
                                            </div>
                                        </td>
                                        <td className="border min-w-[100px]">
                                            <input
                                                type="text"
                                                className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                                value={vehcile?.name || ""}
                                                name="childCount"
                                                // onChange={(e) =>
                                                //     handleChangeRoomOccupancyCombInp(
                                                //         e,
                                                //         index,
                                                //         combinationIndex
                                                //     )
                                                // }
                                                placeholder="vehicle name ..."
                                            />
                                        </td>
                                        <td className="border min-w-[100px]">
                                            <input
                                                type="number"
                                                className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                                value={vehcile?.price || ""}
                                                name="adultCount"
                                                // onChange={(e) =>
                                                //     handleChangeRoomOccupancyCombInp(
                                                //         e,
                                                //         index,
                                                //         combinationIndex
                                                //     )
                                                // }
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
