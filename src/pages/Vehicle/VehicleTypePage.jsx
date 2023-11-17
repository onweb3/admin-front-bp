import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import axios from "../../axios";
import { PageLoader } from "../../components";
import { AddVehicleTypeModal } from "../../features/Vehicle";

export default function VehicleTypePage() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryModal, setCategoryModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedCategory, setSelectedCategory] = useState({});
    const [vehicleCategory, setVehicleCategory] = useState({});

    const { jwtToken } = useSelector((state) => state.admin);
    const { categoryId } = useParams();

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/transfers/vehicles/categories/single/${categoryId}/vehicle-type`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setCategories(response?.data?.vehicleTypes);
            setVehicleCategory(response?.data?.vehicleCategory);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const addCategory = (newCategory) => {
        setCategories((prev) => {
            return [newCategory, ...prev];
        });
    };

    const updateCategory = (updatedCategory) => {
        const objIndex = categories.findIndex((category) => {
            return category?._id === updatedCategory?._id;
        });

        let temp = categories;
        temp[objIndex] = updatedCategory;
    };

    const deleteCategory = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");

            if (isConfirm) {
                await axios.delete(
                    `/transfers/vehicles/vehicle-type/delete/${id}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                const filteredCategories = categories.filter((category) => {
                    return category?._id !== id;
                });
                setCategories(filteredCategories);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Vehicle Types
                </h1>
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
                    <Link
                        to="/transfers/vehicles/categories"
                        className="text-textColor"
                    >
                        Categories{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {categoryId?.slice(0, 3)}...{categoryId?.slice(-3)}
                    </span>
                    <span>{">"} </span>
                    <span>Vehicle Type</span>
                </div>
            </div>

            {categoryModal?.isOpen && (
                <AddVehicleTypeModal
                    categoryModal={categoryModal}
                    selectedCategory={selectedCategory}
                    setCategoryModal={setCategoryModal}
                    addCategory={addCategory}
                    updateCategory={updateCategory}
                />
            )}

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">
                                All Vehicle Vehicle Types{" "}
                                {vehicleCategory &&
                                    `(${vehicleCategory?.categoryName})`}
                            </h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setCategoryModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add Vehicle Type
                            </button>
                        </div>
                        {categories?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Vehicle Vehicle Type found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Index
                                            </th>{" "}
                                            <th className="font-[500] p-3">
                                                Name
                                            </th>{" "}
                                            <th className="font-[500] p-3">
                                                Normal Seating Capacity
                                            </th>{" "}
                                            <th className="font-[500] p-3">
                                                Airport Seating Capacity
                                            </th>
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {categories?.map((category, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        {index + 1}
                                                    </td>
                                                    <td className="p-3">
                                                        {category?.name}
                                                    </td>
                                                    <td className="p-3">
                                                        {
                                                            category?.normalOccupancy
                                                        }
                                                    </td>
                                                    <td className="p-3">
                                                        {
                                                            category?.airportOccupancy
                                                        }
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteCategory(
                                                                        category?._id
                                                                    )
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <button
                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                onClick={() => {
                                                                    setSelectedCategory(
                                                                        category
                                                                    );
                                                                    setCategoryModal(
                                                                        {
                                                                            isOpen: true,
                                                                            isEdit: true,
                                                                        }
                                                                    );
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
