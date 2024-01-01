import React from "react";

import HotelAvailabilityAllocationColumn from "./HotelAvailabilityAllocationColumn";

export default function HotelAvailabilityTableRow({ roomType }) {
    return (
        <tr>
            <td className="p-2 border">{roomType?.roomTypeName}</td>
            {roomType?.allocations?.map((allocation, alIndex) => {
                return (
                    <HotelAvailabilityAllocationColumn
                        key={alIndex}
                        allocation={allocation}
                        roomType={roomType}
                    />
                );
            })}
        </tr>
    );
}
