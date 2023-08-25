import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";

export default function DriverAssignModal({
    setIsDriverAssignModalOpen,
    setOrderData,
    orderId,
    orderItemId,
    orderData,
}) {
    const { drivers } = useSelector((state) => state.general);

    const [selectedDrivers, setSelectedDrivers] = useState(
        orderData.drivers || []
    );
    const [selectedDriverIds, setSelectedDriverIds] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsDriverAssignModalOpen(false));
    const { jwtToken } = useSelector((state) => state.admin);

    const handleSelectDriver = (e) => {
        if (selectedDrivers.length < orderData.driversRequired) {
            const objIndex = drivers.findIndex((obj) => {
                return obj?._id === e.target.value;
            });

            setSelectedDrivers([...selectedDrivers, drivers[objIndex]]);
        }
        e.target.value = "";
    };

    const removeSelectedDriver = (id) => {
        const tempSelectedDrivers = selectedDrivers.filter((driver) => {
            return driver?._id !== id;
        });
        setSelectedDrivers(tempSelectedDrivers);
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            if (selectedDrivers.length < orderData.driversRequired) {
                setError(
                    `you should select ${orderData.driversRequired} drivers`
                );
                return;
            }

            setIsLoading(true);

            const response = await axios.patch(
                "/attractions/orders/assign-driver",
                {
                    orderId,
                    orderItemId,
                    drivers: selectedDriverIds,
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setOrderData((prev) => {
                return {
                    ...prev,
                    drivers: response.data?.driverDetails,
                };
            });
            setIsLoading(false);
            setIsDriverAssignModalOpen(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let tempSelectedDriverIds = selectedDrivers.map(
            (driver) => driver?._id
        );
        setSelectedDriverIds(tempSelectedDriverIds);
    }, [selectedDrivers]);

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Assign Driver</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsDriverAssignModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        {selectedDrivers?.length > 0 && (
                            <div className="flex flex-wrap gap-[10px] mb-2">
                                {selectedDrivers?.map((driver, index) => {
                                    return (
                                        <div
                                            onClick={() =>
                                                removeSelectedDriver(
                                                    driver?._id
                                                )
                                            }
                                            className="flex items-center gap-[5px] bg-slate-200 rounded py-1 px-2 text-sm cursor-pointer"
                                        >
                                            <span key={index}>
                                                {driver?.driverName}
                                            </span>
                                            <span className="text-red-500">
                                                x
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="">
                            <label htmlFor="">Driver</label>
                            <select
                                className=""
                                name="driver"
                                onChange={handleSelectDriver}
                            >
                                <option value="" hidden>
                                    Slect Driver
                                </option>
                                {drivers?.map((driver, index) => {
                                    if (
                                        selectedDriverIds?.includes(driver?._id)
                                    ) {
                                        return (
                                            <React.Fragment
                                                key={index}
                                            ></React.Fragment>
                                        );
                                    }
                                    return (
                                        <option value={driver?._id} key={index}>
                                            {driver?.driverName}
                                        </option>
                                    );
                                })}
                            </select>
                            <span className="text-sm text-grayColor block mt-2">
                                Only {orderData.driversRequired} drivers are
                                allowed..!
                            </span>
                        </div>
                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() =>
                                    setIsDriverAssignModalOpen(false)
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[150px]">
                                {isLoading ? <BtnLoader /> : "Update Status"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
