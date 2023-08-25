import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addHotelRestaurant,
    handleHotelRestaurantDataChange,
    removeHotelRestaurant,
} from "../../../redux/slices/hotelFormSlice";

export default function HotelRestaurentTable() {
    const { restaurants } = useSelector((state) => state.hotelForm);
    const dispatch = useDispatch();

    const handleInpChange = (e, index) => {
        dispatch(
            handleHotelRestaurantDataChange({
                index,
                name: e.target?.name,
                value: e.target?.value,
            })
        );
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
                                    onClick={() => dispatch(addHotelRestaurant())}
                                >
                                    +
                                </button>
                            </div>
                        </th>
                        <th className="font-[500] p-2 border">Name</th>
                        <th className="font-[500] p-2 border">Cuisine</th>
                        <th className="font-[500] p-2 border">From Time</th>
                        <th className="font-[500] p-2 border">To Time</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {restaurants.map((item, index) => (
                        <tr key={index} className="border-b border-tableBorderColor">
                            <td className="p-2 border w-[35px] min-w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-[25px] h-[25px] rounded-full bg-red-500"
                                        onClick={() => {
                                            dispatch(removeHotelRestaurant(index));
                                        }}
                                    >
                                        -
                                    </button>
                                </div>
                            </td>
                            <td className="border">
                                <input
                                    type="text"
                                    name="name"
                                    value={item?.name || ""}
                                    onChange={(e) => handleInpChange(e, index)}
                                    className="h-[100%]  px-2 border-0"
                                    placeholder="Ex: Abc restaurant"
                                />
                            </td>
                            <td className="border">
                                <input
                                    type="text"
                                    name="cuisine"
                                    value={item?.cuisine || ""}
                                    onChange={(e) => handleInpChange(e, index)}
                                    className="h-[100%]  px-2 border-0"
                                    placeholder="Ex: Indian Food"
                                />
                            </td>
                            <td className="border">
                                <input
                                    type="time"
                                    name="fromTime"
                                    value={item?.fromTime || ""}
                                    onChange={(e) => handleInpChange(e, index)}
                                    className="h-[100%]  px-2 border-0"
                                />
                            </td>
                            <td className="border">
                                <input
                                    type="time"
                                    name="toTime"
                                    value={item?.toTime || ""}
                                    onChange={(e) => handleInpChange(e, index)}
                                    className="h-[100%]  px-2 border-0"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
