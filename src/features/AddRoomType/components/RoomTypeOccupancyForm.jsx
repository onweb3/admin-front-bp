import React from "react";

import RoomTypeOccupancySingleRow from "./RoomTypeOccupancySingleRow";

export default function RoomTypeOccupancyForm({
    roomOccupancies,
    setRoomOccupancies,
    defRmOccupancies,
    isEditPermission = true,
}) {
    const addRoomOccupancyRow = () => {
        setRoomOccupancies((prev) => {
            return [
                ...prev,
                {
                    occupancyName: "",
                    shortName: "",
                    combinations: [],
                    maxCount: "",
                    extraBed: "",
                    displayName: "",
                    rollBed: "",
                    isActive: true,
                },
            ];
        });
    };

    return (
        <div className="mt-7">
            <h1 className="font-[600] underline">Room Occupancies</h1>
            <div className="mt-4">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            {isEditPermission && (
                                <th className="p-2 border w-[35px]">
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-[25px] h-[25px] rounded-full bg-green-500"
                                            onClick={addRoomOccupancyRow}
                                            type="button"
                                        >
                                            +
                                        </button>
                                    </div>
                                </th>
                            )}
                            <th className="font-[500] p-2 border">Occupancy</th>
                            <th className="font-[500] p-2 border">Short Name</th>
                            <th className="font-[500] p-2 border">Max Count</th>
                            <th className="font-[500] p-2 border">Reg Ex Bed</th>
                            <th className="font-[500] p-2 border">Display Name</th>
                            <th className="font-[500] p-2 border">RA Bed</th>
                            <th className="font-[500] p-2 border">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {roomOccupancies?.map((item, index) => {
                            return (
                                <RoomTypeOccupancySingleRow
                                    key={index}
                                    item={item}
                                    roomOccupancies={roomOccupancies}
                                    setRoomOccupancies={setRoomOccupancies}
                                    defRmOccupancies={defRmOccupancies}
                                    index={index}
                                    isEditPermission={isEditPermission}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
