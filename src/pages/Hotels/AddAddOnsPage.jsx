import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { BtnLoader, MultipleSelectDropdown } from "../../components";
import axios from "../../axios";

export default function AddAddOnsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        fromDate: "",
        toDate: "",
        addOnName: "",
        applyOn: "pax",
        adultPrice: "",
        childPrice: "",
        infantPrice: "",
        roomPrice: "",
        isMandatory: false,
    });
    const [selectedBoardTypes, setSelectedBoardTypes] = useState([]);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [initialData, setInitialData] = useState({
        roomTypes: [],
        boardTypes: [],
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleCheckBoxChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.checked };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.post(
                "/hotels/add-ons/add",
                {
                    ...data,
                    hotel: id,
                    roomTypes: selectedRoomTypes,
                    boardTypes: selectedBoardTypes,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(`/hotels/${id}/add-ons`);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const fetchInitialData = async () => {
        try {
            const response = await axios.get(`/hotels/board-and-room/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setInitialData((prev) => {
                return {
                    ...prev,
                    roomTypes: response?.data?.roomTypes,
                    boardTypes: response?.data?.boardTypes,
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
                <h1 className="font-[600] text-[15px] uppercase">Add AddOn</h1>
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
                    <span>{">"} </span>
                    <Link to={`/hotels/${id}/add-ons`} className="text-textColor">
                        AddOns{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
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
                                <label htmlFor="allocationType">Room Types</label>
                                <div className="">
                                    <MultipleSelectDropdown
                                        data={initialData.roomTypes}
                                        displayName={"roomName"}
                                        selectedData={selectedRoomTypes}
                                        setSelectedData={setSelectedRoomTypes}
                                        valueName={"_id"}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="allocationType">Board Types</label>
                                <div className="">
                                    <MultipleSelectDropdown
                                        data={initialData.boardTypes}
                                        displayName={"boardName"}
                                        selectedData={selectedBoardTypes}
                                        setSelectedData={setSelectedBoardTypes}
                                        valueName={"_id"}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="">Add On Name</label>
                                <input
                                    type="text"
                                    name="addOnName"
                                    value={data.addOnName || ""}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ex: Compulsory Gala Dinner"
                                />
                            </div>

                            <div>
                                <label htmlFor="">Apply On</label>
                                <select
                                    name="applyOn"
                                    value={data.applyOn || ""}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled hidden>
                                        Select Apply On
                                    </option>
                                    <option value="pax">Pax</option>
                                    <option value="room">Room</option>
                                </select>
                            </div>
                            {data?.applyOn === "pax" ? (
                                <>
                                    <div>
                                        <label htmlFor="">Adult Price </label>
                                        <input
                                            type="number"
                                            name="adultPrice"
                                            value={data.adultPrice}
                                            onChange={handleChange}
                                            required
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">Child Price</label>
                                        <input
                                            type="number"
                                            name="childPrice"
                                            value={data.childPrice}
                                            onChange={handleChange}
                                            required
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="">Infant Price</label>
                                        <input
                                            type="number"
                                            name="infantPrice"
                                            value={data.infantPrice}
                                            onChange={handleChange}
                                            required
                                            placeholder="0"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label htmlFor="">Room Price</label>
                                    <input
                                        type="number"
                                        name="roomPrice"
                                        value={data.roomPrice}
                                        onChange={handleChange}
                                        required
                                        placeholder="0"
                                    />
                                </div>
                            )}
                            <div className="flex items-center justify-left gap-2">
                                <input
                                    type="checkbox"
                                    name="isMandatory"
                                    checked={data?.isMandatory}
                                    onChange={handleCheckBoxChange}
                                    className="w-[17px] h-[17px]"
                                    id="isMandatory"
                                />
                                <label htmlFor="isMandatory" className="mb-0">
                                    Is Mandatory{" "}
                                </label>
                            </div>
                        </div>

                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}

                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button className="w-[150px]">
                                {isLoading ? <BtnLoader /> : "Add AddOns"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
