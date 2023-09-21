import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import { Pagination } from "../../../components";
import AttractionProfileRow from "./AttractionProfileRow";
import HotelStarCategoryRow from "./HotelStarCategoryRow";
import HotelRoomTypeTableRow from "./HotelRoomTableRow";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function HotelRoomTypeTable({ type }) {
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        total: 0,
        searchInput: "",
    });

    const [hotels, setHotels] = useState([]);
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);
    const { profileId, marketId } = useParams();
    const { id } = useParams();

    const fetchHotelInitialData = async () => {
        try {
            setIsPageLoading(true);
            if (type === "market") {
                if (marketId) {
                    const response = await axios.get(
                        `/profile/get-all-hotels?skip=${filters.skip}&limit=${filters.limit}&searchInput=${filters.searchInput}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );
                    setFilters((prev) => {
                        return {
                            ...prev,
                            total: response?.data?.total,
                        };
                    });
                    setHotels(response.data.hotels);
                } else {
                    const response = await axios.get(
                        `/profile/b2b/get-all-hotels?skip=${filters.skip}&limit=${filters.limit}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );
                    setFilters((prev) => {
                        return {
                            ...prev,
                            total: response?.data?.total,
                        };
                    });
                    setHotels(response.data.hotels);
                }
            } else {
                if (profileId) {
                    const response = await axios.get(
                        `/profile/get-all-hotels?skip=${filters.skip}&limit=${filters.limit}&searchInput=${filters.searchInput}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );
                    setFilters((prev) => {
                        return {
                            ...prev,
                            total: response?.data?.total,
                        };
                    });
                    setHotels(response.data.hotels);
                } else {
                    const response = await axios.get(
                        `/profile/b2b/get-all-hotels?skip=${filters.skip}&limit=${filters.limit}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );
                    setFilters((prev) => {
                        return {
                            ...prev,
                            total: response?.data?.total,
                        };
                    });
                    setHotels(response.data.hotels);
                }
            }

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchHotelInitialData();
    }, [filters.skip, filters.limit, filters.searchInput]);
    return (
        <div>
            <div className="overflow-x-auto ">
                <div className="flex items-center justify-between border-b border-dashed pb-4">
                    <h1 className="font-medium">All Hotels</h1>
                    <div className="flex items-center gap-[15px]">
                        <form
                            action=""
                            onSubmit={(e) => {
                                e.preventDefault();
                                fetchHotelInitialData({ ...filters });
                                // let params = prevSearchParams();
                                // setSearchParams({
                                //     ...params,
                                //     search: filters.searchInput,
                                //     skip: 0,
                                // });
                            }}
                            className="flex items-center gap-[10px]"
                        >
                            <input
                                type="text"
                                placeholder="Search here..."
                                value={filters.searchInput || ""}
                                onChange={(e) =>
                                    setFilters((prev) => {
                                        return {
                                            ...prev,
                                            searchInput: e.target.value,
                                        };
                                    })
                                }
                            />
                            {/* <button className="px-5">Search</button> */}
                        </form>
                    </div>
                </div>
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Hotels</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm ">
                        {hotels?.map((hotel, index) => {
                            return (
                                // <div>category</div>
                                <HotelRoomTypeTableRow
                                    key={hotel._id}
                                    hotel={hotel}
                                    type={type}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-4">
                <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={filters?.total}
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
    );
}
