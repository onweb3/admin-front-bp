import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addGuide,
    handleQuotationDisableChange,
} from "../../redux/slices/quotationSlice";
import { useHandleClickOutside } from "../../hooks";
import axios from "../../axios";
import SingleGuide from "./SingleGuide";

export default function GuideQuotationForm() {
    const dispatch = useDispatch();
    const [searchedGuides, setSearchedGuides] = useState([]);

    const [searchText, setSearchText] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const {
        isGuideQuotationDisabled,
        selectedGuides,
        selectedGuidesIds,
        checkInDate,
    } = useSelector((state) => state.quotations);
    const [perPersonTotal, setPerPersonTotal] = useState(0);
    const dropdownWrapperRef = useRef();
    useHandleClickOutside(dropdownWrapperRef, () => setIsDropdownOpen(false));
    const { jwtToken } = useSelector((state) => state.admin);

    const fetchGuides = async (text) => {
        try {
            const response = await axios.get(
                `/quotations/inital/guides?text=${text}&date=${checkInDate}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setSearchedGuides(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (searchText) {
            fetchGuides(searchText);
        }
    }, [searchText]);

    useEffect(() => {
        let total = 0;

        for (let i = 0; i < selectedGuides?.length; i++) {
            total += Number(selectedGuides[i].perPersonPrice);
        }
        setPerPersonTotal(total);
    }, [selectedGuides]);

    return (
        <div>
            <div className="flex items-center mb-7 gap-4">
                <input
                    type="checkbox"
                    className="w-[16px] h-[16px]"
                    checked={!isGuideQuotationDisabled}
                    onChange={(e) =>
                        dispatch(
                            handleQuotationDisableChange({
                                name: "isGuideQuotationDisabled",
                                value: !e.target.checked,
                            })
                        )
                    }
                />
                <h1 className="text-base font-[600]  text-blue-500">
                    Guide Quotation
                </h1>
            </div>
            {isGuideQuotationDisabled === false && (
                <div className="flex items-start gap-[2em]">
                    <label htmlFor="" className="w-[100%] max-w-[180px]">
                        Guides
                    </label>
                    <div className="w-full">
                        <div className="">
                            {" "}
                            <div className="relative" ref={dropdownWrapperRef}>
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                    onFocus={() => setIsDropdownOpen(true)}
                                />
                                {isDropdownOpen && searchText && (
                                    <div className="absolute top-[100%] left-0 right-0 bg-[#fff] max-h-[200px] overflow-y-auto shadow-lg">
                                        {searchedGuides?.length < 1 ? (
                                            <div className="flex items-center justify-center h-full gap-[10px] p-5">
                                                <span className="text-sm text-gray-500">
                                                    No Guide Found
                                                </span>
                                            </div>
                                        ) : (
                                            searchedGuides?.map(
                                                (guide, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className={
                                                                "flex items-center gap-[10px] px-4 py-[7px] hover:bg-[#f6f6f6] cursor-pointer text-sm " +
                                                                (selectedGuidesIds?.includes(
                                                                    guide?._id
                                                                )
                                                                    ? "cursor-not-allowed"
                                                                    : "cursor-pointer")
                                                            }
                                                            onClick={() => {
                                                                if (
                                                                    !selectedGuidesIds?.includes(
                                                                        guide?._id
                                                                    )
                                                                ) {
                                                                    dispatch(
                                                                        addGuide(
                                                                            {
                                                                                guide,
                                                                            }
                                                                        )
                                                                    );
                                                                    setIsDropdownOpen(
                                                                        false
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <span
                                                                className={
                                                                    "flex items-center justify-center w-[18px] h-[18px] min-w-[18px] min-h-[18px] rounded-full " +
                                                                    (selectedGuidesIds?.includes(
                                                                        guide?._id
                                                                    )
                                                                        ? "bg-green-200 text-green-500"
                                                                        : "bg-blue-200 text-blue-500")
                                                                }
                                                            >
                                                                {selectedGuidesIds?.includes(
                                                                    guide?._id
                                                                )
                                                                    ? "-"
                                                                    : "+"}
                                                            </span>
                                                            <span className="leading-[22px]">
                                                                {
                                                                    guide.name?.split(
                                                                        "+"
                                                                    )[0]
                                                                }{" "}
                                                                <span className="text-blue-500">
                                                                    {guide.name?.split(
                                                                        "+"
                                                                    )[1] &&
                                                                        "+ " +
                                                                            guide.name?.split(
                                                                                "+"
                                                                            )[1]}
                                                                </span>
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-5">
                            {!selectedGuides && selectedGuides?.length < 1 ? (
                                <span className="text-sm text-gray-500">
                                    No Guides Selected!
                                </span>
                            ) : (
                                [...selectedGuides]
                                    .slice(0)
                                    .reverse()
                                    ?.map((guide) => {
                                        return (
                                            <SingleGuide
                                                key={guide?.guideId}
                                                guide={guide}
                                            />
                                        );
                                    })
                            )}
                        </div>
                        <div className="flex items-start gap-[2em] mt-8 text-sm">
                            <label
                                htmlFor=""
                                className="w-[100%] max-w-[180px]"
                            >
                                Per Person Total
                            </label>
                            <span className="font-medium">
                                {perPersonTotal?.toFixed(2)} AED
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
