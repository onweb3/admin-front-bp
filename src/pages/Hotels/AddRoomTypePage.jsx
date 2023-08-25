import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { BtnLoader, MultipleSelectDropdown, PageLoader, RichTextEditor } from "../../components";
import {
    RoomAgePolicyForm,
    RoomTypeAmenityForm,
    RoomTypeOccupancyForm,
    RoomTypesImageForm,
} from "../../features/AddRoomType";
import axios from "../../axios";

export default function AddRoomTypePage() {
    const [data, setData] = useState({
        roomName: "",
        serviceBy: "NIGHT",
        areaInM2: "",
        infantAgeFrom: "0",
        infantAgeTo: "5.99",
        childAgeFrom: "6",
        childAgeTo: "11.99",
        adultAgeFrom: "12",
        adultAgeTo: "200",
        description: "",
        hotelBedRooms: [],
        isActive: true,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [newImages, setNewImages] = useState([]);
    const [roomOccupancies, setRoomOccupancies] = useState([
        {
            occupancyName: "Single",
            shortName: "SGL",
            combinations: [
                {
                    adultCount: "1",
                    childCount: "0",
                    infantCount: "0",
                },
                {
                    adultCount: "1",
                    childCount: "0",
                    infantCount: "1",
                },
            ],
            maxCount: 2,
            extraBed: "0",
            displayName: "",
            rollBed: "0",
            isActive: true,
        },
        {
            occupancyName: "Double",
            shortName: "DBL",
            combinations: [
                {
                    adultCount: "1",
                    childCount: "1",
                    infantCount: "0",
                },
                {
                    adultCount: "1",
                    childCount: "0",
                    infantCount: "1",
                },
                {
                    adultCount: "1",
                    childCount: "1",
                    infantCount: "1",
                },
                {
                    adultCount: "2",
                    childCount: "0",
                    infantCount: "0",
                },
                {
                    adultCount: "2",
                    childCount: "1",
                    infantCount: "0",
                },
                {
                    adultCount: "2",
                    childCount: "0",
                    infantCount: "1",
                },
            ],
            maxCount: 3,
            extraBed: "1",
            displayName: "",
            rollBed: "0",
            isActive: true,
        },
    ]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [initialData, setInitialData] = useState({
        amenities: [],
        hbRoomTypes: [],
        defRmOccupancies: [],
    });
    const [initialDataLoading, setInitialDataLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleChkChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.checked };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = new FormData();

            formData.append("roomName", data.roomName);
            formData.append("serviceBy", data.serviceBy);
            formData.append("areaInM2", data.areaInM2);
            formData.append("adultAgeFrom", data.adultAgeFrom);
            formData.append("adultAgeTo", data.adultAgeTo);
            formData.append("childAgeFrom", data.childAgeFrom);
            formData.append("childAgeTo", data.childAgeTo);
            formData.append("infantAgeFrom", data.infantAgeFrom);
            formData.append("infantAgeTo", data.infantAgeTo);
            formData.append("roomOccupancies", JSON.stringify(roomOccupancies));
            formData.append("description", data.description);
            formData.append("hotel", id);
            formData.append("amenities", JSON.stringify(selectedAmenities));
            formData.append("isActive", data.isActive);
            formData.append("hotelBedRooms", JSON.stringify(data.hotelBedRooms));

            for (let i = 0; i < newImages?.length; i++) {
                formData.append("images", newImages[i]);
            }

            await axios.post("/room-types/add", formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate(-1);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const fetchInitialData = async () => {
        try {
            setInitialDataLoading(true);
            const response = await axios.get(`/room-types/initial-data/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setInitialData((prev) => {
                return {
                    ...prev,
                    hbRoomTypes: response?.data?.hbRoomTypes,
                    amenities: response?.data?.hotelAmenities,
                    defRmOccupancies: response?.data?.roomOccupancies,
                };
            });
            setInitialDataLoading(false);
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
                <h1 className="font-[600] text-[15px] uppercase">Add Room Type</h1>
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
                    <Link to={`/hotels/${id}/edit`} className="text-textColor">
                        Edit{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Room Types </span>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>

            {initialDataLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-3 gap-5">
                                <div>
                                    <label htmlFor="">Room Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Deluxe Room"
                                        name="roomName"
                                        value={data.roomName || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Service By *</label>
                                    <select
                                        name="serviceBy"
                                        value={data.serviceBy || ""}
                                        onChange={handleChange}
                                        id=""
                                    >
                                        <option value="NIGHT">Night</option>
                                        {/* <option value="">Day</option> */}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">Area (m^2)</label>
                                    <input
                                        type="number"
                                        placeholder="Enter area"
                                        name="areaInM2"
                                        value={data.areaInM2 || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="allocationType">Hotel Bed Room Types</label>
                                    <div className="">
                                        <MultipleSelectDropdown
                                            data={initialData.hbRoomTypes}
                                            valueName={"hbId"}
                                            displayName={"roomName"}
                                            selectedData={data.hotelBedRooms}
                                            setSelectedData={(selRoomTypes) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        hotelBedRooms: selRoomTypes,
                                                    };
                                                });
                                            }}
                                            randomIndex={"hb-room-type"}
                                            bracketName={"hbId"}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-[10px]">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        id="isActive"
                                        defaultChecked={data.isActive || true}
                                        onChange={handleChkChange}
                                        className="w-[16px] h-[16px]"
                                    />
                                    <label htmlFor="isActive" className="mb-0">
                                        Is Active
                                    </label>
                                </div>
                            </div>

                            <RoomTypeOccupancyForm
                                roomOccupancies={roomOccupancies}
                                setRoomOccupancies={setRoomOccupancies}
                                defRmOccupancies={initialData.defRmOccupancies}
                            />
                            <RoomAgePolicyForm data={data} handleChange={handleChange} />

                            <div className="mt-5">
                                <label htmlFor="">Description</label>
                                <RichTextEditor
                                    getValue={(value) =>
                                        setData((prev) => {
                                            return { ...prev, description: value };
                                        })
                                    }
                                    initialValue={data?.description || ""}
                                />
                            </div>

                            <div className="mt-5">
                                <RoomTypeAmenityForm
                                    amenities={initialData.amenities}
                                    selectedAmenities={selectedAmenities}
                                    setSelectedAmenities={setSelectedAmenities}
                                />
                            </div>

                            <RoomTypesImageForm newImages={newImages} setNewImages={setNewImages} />
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
                                    {isLoading ? <BtnLoader /> : "Add Room Type"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
