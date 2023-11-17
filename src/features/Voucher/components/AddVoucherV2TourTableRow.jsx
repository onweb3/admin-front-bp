import React, { useState } from "react";
import VoucherTourTransferModal from "./VoucherTourTransferModal";
import { FaCar } from "react-icons/fa";
import { RiSteering2Line } from "react-icons/ri";

export default function AddVoucherV2TourTableRow({
    tourItem,
    handleChange,
    tourDayIndex,
    tourItemIndex,
    deleteExtraRow,
    initialData,
}) {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    return (
        <React.Fragment>
            <td className="p-2 border w-[35px] min-w-[35px]">
                <div className="flex items-center justify-center">
                    <button
                        className="w-[25px] h-[25px] rounded-full bg-red-500"
                        onClick={() => {
                            deleteExtraRow(tourDayIndex, tourItemIndex);
                        }}
                        type="button"
                    >
                        -
                    </button>
                </div>
            </td>
            <td className="border w-[400px] min-w-[400px]">
                <input
                    type="text"
                    name="tourName"
                    value={tourItem?.tourName || ""}
                    onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                />
            </td>
            <td>
                <select
                    name="tourType"
                    id=""
                    value={tourItem?.tourType || ""}
                    onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                >
                    <option value="" hidden>
                        Select
                    </option>
                    <option value="regular">Regular</option>
                    <option value="arrival">Arrival</option>
                    <option value="departure">Departure</option>
                    <option value="ticket-only">Ticket Only</option>
                </select>
            </td>

            <td className="border min-w-[100px]">
                <input
                    type="text"
                    name="pickupFrom"
                    value={tourItem?.pickupFrom || ""}
                    onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                />
            </td>
            <td className="border min-w-[100px]">
                <div className="flex items-center px-2">
                    <input
                        type="time"
                        name="pickupTimeFrom"
                        value={tourItem?.pickupTimeFrom || ""}
                        onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                        className="h-[100%] arrow-hidden p-0 border-0"
                    />
                    <button
                        className="w-[15px] min-w-[15px] h-[15px] min-h-[15px] ml-2 bg-gray-500 p-0 flex items-center justify-center"
                        type="button"
                        // onClick={() => {
                        //     handleExtraDataChange(
                        //         {
                        //             index,
                        //             name: "pickupTimeFrom",
                        //             value: "",
                        //         }
                        //     );
                        // }}
                    >
                        x
                    </button>
                </div>
            </td>
            <td className="border min-w-[100px]">
                <div className="flex items-center px-2">
                    <input
                        type="time"
                        name="pickupTimeTo"
                        value={tourItem?.pickupTimeTo || ""}
                        onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                        className="h-[100%] arrow-hidden p-0 border-0"
                    />
                    <button
                        className="w-[15px] min-w-[15px] h-[15px] min-h-[15px] ml-2 bg-gray-500 p-0 flex items-center justify-center"
                        type="button"
                        // onClick={() => {
                        //     handleExtraDataChange(
                        //         {
                        //             index,
                        //             name: "pickupTimeTo",
                        //             value: "",
                        //         }
                        //     );
                        // }}
                    >
                        x
                    </button>
                </div>
            </td>
            <td className="px-2">
                <div
                    className="flex items-center gap-2"
                    onClick={() => {
                        setIsTransferModalOpen(true);
                    }}
                >
                    <span
                        className={
                            " " + (tourItem.pickupVehicle ? "text-green-500" : "text-[#444]")
                        }
                    >
                        <FaCar />
                    </span>
                    <span
                        className={
                            " " + (tourItem.pickupDriver ? "text-green-500" : "text-[#444]")
                        }
                    >
                        <RiSteering2Line />
                    </span>
                </div>
            </td>
            <td className="border min-w-[100px]">
                <div className="flex items-center px-2">
                    <input
                        type="time"
                        name="returnTimeFrom"
                        value={tourItem?.returnTimeFrom || ""}
                        onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                        className="h-[100%] arrow-hidden p-0  border-0"
                    />
                    <button
                        className="w-[15px] min-w-[15px] h-[15px] min-h-[15px] ml-2 bg-gray-500 p-0 flex items-center justify-center"
                        type="button"
                        // onClick={() => {
                        //     handleExtraDataChange(
                        //         {
                        //             index,
                        //             name: "returnTimeFrom",
                        //             value: "",
                        //         }
                        //     );
                        // }}
                    >
                        x
                    </button>
                </div>
            </td>
            <td className="px-2">
                <div
                    className="flex items-center gap-2"
                    onClick={() => {
                        setIsTransferModalOpen(true);
                    }}
                >
                    <span
                        className={
                            " " + (tourItem.returnVehicle ? "text-green-500" : "text-[#444]")
                        }
                    >
                        <FaCar />
                    </span>
                    <span
                        className={
                            " " + (tourItem.returnDriver ? "text-green-500" : "text-[#444]")
                        }
                    >
                        <RiSteering2Line />
                    </span>
                </div>
                {isTransferModalOpen && (
                    <VoucherTourTransferModal
                        setIsTransferModalOpen={setIsTransferModalOpen}
                        tourItem={tourItem}
                        handleChange={handleChange}
                        initialData={initialData}
                        tourDayIndex={tourDayIndex}
                        tourItemIndex={tourItemIndex}
                    />
                )}
            </td>
        </React.Fragment>
    );
}
