import React, { useCallback, useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHotel } from "react-icons/fa";

import axios from "../axios";

const sections = {
    "room-types": "Room Types",
    "hb-room-types": "Hotel Bed Room Types",
    "contract-groups": "Contract Groups",
    contracts: "Contracts",
    promotions: "Promotions",
    // "rate-promotions": "Rate Promotions",
    "add-ons": "Add Ons",
    "add-allocation": "Inventory Control",
    // reviews: "Reviews",
};

export default function EditHotelLayout({ section }) {
    const [selectedSection, setSelectedSection] = useState(
        section || "room-types"
    );
    const [hotel, setHotel] = useState({});
    const [isHotelLoading, setIsHotelLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchHotel = useCallback(async () => {
        try {
            setIsHotelLoading(true);
            const response = await axios.get(`/hotels/info/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setHotel(response?.data);
            setIsHotelLoading(false);
        } catch (err) {
            console.log(err?.response?.data?.error);
        }
    }, []);

    useEffect(() => {
        fetchHotel();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Hotel Settings
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
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </span>
                    {/* <span>{">"} </span> */}
                    {/* <span>{data.slug}</span> */}
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="p-4">
                        <div className="border-b border-dashed mb-2 pb-2">
                            {isHotelLoading ? (
                                <div>
                                    <div className="h-[16px] w-[140px] bg-slate-300 animate-pulse"></div>
                                    <div className="h-[14px] mt-2 w-[100px] bg-slate-300 animate-pulse"></div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="font-[600] text-orange-500 flex items-center gap-[10px]">
                                        <FaHotel /> {hotel?.hotelName}
                                    </h2>
                                    <span className="text-sm text-grayColor">
                                        {hotel?.city?.cityName},{" "}
                                        {hotel?.state?.stateName},{" "}
                                        {hotel?.country?.countryName}
                                    </span>
                                </>
                            )}
                        </div>
                        <ul className="dir-btn">
                            {Object.keys(sections)?.map((section, index) => {
                                return (
                                    <li
                                        key={index}
                                        className={
                                            selectedSection === section
                                                ? "active"
                                                : ""
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(
                                                `/hotels/${id}/${section}`
                                            );
                                        }}
                                    >
                                        <span>{sections[section]}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <Outlet context={{ setSelectedSection }} />
                </div>
            </div>
        </div>
    );
}
