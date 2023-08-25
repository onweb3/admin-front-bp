import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { BtnLoader, MultipleSelectDropdown } from "../../components";
import axios from "../../axios";

export default function ChangeAvailabilityPage() {
    const location = useLocation();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [initialData, setInitialData] = useState({
        roomTypes: [],
        contracts: [],
    });
    const [data, setData] = useState({
        fromDate: location.state?.fromDate || "",
        toDate: location.state?.toDate || "",
        allocationType: "free-sale",
        unitWise: "room",
        releaseDate: "",
        allocation: "",
    });
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [selectedContracts, setSelectedContracts] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.post(
                "/hotels/allocations/add",
                {
                    ...data,
                    hotelId: id,
                    roomTypes: selectedRoomTypes,
                    contracts: selectedContracts,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(-1);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchInitialData = async () => {
        try {
            const response = await axios.get(
                `/hotels/room-and-contract/${id}`,
                {
                    headers: {
                        authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            setInitialData((prev) => {
                return {
                    ...prev,
                    roomTypes: response?.data?.roomTypes,
                    contracts: response?.data?.contracts,
                };
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Change Availability
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
                    <Link to="/hotels/availability" className="text-textColor">
                        Availability{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Change</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm p-6">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-5">
                            <div>
                                <label htmlFor="">From Date</label>
                                <input
                                    type="date"
                                    name="fromDate"
                                    value={data.fromDate || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">To Date</label>
                                <input
                                    type="date"
                                    name="toDate"
                                    value={data.toDate || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="allocationType">
                                    AllocationType{" "}
                                </label>
                                <select
                                    name="allocationType"
                                    value={data.allocationType || ""}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled hidden>
                                        Select Allocation Type
                                    </option>
                                    {/* <option value="static">static</option> */}
                                    <option value="free-sale">Free Sale</option>
                                    <option value="stop-sale">Stop Sale</option>
                                    <option value="on-request">
                                        On Request
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="allocationType">
                                    Room Types
                                </label>
                                <div className="">
                                    <MultipleSelectDropdown
                                        data={initialData.roomTypes}
                                        valueName={"_id"}
                                        displayName={"roomName"}
                                        selectedData={selectedRoomTypes}
                                        setSelectedData={setSelectedRoomTypes}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="allocationType">
                                    Contracts
                                </label>
                                <div className="">
                                    <MultipleSelectDropdown
                                        data={initialData.contracts}
                                        valueName={"_id"}
                                        displayName={"rateName"}
                                        selectedData={selectedContracts}
                                        setSelectedData={setSelectedContracts}
                                    />
                                </div>
                            </div>
                            {(data?.allocationType === "static" ||
                                data?.allocationType === "free-sale") && (
                                <div>
                                    <label htmlFor="">Release Date</label>
                                    <input
                                        type="number"
                                        name="releaseDate"
                                        value={data.releaseDate || ""}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                    />
                                </div>
                            )}
                            {data.allocationType === "static" && (
                                <>
                                    <div>
                                        <label htmlFor="">Unit Wise</label>
                                        <select
                                            name="unitWise"
                                            value={data.unitWise || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="" hidden>
                                                Select Unit Wise
                                            </option>
                                            {/* <option value="pax">pax </option> */}
                                            <option value="room">room </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="">Allocation</label>
                                        <input
                                            type="number"
                                            name="allocation"
                                            value={data.allocation || ""}
                                            onChange={handleChange}
                                            required
                                            placeholder="0"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}

                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>
                            <button className="w-[170px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : (
                                    "Change Availability"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
