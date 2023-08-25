import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useHandleClickOutside } from "../hooks";

const InputDropDown = ({
    title,
    value,
    setValue,
    list,
    name,
    placeholder,
    isCustom,
}) => {
    const dropdownWrapperRef = useRef();
    const [showDd, setShowDd] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const handleFocus = () => {
        setShowDd(!showDd);
    };

    useHandleClickOutside(dropdownWrapperRef, () => {
        setShowDd(false);
    });
    useEffect(() => {
        const updated = list?.filter((ele) => {
            const data = inputValue.toLowerCase();
            return ele?.title?.toLowerCase().includes(data);
        });
        setFilteredData(updated);
    }, [inputValue, list]);

    useEffect(() => {
        if (value === "") {
            setInputValue("");
        }
        if (value && !isCustom && list.length > 0) {
            const initial = list?.filter((ele) => {
                return value === ele._id;
            })[0];
            setInputValue(initial?.title || "");
        } else if (value && isCustom) {
            setInputValue(value);
        }
    }, [isCustom, list]);
    return (
        <div>
            <div className="" ref={dropdownWrapperRef}>
                <div className="relative bg-white  ">
                    <input
                        name={name}
                        type="text"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setValue(e);
                        }}
                        onFocus={handleFocus}
                        required
                        className="block w-full capitalize outline-none bg-transparent text-sm  font-medium"
                    />
                </div>
                {showDd && (
                    <div className="absolute max-h-[17em] w-[21em] mt-1  bg-light rounded-lg overflow-y-auto z-20 bg-white">
                        <div className="w-full p-2 overflow-y-auto">
                            <div className="">
                                <p className="bg-gray-200 py-[2px] px-2 text-[14px] font-[600] text-textColor">
                                    {title}
                                </p>
                                {filteredData?.map((item) => (
                                    <>
                                        <div
                                            key={item?._id}
                                            className=" py-2 px-2 cursor-pointer capitalize text-darktext z-30 border-b text-sm"
                                            onClick={() => {
                                                setInputValue(item?.title);
                                                setValue({
                                                    target: {
                                                        name,
                                                        value: item?._id,
                                                    },
                                                });
                                                setShowDd(!showDd);
                                            }}
                                        >
                                            {item?.title}
                                        </div>
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InputDropDown;
