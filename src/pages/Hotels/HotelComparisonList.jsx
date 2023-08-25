import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { PageLoader } from "../../components";
import axios from "../../axios";

export default function HotelComparisonList() {
    const [isLoading, setIsLoading] = useState(true);
    const [hotels, setHotels] = useState([]);

    const { jwtToken } = useSelector((state) => state.admin);

    const getHotels = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/hotels/comparison-list", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setHotels(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getHotels();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Comparison List
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Comparison List</span>
                </div>
            </div>

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Hotels</h1>
                        </div>
                        {hotels?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Hotels found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                #
                                            </th>
                                            <th className="font-[500] p-3">
                                                Hotelbed Id
                                            </th>
                                            <th className="font-[500] p-3">
                                                Hotel - Contract
                                            </th>
                                            <th className="font-[500] p-3">
                                                Hotel - Hotelbed
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {hotels?.map((hotel, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3 capitalize">
                                                        {index + 1}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {hotel?.hbId || "N/A"}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        <span className="font-medium">
                                                            {hotel?.liveHotelName ||
                                                                "N/A"}
                                                        </span>
                                                        <span className="block text-sm text-grayColor mt-1">
                                                            {
                                                                hotel
                                                                    ?.liveHotelCity
                                                                    ?.cityName
                                                            }
                                                            ,{" "}
                                                            {
                                                                hotel
                                                                    ?.liveHotelState
                                                                    ?.stateName
                                                            }
                                                            ,{" "}
                                                            {
                                                                hotel
                                                                    ?.liveHotelCountry
                                                                    ?.countryName
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        <span className="font-medium">
                                                            {hotel?.testHotelName ||
                                                                "N/A"}
                                                        </span>
                                                        {hotel?.testHotelName && (
                                                            <span className="block text-sm text-grayColor mt-1">
                                                                {hotel
                                                                    ?.testHotelCity
                                                                    ?.cityName
                                                                    ? `${hotel?.testHotelCity?.cityName}, `
                                                                    : ""}
                                                                {
                                                                    hotel
                                                                        ?.testHotelState
                                                                        ?.stateName
                                                                }
                                                                ,{" "}
                                                                {
                                                                    hotel
                                                                        ?.testHotelCountry
                                                                        ?.countryName
                                                                }
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
