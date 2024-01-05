import React, { useRef, useState } from "react";
import { useHandleClickOutside } from "../../../hooks";

export default function RoomTypeOccupancySingleRow({
    item,
    roomOccupancies,
    setRoomOccupancies,
    defRmOccupancies,
    index,
    isEditPermission,
}) {
    const [defOccupDropdownOpen, setDefOccupDropdownOpen] = useState(false);

    const defOccupDrodownRef = useRef();
    useHandleClickOutside(defOccupDrodownRef, () => setDefOccupDropdownOpen(false));

    const handleChangeRoomOccupancyInp = (e, index) => {
        let tempRoomOccupancies = roomOccupancies;
        tempRoomOccupancies[index][e.target?.name] = e.target.value;
        setRoomOccupancies(() => {
            return [...tempRoomOccupancies];
        });
    };

    const handleChangeRoomOccupancyChk = (e, index) => {
        let tempRoomOccupancies = roomOccupancies;
        tempRoomOccupancies[index][e.target?.name] = e.target.checked;
        setRoomOccupancies(() => {
            return [...tempRoomOccupancies];
        });
    };

    const removeSingleOccupancyRow = (index) => {
        const tempRoomOccupancies = roomOccupancies;
        const filteredRoomOccupancies = tempRoomOccupancies?.filter((_, tIndex) => {
            return index !== tIndex;
        });
        setRoomOccupancies(filteredRoomOccupancies);
    };

    const addOccupancyCombinationRow = (index) => {
        const tempRoomOccupancies = roomOccupancies;
        tempRoomOccupancies[index]?.combinations?.push({
            adultCount: "",
            childCount: "",
            infantCount: "",
        });
        setRoomOccupancies(() => {
            return [...tempRoomOccupancies];
        });
    };

    const removeOccupancyCombinationRow = (index, combinationIndex) => {
        const tempRoomOccupancies = roomOccupancies;
        tempRoomOccupancies[index]?.combinations?.splice(combinationIndex, 1);
        setRoomOccupancies(() => {
            return [...tempRoomOccupancies];
        });
    };

    const handleChangeRoomOccupancyCombInp = (e, index, combinationIndex) => {
        let tempRoomOccupancies = roomOccupancies;
        tempRoomOccupancies[index].combinations[combinationIndex][e.target?.name] = e.target.value;
        setRoomOccupancies(() => {
            return [...tempRoomOccupancies];
        });
    };

    const updateSingleOccupancyAllDetails = (index, defOccupIndex) => {
        let tempRoomOccupancies = roomOccupancies;
        let tempDefRmOccupancies = defRmOccupancies;
        let tempOccupany = { ...tempDefRmOccupancies[defOccupIndex], _id: item?._id || undefined };

        tempOccupany.isActive = true;
        tempRoomOccupancies[index] = tempOccupany;
        setRoomOccupancies(() => {
            return [...tempRoomOccupancies];
        });
    };

    return (
        <React.Fragment>
            <tr className="border-b border-tableBorderColor">
                {isEditPermission && (
                    <td className="p-2 border w-[35px] min-w-[35px]">
                        <div className="flex items-center justify-center">
                            <button
                                className="w-[25px] h-[25px] rounded-full bg-red-500"
                                onClick={() => removeSingleOccupancyRow(index)}
                                type="button"
                            >
                                -
                            </button>
                        </div>
                    </td>
                )}
                <td className="border w-[250px] min-w-[250px]">
                    <div className="relative">
                        <input
                            type="text"
                            className="h-[100%]  px-2 border-0"
                            value={item.occupancyName || ""}
                            name="occupancyName"
                            onChange={(e) => handleChangeRoomOccupancyInp(e, index)}
                            placeholder="Ex: Single"
                            onClick={() => setDefOccupDropdownOpen(true)}
                            disabled={!isEditPermission}
                        />
                        {defOccupDropdownOpen === true && (
                            <div
                                ref={defOccupDrodownRef}
                                className="absolute top-[100%] left-0 right-0 bg-white shadow-lg rounded max-h-[300px] overflow-y-auto z-10 text-[14px]"
                            >
                                {defRmOccupancies?.map((defItem, defIndex) => {
                                    return (
                                        <div
                                            key={defIndex}
                                            className="px-3 hover:bg-blue-500 hover:text-white capitalize py-1 cursor-pointer"
                                            onClick={() => {
                                                updateSingleOccupancyAllDetails(index, defIndex);
                                                setDefOccupDropdownOpen(false);
                                            }}
                                        >
                                            {defItem?.occupancyName}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </td>
                <td className="border w-[150px] min-w-[250px]">
                    <input
                        type="text"
                        className="h-[100%]  px-2 border-0"
                        value={item.shortName || ""}
                        name="shortName"
                        onChange={(e) => handleChangeRoomOccupancyInp(e, index)}
                        placeholder="Ex: SGL"
                        disabled={!isEditPermission}
                    />
                </td>
                <td className="border w-[100px] min-w-[100px]">
                    <input
                        type="number"
                        className="h-[100%] arrow-hidden px-2 border-0"
                        value={item.maxCount || ""}
                        name="maxCount"
                        onChange={(e) => handleChangeRoomOccupancyInp(e, index)}
                        placeholder="Max Count"
                        disabled={!isEditPermission}
                    />
                </td>
                <td className="border w-[70px] min-w-[70px]">
                    <div className="flex items-center justify-center">
                        <input
                            type="number"
                            className="h-[100%] arrow-hidden px-2 border-0"
                            value={item.extraBed}
                            name="extraBed"
                            onChange={(e) => handleChangeRoomOccupancyInp(e, index)}
                            placeholder="Ex Bed"
                            disabled={!isEditPermission}
                        />
                    </div>
                </td>
                <td className="border w-[250px] min-w-[250px]">
                    <input
                        type="text"
                        className="h-[100%]  px-2 border-0"
                        value={item.displayName || ""}
                        name="displayName"
                        onChange={(e) => handleChangeRoomOccupancyInp(e, index)}
                        disabled={!item.extraBed || Number(item.extraBed) < 1 || !isEditPermission}
                        placeholder="Disp Name (Optional)"
                    />
                </td>
                <td className="border w-[70px] min-w-[70px]">
                    <div className="flex items-center justify-center">
                        <input
                            type="number"
                            className="h-[100%] arrow-hidden px-2 border-0"
                            value={item.rollBed}
                            name="rollBed"
                            onChange={(e) => handleChangeRoomOccupancyInp(e, index)}
                            placeholder="RA Bed"
                            disabled={!isEditPermission}
                        />
                    </div>
                </td>
                <td className="border w-[70px] min-w-[70px]">
                    <div className="flex items-center justify-center">
                        <input
                            type="checkbox"
                            className="w-[18px] h-[18px]"
                            defaultChecked={item.isActive === true}
                            name="isActive"
                            onChange={(e) => handleChangeRoomOccupancyChk(e, index)}
                            title="Status"
                            disabled={!isEditPermission}
                        />
                    </div>
                </td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td colSpan={6}>
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                            <tr>
                                {isEditPermission && (
                                    <th className="p-2 border w-[35px]">
                                        <div className="flex items-center justify-center">
                                            <button
                                                className="w-[25px] h-[25px] rounded-full bg-green-500"
                                                onClick={() => addOccupancyCombinationRow(index)}
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
                            {item?.combinations?.map((occupancyComb, combinationIndex) => {
                                return (
                                    <tr key={combinationIndex} className="border-b border-tableBorderColor">
                                        {isEditPermission && (
                                            <td className="p-2 border w-[35px] min-w-[35px]">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                        onClick={() =>
                                                            removeOccupancyCombinationRow(
                                                                index,
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
                                                className="h-[100%] arrow-hidden p-2 border-0"
                                                value={occupancyComb.adultCount}
                                                name="adultCount"
                                                onChange={(e) =>
                                                    handleChangeRoomOccupancyCombInp(
                                                        e,
                                                        index,
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
                                                className="h-[100%] arrow-hidden p-2 border-0"
                                                value={occupancyComb.childCount}
                                                name="childCount"
                                                onChange={(e) =>
                                                    handleChangeRoomOccupancyCombInp(
                                                        e,
                                                        index,
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
                                                className="h-[100%] arrow-hidden p-2 border-0"
                                                value={occupancyComb.infantCount}
                                                name="infantCount"
                                                onChange={(e) =>
                                                    handleChangeRoomOccupancyCombInp(
                                                        e,
                                                        index,
                                                        combinationIndex
                                                    )
                                                }
                                                placeholder="0"
                                                disabled={!isEditPermission}
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
