import React, { useRef, useState } from "react";
import { BsPlusCircle, BsPlusSquare } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";

import { useHandleClickOutside } from "../hooks";

export default function AddSingleSelectDropdown({
    data,
    setData,
    selectedData,
    setSelectedData,
    valueName,
    displayName,
    randomIndex = 0,
    bracketName,
    ComponentProp,
    isEdit,
}) {
    console.log("Accounts", data);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownData, setDropdownData] = useState({
        width: "0",
        left: "0",
        top: "0",
    });
    const [isModal, setIsModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selected, setSelected] = useState("");

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsDropdownOpen(false));

    const filteredData = searchQuery
        ? data?.filter((item) =>
              item[displayName]
                  ?.toLowerCase()
                  ?.includes(searchQuery?.toLowerCase())
          )
        : data;

    const removeSelectedItem = () => {
        setSelectedData("");
        setSelected("");
    };

    const handleScreenChange = () => {
        const parent = wrapperRef.current.getBoundingClientRect();

        const scrollLeft =
            window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;

        setDropdownData((prev) => {
            return {
                ...prev,
                width: parent.width,
                left: parent.left + scrollLeft,
                top: parent.top + scrollTop + parent.height,
            };
        });
    };

    return (
        <>
            <div className="" ref={wrapperRef}>
                <div
                    className="border border-[#ced4da] rounded text-[#212529] h-[40px] text-sm cursor-pointer"
                    onClick={() => {
                        if (isDropdownOpen === false) {
                            setSearchQuery("");
                        }
                        handleScreenChange();
                        setIsDropdownOpen(true);
                    }}
                >
                    {isDropdownOpen ? (
                        <div className="relative w-full h-full">
                            <input
                                type="text"
                                className="h-[100%] w-[100%] border-0"
                                value={searchQuery || ""}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                }}
                                autoFocus
                            />
                            {!searchQuery && (
                                <span className="absolute top-[50%] left-0 translate-y-[-50%] px-[15px] capitalize">
                                    {selected}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-between h-full w-full px-3">
                            {selected}
                            <span>
                                <FiChevronDown />
                            </span>
                        </div>
                    )}
                </div>

                <div
                    className={
                        `z-30 absolute top-[100%] left-0 w-full bg-white shadow-lg rounded max-h-[200px] overflow-y-auto  ` +
                        (isDropdownOpen === false
                            ? "invisible opacity-0"
                            : "visible opacity-100")
                    }
                    style={{
                        width: `${dropdownData.width}px`,
                        left: `${dropdownData.left}px`,
                        top: `${dropdownData.top}px`,
                    }}
                >
                    {filteredData?.length < 1 ? (
                        <div className="p-2">
                            <span className="text-grayColor font-medium text-center block text-sm">
                                Search not found!
                            </span>
                        </div>
                    ) : (
                        filteredData?.map((item) => {
                            return (
                                <label
                                    htmlFor={`multi-select-${item[valueName]}-${randomIndex}`}
                                    key={item[valueName]}
                                    className="flex items-center gap-[10px] px-[0.9rem] hover:bg-blue-500 hover:text-white py-1 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        className="w-[15px] h-[15px] min-w-[15px] min-h-[15px]"
                                        id={`multi-select-${item[valueName]}-${randomIndex}`}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedData(
                                                    item[valueName]
                                                );
                                                setSelected(item[displayName]);
                                            } else {
                                                removeSelectedItem(
                                                    item[valueName]
                                                );
                                            }
                                        }}
                                        checked={
                                            selectedData.toString() ===
                                            item[valueName]?.toString()
                                        }
                                    />
                                    <span className="capitalize">
                                        {item[displayName]}{" "}
                                        {bracketName &&
                                            `(${item[bracketName]})`}
                                    </span>
                                </label>
                            );
                        })
                    )}
                </div>
                {isEdit === true && (
                    <div
                        className={
                            `absolute sticky bottom-0 w-full h-[40px]  flex items-center rounded z-30` +
                            (isDropdownOpen === false
                                ? "hidden"
                                : "block opacity-100 bg-blue-400 hover:bg-blue-500 cursior-pointer pl-2")
                        }
                        onClick={(e) => {
                            setIsModal(true);
                        }}
                    >
                        <div className="flex items-center gap-6">
                            <div className="">
                                {" "}
                                <BsPlusCircle className="text-white" />
                            </div>
                            <div>
                                <p className="text-white">add new</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isModal && (
                <ComponentProp
                    setIsModal={setIsModal}
                    setData={setData}
                    data={data}
                />
            )}
        </>
    );
}
