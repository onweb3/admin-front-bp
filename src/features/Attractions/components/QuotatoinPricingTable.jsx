import React from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

export default function QuotationPricingTable({ setPricing, pricing }) {
    const addNewRow = (e) => {
        e.preventDefault();
        setPricing((prev) => [
            ...prev,
            {
                fromDate: "",
                toDate: "",
                adultPrice: "",
                childPrice: "",
            },
        ]);
    };

    const deleteRow = (e, index) => {
        e.preventDefault();

        setPricing((prev) => {
            // Create a copy of the previous array without the element at the specified index
            const updatedPricing = prev.filter((_, i) => i !== index);

            return updatedPricing;
        });
    };

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

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                    <tr>
                        <th className="p-2 border w-[35px]">
                            <div className="flex items-center justify-center">
                                <button
                                    className="w-[25px] h-[25px] rounded-full bg-green-500"
                                    onClick={(e) => addNewRow(e)}
                                >
                                    +
                                </button>
                            </div>
                        </th>
                        <th className="font-[500] p-2 border">From Date</th>
                        <th className="font-[500] p-2 border">To Date</th>
                        <th className="font-[500] p-2 border">Adult price</th>
                        <th className="font-[500] p-2 border">Child Price</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {pricing.map((price, index) => (
                        <tr
                            key={index}
                            className="border-b border-tableBorderColor"
                        >
                            <td className="p-2 border w-[35px] min-w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-[25px] h-[25px] rounded-full bg-red-500"
                                        onClick={(e) => {
                                            deleteRow(e, index);
                                        }}
                                    >
                                        -
                                    </button>
                                </div>
                            </td>

                            <td className="border w-[140px] min-w-[140px]">
                                <input
                                    type="date"
                                    name="fromDate"
                                    value={price?.fromDate || ""}
                                    onChange={(e) => handleChange(e, index)}
                                    className="h-[100%] px-2 border-0"
                                />
                            </td>
                            <td className="border w-[140px] min-w-[140px]">
                                <input
                                    type="date"
                                    name="toDate"
                                    value={price?.toDate || ""}
                                    onChange={(e) => handleChange(e, index)}
                                    className="h-[100%]  px-2  border-0"
                                />
                            </td>
                            <td className="border w-[100px] min-w-[100px]">
                                <input
                                    type="number"
                                    name="adultPrice"
                                    value={price?.adultPrice}
                                    onChange={(e) => handleChange(e, index)}
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                />
                            </td>
                            <td className="border w-[100px] min-w-[100px]">
                                <input
                                    type="number"
                                    name="childPrice"
                                    value={price?.childPrice}
                                    onChange={(e) => handleChange(e, index)}
                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
