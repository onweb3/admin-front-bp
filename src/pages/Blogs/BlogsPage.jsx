import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { config } from "../../constants";

export default function BlogsPage() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalBlogs: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchBlogs = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/blogs/all?skip=${filters?.skip}&limit=${filters?.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const { blogs, totalBlogs } = response.data;

            setBlogs(blogs);
            setFilters((prev) => {
                return { ...prev, totalBlogs: totalBlogs };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteBlog = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/blogs/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });
                const filteredBlogs = blogs.filter((blog) => blog._id !== id);
                setBlogs(filteredBlogs);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Blogs</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Blogs</span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Blogs</h1>
                            <Link to="add">
                                <button className="px-3">+ Add Blog</button>
                            </Link>
                        </div>
                        {blogs?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Blogs found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Title
                                            </th>
                                            <th className="font-[500] p-3">
                                                Category
                                            </th>
                                            <th className="font-[500] p-3">
                                                Tags
                                            </th>
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {blogs?.map((blog, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-[10px]">
                                                            <img
                                                                src={
                                                                    config.SERVER_URL +
                                                                    blog?.thumbnail
                                                                }
                                                                alt=""
                                                                className="w-[40px] rounded max-h-[40px]"
                                                            />
                                                            <span>
                                                                {blog?.title}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {blog?.category
                                                            ?.categoryName ||
                                                            "N/A"}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex flex-wrap gap-[10px]">
                                                            {blog?.tags?.map(
                                                                (
                                                                    tag,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <span
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="bg-[#f3f3f9] px-2 py-1 rounded"
                                                                        >
                                                                            {
                                                                                tag
                                                                            }
                                                                        </span>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteBlog(
                                                                        blog?._id
                                                                    )
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <Link
                                                                to={`${blog?._id}/edit`}
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
                                        total={filters?.totalBlogs}
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
