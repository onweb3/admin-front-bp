import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { UpsertHotelStarCategoriesModal } from "../../features/HotelStarCategories";

export default function HotelStarCategoriesPage() {
    const [isLoading, setIsLaoding] = useState(false);
    const [starCategories, setStarCategories] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalStarCategories: 0,
        searchQuery: "",
    });
    const [starCategoriesModal, setStarCategoriesModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedStarCategory, setSelectedStarCategory] = useState({});

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchStarCategories = async () => {
        try {
            setIsLaoding(true);

            const response = await axios.get(
                `/hotels/star-categories/all?skip=${filters.skip}&limit=${filters.limit}&searchQuery=${filters.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setStarCategories(response?.data?.starCategories);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalStarCategories: response?.data?.totalStarCategories,
                };
            });
            setIsLaoding(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteStarCategory = async (id) => {
        try {
            const isConfrm = window.confirm("Are you sure to delete?");
            if (isConfrm) {
                await axios.delete(`/hotels/star-categories/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredStarCategories = starCategories?.filter((item) => {
                    return item?._id !== id;
                });
                setStarCategories(filteredStarCategories);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchStarCategories();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Star Categories</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Star Categories</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Star Categories</h1>
                        <div className="flex items-center gap-3">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (filters?.skip !== 0) {
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                skip: 0,
                                            };
                                        });
                                    } else {
                                        fetchStarCategories();
                                    }
                                }}
                                className="flex items-center gap-3"
                            >
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    onChange={(e) => {
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                searchQuery: e.target.value,
                                            };
                                        });
                                    }}
                                    value={filters.searchQuery || ""}
                                />
                                <button type="submit" className="px-3 bg-primaryColor">
                                    Search
                                </button>
                            </form>
                            <button
                                className="px-3"
                                onClick={() => {
                                    setStarCategoriesModal({
                                        isOpen: true,
                                        isEdit: false,
                                    });
                                }}
                            >
                                + Add Star Category
                            </button>
                        </div>

                        {starCategoriesModal?.isOpen && (
                            <UpsertHotelStarCategoriesModal
                                starCategoriesModal={starCategoriesModal}
                                setStarCategoriesModal={setStarCategoriesModal}
                                selectedStarCategory={selectedStarCategory}
                                starCategories={starCategories}
                                setStarCategories={setStarCategories}
                            />
                        )}
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : starCategories?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Star Categories Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Category Code</th>
                                        <th className="font-[500] p-3">Category Name</th>
                                        <th className="font-[500] p-3">Order</th>
                                        <th className="font-[500] p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {starCategories?.map((category, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">{category?.categoryCode}</td>
                                                <td className="p-3 capitalize">
                                                    {category?.categoryName}
                                                </td>
                                                <td className="p-3">{category?.order}</td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                deleteStarCategory(category?._id)
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <button
                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                            onClick={() => {
                                                                setSelectedStarCategory(category);
                                                                setStarCategoriesModal({
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
                                    total={filters?.totalStarCategories}
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
