import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { AddVehicleCategoryModal } from "../../features/Vehicle";
import { AiFillEye } from "react-icons/ai";

export default function VehicleCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryModal, setCategoryModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedCategory, setSelectedCategory] = useState({});
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalVehicleCategories: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/transfers/vehicles/categories/all?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setCategories(response?.data?.vehicleCategories);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalVehicleCategories:
                        response?.data?.totalVehicleCategories,
                };
            });
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
                    `/transfers/vehicles/categories/delete/${id}`,
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
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Vehicle CATEGORIES
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
                    <span>Categories</span>
                </div>
            </div>

            {categoryModal?.isOpen && (
                <AddVehicleCategoryModal
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
                                All Vehicle Categories
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
                                + Add Category
                            </button>
                        </div>
                        {categories?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Vehicle Categories found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Category Name
                                            </th>
                                            <th className="font-[500] p-3 text-center">
                                                Vehicle Type
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
                                                        {category?.categoryName}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <Link
                                                            to={`${category?._id}/vehicle-type`}
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

                                <div className="p-4">
                                    <Pagination
                                        limit={filters?.limit}
                                        skip={filters?.skip}
                                        total={filters?.totalVehicleCategories}
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
