import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { useHandleClickOutside } from "../hooks";

export default function SelectDropdown({
    data,
    selectedData,
    setSelectedData,
    valueName,
    displayName,
    placeholder,
    bracketValue,
    disabled = false,
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDataInfo, setSelectedDataInfo] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsDropdownOpen(false));

    const filteredData = searchQuery
        ? data?.filter((item) => {
              return item[displayName]?.toLowerCase().includes(searchQuery.toLowerCase());
          })
        : data;

    useEffect(() => {
        if (selectedData) {
            const dataObjIndex = data?.findIndex((item) => item[valueName] === selectedData);
            if (dataObjIndex !== -1) {
                setSelectedDataInfo(data[dataObjIndex]);
            } else {
                setSelectedDataInfo({});
            }
        } else {
            setSelectedDataInfo({});
        }
    }, [data, selectedData]);

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                className="border border-[#ced4da] rounded w-ful text-[14px] text-[#212529] h-[40px] flex items-center"
                onClick={() => {
                    if (isDropdownOpen === false) {
                        setSearchQuery("");
                    }
                    setIsDropdownOpen(true);
                }}
            >
                {isDropdownOpen && disabled === false ? (
                    <div className="relative w-full h-full">
                        <input
                            type="text"
                            className="h-[100%] w-[100%] border-0"
                            placeholder={!selectedDataInfo[displayName] ? "Search here..." : ""}
                            value={searchQuery || ""}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                            }}
                            autoFocus
                        />
                        {!searchQuery && selectedDataInfo[displayName] && (
                            <span className="absolute top-[50%] left-0 translate-y-[-50%] px-[15px] capitalize">
                                {selectedDataInfo[displayName]}
                                {bracketValue ? ` (${selectedDataInfo[bracketValue]})` : ""}
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-between w-full px-3 text-sm">
                        <span className="capitalize">
                            {selectedDataInfo[displayName]
                                ? `${selectedDataInfo[displayName]}${
                                      bracketValue ? ` (${selectedDataInfo[bracketValue]})` : ""
                                  }`
                                : placeholder}
                        </span>
                        <span>
                            <FiChevronDown />
                        </span>
                    </div>
                )}
            </div>
            {isDropdownOpen && disabled === false && (
                <div className="absolute top-[100%] left-0 right-0 bg-white shadow-lg rounded max-h-[300px] overflow-y-auto z-10 text-[14px]">
                    {filteredData?.length < 1 ? (
                        <div className="p-2">
                            <span className="text-grayColor font-medium text-center block">
                                Search not found!
                            </span>
                        </div>
                    ) : (
                        filteredData?.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setSelectedData(item[valueName]);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="px-3 hover:bg-blue-500 hover:text-white capitalize py-1 cursor-pointer"
                                >
                                    {item[displayName]}{" "}
                                    {bracketValue ? ` (${item[bracketValue]})` : ""}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
