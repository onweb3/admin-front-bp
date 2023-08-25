import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { BtnLoader, MultipleSelectDropdown, PageLoader } from "../../components";
import axios from "../../axios";
import { useSelector } from "react-redux";

export default function EditAddOnsPage() {
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
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { id, addOnsId } = useParams();
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

            const formData = {
                ...data,
                hotel: id,
                roomTypes: selectedRoomTypes,
                boardTypes: selectedBoardTypes,
            };

            await axios.patch(`/hotels/add-ons/update/${addOnsId}`, formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate(`/hotels/${id}/add-ons`);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const fetchAddOn = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/hotels/add-ons/single/${addOnsId}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            const {
                fromDate,
                toDate,
                addOnName,
                applyOn,
                adultPrice,
                childPrice,
                infantPrice,
                roomPrice,
                isMandatory,
                roomTypes,
                boardTypes,
            } = response?.data;

            setData((prev) => {
                return {
                    ...prev,
                    fromDate,
                    toDate,
                    addOnName,
                    applyOn,
                    adultPrice,
                    childPrice,
                    infantPrice,
                    roomPrice,
                    isMandatory,
                };
            });
            setSelectedBoardTypes(boardTypes);
            setSelectedRoomTypes(roomTypes);
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
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
        fetchAddOn();
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Edit Add Ons </h1>
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
                    <span>
                        {addOnsId?.slice(0, 3)}...{addOnsId?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Edit </span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm p-6">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-3 gap-5">
                                <div>
                                    <label htmlFor="">From Date</label>
                                    <input
                                        type="date"
                                        name="fromDate"
                                        value={
                                            data.fromDate
                                                ? new Date(data.fromDate)
                                                      ?.toISOString()
                                                      .slice(0, 10)
                                                : ""
                                        }
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">To Date</label>
                                    <input
                                        type="date"
                                        name="toDate"
                                        value={
                                            data.toDate
                                                ? new Date(data.toDate)?.toISOString().slice(0, 10)
                                                : ""
                                        }
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

                            {error && (
                                <span className="text-sm block text-red-500 mt-2">{error}</span>
                            )}

                            <div className="mt-4 flex items-center justify-end gap-[12px]">
                                <button
                                    className="bg-slate-300 text-textColor px-[15px]"
                                    type="button"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>
                                <button className="w-[150px]">
                                    {isLoading ? <BtnLoader /> : "Update AddOns"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
