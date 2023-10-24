import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import { PageLoader, Pagination } from "../../../components";
import FlightProfileRow from "./FlightProfileRow";
import InsuranceProfileRow from "./InsuranceProfileRow";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function InsuranceProfileTable({ type }) {
    const [plans, setPlans] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const { profileId, marketId } = useParams();
    const { id } = useParams();

    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchInsuranceInitialData = async () => {
        try {
            setIsPageLoading(true);

            if (type === "market") {
                if (marketId) {
                    const response = await axios.get(
                        `/profile/get-all-insurance/${marketId}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setPlans(response.data);
                } else {
                    const response = await axios.get(
                        `/profile/b2b/get-all-insurance/${id}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setPlans(response.data);
                }
            } else {
                if (profileId) {
                    const response = await axios.get(
                        `/profile/get-all-insurance/${profileId}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setPlans(response.data);
                } else {
                    const response = await axios.get(
                        `/profile/b2b/get-all-insurance/${id}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setPlans(response.data);
                }
            }

            // const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}`;

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchInsuranceInitialData();
    }, []);

    return (
        <div>
            <div className="overflow-x-auto">
                {isPageLoading ? (
                    <PageLoader />
                ) : plans?.length < 1 ? (
                    <div className="p-6 flex flex-col items-center">
                        <span className="text-sm text-grayColor block mt-[6px]">
                            Oops.. No insurance found
                        </span>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                            <tr>
                                <th className="font-[500] p-3">Index</th>
                                <th className="font-[500] p-3">Plans Name</th>

                                <th className="font-[500] p-3">Markup Type</th>
                                <th className="font-[500] p-3">Markup </th>

                                <th className="font-[500] p-3">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {plans?.map((plan, index) => {
                                return (
                                    <InsuranceProfileRow
                                        index={index}
                                        plan={plan}
                                        type={type}

                                        // section={section}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                )}
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
