import React from "react";

export default function RoomOccupancyForm({ roomOccupancy, setRoomOccupancy, isEditPermission = true }) {
    const handleChangeRoomOccupancyInp = (e) => {
        setRoomOccupancy((prev) => {
            return { ...prev, [e.target?.name]: e.target.value };
        });
    };

    const addOccupancyCombinationRow = () => {
        const tempRoomOccupancy = roomOccupancy;
        tempRoomOccupancy?.combinations?.push({
            adultCount: "",
            childCount: "",
            infantCount: "",
        });
        setRoomOccupancy((prev) => {
            return { ...prev, ...tempRoomOccupancy };
        });
    };

    const removeOccupancyCombinationRow = (combinationIndex) => {
        const tempRoomOccupancy = roomOccupancy;
        tempRoomOccupancy?.combinations?.splice(combinationIndex, 1);
        setRoomOccupancy((prev) => {
            return { ...prev, ...tempRoomOccupancy };
        });
    };

    const handleChangeRoomOccupancyCombInp = (e, combinationIndex) => {
        let tempRoomOccupancy = roomOccupancy;
        tempRoomOccupancy.combinations[combinationIndex][e.target?.name] = e.target.value;
        setRoomOccupancy((prev) => {
            return { ...prev, ...tempRoomOccupancy };
        });
    };

    return (
        <div className="mt-7">
            <div className="overflow-x-auto mt-4">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            <th className="font-[500] p-2 border">Occupancy</th>
                            <th className="font-[500] p-2 border">Short Name</th>
                            <th className="font-[500] p-2 border">Max Count</th>
                            <th className="font-[500] p-2 border">Reg Ex Bed</th>
                            <th className="font-[500] p-2 border">Display Name</th>
                            <th className="font-[500] p-2 border">RA Bed</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <React.Fragment>
                            <tr className="border-b border-tableBorderColor">
                                <td className="border w-[250px] min-w-[250px]">
                                    <input
                                        type="text"
                                        className="h-[100%] px-2 border-0"
                                        value={roomOccupancy.occupancyName || ""}
                                        name="occupancyName"
                                        onChange={handleChangeRoomOccupancyInp}
                                        placeholder="Ex: Single"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[150px] min-w-[250px]">
                                    <input
                                        type="text"
                                        className="h-[100%] px-2 border-0"
                                        value={roomOccupancy.shortName || ""}
                                        name="shortName"
                                        onChange={handleChangeRoomOccupancyInp}
                                        placeholder="Ex: SGL"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[100px] min-w-[100px]">
                                    <input
                                        type="number"
                                        className="h-[100%] arrow-hidden px-2 border-0"
                                        value={roomOccupancy.maxCount || ""}
                                        name="maxCount"
                                        onChange={handleChangeRoomOccupancyInp}
                                        placeholder="Max Count"
                                        disabled={!isEditPermission}
                                    />
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="number"
                                            className="h-[100%] arrow-hidden px-2 border-0"
                                            value={roomOccupancy.extraBed}
                                            name="extraBed"
                                            onChange={handleChangeRoomOccupancyInp}
                                            placeholder="Ex Bed"
                                            disabled={!isEditPermission}
                                        />
                                    </div>
                                </td>
                                <td className="border w-[250px] min-w-[250px]">
                                    <input
                                        type="text"
                                        className="h-[100%] px-2 border-0"
                                        value={roomOccupancy.displayName || ""}
                                        name="displayName"
                                        onChange={handleChangeRoomOccupancyInp}
                                        disabled={
                                            !roomOccupancy.extraBed ||
                                            Number(roomOccupancy.extraBed) < 1 ||
                                            !isEditPermission
                                        }
                                        placeholder="Disp Name (Optional)"
                                    />
                                </td>
                                <td className="border w-[70px] min-w-[70px]">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="number"
                                            className="h-[100%] arrow-hidden px-2 border-0"
                                            value={roomOccupancy.rollBed}
                                            name="rollBed"
                                            onChange={handleChangeRoomOccupancyInp}
                                            placeholder="RA Bed"
                                            disabled={!isEditPermission}
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td colSpan={4}>
                                    <table className="w-full">
                                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                                            <tr>
                                                {isEditPermission && (
                                                    <th className="p-2 border w-[35px]">
                                                        <div className="flex items-center justify-center">
                                                            <button
                                                                className="w-[25px] h-[25px] rounded-full bg-green-500"
                                                                onClick={addOccupancyCombinationRow}
                                                                type="button"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </th>
                                                )}
                                                <th className="font-[500] p-2 border">Adult</th>
                                                <th className="font-[500] p-2 border">Child</th>
                                                <th className="font-[500] p-2 border">Infant</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roomOccupancy?.combinations?.map(
                                                (occupancyComb, combinationIndex) => {
                                                    return (
                                                        <tr
                                                            key={combinationIndex}
                                                            className="border-b border-tableBorderColor"
                                                        >
                                                            {isEditPermission && (
                                                                <td className="p-2 border w-[35px] min-w-[35px]">
                                                                    <div className="flex items-center justify-center">
                                                                        <button
                                                                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                                            onClick={() =>
                                                                                removeOccupancyCombinationRow(
                                                                                    combinationIndex
                                                                                )
                                                                            }
                                                                            type="button"
                                                                        >
                                                                            -
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            )}
                                                            <td className="border min-w-[100px]">
                                                                <input
                                                                    type="number"
                                                                    className="h-[100%] arrow-hidden p-0 px-2 py-2 border-0"
                                                                    value={occupancyComb.adultCount}
                                                                    name="adultCount"
                                                                    onChange={(e) =>
                                                                        handleChangeRoomOccupancyCombInp(
                                                                            e,
                                                                            combinationIndex
                                                                        )
                                                                    }
                                                                    placeholder="0"
                                                                    disabled={!isEditPermission}
                                                                />
                                                            </td>
                                                            <td className="border min-w-[100px]">
                                                                <input
                                                                    type="number"
                                                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                                                    value={occupancyComb.childCount}
                                                                    name="childCount"
                                                                    onChange={(e) =>
                                                                        handleChangeRoomOccupancyCombInp(
                                                                            e,
                                                                            combinationIndex
                                                                        )
                                                                    }
                                                                    placeholder="0"
                                                                    disabled={!isEditPermission}
                                                                />
                                                            </td>
                                                            <td className="border min-w-[100px]">
                                                                <input
                                                                    type="number"
                                                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                                                    value={occupancyComb.infantCount}
                                                                    name="infantCount"
                                                                    onChange={(e) =>
                                                                        handleChangeRoomOccupancyCombInp(
                                                                            e,
                                                                            combinationIndex
                                                                        )
                                                                    }
                                                                    placeholder="0"
                                                                    disabled={!isEditPermission}
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </React.Fragment>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
