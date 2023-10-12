import React, { useEffect, useState } from "react";
import { BiEditAlt, BiSearch } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "../../axios";
import { PageLoader } from "../../components";
import AddBlogCategoryModal from "../../features/Blogs/components/AddBlogCategoryModal";

export default function BlogsCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryModal, setCategoryModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedCategory, setSelectedCategory] = useState({});

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get("/blogs/categories/all", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setCategories(data?.categories);
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
                await axios.delete(`/blogs/categories/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

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
                <h1 className="font-[600] text-[15px] uppercase">CATEGORIES</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/blogs" className="text-textColor">
                        Blogs{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Categories</span>
                </div>
            </div>

            {categoryModal?.isOpen && (
                <AddBlogCategoryModal
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
                            <h1 className="font-medium">All Categories</h1>
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
                                    Oops.. No Categories found
                                </span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Category Name
                                        </th>
                                        <th className="font-[500] p-3">
                                            Category Description
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
                                                <td className="p-3">
                                                    {category?.description ||
                                                        "N/A"}
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
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
