import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import { avatarImg } from "../../assets/images";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { config } from "../../constants";
import SubAgentsTableRow from "../../features/Resellers/components/SubAgentsTableRow";

export default function SingleResellerSubAgentsPage() {
    const [subAgents, setSubAgents] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalSubAgents: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { setTotalSubAgents } = useOutletContext();

    const fetchSubAgents = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/resellers/${id}/sub-agents?skip=${filters.skip}&limit=${filters.limit}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const { totalSubAgents, subAgents } = response.data;
            setSubAgents(subAgents);
            setFilters((prev) => {
                return { ...prev, totalSubAgents };
            });
            setTotalSubAgents(totalSubAgents);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchSubAgents();
    }, [filters.skip, filters.limit]);

    return (
        <div>
            {isLoading ? (
                <PageLoader />
            ) : subAgents?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm  text-grayColor block mt-[6px]">
                        Oops.. No Resellers found
                    </span>
                </div>
            ) : (
                <div>
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                            <tr>
                                <th className="font-[500] p-3">Agent Code</th>
                                <th className="font-[500] p-3">Title</th>
                                <th className="font-[500] p-3">User</th>
                                <th className="font-[500] p-3">Country</th>
                                <th className="font-[500] p-3">Phone Number</th>
                                <th className="font-[500] p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {subAgents?.map((subAgent, index) => {
                                return (
                                    <SubAgentsTableRow
                                        key={index}
                                        reseller={subAgent}
                                        referredBy={false}
                                    />
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="p-4">
                        <Pagination
                            limit={filters?.limit}
                            skip={filters?.skip}
                            total={filters?.totalSubAgents}
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
    );
}
