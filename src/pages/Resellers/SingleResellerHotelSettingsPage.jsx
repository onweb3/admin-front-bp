import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BtnLoader, MultipleSelectDropdown, PageLoader, SelectDropdown } from "../../components";
import { MdClose } from "react-icons/md";

export default function SingleResellerHotelSettingsPage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [data, setData] = useState({
        country: "",
        availableHotels: [],
        availableAreas: [],
        availableCities: [],
    });
    const [hotels, setHotels] = useState([]);
    const [selectedHotels, setSelectedHotels] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isClearLoading, setIsClearLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);
    const { id } = useParams();

    const fetchResellerHotelSettings = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get(`/hotels/resellers/settings/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setData((prev) => {
                return {
                    ...prev,
                    availableHotels: response?.data?.availableHotels || [],
                    availableAreas: response?.data?.availableAreas || [],
                    availableCities: response?.data?.availableCities || [],
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const updateResellerHotelSettings = async () => {
        try {
            setIsLoading(true);
            setError("");

            const availableHotels = data.availableHotels?.map((item) => item?._id);
            const availableAreas = data.availableAreas?.map((item) => item?._id);
            const availableCities = data.availableCities?.map((item) => item?._id);

            await axios.patch(
                "/hotels/resellers/settings/upsert",
                {
                    resellerId: id,
                    availableHotels,
                    availableAreas,
                    availableCities,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
        } catch (err) {
            setError(err?.response?.data?.error || "something went wrong, try again");
            setIsLoading(false);
        }
    };

    const clearResellerHotelSettings = async () => {
        try {
            setIsClearLoading(true);
            await axios.patch(
                `/hotels/resellers/settings/clear/${id}`,
                {},
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setData((prev) => {
                return {
                    ...prev,
                    availableHotels: [],
                    availableAreas: [],
                    availableCities: [],
                };
            });
            setIsClearLoading(false);
        } catch (err) {
            console.log(err);
            setIsClearLoading(false);
        }
    };

    useEffect(() => {
        fetchResellerHotelSettings();
    }, []);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                if (data.country) {
                    const response = await axios.get(`/hotels/all/names?country=${data.country}`, {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    });
                    setHotels(response?.data);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchHotels();
    }, [data.country]);

    if (isPageLoading) return <PageLoader />;

    return (
        <div className="p-6">
            <div>
                <h2 className="font-medium mb-2">Available Hotels</h2>
                <div className="grid grid-cols-4 items-end gap-4">
                    <div>
                        <label htmlFor="">Country</label>
                        <SelectDropdown
                            data={countries}
                            displayName={"countryName"}
                            placeholder={"Select Country"}
                            selectedData={data.country}
                            setSelectedData={(val) => {
                                setData((prev) => {
                                    return { ...prev, country: val };
                                });
                            }}
                            valueName={"_id"}
                        />
                    </div>
                    <div>
                        <label htmlFor="">Hotel</label>
                        <MultipleSelectDropdown
                            data={hotels}
                            displayName={"hotelName"}
                            selectedData={selectedHotels}
                            setSelectedData={(val) => {
                                setSelectedHotels(val);
                            }}
                            valueName={"_id"}
                            randomIndex={"hotels-list" + 1}
                        />
                    </div>
                    <div>
                        <button
                            className="px-3"
                            onClick={() => {
                                if (selectedHotels?.length > 0) {
                                    const availableHotels = [];
                                    selectedHotels?.forEach((item) => {
                                        const hotel = hotels?.find((ht) => ht?._id === item);
                                        if (
                                            !data.availableHotels?.some((aht) => aht?._id === item)
                                        ) {
                                            availableHotels.push(hotel);
                                        }
                                    });
                                    setData((prev) => {
                                        return {
                                            ...prev,
                                            availableHotels: [
                                                ...prev.availableHotels,
                                                ...availableHotels,
                                            ],
                                        };
                                    });
                                }
                            }}
                        >
                            Add
                        </button>
                    </div>
                </div>
                <div className="flex items-center flex-wrap gap-3 mt-4">
                    {data?.availableHotels?.map((item, index) => {
                        return (
                            <div key={index} className="bg-gray-400 p-2 rounded relative">
                                <span className="text-sm">{item?.hotelName}</span>
                                <span className="block text-[12px] text-[#444]">
                                    {item?.address}
                                </span>
                                <span
                                    className="absolute top-[-10px] right-[-10px] h-[20px] w-[20px] flex items-center justify-center cursor-pointer text-white bg-red-500 rounded-full"
                                    onClick={() => {
                                        let tempAvailableHotels = data.availableHotels?.filter(
                                            (hotel) => {
                                                return hotel?._id !== item?._id;
                                            }
                                        );
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                availableHotels: tempAvailableHotels,
                                            };
                                        });
                                    }}
                                >
                                    <MdClose />
                                </span>
                            </div>
                        );
                    })}
                </div>
                {error && <span className="block text-sm text-red-500 mt-2">{error}</span>}
                <div className="flex items-center justify-end gap-3">
                    <button
                        className="bg-slate-300 text-textColor px-3"
                        onClick={clearResellerHotelSettings}
                    >
                        {isClearLoading ? "Clearing" : "Clear"}
                    </button>
                    <button
                        className="px-3"
                        onClick={updateResellerHotelSettings}
                        disabled={isLoading}
                    >
                        {isLoading ? <BtnLoader /> : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
}
