import React, { useState } from "react";

import { Pagination } from "../../../components";
import ActivityProfileRow from "./ActivityProfileRow";
import AttracitonMarkupModal from "./AttractionMarkupModal";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function AttractionProfileRow({
    attraction,
    setAttractionList,
    setInitalAttractionList,
    filters,
    setFilters,
    section,
}) {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <>
            <tr
                className={
                    "border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9] " +
                    (dropdownVisible ? "bg-[#f3f6f9]" : "")
                }
                onClick={() => setDropdownVisible(!dropdownVisible)}
            >
                <td className="p-3 font-[600] "> {attraction.name} </td>
            </tr>
            <div className="w-full">
                <table
                    className={`w-full border shadow-lg
                     ${dropdownVisible ? "" : " hidden "}
                    `}
                >
                    <thead
                        className={`w-full text-grayColor text-[14px] text-left `}
                    >
                        <tr>
                            <th className="font-[500] p-3">Index</th>
                            <th className="font-[500] p-3">Activity Name</th>
                            <th className="font-[500] p-3">Activity Type</th>
                            <th className="font-[500] p-3">Markup Type</th>

                            <th className="font-[500] p-3">Markup</th>
                            <th className="font-[500] p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {attraction.activities.map((activities, index) => {
                            const rowClass =
                                index % 2 === 0 ? "bg-gray-100" : "bg-white"; // define the row class based on the index
                            return (
                                <ActivityProfileRow
                                    activities={activities}
                                    setAttractionList={setAttractionList}
                                    setInitalAttractionList={
                                        setInitalAttractionList
                                    }
                                    index={index}
                                    rowClass={rowClass}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}
