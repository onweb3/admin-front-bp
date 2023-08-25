import React from "react";

export default function TopHotelsList({ topHotels }) {
    return (
        <div className="bg-[#fff] shadow rounded">
            <div className="p-5 border-b">
                <h1 className="font-medium text-base">Top Hotels</h1>
            </div>
            <div className="text-[15px] p-5">
                {topHotels?.length < 1 || !topHotels ? (
                    <div className="text-center">
                        <span className="text-sm text-gray-500">
                            No data found
                        </span>
                    </div>
                ) : (
                    topHotels?.map((hotel, index) => {
                        return (
                            <div
                                className="flex items-start gap-[15px] py-2"
                                key={index}
                            >
                                <span>#{index + 1}</span>
                                <span className="flex-1">
                                    {hotel?.hotel?.hotelName}
                                </span>
                                <span className="font-medium">
                                    {hotel?.count}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
