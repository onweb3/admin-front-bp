import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { FeaturedHotelModal } from "../../features/FeaturedHotels";
import { config } from "../../constants";

export default function FeaturedHotelsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [featuredHotels, setFeaturedHotels] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        hotelName: "",
        totalFeaturedHotels: 0,
    });
    const [featuredModal, setFeaturedModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedFeaturedHotel, setSelectedFeaturedHotel] = useState({});

    const { jwtToken } = useSelector((state) => state.admin);

    const addFeaturedHotel = (newFeaturedHotel) => {
        setFeaturedHotels((prev) => {
            return [newFeaturedHotel, ...prev];
        });
    };

    const updateFeaturedHotel = (updatedFeaturedHotel) => {
        const objIndex = featuredHotels.findIndex((item) => {
            return item?._id === updatedFeaturedHotel?._id;
        });

        let temp = featuredHotels;
        temp[objIndex] = updatedFeaturedHotel;
    };

    const deleteFeaturedHotel = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/hotels/featured/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredFeaturedHotels = featuredHotels?.filter((item) => item?._id !== id);
                setFeaturedHotels(filteredFeaturedHotels);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchFeaturedHotels = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/hotels/featured/all?skip=${filters.skip}&limit=${filters.limit}&hotelName=${filters.hotelName}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setFeaturedHotels(response?.data?.featuredHotels);
            setFilters((prev) => {
                return { ...prev, totalFeaturedHotels: response?.data?.totalFeaturedHotels };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchFeaturedHotels();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Featured Hotels</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Featured Hotels</span>
                </div>
            </div>

            {featuredModal?.isOpen && (
                <FeaturedHotelModal
                    featuredModal={featuredModal}
                    setFeaturedModal={setFeaturedModal}
                    selectedFeaturedHotel={selectedFeaturedHotel}
                    addFeaturedHotel={addFeaturedHotel}
                    updateFeaturedHotel={updateFeaturedHotel}
                />
            )}

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Featured Hotels</h1>
                            <button
                                className="px-3"
                                onClick={() => {
                                    setFeaturedModal({ isOpen: true, isEdit: false });
                                }}
                            >
                                + Add Featured Hotel
                            </button>
                        </div>
                        {featuredHotels?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Featured Hotels Found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">Hotel</th>
                                            <th className="font-[500] p-3">Tag Line</th>
                                            <th className="font-[500] p-3">Show Home Page</th>
                                            <th className="font-[500] p-3">Priority</th>
                                            <th className="font-[500] p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {featuredHotels?.map((item, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-[10px]">
                                                            <img
                                                                src={
                                                                    item?.thumbnail?.isRelative ===
                                                                    true
                                                                        ? config.SERVER_URL +
                                                                          item?.thumbnail?.path
                                                                        : item?.thumbnail?.path
                                                                }
                                                                alt=""
                                                                className="w-[40px] rounded max-h-[40px]"
                                                            />
                                                            <div>
                                                                <span>{item?.hotelName}</span>
                                                                <span className="block text-grayColor text-[12px]">
                                                                    {item?.hotelId?.address}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        {item?.tagLine || "N/A"}
                                                    </td>
                                                    <td className="p-3">
                                                        {item?.showHomePage === true
                                                            ? "True"
                                                            : "False"}
                                                    </td>
                                                    <td className="p-3">{item?.priority || 0}</td>
                                                    <td className="p-3">
                                                        <div className="flex gap-[10px]">
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() =>
                                                                    deleteFeaturedHotel(item?._id)
                                                                }
                                                            >
                                                                <MdDelete />
                                                            </button>
                                                            <button
                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                onClick={() => {
                                                                    setSelectedFeaturedHotel(item);
                                                                    setFeaturedModal({
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
                                        total={filters?.totalFeaturedHotels}
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
