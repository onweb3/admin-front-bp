import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import { PageLoader, Pagination } from "../../components";
import axios from "../../axios";
import { deleteDriver } from "../../redux/slices/generalSlice";
import { formatDate } from "../../utils";

export default function DriversPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [drivers, setDrivers] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalDrivers: 0,
    });
    const { jwtToken } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    const delDriver = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/drivers/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                dispatch(deleteDriver(id));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchDrivers = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/drivers/all?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setDrivers(response?.data?.drivers);
            setFilters((prev) => {
                return { ...prev, totalDrivers: response?.data?.totalDrivers };
            });

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Drivers</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Drivers </span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Drivers</h1>
                            <Link to="add">
                                <button className="px-3">+ Add Driver</button>
                            </Link>
                        </div>
                        {drivers?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Drivers Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                            <tr>
                                                <th className="font-[500] p-3">Driver Name</th>
                                                <th className="font-[500] p-3">Nationality</th>
                                                <th className="font-[500] p-3">Email</th>
                                                <th className="font-[500] p-3">Phone Number</th>
                                                <th className="font-[500] p-3">Whatsapp Number</th>
                                                <th className="font-[500] p-3">License Number</th>
                                                <th className="font-[500] p-3">License Exp Date</th>
                                                <th className="font-[500] p-3">License Types</th>
                                                <th className="font-[500] p-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {drivers?.map((driver, index) => {
                                                return (
                                                    <tr
                                                        key={index}
                                                        className="border-b border-tableBorderColor"
                                                    >
                                                        <td className="p-3">
                                                            {driver?.driverName}
                                                        </td>
                                                        <td className="p-3">
                                                            {driver?.nationality}
                                                        </td>
                                                        <td className="p-3">{driver?.email}</td>
                                                        <td className="p-3">
                                                            {driver?.phoneNumber}
                                                        </td>
                                                        <td className="p-3">
                                                            {driver?.whatsappNumber}
                                                        </td>
                                                        <td className="p-3">
                                                            {driver?.licenseNumber}
                                                        </td>
                                                        <td className="p-3">
                                                            {formatDate(driver?.licenseExpDate)}
                                                        </td>
                                                        <td className="p-3">
                                                            {driver?.availLicenseTypes?.length > 0
                                                                ? driver?.availLicenseTypes?.map(
                                                                      (item, index) => {
                                                                          return (
                                                                              <span key={index}>
                                                                                  {index !== 0
                                                                                      ? ", "
                                                                                      : ""}
                                                                                  {
                                                                                      item?.licenseType
                                                                                  }
                                                                              </span>
                                                                          );
                                                                      }
                                                                  )
                                                                : "N/A"}
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex gap-[10px]">
                                                                <button
                                                                    className="h-auto bg-transparent text-red-500 text-xl"
                                                                    onClick={() =>
                                                                        delDriver(driver?._id)
                                                                    }
                                                                >
                                                                    <MdDelete />
                                                                </button>
                                                                <Link to={`${driver?._id}/edit`}>
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
                                </div>

                                <div className="p-4">
                                    <Pagination
                                        limit={filters?.limit}
                                        skip={filters?.skip}
                                        total={filters?.totalDrivers}
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
