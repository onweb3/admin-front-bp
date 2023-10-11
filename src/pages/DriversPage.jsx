import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddDriverModal from "../features/Drivers/components/AddDriverModal";
import { BiEditAlt } from "react-icons/bi";
import { PageLoader } from "../components";
import { MdDelete } from "react-icons/md";
import axios from "../axios";
import { deleteDriver } from "../redux/slices/generalSlice";

export default function DriversPage() {
    const [driverModal, setDriverModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedDriver, setSelectedDriver] = useState({});

    const { drivers, isGeneralLoading } = useSelector((state) => state.general);
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

            {driverModal?.isOpen && (
                <AddDriverModal
                    driverModal={driverModal}
                    setDriverModal={setDriverModal}
                    selectedDriver={selectedDriver}
                />
            )}

            {isGeneralLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Drivers</h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setDriverModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add Driver
                            </button>
                        </div>
                        {drivers?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Drivers found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Driver Name</th>
                                            <th className="font-[500] p-3">Phone Number</th>
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
                                                    <td className="p-3">{driver?.driverName}</td>
                                                    <td className="p-3 capitalize">
                                                        {driver?.phoneNumber}
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
                                                            <button
                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                onClick={() => {
                                                                    setSelectedDriver(driver);
                                                                    setDriverModal({
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
