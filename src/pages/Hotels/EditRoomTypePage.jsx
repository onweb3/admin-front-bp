import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, MultipleSelectDropdown, PageLoader, RichTextEditor } from "../../components";
import {
    RoomAgePolicyForm,
    RoomTypeAmenityForm,
    RoomTypeOccupancyForm,
    RoomTypesImageForm,
} from "../../features/AddRoomType";
import { hasPermission } from "../../utils";

export default function EditRoomTypePage() {
    const [data, setData] = useState({
        roomName: "",
        serviceBy: "NIGHT",
        areaInM2: "",
        adultAgeFrom: "",
        adultAgeTo: "",
        childAgeFrom: "",
        childAgeTo: "",
        infantAgeFrom: "",
        infantAgeTo: "",
        description: "",
        images: [],
        hotelBedRooms: [],
        isActive: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [newImages, setNewImages] = useState([]);
    const [roomOccupancies, setRoomOccupancies] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [initialData, setInitialData] = useState({
        amenities: [],
        hbRoomTypes: [],
        defRmOccupancies: [],
    });
    const [initialDataLoading, setInitialDataLoading] = useState(true);

    const { jwtToken, admin } = useSelector((state) => state.admin);
    const { id, roomTypeId } = useParams();
    const navigate = useNavigate();

    const isEditPermission = hasPermission({
        roles: admin?.roles,
        name: "contracts",
        permission: "update",
    });

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
            formData.append("oldImages", JSON.stringify(data.images));
            formData.append("hotel", id);
            formData.append("amenities", JSON.stringify(selectedAmenities));
            formData.append("isActive", data.isActive);
            formData.append("hotelBedRooms", JSON.stringify(data.hotelBedRooms));

            for (let i = 0; i < newImages?.length; i++) {
                formData.append("images", newImages[i]);
            }

            await axios.patch(`/room-types/update/${roomTypeId}`, formData, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate(-1);
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const removeImage = (ind) => {
        const filteredImages = data.images?.filter((_, index) => {
            return index !== ind;
        });
        setData((prev) => {
            return { ...prev, images: filteredImages };
        });
    };

    const fetchData = async (e) => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/room-types/single/${roomTypeId}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            const {
                roomName,
                serviceBy,
                areaInM2,
                adultAgeFrom,
                adultAgeTo,
                childAgeFrom,
                childAgeTo,
                infantAgeFrom,
                infantAgeTo,
                description,
                images,
                amenities,
                hotelBedRooms,
                isActive,
            } = response.data;

            setData({
                roomName,
                serviceBy,
                areaInM2: areaInM2 || "",
                adultAgeFrom,
                adultAgeTo,
                childAgeFrom,
                childAgeTo,
                infantAgeFrom,
                infantAgeTo,
                description,
                images: images ? images : [],
                hotelBedRooms: hotelBedRooms ? hotelBedRooms : [],
                isActive: isActive || false,
            });

            setRoomOccupancies(
                response.data.roomOccupancies.map(
                    (room) =>
                        ({
                            occupancyName: room.occupancyName,
                            shortName: room.shortName,
                            combinations: room?.combinations || [],
                            maxCount: room?.maxCount,
                            extraBed: room?.extraBed,
                            displayName: room?.displayName || "",
                            rollBed: room?.rollBed,
                            isActive: room.isActive,
                            _id: room._id,
                        } || [])
                )
            );
            setSelectedAmenities(amenities ? amenities : []);

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
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
        fetchData();
    }, []);

    useEffect(() => {
        fetchInitialData();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">EDit Room Type</h1>
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
                    <Link to={`/hotels/${id}/room-types`} className="text-textColor">
                        Room Types{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {roomTypeId?.slice(0, 3)}...{roomTypeId?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>

            {isPageLoading || initialDataLoading ? (
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
                                        disabled={!isEditPermission}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Service By *</label>
                                    <select
                                        name="serviceBy"
                                        value={data.serviceBy || ""}
                                        onChange={handleChange}
                                        id=""
                                        disabled={!isEditPermission}
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
                                        disabled={!isEditPermission}
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
                                            disabled={!isEditPermission}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-[10px]">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        id="isActive"
                                        defaultChecked={data.isActive || false}
                                        onChange={handleChkChange}
                                        className="w-[16px] h-[16px]"
                                        disabled={!isEditPermission}
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
                                isEditPermission={isEditPermission}
                            />
                            <RoomAgePolicyForm
                                data={data}
                                handleChange={handleChange}
                                isEditPermission={isEditPermission}
                            />

                            <div className="mt-5">
                                <label htmlFor="">Description</label>
                                <RichTextEditor
                                    getValue={(value) =>
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                description: value,
                                            };
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
                                    isEditPermission={isEditPermission}
                                />
                            </div>

                            <RoomTypesImageForm
                                newImages={newImages}
                                setNewImages={setNewImages}
                                images={data.images}
                                removeImage={removeImage}
                                isEditPermission={isEditPermission}
                            />
                            {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                            <div className="mt-4 flex items-center justify-end gap-[12px]">
                                <button
                                    className="bg-slate-300 text-textColor px-[15px]"
                                    type="button"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>
                                {isEditPermission && (
                                    <button className="w-[170px]">
                                        {isLoading ? <BtnLoader /> : "Update Room Type"}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
