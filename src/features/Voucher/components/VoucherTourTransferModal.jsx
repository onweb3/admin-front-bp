import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";

export default function VoucherTourTransferModal({
    setIsTransferModalOpen,
    initialData,
    setSchedules,
    selectedVehicleType,
}) {
    const [data, setData] = useState({
        pickupVehicleType: selectedVehicleType || "",
        pickupVehicle: "",
        pickupDriver: "",
        pickupBufferTime: 60,
        transferType: "pickup-drop",
        vehicleSource: "in-house",
        returnVehicleType: selectedVehicleType || "",
        returnVehicle: "",
        returnDriver: "",
        returnBufferTime: 60,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsTransferModalOpen(false));
    const { voucherId, tourId } = useParams();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const response = await axios.post(
                `/v2/vouchers/tours/transfers/add`,
                {
                    ...data,
                    voucherId,
                    tourId,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setSchedules((prev) => {
                return [...response.data, ...prev];
            });
            setIsTransferModalOpen(false);

            setIsLoading(false);
        } catch (err) {
            setError(err?.response?.data?.error || "something went wrong, try again");
            setIsLoading(false);
        }
    };

    const filteredPickupVehicles = data.pickupVehicleType
        ? initialData?.vehicles?.filter((item) => {
              return item?.vehicleType === data.pickupVehicleType;
          })
        : initialData?.vehicles;
    const filteredReturnVehicles = data.returnVehicleType
        ? initialData?.vehicles?.filter((item) => {
              return item?.vehicleType === data.returnVehicleType;
          })
        : initialData?.vehicles;

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[800px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
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
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="">Transfer Type</label>
                                <select
                                    id=""
                                    name="transferType"
                                    value={data?.transferType || ""}
                                    onChange={handleChange}
                                >
                                    <option value="" hidden>
                                        Select Transfer Type
                                    </option>
                                    <option value="pickup-drop">Pickup & Drop</option>
                                    <option value="disposal">Disposal</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="">Pickup Vehicle Type</label>
                                <select
                                    id=""
                                    name="pickupVehicleType"
                                    value={data?.pickupVehicleType || ""}
                                    onChange={handleChange}
                                >
                                    <option value="" hidden>
                                        Select Pickup Vehicle Type
                                    </option>
                                    {initialData?.vehicleTypes?.map((item, index) => {
                                        return (
                                            <option value={item?._id} key={index}>
                                                {item?.name}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="">Pickup Vehicle</label>
                                <select
                                    id=""
                                    name="pickupVehicle"
                                    value={data?.pickupVehicle || ""}
                                    onChange={handleChange}
                                >
                                    <option value="" hidden>
                                        Select Pickup Vehicle
                                    </option>
                                    {filteredPickupVehicles?.map((item, index) => {
                                        return (
                                            <option value={item?._id} key={index}>
                                                {item?.vehicleModel?.modelName} (
                                                {item?.vehicleTrim?.trimName})
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="">Pickup Driver</label>
                                <select
                                    id=""
                                    name="pickupDriver"
                                    value={data?.pickupDriver || ""}
                                    onChange={handleChange}
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
                            <div>
                                <label htmlFor="">Pickup Buffer Time (Minutes)</label>
                                <input
                                    type="number"
                                    name="pickupBufferTime"
                                    value={data.pickupBufferTime || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            {data.transferType === "pickup-drop" && (
                                <>
                                    <div>
                                        <label htmlFor="">Return Vehicle Type</label>
                                        <select
                                            id=""
                                            name="returnVehicleType"
                                            value={data?.returnVehicleType || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="" hidden>
                                                Select Return Vehicle Type
                                            </option>
                                            {initialData?.vehicleTypes?.map((item, index) => {
                                                return (
                                                    <option value={item?._id} key={index}>
                                                        {item?.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="">Return Vehicle</label>
                                        <select
                                            id=""
                                            name="returnVehicle"
                                            value={data?.returnVehicle || ""}
                                            onChange={handleChange}
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
                                    <div>
                                        <label htmlFor="">Return Driver</label>
                                        <select
                                            id=""
                                            name="returnDriver"
                                            value={data?.returnDriver || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="" hidden>
                                                Select Return Driver
                                            </option>
                                            {filteredReturnVehicles?.map((item, index) => {
                                                return (
                                                    <option value={item?._id} key={index}>
                                                        {item?.driverName}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="">Return Buffer Time (Minutes)</label>
                                        <input
                                            type="number"
                                            name="returnBufferTime"
                                            value={data.returnBufferTime || ""}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        {error && <span className="block mt-2 text-sm text-red-500">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button className="w-[150px]" disabled={isLoading}>
                                {isLoading ? <BtnLoader /> : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
