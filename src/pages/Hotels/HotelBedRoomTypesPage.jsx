import React, { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { PageLoader } from "../../components";
import axios from "../../axios";

export default function HotelBedRoomTypesPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [roomTypes, setRoomTypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const { setSelectedSection } = useOutletContext();

    const fetchData = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/room-types/hotel/hb/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setRoomTypes(response.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const addHbRoomTypeToHotelBedRoomType = async (roomTypeId) => {
        try {
            const isConfirm = window.confirm(
                "Are you sure to add this hotel bed room type to main room types list?"
            );
            if (isConfirm) {
                await axios.post(
                    "/room-types/hb/upgrade",
                    {
                        hotelId: id,
                        hbRoomTypeId: roomTypeId,
                    },
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const filteredRoomTypes = searchQuery
        ? roomTypes?.filter((item) => {
              return (
                  item?.hbId?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                  item?.roomName?.toLowerCase()?.includes(searchQuery?.toLowerCase())
              );
          })
        : roomTypes;

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setSelectedSection("hb-room-types");
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between border-b border-dashed p-4">
                <h1 className="font-medium">Hotel Bed Room Types</h1>

                <div>
                    <input
                        type="text"
                        placeholder="Search here..."
                        value={searchQuery || ""}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            {isLoading ? (
                <PageLoader />
            ) : filteredRoomTypes?.length < 1 ? (
                <div className="p-6 flex flex-col items-center">
                    <span className="text-sm text-grayColor block mt-[6px]">
                        Oops.. No Hotel Bed Room Types Found
                    </span>
                </div>
            ) : (
                <div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                <tr>
                                    <th className="font-[500] p-3">Room Code</th>
                                    <th className="font-[500] p-3">Room Name</th>
                                    <th className="font-[500] p-3">Min Pax</th>
                                    <th className="font-[500] p-3">Max Pax</th>
                                    <th className="font-[500] p-3">Contract Room Types</th>
                                    <th className="font-[500] p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredRoomTypes?.map((data, index) => {
                                    return (
                                        <tr
                                            className="border-b border-tableBorderColor"
                                            key={index}
                                        >
                                            <td className="p-3">{data?.hbId}</td>
                                            <td className="p-3 capitalize">{data?.roomName}</td>
                                            <td className="p-3 capitalize">
                                                {data?.minAdults} ADT, {data?.minPax} TOT
                                            </td>
                                            <td className="p-3 capitalize">
                                                {data?.maxChildren} CHD, {data?.maxAdults} ADT,{" "}
                                                {data?.maxPax} TOT
                                            </td>
                                            {data?.roomTypes?.length > 0 ? (
                                                <td className="p-3 ">
                                                    {data?.roomTypes?.map((item, index) => {
                                                        return (
                                                            <Link
                                                                key={index}
                                                                className="capitalize font-medium text-blue-500 hover:underline"
                                                                to={`/hotels/${id}/room-types/${item?._id}/edit`}
                                                            >
                                                                {item?.roomName}
                                                                {index < data?.roomTypes?.length - 1
                                                                    ? ", "
                                                                    : ""}
                                                            </Link>
                                                        );
                                                    })}
                                                </td>
                                            ) : (
                                                <td className="p-3">N/A</td>
                                            )}
                                            <td className="p-3">
                                                <div className="flex gap-[10px]">
                                                    <button
                                                        className="text-sm px-3"
                                                        onClick={() =>
                                                            addHbRoomTypeToHotelBedRoomType(
                                                                data?._id
                                                            )
                                                        }
                                                    >
                                                        + Add Room Type
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
