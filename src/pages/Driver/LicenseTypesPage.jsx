import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { AddVehicleCategoryModal } from "../../features/Vehicle";
import { AiFillEye } from "react-icons/ai";
import { AddLicenseTypeModal } from "../../features/Drivers";

export default function LicenseTypesPage() {
    const [licenseTypes, setLicenseTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [licenseTypeModal, setLicenseTypeModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedLicenseType, setSelectedLicenseType] = useState({});

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchLicenseTypes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`/drivers/license-types/all`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setLicenseTypes(response?.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const addLicenseType = (newLicenseType) => {
        setLicenseTypes((prev) => {
            return [newLicenseType, ...prev];
        });
    };

    const updateLicenseType = (updatedLicenseType) => {
        const objIndex = licenseTypes.findIndex((licenseType) => {
            return licenseType?._id === updatedLicenseType?._id;
        });

        let temp = licenseTypes;
        temp[objIndex] = updatedLicenseType;
    };

    const deleteLicenseType = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");

            if (isConfirm) {
                await axios.delete(`/drivers/license-types/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredLicenseTypes = licenseTypes.filter((licenseType) => {
                    return licenseType?._id !== id;
                });
                setLicenseTypes(filteredLicenseTypes);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchLicenseTypes();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">License Types</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>License Types</span>
                </div>
            </div>

            {licenseTypeModal?.isOpen && (
                <AddLicenseTypeModal
                    licenseTypeModal={licenseTypeModal}
                    setLicenseTypeModal={setLicenseTypeModal}
                    selectedLicenseType={selectedLicenseType}
                    addLicenseType={addLicenseType}
                    updateLicenseType={updateLicenseType}
                />
            )}

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All License Types</h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setLicenseTypeModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add License Type
                            </button>
                        </div>
                        {licenseTypes?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No License Types Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">License Type</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {licenseTypes?.map((lcType, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">{lcType?.licenseType}</td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteLicenseType(lcType?._id)
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <button
                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                onClick={() => {
                                                                    setSelectedLicenseType(lcType);
                                                                    setLicenseTypeModal({
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
