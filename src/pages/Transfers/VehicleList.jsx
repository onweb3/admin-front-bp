import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { config } from "../../constants";

export default function VehicleListPage() {
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        total: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchCategory = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/transfer/vehicle/all?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setVehicles(response?.data?.vehicles);
            setFilters((prev) => {
                return {
                    ...prev,
                    total: response?.data?.total,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteVehicle = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/transfer/vehicle/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredVehicles = vehicles.filter((vehicle) => {
                    return vehicle?._id !== id;
                });
                setVehicles(filteredVehicles);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, [filters?.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Vehicle</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Vehicle</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Vehicle </h1>
                        <Link to="add">
                            <button className="px-3">+ Add Vehicle</button>
                        </Link>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : vehicles?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Vehicle Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Index
                                        </th>
                                        <th className="font-[500] p-3">Name</th>
                                        <th className="font-[500] p-3">
                                            Normal Occupancy
                                        </th>
                                        <th className="font-[500] p-3">
                                            Airport Occupancy
                                        </th>
                                        <th className="font-[500] p-3">
                                            Image
                                        </th>

                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {vehicles?.map((vehicle, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                {" "}
                                                <td className="p-3">
                                                    {index + 1}
                                                </td>
                                                <td className="p-3">
                                                    {vehicle?.name}
                                                </td>
                                                <td className="p-3">
                                                    {vehicle?.normalOccupancy}
                                                </td>
                                                <td className="p-3">
                                                    {vehicle?.airportOccupancy}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-[10px]">
                                                        <img
                                                            src={
                                                                config.SERVER_URL +
                                                                vehicle?.image
                                                            }
                                                            alt=""
                                                            className="w-[40px] h-[40px] rounded object-cover"
                                                        />
                                                        <span>
                                                            {
                                                                vehicle?.airlineName
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteVehicle(
                                                                    vehicle?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <Link
                                                            to={`${vehicle?._id}/edit`}
                                                        >
                                                            <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                <BiEditAlt />
                                                            </button>
                                                        </Link>
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
                                    total={filters?.total}
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
        </div>
    );
}
