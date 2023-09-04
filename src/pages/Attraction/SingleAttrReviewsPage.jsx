import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";

import axios from "../../axios";
import { formatDate } from "../../utils";
import { PageLoader, Pagination } from "../../components";

export default function SingleAttrReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [attraction, setAttraction] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalAttractionReviews: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);
    const { id } = useParams();

    const fetchReviews = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/attractions/${id}/reviews?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setReviews(response?.data?.attractionReviews);
            setAttraction(response?.data?.attraction);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalAttractionReviews: response.data?.totalAttractionReviews,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (reviewId) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/attractions/reviews/delete/${reviewId}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredReviews = reviews.filter((review) => {
                    return review?._id !== reviewId;
                });
                setReviews(filteredReviews);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Reviews</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/attractions" className="text-textColor">
                        Attractions{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Reviews</span>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}
                    </span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">{attraction?.title}</h1>
                        </div>

                        {reviews?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Reviews found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">User</th>
                                            <th className="font-[500] p-3">Title</th>
                                            <th className="font-[500] p-3">Description</th>
                                            <th className="font-[500] p-3">Rating</th>
                                            <th className="font-[500] p-3">Date</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {reviews?.map((review, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        <span className="block capitalize">
                                                            {review?.user?.name}
                                                        </span>
                                                        <span>{review?.user?.email}</span>
                                                    </td>
                                                    <td className="p-3">{review?.title}</td>
                                                    <td className="p-3">{review?.description}</td>
                                                    <td className="p-3">
                                                        {review?.rating} &#9734;
                                                    </td>
                                                    <td className="p-3">
                                                        {formatDate(review?.createdAt)}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    handleDelete(review?._id)
                                                                }
                                                            >
                                                                <MdDelete />
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
                                        total={filters?.totalAttractionReviews}
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
