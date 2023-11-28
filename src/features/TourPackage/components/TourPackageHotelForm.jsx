import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { addTPackageHotelRow } from "../../../redux/slices/tourPackageFormSlice";
import TourPackageHotelFormHotelsRow from "./TourPackageHotelFormHotelsRow";

export default function TourPackageHotelForm({ selectedSection }) {
    const { tPackageHotels } = useSelector((state) => state.tourPackageForm);
    const dispatch = useDispatch();

    return (
        <div className={selectedSection === "hotel" ? "block" : "hidden"}>
            {tPackageHotels?.map((tpHotel, tpHotelIndex) => {
                return (
                    <TourPackageHotelFormHotelsRow
                        key={tpHotelIndex}
                        tpHotel={tpHotel}
                        tpHotelIndex={tpHotelIndex}
                    />
                );
            })}

            <div className="mt-6">
                <button
                    className="px-3"
                    onClick={() => {
                        dispatch(addTPackageHotelRow());
                    }}
                >
                    + Add City
                </button>
            </div>
            {/* <div className="mt-6">
                <h4 className="font-medium mb-3 text-[14px]">Room Types</h4>
                <div className="flex gap-3 flex-wrap">
                    {Array.from({ length: 10 })?.map((_, index) => {
                        return (
                            <div
                                key={index}
                                className="bg-tableBorderColor py-2 px-3 rounded text-sm cursor-pointer"
                            >
                                Superior Room VIP
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="mt-6">
                <h4 className="font-medium mb-3 text-[14px]">Board Types</h4>
                <div className="flex gap-3 flex-wrap">
                    {Array.from({ length: 10 })?.map((_, index) => {
                        return (
                            <div
                                key={index}
                                className="bg-tableBorderColor py-2 px-3 rounded text-sm cursor-pointer"
                            >
                                Half Board
                            </div>
                        );
                    })}
                </div>
            </div> */}
        </div>
    );
}
