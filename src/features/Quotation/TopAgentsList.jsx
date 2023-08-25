import React from "react";

export default function TopAgentsList({ topAgents }) {
    return (
        <div className="bg-[#fff] shadow rounded">
            <div className="p-5 border-b">
                <h1 className="font-medium text-base">Top Agents</h1>
            </div>
            <div className="p-5 text-[15px]">
                {topAgents?.length < 1 || !topAgents ? (
                    <div className="text-center">
                        <span className="text-sm text-gray-500">
                            No data found
                        </span>
                    </div>
                ) : (
                    topAgents?.map((agent, index) => {
                        return (
                            <div
                                key={index}
                                className="flex items-start gap-[15px] py-2"
                            >
                                <span>#{index + 1}</span>
                                <div className="flex-1">
                                    <span className="block">
                                        {agent?.reseller?.name}
                                    </span>
                                    <span className="block">
                                        {agent?.reseller?.email}
                                    </span>
                                </div>
                                <span className="font-medium">
                                    {agent?.count}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
