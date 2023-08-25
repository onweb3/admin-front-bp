import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { RoomOccupancyForm } from "../../features/RoomOccupancies";
import { BtnLoader } from "../../components";
import axios from "../../axios";

export default function AddRoomOccupanciesPage() {
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

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            await axios.post(`/hotels/room-occupancies/add`, roomOccupancy, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setIsLoading(false);
            navigate("/hotels/room-occupancies");
        } catch (err) {
            setError(err?.response?.data?.error || "something went wrong, try again");
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Add Room Occupancy</h1>
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
                    <span>Add </span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm p-4">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Add Room Occupancy</h1>
                    </div>

                    <RoomOccupancyForm
                        roomOccupancy={roomOccupancy}
                        setRoomOccupancy={setRoomOccupancy}
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
                        <button className="w-[200px]" onClick={handleSubmit}>
                            {isLoading ? <BtnLoader /> : "Add Room Occupancy"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
