import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { IoIosAddCircle, IoIosRemoveCircle, IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { BsArrowRightSquareFill } from "react-icons/bs";

import {
    addNewMultiHotel,
    removeHotel,
    removeMultiHotel,
    handleTransferCheckChange,
    handleTransferCountChange,
    handleTransferInitalData,
    setVehicleCountEdit,
    handleTransferInitalCount,
    handleIsAddTransferDataChange,
} from "../../redux/slices/quotationSlice";
import axios from "../../axios";
import { BtnLoader } from "../../components";

export default function EditTransferStayQuotation({
    transferIndex,
    stayIndex,
    transfer,
    stay,
    type,
    // isReload,
    // setIsReload,
}) {
    const [isReload, setIsReload] = useState(false);
    const [data, setData] = useState({
        transferFrom: stay.transferFrom,
        transferFromName: stay.transferFromName,
        transferTo: stay.transferTo,
        transferToName: stay.transferToName,
        transferType: stay.transferType,
        vehicleType: [],
        isAddTransfer: stay?.isAddTransfer || false,
        transferArrivalTerminalCode: stay?.transferArrivalTerminalCode || "",
        transferArrivalTerminalName: stay?.transferArrivalTerminalName || "",
        transferDepartureTerminalCode:
            stay?.transferDepartureTerminalCode || "",
        transferDepartureTerminalName:
            stay?.transferDepartureTerminalName || "",
    });
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const {
        noOfChildren,
        noOfAdults,
        arrivalAirportName,
        departureAirportName,
        transferQuotation,
        arrivalAirport,
        departureAirport,
        transfers,
    } = useSelector((state) => state.quotations);

    const { jwtToken } = useSelector((state) => state.admin);
    const onChangeHandler = ({ name, value }) => {
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [errorStatus, setErrorStatus] = useState(false);
    const fetchvehicles = async (reload) => {
        try {
            setErrorStatus(false);
            setIsLoading(true);
            setError("");

            console.log("Fetching vehicles");
            const response = await axios.post(
                "/quotations/inital/transfer",
                {
                    transferFrom: data.transferFrom,
                    transferTo: data.transferTo,
                    transferType: data.transferType,
                    noOfPax: noOfAdults + noOfChildren,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setVehicles(response?.data);
            console.log(response?.data, "vehicles");
            // console.log("isReload ", isReload);

            if (isReload === true) {
                console.log("Reloading ");
                dispatch(
                    handleTransferInitalCount({
                        transferIndex,
                        stayIndex,
                        vehicles: response?.data,
                    })
                );
            }

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setError(
                err?.response?.data?.error ||
                    "Something went wrong! try again.."
            );
            console.log(err, "error");
            setVehicles([]);
            setErrorStatus(true);
        }
    };

    useEffect(() => {
        fetchvehicles();
    }, [isReload]);

    // useEffect(() => {
    //     setError("");
    //     const fetchData = async () => {
    //         setData((prev) => ({
    //             ...prev,
    //             transferFrom: "",
    //             transferFromName: "",
    //             transferTo: "",
    //             transferToName: "",
    //             transferType: "",
    //             vehicleType: [],
    //         }));

    //         await handleDataChange();
    //         // setVehicles([]);

    //         // await fetchvehicles();
    //     };

    //     // fetchData();
    // }, [arrivalAirport, departureAirport, data, resultArray]);

    return data.transferFromName && data.transferToName ? (
        <div className="mb-10">
            <div className="bg-stone-200/50 border-dashed border">
                <div className="px-2 py-4">
                    <h2 className="text-[16px] font-[500]">
                        Transfer {stayIndex + 1}
                    </h2>
                </div>
                <div className="flex w-full ">
                    <div className="bg-stone-200/40 w-full px-2 py-10 border-dashed border flex justify-between  gap-4 items-center">
                        <p className="text-[14px] w-1/4 font-[500]">
                            {data?.transferFromName}
                            {data?.transferArrivalTerminalName
                                ? data?.transferArrivalTerminalName
                                : ""}
                        </p>
                        <div className="flex items-center w-1/4  justify-center">
                            <BsArrowRightSquareFill className="w-6 h-6" />
                        </div>
                        <p className="text-[14px] font-[500] text-left w-1/4 flex items-center justify-center">
                            {data?.transferToName}
                            {data?.transferDepartureTerminalName
                                ? data?.transferDepartureTerminalName
                                : ""}
                        </p>
                        {stay.isAddTransfer ? (
                            <>
                                <div className="  items-center gap-[5px] w-1/4 flex justify-center items-center">
                                    <button
                                        className="w-[120px] text-white p-2 "
                                        onClick={(e) => {
                                            dispatch(
                                                handleIsAddTransferDataChange({
                                                    data: data,
                                                    value: false,
                                                    stayIndex: transferIndex,
                                                })
                                            );

                                            // setIsReload(true);
                                        }}
                                    >
                                        <div className="flex justify-evenly items-center ">
                                            <IoIosRemoveCircle className="text-white font-[500]" />
                                            <span>Remove </span>
                                        </div>
                                    </button>{" "}
                                </div>
                            </>
                        ) : (
                            <>
                                {" "}
                                <div className="  items-center gap-[10px] w-1/4  flex justify-center items-center">
                                    <button
                                        className="w-[150px] text-white p-2 "
                                        onClick={(e) => {
                                            dispatch(
                                                handleIsAddTransferDataChange({
                                                    data: data,
                                                    value: true,
                                                    stayIndex: transferIndex,
                                                })
                                            );
                                            setIsReload(true);
                                            fetchvehicles();

                                            // setIsReload(true);
                                        }}
                                    >
                                        <div className="flex justify-evenly items-center ">
                                            <IoIosAddCircle className="text-white font-[500]" />
                                            <span>Add Transfer</span>
                                        </div>
                                    </button>{" "}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {stay?.isAddTransfer && (
                    <div
                        className="w-full flex justify-center items-center bg-stone-200/40 "
                        // onClick={fetchvehicles}
                    >
                        <div className="grid grid-cols-5 items-top gap-[20px] p-4 ">
                            {vehicles.length > 0 ? (
                                vehicles.map((veh) => {
                                    return (
                                        <>
                                            {" "}
                                            <div>
                                                <div className="flex  w-full gap-[10px]">
                                                    <div className="flex justify-center items-center gap-[10px]">
                                                        <input
                                                            type="checkbox"
                                                            className="w-[16px] h-[16px]"
                                                            // checked={data.vehicleType.find(
                                                            //     (vh) =>
                                                            //         vh.vehicle ===
                                                            //         veh
                                                            //             .vehicle
                                                            //             ._id
                                                            // )}
                                                            checked={
                                                                transferQuotation?.transfers
                                                                    ?.find(
                                                                        (tf) =>
                                                                            tf?.stayNo ===
                                                                            transferIndex +
                                                                                1
                                                                    )
                                                                    ?.stays?.find(
                                                                        (
                                                                            stay
                                                                        ) =>
                                                                            stay?.transferFrom.toString() ===
                                                                                data?.transferFrom.toString() &&
                                                                            stay?.transferTo.toString() ===
                                                                                data?.transferTo.toString()
                                                                    )
                                                                    ?.vehicleTypes?.find(
                                                                        (vt) =>
                                                                            vt?.vehicle?.toString() ===
                                                                            veh?.vehicle?._id.toString()
                                                                    ) !==
                                                                    undefined ||
                                                                false
                                                            }
                                                            onChange={(e) => {
                                                                // onHandleChangeVehicleType(
                                                                //     veh
                                                                //         .vehicle
                                                                //         ._id
                                                                // );

                                                                dispatch(
                                                                    handleTransferCheckChange(
                                                                        {
                                                                            data: data,
                                                                            veh: veh,
                                                                            stayIndex:
                                                                                transferIndex,
                                                                        }
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor=""
                                                            className="w-[100%] max-w-[180px]"
                                                        >
                                                            {veh.vehicle.name}
                                                        </label>
                                                    </div>{" "}
                                                </div>
                                                {transferQuotation?.transfers
                                                    ?.find(
                                                        (tf) =>
                                                            tf?.stayNo ===
                                                            transferIndex + 1
                                                    )
                                                    ?.stays.find(
                                                        (stay) =>
                                                            stay?.transferFrom ===
                                                                data?.transferFrom &&
                                                            stay?.transferTo ===
                                                                data?.transferTo
                                                    )
                                                    ?.vehicleTypes?.find(
                                                        (vt) =>
                                                            vt?.vehicle ===
                                                            veh?.vehicle._id
                                                    ) ? (
                                                    <select
                                                        name="count"
                                                        value={
                                                            transferQuotation.transfers
                                                                ?.find(
                                                                    (tf) =>
                                                                        tf?.stayNo ===
                                                                        transferIndex +
                                                                            1
                                                                )
                                                                ?.stays?.find(
                                                                    (stay) =>
                                                                        stay?.transferFrom ===
                                                                            data?.transferFrom &&
                                                                        stay?.transferTo ===
                                                                            data?.transferTo
                                                                )
                                                                .vehicleTypes?.find(
                                                                    (vt) =>
                                                                        vt?.vehicle ===
                                                                        veh
                                                                            ?.vehicle
                                                                            ?._id
                                                                ).count || ""
                                                        }
                                                        onChange={(e) => {
                                                            // onHandleCountChange(
                                                            //     {
                                                            //         vehicleId:
                                                            //             veh
                                                            //                 .vehicle
                                                            //                 ._id,
                                                            //         count: e
                                                            //             .target
                                                            //             .value,
                                                            //     }
                                                            // );

                                                            dispatch(
                                                                handleTransferCountChange(
                                                                    {
                                                                        data: data,
                                                                        veh: veh,
                                                                        stayIndex:
                                                                            transferIndex,
                                                                        count: e
                                                                            .target
                                                                            .value,
                                                                    }
                                                                )
                                                            );
                                                        }}
                                                        id=""
                                                        required
                                                    >
                                                        {Array.from(
                                                            { length: 10 },
                                                            (_, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        index +
                                                                        1
                                                                    }
                                                                >
                                                                    {index + 1}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </>
                                    );
                                })
                            ) : (
                                <div>
                                    {error && (
                                        <div className="text-sm block text-red-500 mt-2">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    ) : (
        ""
    );
}
