import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdDelete } from "react-icons/md";
import { TbPlus } from "react-icons/tb";

import { SelectDropdown } from "../../../components";
import {
    handleTourPackageHotelDataChange,
    removeTPackageHotelRow,
    removeTourPackageHotelOption,
} from "../../../redux/slices/tourPackageFormSlice";
import axios from "../../../axios";
import TourPackageHotelAddModal from "./TourPackageHotelSelectModal";
import { config } from "../../../constants";

export default function TourPackageHotelFormHotelsRow({ tpHotel, tpHotelIndex }) {
    const [cities, setCities] = useState([]);
    const [isHotelLoading, setIsHotelLoading] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [isHotelSelectModalOpen, setIsHotelSelectModalOpen] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            handleTourPackageHotelDataChange({
                index: tpHotelIndex,
                name: "city",
                value: "",
            })
        );
        setCities([]);
        if (tpHotel?.country) {
            const fetchAllCitiesByCountry = async () => {
                try {
                    const resposne = await axios.get(`/cities/country/${tpHotel?.country}`, {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    });
                    setCities(resposne?.data?.cities);
                } catch (err) {
                    console.log(err);
                }
            };

            fetchAllCitiesByCountry();
        }
    }, [tpHotel?.country]);

    useEffect(() => {
        if (tpHotel?.country && tpHotel?.city) {
            const fetchHotels = async () => {
                try {
                    setIsHotelLoading(true);
                    const response = await axios.get(
                        `/hotels/board-and-room/city/${tpHotel?.city}`,
                        {
                            headers: { Authorization: `Bearer ${jwtToken}` },
                        }
                    );
                    setHotels(response?.data?.hotels);
                    setIsHotelLoading(false);
                } catch (err) {
                    console.log(err);
                }
            };

            fetchHotels();
        }
    }, [tpHotel?.country, tpHotel?.city]);

    return (
        <div className="mt-8 first:mt-0">
            <div className="grid grid-cols-4 gap-4">
                <div>
                    <label htmlFor="">Country</label>
                    <SelectDropdown
                        data={countries || []}
                        displayName="countryName"
                        valueName="_id"
                        placeholder="Select country"
                        selectedData={tpHotel?.country}
                        setSelectedData={(val) => {
                            dispatch(
                                handleTourPackageHotelDataChange({
                                    index: tpHotelIndex,
                                    name: "country",
                                    value: val,
                                })
                            );
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="">City</label>
                    <SelectDropdown
                        data={cities || []}
                        displayName="cityName"
                        valueName="_id"
                        placeholder="Select City"
                        selectedData={tpHotel?.city}
                        setSelectedData={(val) => {
                            dispatch(
                                handleTourPackageHotelDataChange({
                                    index: tpHotelIndex,
                                    name: "city",
                                    value: val,
                                })
                            );
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="">No Of Nights</label>
                    <input type="number" />
                </div>
            </div>

            <div className="mt-6 relative">
                <div className="grid grid-cols-7 gap-4 ">
                    {tpHotel?.hotelOptions?.map((hOption, hOptIndex) => {
                        return (
                            <div key={hOptIndex}>
                                <div className="w-full rounded overflow-hidden relative aspect-[5/3]">
                                    <img
                                        src={
                                            hOption?.hotel?.image?.isRelative === true
                                                ? config.SERVER_URL + hOption?.hotel?.image?.path
                                                : hOption?.hotel?.image?.path
                                        }
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                    <span
                                        className="absolute top-0 right-0 bg-red-100 text-red-500 cursor-pointer"
                                        onClick={() => {
                                            dispatch(
                                                removeTourPackageHotelOption({
                                                    index: tpHotelIndex,
                                                    hOptIndex,
                                                })
                                            );
                                        }}
                                    >
                                        <MdDelete />
                                    </span>
                                </div>
                                <span className="block font-medium text-sm mt-2">
                                    {hOption?.hotel?.hotelName}
                                </span>
                                <span className="block text-sm text-grayColor capitalize">
                                    {hOption?.hotel?.city?.cityName},{" "}
                                    {hOption?.hotel?.state?.stateName},{" "}
                                    {hOption?.hotel?.country?.countryName}
                                </span>
                                <span className="text-sm capitalize">
                                    {hOption?.roomName} | {hOption?.boardCode}
                                </span>
                            </div>
                        );
                    })}

                    <div
                        className={
                            "border border-gray-400 border-dashed flex items-center justify-center flex-col rounded min-h-[200px] " +
                            (tpHotel?.country && tpHotel?.city
                                ? "cursor-pointer"
                                : "cursor-not-allowed")
                        }
                        onClick={() => {
                            if (tpHotel?.country && tpHotel?.city) {
                                setIsHotelSelectModalOpen(true);
                            }
                        }}
                    >
                        <span className="text-[50px] text-gray-400">
                            <TbPlus />
                        </span>
                        <span className="font-medium text-[#333]">Add</span>
                    </div>

                    {isHotelSelectModalOpen && (
                        <TourPackageHotelAddModal
                            hotels={hotels}
                            isHotelLoading={isHotelLoading}
                            setIsHotelSelectModalOpen={setIsHotelSelectModalOpen}
                            tpHotelIndex={tpHotelIndex}
                        />
                    )}
                </div>
                <div className="border-t border-dashed border-gray-300 mt-5 relative">
                    <div className="absolute bottom-[100%] right-0">
                        <button
                            className="h-auto py-1 px-2 bg-transparent text-[#444] border rounded-tr-none font-[500] text-[13px]"
                            onClick={() => dispatch(removeTPackageHotelRow(tpHotelIndex))}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
