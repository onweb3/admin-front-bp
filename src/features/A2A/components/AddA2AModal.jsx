import React, { useRef, useState } from "react";
import { useHandleClickOutside } from "../../../hooks";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";

export default function AddA2AModal({
    setIsAddA2AModalOpen,
    isAddA2AModalOpen,
    airports,
    result,
    setResult
}) {
    const [airportFrom, setAirportFrom] = useState("");
    const [airportTo, setAirportTo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const wrapperRef = useRef();

    useHandleClickOutside(wrapperRef, () => setIsAddA2AModalOpen(false));

    const { jwtToken } = useSelector((state) => state.admin);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);

            const response = await axios.post(
                "/a2a/add",
                { airportFrom, airportTo },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setResult([response?.data?.data,...result])
            setIsLoading(false);
            setIsAddA2AModalOpen(false);
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.error);
            setIsLoading(false)
        }
    };

    return (
        <div
            className={
                "fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 " +
                (isAddA2AModalOpen ? "block" : "hidden")
            }
        >
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[600px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Add A2A</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsAddA2AModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-2">
                    <div>
                        <label htmlFor=""> Airport From *</label>
                        <select
                            value={airportFrom || ""}
                            onChange={(e) => setAirportFrom(e.target.value)}
                        >
                            <option hidden>Select airport</option>
                            {airports?.map((item) => (
                                <option key={item?._id} value={item?._id}>
                                    {item?.airportName +
                                        ` (${item?.iataCode}) `}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor=""> Airport To *</label>
                        <select
                            value={airportTo || ""}
                            onChange={(e) => setAirportTo(e.target.value)}
                        >
                            <option hidden>Select airport</option>
                            {airports?.map((item) => (
                                <option key={item?._id} value={item?._id}>
                                    {item?.airportName +
                                        ` (${item?.iataCode}) `}
                                </option>
                            ))}
                        </select>
                    </div>
                    {error && (
                        <p className="text-[12px] text-red-500 text-right">
                            {error}
                        </p>
                    )}
                    <div className="flex items-center justify-end mt-6">
                        <button className="px-3 bg-primaryColor" type="submit">
                            {isLoading ? <BtnLoader /> : "Add A2A"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
