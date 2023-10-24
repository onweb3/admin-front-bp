import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { BtnLoader, MultipleSelectDropdown } from "../../components";
import axios from "../../axios";

export default function AddAllocationPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [initialData, setInitialData] = useState({
        roomTypes: [],
        contractGroups: [],
    });
    const [data, setData] = useState({
        fromDate: "",
        toDate: "",
        allocationType: "static",
        unitWise: "room",
        releaseDate: "",
        allocation: "",
    });
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [selectedContractGroups, setSelectedContractGroups] = useState([]);

    const { id } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);
    const { setSelectedSection } = useOutletContext();

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
                    contractGroups: selectedContractGroups,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate("/hotels/availability");
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const fetchInitialData = async () => {
        try {
            const response = await axios.get(`/hotels/room-and-contract-group/${id}`, {
                headers: {
                    authorization: `Bearer ${jwtToken}`,
                },
            });
            setInitialData((prev) => {
                return {
                    ...prev,
                    roomTypes: response?.data?.roomTypes,
                    contractGroups: response?.data?.contractGroups,
                };
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        setSelectedSection("add-allocation");
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between border-b border-dashed p-4">
                <h1 className="font-medium">Add Inventory</h1>
            </div>

            <form action="" className="p-6" onSubmit={handleSubmit}>
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
                        <label htmlFor="allocationType">Allocation Type</label>
                        <select
                            name="allocationType"
                            value={data.allocationType || ""}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled hidden>
                                Select Allocation Type
                            </option>
                            <option value="free-sale">Free Sale</option>
                            <option value="static">On Allocation</option>
                            <option value="on-request">On Request</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="rateType">Rate Type</label>
                        <select
                            name="rateType"
                            value={data.rateType || ""}
                            onChange={handleChange}
                            required
                        >
                            <option value="all-promotions">All Promotions Applicable</option>
                            <option value="contract-rate">Applicable On Contracted Rate</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="allocationType">Room Types</label>
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
                        <label htmlFor="allocationType">Contract Groups</label>
                        <div className="">
                            <MultipleSelectDropdown
                                data={initialData.contractGroups}
                                valueName={"_id"}
                                displayName={"contractName"}
                                selectedData={selectedContractGroups}
                                setSelectedData={setSelectedContractGroups}
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
                                    <option value="room">room </option>
                                    {/* <option value="pax">pax </option> */}
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

                {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}

                <div className="mt-4 flex items-center justify-end gap-[12px]">
                    <button
                        className="bg-slate-300 text-textColor px-[15px]"
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </button>
                    <button className="w-[150px]">
                        {isLoading ? <BtnLoader /> : "Add Inventory"}
                    </button>
                </div>
            </form>
        </div>
    );
}
