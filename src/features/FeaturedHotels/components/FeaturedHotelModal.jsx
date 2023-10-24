import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader, SelectDropdown } from "../../../components";
import axios from "../../../axios";

export default function FeaturedHotelModal({
    featuredModal,
    setFeaturedModal,
    selectedFeaturedHotel,
    addFeaturedHotel,
    updateFeaturedHotel,
}) {
    const [data, setData] = useState({
        country: (featuredModal?.isEdit && selectedFeaturedHotel?.hotelId?.country) || "",
        hotelId: (featuredModal?.isEdit && selectedFeaturedHotel?.hotelId?._id) || "",
        priority: (featuredModal?.isEdit && selectedFeaturedHotel?.priority) || "",
        showHomePage: (featuredModal?.isEdit && selectedFeaturedHotel?.showHomePage) || false,
        tagLine: (featuredModal?.isEdit && selectedFeaturedHotel?.tagLine) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hotels, setHotels] = useState([]);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setFeaturedModal({ isEdit: false, isOpen: false }));
    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);

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

            if (featuredModal?.isEdit) {
                const response = await axios.patch(
                    `/hotels/featured/update/${selectedFeaturedHotel?._id}`,
                    { ...data, country: undefined },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateFeaturedHotel(response.data);
            } else {
                const response = await axios.post(
                    "/hotels/featured/add",
                    { ...data, country: undefined },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                addFeaturedHotel(response.data);
            }
            setFeaturedModal({ isOpen: false, isEdit: false });
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
                        {featuredModal?.isEdit ? "Update Featured Hotel" : "Add Featured Hotel"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setFeaturedModal({ isOpen: false, isEdit: false })}
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
                            <label htmlFor="">Tag Line</label>
                            <input
                                type="text"
                                placeholder="Ex: 30% Offer"
                                name="tagLine"
                                value={data.tagLine || ""}
                                onChange={handleChange}
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
                        <div className="mt-4 flex items-center gap-3">
                            <input
                                type="checkbox"
                                name="showHomePage"
                                checked={data.showHomePage || false}
                                onChange={(e) => {
                                    setData((prev) => {
                                        return { ...prev, showHomePage: e.target.checked };
                                    });
                                }}
                                id="showHomePage"
                                className="w-[15px] h-[15px]"
                            />
                            <label htmlFor="showHomePage" className="mb-0">
                                Show This On Home Page?
                            </label>
                        </div>
                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() =>
                                    setFeaturedModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[180px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : featuredModal?.isEdit ? (
                                    "Update Featured Hotel"
                                ) : (
                                    "Add Featured Hotel"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
