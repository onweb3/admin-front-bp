import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { AddVehicleMakeModal } from "../../features/Vehicle";
import { AiFillEye } from "react-icons/ai";

export default function VehicleMakesPage() {
    const [vehicleMakes, setVehicleMakes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [vehicleMakeModal, setVehicleMakeModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedVehicleMake, setSelectedVehicleMake] = useState({});
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalVehicleMakes: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchVehicleMakes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/transfers/vehicles/makes/all?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setVehicleMakes(response?.data?.vehicleMakes);
            setFilters((prev) => {
                return { ...prev, totalVehicleMakes: response?.data?.totalVehicleMakes };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const addVehicleMake = (newVehicleMake) => {
        setVehicleMakes((prev) => {
            return [newVehicleMake, ...prev];
        });
    };

    const updateVehicleMake = (updatedMake) => {
        const objIndex = vehicleMakes.findIndex((make) => {
            return make?._id === updatedMake?._id;
        });

        let temp = vehicleMakes;
        temp[objIndex] = updatedMake;
    };

    const deleteVehicleMake = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");

            if (isConfirm) {
                await axios.delete(`/transfers/vehicles/makes/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredMakes = vehicleMakes.filter((make) => {
                    return make?._id !== id;
                });
                setVehicleMakes(filteredMakes);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVehicleMakes();
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Vehicle Makes</h1>
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
                    <span>Makes</span>
                </div>
            </div>

            {vehicleMakeModal?.isOpen && (
                <AddVehicleMakeModal
                    vehicleMakeModal={vehicleMakeModal}
                    setVehicleMakeModal={setVehicleMakeModal}
                    selectedVehicleMake={selectedVehicleMake}
                    addVehicleMake={addVehicleMake}
                    updateVehicleMake={updateVehicleMake}
                />
            )}

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Vehicle Makes</h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setVehicleMakeModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add Vehicle Make
                            </button>
                        </div>
                        {vehicleMakes?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Vehicle Makes found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Company Name</th>
                                            <th className="font-[500] p-3 text-center">Vehicle Models</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {vehicleMakes?.map((make, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">{make?.companyName}</td>
                                                    <td className="p-3 text-center">
                                                        <Link
                                                            to={`${make?._id}/models`}
                                                        >
                                                            <button className="bg-transparent text-[#222] text-lg h-auto">
                                                                <AiFillEye />
                                                            </button>
                                                        </Link>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteVehicleMake(make?._id)
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <button
                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                onClick={() => {
                                                                    setSelectedVehicleMake(make);
                                                                    setVehicleMakeModal({
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

                                <div className="p-4">
                                    <Pagination
                                        limit={filters?.limit}
                                        skip={filters?.skip}
                                        total={filters?.totalVehicleMakes}
                                        incOrDecSkip={(number) =>
                                            setFilters((prev) => {
                                                return {
                                                    ...prev,
                                                    skip: prev.skip + number,
                                                };
                                            })
                                        }
                                        updateSkip={(skip) =>
                                            setFilters((prev) => {
                                                return { ...prev, skip };
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
