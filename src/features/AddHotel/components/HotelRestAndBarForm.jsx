import React from "react";
import { BsFillArrowRightCircleFill } from "react-icons/bs";

import HotelRestaurentTable from "./HotelRestaurentTable";
import HotelBarTable from "./HotelBarTable";

export default function HotelRestAndBarForm({ selectedSection }) {
    return (
        <div
            className={selectedSection === "-rest-and-bar" ? "block" : "hidden"}
        >
            <div className="">
                <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                    <BsFillArrowRightCircleFill /> Restaurants
                </h1>
                <HotelRestaurentTable />
            </div>
            <div className="mt-8">
                <h1 className="font-[600] flex items-center gap-[10px] mb-3">
                    <BsFillArrowRightCircleFill /> Hotel Bars
                </h1>
                <HotelBarTable />
            </div>
        </div>
    );
}
