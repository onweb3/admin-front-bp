import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import { Pagination } from "../../../components";
import A2aProfileRow from "./A2aProfileRow";
import AttractionProfileRow from "./AttractionProfileRow";
import VisaProfileRow from "./visaProfileRow";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function A2aProfileListTable({}) {
    const [initalA2aTypeList, setIntialA2aTypeList] = useState([]);
    const [a2aTypeList, setA2aTypeList] = useState([]);
    const [a2a, setA2a] = useState([]);

    const [isPageLoading, setIsPageLoading] = useState(false);
    const { profileId } = useParams();
    const { id } = useParams();

    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchA2aInitialData = async () => {
        try {
            setIsPageLoading(true);

            if (profileId) {
                const response = await axios.get(
                    `/profile/get-all-a2atype/${profileId}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                setA2aTypeList(response.data);
            } else {
                const response = await axios.get(
                    `/profile/b2b/get-all-a2atype/${id}`,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                setA2aTypeList(response.data);
            }
            // const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}`;

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchA2aInitialData();
    }, []);

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Index</th>
                            <th className="font-[500] p-3">Airport From</th>

                            <th className="font-[500] p-3">Airport To</th>

                            <th className="font-[500] p-3">Markup Type</th>
                            <th className="font-[500] p-3">Markup </th>

                            <th className="font-[500] p-3">Edit</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {a2aTypeList?.map((a2aType, index) => {
                            return (
                                <A2aProfileRow
                                    index={index}
                                    a2aType={a2aType}

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
