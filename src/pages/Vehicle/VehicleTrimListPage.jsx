import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";

import axios from "../../axios";
import { PageLoader } from "../../components";
import { AddVehicleModelModal, AddVehicleTrimModal } from "../../features/Vehicle";
import { config } from "../../constants";

export default function VehicleTrimListPage() {
    const [vehicleTrims, setVehicleTrims] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [vehicleTrimModal, setVehicleTrimModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedVehicleTrim, setSelectedVehicleTrim] = useState({});
    const [vehicleModel, setVehicleModel] = useState({});

    const { jwtToken } = useSelector((state) => state.admin);
    const { makeId, modelId } = useParams();

    const fetchVehicleTrims = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/transfers/vehicles/models/single/${modelId}/trims`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setVehicleTrims(response?.data?.vehicleTrims);
            setVehicleModel(response?.data?.vehicleModel);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const addVehicleTrim = (newVehicleTrim) => {
        setVehicleTrims((prev) => {
            return [newVehicleTrim, ...prev];
        });
    };

    const updateVehicleTrim = (updatedVehicleTrim) => {
        const objIndex = vehicleTrims.findIndex((vTrim) => {
            return vTrim?._id === updatedVehicleTrim?._id;
        });

        let temp = vehicleTrims;
        temp[objIndex] = updatedVehicleTrim;
    };

    const deleteVehicleTrim = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");

            if (isConfirm) {
                await axios.delete(`/transfers/vehicles/trim/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredVehicleTrims = vehicleTrims.filter((vTrim) => {
                    return vTrim?._id !== id;
                });
                setVehicleTrims(filteredVehicleTrims);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVehicleTrims();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Vehicle Trim</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/transfers" className="text-textColor">
                        Transfers{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/transfers/vehicles" className="text-textColor">
                        Vehicles{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/transfers/vehicles/makes" className="text-textColor">
                        Makes{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {makeId?.slice(0, 3)}...{makeId?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Models</span>
                    <span>{">"} </span>
                    <span>
                        {modelId?.slice(0, 3)}...{modelId?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Trim</span>
                </div>
            </div>

            {vehicleTrimModal?.isOpen && (
                <AddVehicleTrimModal
                    vehicleTrimModal={vehicleTrimModal}
                    setVehicleTrimModal={setVehicleTrimModal}
                    selectedVehicleTrim={selectedVehicleTrim}
                    addVehicleTrim={addVehicleTrim}
                    updateVehicleTrim={updateVehicleTrim}
                />
            )}

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">
                                All Vehicle Trim {vehicleModel && `(${vehicleModel?.modelName})`}
                            </h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setVehicleTrimModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add Vehicle Trim
                            </button>
                        </div>
                        {vehicleTrims?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Vehicle Trim Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Trim Name</th>
                                            <th className="font-[500] p-3">Airport Capacity</th>
                                            <th className="font-[500] p-3">Normal Capacity</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {vehicleTrims?.map((vTrim, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">{vTrim?.trimName}</td>
                                                    <td className="p-3">
                                                        {vTrim?.airportSeatingCapacity}
                                                    </td>
                                                    <td className="p-3">
                                                        {vTrim?.normalSeatingCapacity}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteVehicleTrim(vTrim?._id)
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <button
                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                onClick={() => {
                                                                    setSelectedVehicleTrim(vTrim);
                                                                    setVehicleTrimModal({
                                                                        isOpen: true,
                                                                        isEdit: true,
                                                                    });
                                                                }}
                                                            >
                                                                <BiEditAlt />
                                                            </button>
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
