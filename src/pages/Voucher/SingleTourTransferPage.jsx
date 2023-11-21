import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PageLoader } from "../../components";
import VoucherTourTransferModal from "../../features/Voucher/components/VoucherTourTransferModal";
import axios from "../../axios";
import { useSelector } from "react-redux";
import moment from "moment";
import { MdDelete } from "react-icons/md";

export default function SingleTourTransferPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [tour, setTour] = useState({});
    const [schedules, setSchedules] = useState([]);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [initialData, setInitialData] = useState({
        vehicles: [],
        drivers: [],
    });

    const { voucherId, tourId } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);

    const deleteVehicleSchedule = async (scheduleId) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete this?");
            if (isConfirm) {
                await axios.delete(`/v2/vouchers/tours/transfers/${scheduleId}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredSchedules = schedules.filter((item) => {
                    return item?._id !== scheduleId;
                });
                setSchedules(JSON.parse(JSON.stringify(filteredSchedules)));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const getSingleTourDetailsWithTransfers = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/v2/vouchers/${voucherId}/tours/${tourId}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setTour(response?.data?.tour);
            setSchedules(response?.data?.vehicleSchedules);

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchVehiclesAndDrivers = async () => {
        try {
            const response = await axios.get("/v2/vouchers/vehicles-drivers", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setInitialData((prev) => {
                return {
                    ...prev,
                    vehicles: response?.data?.vehicles,
                    drivers: response?.data?.drivers,
                };
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getSingleTourDetailsWithTransfers();
        fetchVehiclesAndDrivers();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Voucher Transfer Schedules</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/vouchers/v2" className="text-textColor">
                        Vouchers{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/vouchers/v2" className="text-textColor">
                        {voucherId?.slice(0, 4)}...{voucherId?.slice(-3)}{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Tours </span>
                    <span>{">"} </span>
                    <span>
                        {tourId?.slice(0, 4)}...{tourId?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Transfer </span>
                </div>
            </div>

            {isTransferModalOpen && (
                <VoucherTourTransferModal
                    setIsTransferModalOpen={setIsTransferModalOpen}
                    initialData={initialData}
                    setSchedules={setSchedules}
                />
            )}

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Voucher Tour Transfer Schedules</h1>
                            <button className="px-3" onClick={() => setIsTransferModalOpen(true)}>
                                + Add Transfer
                            </button>
                        </div>
                        <div className="p-6">
                            <h3 className="font-medium mb-1">
                                <span>{tour?.tourName}</span>
                            </h3>
                            <span className="block text-sm text-grayColor">
                                Pickup Date Time:{" "}
                                {tour?.pickupISODateTime
                                    ? moment(tour.pickupISODateTime)
                                          .utcOffset(tour.utcOffset)
                                          .format("MMM DD YYYY HH:mm")
                                    : "N/A"}
                            </span>
                            <span className="block text-sm text-grayColor mt-1">
                                Return Date Time:{" "}
                                {tour?.returnISODateTime
                                    ? moment(tour.returnISODateTime)
                                          .utcOffset(tour.utcOffset)
                                          .format("MMM DD YYYY HH:mm")
                                    : "N/A"}
                            </span>

                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-sm">Selected Qtn Transfers</span>
                                {tour?.qtnTransfers?.map((transfer, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="bg-gray-300 rounded-full text-sm px-2 py-1 cursor-pointer"
                                            onClick={() => setIsTransferModalOpen(true)}
                                        >
                                            + {transfer?.vehicleType?.name} ({transfer?.count})
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {schedules?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Vehicle Schedules Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Date & Time</th>
                                            <th className="font-[500] p-3">Buffered From Time</th>
                                            <th className="font-[500] p-3">Buffered To Time</th>
                                            <th className="font-[500] p-3">Vehicle</th>
                                            <th className="font-[500] p-3">Driver</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {schedules?.map((schedule, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        {moment(schedule.fromISODateTime)
                                                            .utcOffset(schedule.utcOffset)
                                                            .format("MMM DD YYYY HH:mm")}
                                                    </td>
                                                    <td className="p-3">
                                                        {moment(schedule.bufferedFromISODateTime)
                                                            .utcOffset(schedule.utcOffset)
                                                            .format("MMM DD YYYY HH:mm")}
                                                    </td>
                                                    <td className="p-3">
                                                        {moment(schedule.bufferedToISODateTime)
                                                            .utcOffset(schedule.utcOffset)
                                                            .format("MMM DD YYYY HH:mm")}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {
                                                            schedule?.vehicleId?.vehicleModel
                                                                ?.modelName
                                                        }
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {schedule?.driverId?.driverName || "N/A"}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteVehicleSchedule(
                                                                        schedule?._id
                                                                    )
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            {/* <Link to={`${blog?._id}/edit`}>
                                                                <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                    <BiEditAlt />
                                                                </button>
                                                            </Link> */}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
