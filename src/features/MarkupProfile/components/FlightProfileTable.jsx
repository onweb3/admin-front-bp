import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import { Pagination } from "../../../components";
import FlightProfileRow from "./FlightProfileRow";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function FlightProfileTable({}) {
    const [airlines, setAirlines] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const { profileId } = useParams();
    const { id } = useParams();

    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchFlightInitialData = async () => {
        try {
            setIsPageLoading(true);

            if (profileId) {
                const response = await axios.get(
                    `/profile/get-all-airlines/${profileId}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                setAirlines(response.data);
            } else {
                const response = await axios.get(
                    `/profile/b2b/get-all-airlines/${id}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                setAirlines(response.data);
            }
            // const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}`;

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchFlightInitialData();
    }, []);

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Index</th>
                            <th className="font-[500] p-3">Airline Name</th>

                            <th className="font-[500] p-3">Markup Type</th>
                            <th className="font-[500] p-3">Markup </th>

                            <th className="font-[500] p-3">Edit</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {airlines?.map((airline, index) => {
                            return (
                                <FlightProfileRow
                                    index={index}
                                    airline={airline}

                                    // section={section}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* <div className="p-4">
                <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={filters?.totalOrders}
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
            </div> */}
        </div>
    );
}
