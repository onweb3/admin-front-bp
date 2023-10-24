import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside, useImageChange } from "../../../hooks";
import { BtnLoader, SelectDropdown } from "../../../components";
import axios from "../../../axios";
import { config } from "../../../constants";

export default function HotelBannerAdModal({
    hotelBannerModal,
    setHotelBannerModal,
    selectedHotelBannerAd,
    addHotelBannerAd,
    updateHotelBannerAd,
}) {
    const [data, setData] = useState({
        country: (hotelBannerModal?.isEdit && selectedHotelBannerAd?.hotel?.country) || "",
        hotelId: (hotelBannerModal?.isEdit && selectedHotelBannerAd?.hotel?._id) || "",
        priority: (hotelBannerModal?.isEdit && selectedHotelBannerAd?.priority) || "",
        bannerImage: (hotelBannerModal?.isEdit && selectedHotelBannerAd?.bannerImage) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hotels, setHotels] = useState([]);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setHotelBannerModal({ isEdit: false, isOpen: false }));
    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);
    const {
        error: bannerError,
        handleImageChange: handleBannerChange,
        image: bannerImage,
    } = useImageChange();

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

            const formData = new FormData();
            formData.append("hotelId", data.hotelId);
            formData.append("priority", data.priority);
            if (bannerImage) {
                formData.append("bannerImage", bannerImage);
            }

            if (hotelBannerModal?.isEdit) {
                const response = await axios.patch(
                    `/hotels/banner-ads/update/${selectedHotelBannerAd?._id}`,
                    formData,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateHotelBannerAd(response.data);
            } else {
                const response = await axios.post("/hotels/banner-ads/add", formData, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                addHotelBannerAd(response.data);
            }
            setHotelBannerModal({ isOpen: false, isEdit: false });
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

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

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">
                        {hotelBannerModal?.isEdit
                            ? "Update Hotel Banner Ad"
                            : "Add Hotel Banner Ad"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setHotelBannerModal({ isOpen: false, isEdit: false })}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Country *</label>
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
                        <div className="mt-4">
                            <label htmlFor="">Hotel *</label>
                            <SelectDropdown
                                data={hotels}
                                displayName={"hotelName"}
                                placeholder={"Select Hotel"}
                                selectedData={data.hotelId}
                                setSelectedData={(val) => {
                                    setData((prev) => {
                                        return { ...prev, hotelId: val };
                                    });
                                }}
                                valueName={"_id"}
                                bracketValue={"address"}
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Priority</label>
                            <input
                                type="number"
                                placeholder="Ex: 0"
                                name="priority"
                                value={data.priority || ""}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Banner Image *</label>
                            <input type="file" name="bannerImage" onChange={handleBannerChange} />
                            {(bannerImage || data.bannerImage) && (
                                <div className="mt-3">
                                    <img
                                        src={
                                            bannerImage
                                                ? URL.createObjectURL(bannerImage)
                                                : config.SERVER_URL + data.bannerImage
                                        }
                                        alt=""
                                        className="w-[100%] max-w-[500px] object-cover "
                                    />
                                </div>
                            )}

                            <span className="block text-red-500 mt-2 text-sm">{bannerError}</span>
                        </div>
                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() =>
                                    setHotelBannerModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[150px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : hotelBannerModal?.isEdit ? (
                                    "Update Banner"
                                ) : (
                                    "Add Banner"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
