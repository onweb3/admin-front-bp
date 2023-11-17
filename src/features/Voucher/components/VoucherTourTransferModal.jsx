import React, { useRef } from "react";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";

export default function VoucherTourTransferModal({
    setIsTransferModalOpen,
    tourItem,
    handleChange,
    initialData,
    tourDayIndex,
    tourItemIndex,
}) {
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsTransferModalOpen(false));

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Vehicle & Driver</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsTransferModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <div>
                        <div>
                            <label htmlFor="">Pickup Vehicle</label>
                            <select
                                id=""
                                name="pickupVehicle"
                                value={tourItem?.pickupVehicle || ""}
                                onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                            >
                                <option value="" hidden>
                                    Select Pickup Vehicle
                                </option>
                                {initialData?.vehicles?.map((item, index) => {
                                    return (
                                        <option value={item?._id} key={index}>
                                            {item?.vehicleModel?.modelName} (
                                            {item?.vehicleTrim?.trimName})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Pickup Driver</label>
                            <select
                                id=""
                                name="pickupDriver"
                                value={tourItem?.pickupDriver || ""}
                                onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                            >
                                <option value="" hidden>
                                    Select Pickup Driver
                                </option>
                                {initialData?.drivers?.map((item, index) => {
                                    return (
                                        <option value={item?._id} key={index}>
                                            {item?.driverName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Return Vehicle</label>
                            <select
                                id=""
                                name="returnVehicle"
                                value={tourItem?.returnVehicle || ""}
                                onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                            >
                                <option value="" hidden>
                                    Select Return Vehicle
                                </option>
                                {initialData?.vehicles?.map((item, index) => {
                                    return (
                                        <option value={item?._id} key={index}>
                                            {item?.vehicleModel?.modelName} (
                                            {item?.vehicleTrim?.trimName})
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Return Driver</label>
                            <select
                                id=""
                                name="returnDriver"
                                value={tourItem?.returnDriver || ""}
                                onChange={(e) => handleChange(e, tourDayIndex, tourItemIndex)}
                            >
                                <option value="" hidden>
                                    Select Return Driver
                                </option>
                                {initialData?.drivers?.map((item, index) => {
                                    return (
                                        <option value={item?._id} key={index}>
                                            {item?.driverName}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button className="w-[150px]">{"Close Modal"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
