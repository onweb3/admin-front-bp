import React, { useEffect } from "react";
import { useState } from "react";
import { BsFillChatRightQuoteFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import axios from "../../axios";
import { PageLoader } from "../../components";
import TopAgentsList from "../../features/Quotation/TopAgentsList";
import TopExcursionsList from "../../features/Quotation/TopExcursionList";
import TopHotelsList from "../../features/Quotation/TopHotelsList";

function QuotationDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({});
    const [filters, setFilters] = useState({
        dateFrom: new Date(new Date().setDate(new Date().getDate() - 30)),
        dateTo: "",
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const handleFilterChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/quotations/dashboard?dateFrom=${filters?.dateFrom}&dateTo=${filters?.dateTo}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setData(response.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    return (
        <div className="p-6">
            <div className="mb-7 flex flex-wrap  justify-between">
                <h1 className="text-lg font-[600]">Dashboard</h1>
                <div className="flex items-end justify-end gap-[10px]">
                    <div>
                        <label htmlFor="">From</label>
                        <input
                            type="date"
                            value={
                                filters?.dateFrom
                                    ? new Date(filters.dateFrom)
                                          ?.toISOString()
                                          ?.substring(0, 10)
                                    : ""
                            }
                            name="dateFrom"
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="">To</label>
                        <input
                            type="date"
                            value={
                                filters?.dateTo
                                    ? new Date(filters.dateTo)
                                          ?.toISOString()
                                          ?.substring(0, 10)
                                    : ""
                            }
                            name="dateTo"
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <>
                    <div className="grid grid-cols-3 gap-[2em]">
                        <div className="w-full bg-[#073B4C] p-5 text-center rounded text-white">
                            <span className="flex items-center justify-center text-2xl">
                                <BsFillChatRightQuoteFill />
                            </span>
                            <span className="block text-sm font-medium mt-2">
                                Total Quotations
                            </span>
                            <span className="block text-xl font-bold mt-2">
                                {data?.totalQuotations || 0}
                            </span>
                        </div>
                        <div className="w-full bg-[#118AB2] p-5 text-center rounded text-white">
                            <span className="flex items-center justify-center text-2xl">
                                <BsFillChatRightQuoteFill />
                            </span>
                            <span className="block text-sm font-medium mt-2">
                                Total Amendments
                            </span>
                            <span className="block text-xl font-bold mt-2">
                                {data?.totalAmendments || 0}
                            </span>
                        </div>
                        <div className="w-full bg-[#EF476F] p-5 text-center rounded text-white">
                            <span className="flex items-center justify-center text-2xl">
                                <BsFillChatRightQuoteFill />
                            </span>
                            <span className="block text-sm font-medium mt-2">
                                Total Agents
                            </span>
                            <span className="block text-xl font-bold mt-2">
                                {data?.totalAgents || 0}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-[2em] mt-[2em]">
                        <TopExcursionsList
                            topExcursions={data?.topExcursions}
                        />
                        <TopHotelsList topHotels={data?.topHotels} />
                        <TopAgentsList topAgents={data?.topAgents} />
                    </div>
                </>
            )}
        </div>
    );
}

export default QuotationDashboard;
