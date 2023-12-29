import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheck } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";

import { handleHotelDetailsChange } from "../../../redux/slices/hotelFormSlice";
import { MultipleSelectDropdown } from "../../../components";

export default function HotelConfigurationForm({ selectedSection, isEditPermission = true }) {
    const [isHbIdCopied, setIsHbIdCopied] = useState(false);

    const { details, apis } = useSelector((state) => state.hotelForm);
    const dispatch = useDispatch();

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
                        disabled={!isEditPermission}
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
                        disabled={!isEditPermission}
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
                            disabled={!isEditPermission}
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
                        disabled={!isEditPermission}
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
                            disabled={!isEditPermission}
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
                        disabled={!isEditPermission}
                    />
                    <label htmlFor="isActive" className="mb-0">
                        Is Active
                    </label>
                </div>
            </div>
        </div>
    );
}
