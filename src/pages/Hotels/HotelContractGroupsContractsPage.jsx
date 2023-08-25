import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useOutletContext, useParams } from "react-router-dom";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { HotelContractTableRow } from "../../features/HotelContract";

function HotelContractGroupsContractPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalContracts: 0,
        searchQuery: "",
    });
    const [contractGroup, setContractGroup] = useState({});

    const { contractGroupId } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const { setSelectedSection } = useOutletContext();

    const fetchContracts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `/hotels/contracts/contract-group/${contractGroupId}?skip=${filters?.skip}&limit=${filters?.limit}&searchQuery=${filters?.searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setContracts(response.data?.contracts);
            setContractGroup(response?.data?.contractGroup);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalContracts: response?.data?.totalContracts,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, [filters.skip, filters.limit]);

    useEffect(() => {
        setSelectedSection("contract-groups");
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between border-b border-dashed p-4">
                <h1 className="font-medium">
                    Hotel Contracts
                    {Object.keys(contractGroup)?.length > 0 &&
                        ` - (${contractGroup?.contractName} - ${contractGroup?.contractCode})`}
                </h1>
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
                                fetchContracts();
                            }
                        }}
                        className="flex items-center gap-2"
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
                        />
                        <button type="submit" className="px-3 bg-primaryColor">
                            Search
                        </button>
                    </form>
                    <Link to={`add`}>
                        <button className="px-3">+ Add Contract</button>
                    </Link>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : !contracts || contracts?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm text-grayColor block mt-[6px]">
                        Oops.. No Contracts Found
                    </span>
                </div>
            ) : (
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                <tr>
                                    <th className="font-[500] p-3">Sell From</th>
                                    <th className="font-[500] p-3">Sell To</th>
                                    <th className="font-[500] p-3">Base Plan</th>
                                    <th className="font-[500] p-3">Rate Name</th>
                                    <th className="font-[500] p-3">Rate Code</th>
                                    <th className="font-[500] p-3">Priority</th>
                                    <th className="font-[500] p-3">Status</th>
                                    <th className="font-[500] p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {contracts.map((contract, index) => (
                                    <HotelContractTableRow
                                        contract={contract}
                                        key={index}
                                        setContracts={setContracts}
                                        contracts={contracts}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4">
                        <Pagination
                            limit={filters?.limit}
                            skip={filters?.skip}
                            total={filters?.totalContracts}
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

export default HotelContractGroupsContractPage;
