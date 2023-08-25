import React from "react";

export default function TopExcursionsList({ topExcursions }) {
    return (
        <div className="bg-[#fff] shadow rounded">
            <div className="p-5 border-b">
                <h1 className="font-medium text-base">Top Excursions</h1>
            </div>
            <div className="text-[15px] p-5">
                {topExcursions?.length < 1 || !topExcursions ? (
                    <div className="text-center">
                        <span className="text-sm text-gray-500">
                            No data found
                        </span>
                    </div>
                ) : (
                    topExcursions?.map((exc, index) => {
                        return (
                            <div
                                className="flex items-start gap-[15px] py-2"
                                key={index}
                            >
                                <span>#{index + 1}</span>
                                <span className="flex-1">
                                    {exc?.excursion?.name}
                                </span>
                                <span className="font-medium">
                                    {exc?.count}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
