import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { RoomOccupancyForm } from "../../features/RoomOccupancies";
import { BtnLoader, PageLoader } from "../../components";
import axios from "../../axios";
import { hasPermission } from "../../utils";

export default function EditRoomOccupanciesPage() {
    const [roomOccupancy, setRoomOccupancy] = useState({
        occupancyName: "",
        shortName: "",
        combinations: [],
        maxCount: "",
        extraBed: "",
        rollBed: "",
        displayName: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { jwtToken, admin } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { occupancyId } = useParams();

    const isEditPermission = hasPermission({
        roles: admin?.roles,
        name: "room-occupancies",
        permission: "update",
    });

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            await axios.patch(`/hotels/room-occupancies/update/${occupancyId}`, roomOccupancy, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setIsLoading(false);
            navigate("/hotels/room-occupancies");
        } catch (err) {
            setError(err?.response?.data?.error || "something went wrong, try again");
            setIsLoading(false);
        }
    };

    const getSingleRoomOccupancy = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get(`/hotels/room-occupancies/single/${occupancyId}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setRoomOccupancy((prev) => {
                return {
                    ...prev,
                    occupancyName: response.data.occupancyName,
                    shortName: response.data.shortName,
                    combinations: response.data.combinations,
                    maxCount: response.data.maxCount,
                    extraBed: response.data.extraBed,
                    rollBed: response.data.rollBed,
                    displayName: response.data.displayName || "",
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getSingleRoomOccupancy();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Edit Room Occupancy</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels/room-occupancies" className="text-textColor">
                        Room Occupancies{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {occupancyId?.slice(0, 3)}...{occupancyId?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Edit </span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm p-4">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">Edit Room Occupancy</h1>
                        </div>

                        <RoomOccupancyForm
                            roomOccupancy={roomOccupancy}
                            setRoomOccupancy={setRoomOccupancy}
                            isEditPermission={isEditPermission}
                        />

                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-8 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>
                            {isEditPermission && (
                                <button className="w-[200px]" onClick={handleSubmit}>
                                    {isLoading ? <BtnLoader /> : "Edit Room Occupancy"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
