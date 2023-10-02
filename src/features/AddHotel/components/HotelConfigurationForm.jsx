import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";

import {
    handleHotelDetailsChange,
    removeHotelOpenDay,
    selectHotelOpenDay,
} from "../../../redux/slices/hotelFormSlice";
import { MultipleSelectDropdown, SelectDropdown } from "../../../components";

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export default function HotelConfigurationForm({ selectedSection }) {
    const [isHbIdCopied, setIsHbIdCopied] = useState(false);

    const { details, accommodationTypes, apis, boards, hotelChains } = useSelector(
        (state) => state.hotelForm
    );
    const { states, cities, countries, areas } = useSelector((state) => state.general);
    const dispatch = useDispatch();

    const availableStates = states?.filter((item) => {
        return item?.country === details.country;
    });
    const availableCities = cities?.filter((item) => {
        return item?.country === details.country;
    });
    const availableAreas = areas?.filter((item) => {
        return item?.country === details.country;
    });

    const handleChange = (e) => {
        dispatch(
            handleHotelDetailsChange({
                name: e.target?.name,
                value: e.target?.value,
            })
        );
    };

    const handleCheckBoxChange = (e) => {
        dispatch(
            handleHotelDetailsChange({
                name: e.target?.name,
                value: e.target?.checked,
            })
        );
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsHbIdCopied(false);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [isHbIdCopied]);

    return (
        <div className={selectedSection === "-configuration" ? "block" : "hidden"}>
            <div className="grid grid-cols-4 gap-[20px]">
                <div className="flex items-center gap-[10px]">
                    <input
                        type="checkbox"
                        name="isContractAvailable"
                        checked={details?.isContractAvailable || false}
                        onChange={handleCheckBoxChange}
                        className="w-[17px] h-[17px]"
                        id="isContractAvailable"
                    />
                    <label htmlFor="isContractAvailable" className="mb-0">
                        Contract Available
                    </label>
                </div>
                <div className="flex items-center gap-[10px]">
                    <input
                        type="checkbox"
                        name="isApiConnected"
                        checked={details?.isApiConnected || false}
                        onChange={handleCheckBoxChange}
                        className="w-[17px] h-[17px]"
                        id="isApiConnected"
                    />
                    <label htmlFor="isApiConnected" className="mb-0">
                        Is Api Connected
                    </label>
                </div>
                <div>
                    <label htmlFor="">Connected APIs</label>
                    <div className="">
                        <MultipleSelectDropdown
                            data={apis}
                            displayName={"apiName"}
                            selectedData={details.connectedApis || []}
                            setSelectedData={(selApis) =>
                                dispatch(
                                    handleHotelDetailsChange({
                                        name: "connectedApis",
                                        value: selApis,
                                    })
                                )
                            }
                            valueName={"_id"}
                            randomIndex={"connectedApis"}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-[10px]">
                    <input
                        type="checkbox"
                        name="allGuestDetailsRequired"
                        checked={details?.allGuestDetailsRequired || false}
                        onChange={handleCheckBoxChange}
                        className="w-[17px] h-[17px]"
                        id="allGuestDetailsRequired"
                    />
                    <label htmlFor="allGuestDetailsRequired" className="mb-0">
                        All Guest Details Required?
                    </label>
                </div>
                <div>
                    <label htmlFor="">Hotel Bed Id</label>
                    <div className="flex items-center gap-[10px]">
                        <input
                            type="number"
                            placeholder="Enter hotel bed id"
                            name="hbId"
                            value={details?.hbId || ""}
                            onChange={handleChange}
                        />
                        <button
                            className={
                                "w-[40px] flex items-center justify-center text-lg bg-[#f3f6f9]  hover:bg-[#f0f0f0] " +
                                (isHbIdCopied ? "text-green-500" : "text-[#222]")
                            }
                            onClick={() => {
                                navigator.clipboard.writeText(details?.hbId || "");
                                setIsHbIdCopied(true);
                            }}
                        >
                            {isHbIdCopied ? <FaCheck /> : <FiCopy />}
                        </button>
                    </div>
                    <span className="text-sm text-grayColor block mt-2">
                        Consult technical team before updating this filed.(Hotel Bed provided id)
                    </span>
                </div>
                <div className="flex items-center gap-[10px]">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={details?.isActive || false}
                        onChange={handleCheckBoxChange}
                        className="w-[17px] h-[17px]"
                        id="isActive"
                    />
                    <label htmlFor="isActive" className="mb-0">
                        Is Active
                    </label>
                </div>
            </div>
        </div>
    );
}
