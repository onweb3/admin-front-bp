import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { BtnLoader, MultipleSelectDropdown } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";

export default function HotelAvailabilityModal({
    selectedContractGroups,
    selectedHotel,
    fromDate,
    toDate,
    setAvailabilityModalOpen,
}) {
    const [data, setData] = useState({
        allocationType: "static",
        unitWise: "room",
        releaseDate: "",
        allocation: "",
        rateType: "all-promotions",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setAvailabilityModalOpen(false));
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
                    hotelId: selectedHotel?._id,
                    roomTypes: selectedRoomTypes,
                    contractGroups: selectedContractGroups,
                    fromDate,
                    toDate,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            setAvailabilityModalOpen(false);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Change Inventory</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setAvailabilityModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="">
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
                                    <option value="stop-sale">Stop Sale</option>
                                </select>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="rateType">Rate Type</label>
                                <select
                                    name="rateType"
                                    value={data.rateType || ""}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="all-promotions">
                                        All Promotions Applicable
                                    </option>
                                    <option value="contract-rate">
                                        Applicable On Contracted Rate
                                    </option>
                                </select>
                            </div>
                            <div className="mt-4">
                                <label htmlFor="allocationType">Room Types</label>
                                <div className="">
                                    <MultipleSelectDropdown
                                        data={selectedHotel.roomTypes}
                                        valueName={"_id"}
                                        displayName={"roomName"}
                                        selectedData={selectedRoomTypes}
                                        setSelectedData={setSelectedRoomTypes}
                                    />
                                </div>
                            </div>
                            {(data?.allocationType === "static" ||
                                data?.allocationType === "free-sale") && (
                                <div className="mt-4">
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
                                    <div className="mt-4">
                                        <label htmlFor="">Unit Wise</label>
                                        <select
                                            name="unitWise"
                                            value={data.unitWise || ""}
                                            onChange={handleChange}
                                            className="capitalize"
                                        >
                                            <option value="" hidden>
                                                Select Unit Wise
                                            </option>
                                            {/* <option value="pax">pax </option> */}
                                            <option value="room">Room </option>
                                        </select>
                                    </div>
                                    <div className="mt-4">
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
                                onClick={() => setAvailabilityModalOpen(false)}
                            >
                                Back
                            </button>
                            <button className="w-[170px]">
                                {isLoading ? <BtnLoader /> : "Change Inventory"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
