import React from "react";
import BtnLoader from "../../components/BtnLoader";
import { GoLocation } from "react-icons/go";
import { addEnquiry } from "../../redux/slices/quotationSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaBed } from "react-icons/fa";

function Datalist({
    datalist,
    suggestions,
    value,
    setLocality,
    setDatalist,
    setValue,
    locality,
    isLoading,
    setIsHotel,
    setSearchQuery,
}) {
    const dispatch = useDispatch();
    const { enquiry, areas, states, cities } = useSelector(
        (state) => state.quotations
    );
    return (
        <>
            {datalist && (
                <div className="absolute max-h-[20em] w-[32em] mt-1 shadow border bg-white rounded-lg overflow-y-auto z-40">
                    <div className="w-full p-5 overflow-y-auto">
                        <div className="">
                            {(areas?.length > 0 || cities?.length > 0) &&
                                value.length < 3 && (
                                    <p className="test-xs text-gray-600 font-[700] pb-2">
                                        Top Destinations{" "}
                                    </p>
                                )}
                            {value.length < 3 &&
                                cities?.map((item) => (
                                    <div
                                        key={item?._id}
                                        className=" py-3  cursor-pointer capitalize text-darktext z-30 border-t text-sm "
                                        onClick={() => {
                                            setLocality(item?._id);
                                            setDatalist(!datalist);
                                            setValue(
                                                `${item.cityName}, ${item.stateName}, ${item.countryName}`
                                            );
                                            dispatch(
                                                addEnquiry({
                                                    ...enquiry,
                                                    locality: locality,
                                                })
                                            );
                                            setIsHotel(false);
                                            setSearchQuery({
                                                id: item?._id,
                                                suggestionType:
                                                    item?.suggestionType.toUpperCase(),
                                            });
                                        }}
                                    >
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg">
                                                <GoLocation />
                                            </span>
                                            <p className=" flex justify-between w-full">
                                                <span className="text-[15px] whitespace-nowrap">
                                                    {item?.cityName}
                                                </span>
                                                {item?.propertyCount ? (
                                                    <span className="text-[12px] text-gray-400">
                                                        ({item?.propertyCount})
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 text-[12px] pl-6">
                                            <span className=" whitespace-nowrap">
                                                {item?.stateName},
                                            </span>
                                            <span className=" whitespace-nowrap">
                                                {item?.countryName}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            {value.length < 3 &&
                                areas?.map((item) => (
                                    <div
                                        key={item?._id}
                                        className=" py-3  cursor-pointer capitalize text-darktext z-30 border-t text-sm "
                                        onClick={() => {
                                            setLocality(item?._id);
                                            setDatalist(!datalist);
                                            setValue(
                                                `${item.areaName},  ${item?.cityName}, ${item.stateName}, ${item.countryName}`
                                            );
                                            dispatch(
                                                addEnquiry({
                                                    ...enquiry,
                                                    locality: locality,
                                                })
                                            );
                                            setIsHotel(false);
                                            setSearchQuery({
                                                id: item?._id,
                                                suggestionType:
                                                    item?.suggestionType.toUpperCase(),
                                            });
                                        }}
                                    >
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg">
                                                <GoLocation />
                                            </span>
                                            <p className=" flex justify-between w-full">
                                                <span className="text-[15px] whitespace-nowrap">
                                                    {item?.areaName}
                                                </span>
                                                {item?.propertyCount ? (
                                                    <span className="text-[12px] text-gray-400">
                                                        ({item?.propertyCount})
                                                    </span>
                                                ) : (
                                                    ""
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 text-[12px] pl-6">
                                            <span className=" whitespace-nowrap">
                                                {item?.areaName},
                                            </span>
                                            <span className=" whitespace-nowrap">
                                                {item?.stateName},
                                            </span>
                                            <span className=" whitespace-nowrap">
                                                {item?.countryName}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        {(suggestions?.cities?.length > 0 &&
                            value.length > 2) ||
                        (suggestions?.states?.length > 0 && value.length > 2) ||
                        (suggestions?.hotels?.length > 0 &&
                            value.length > 2) ? (
                            <>
                                <div className="">
                                    {suggestions?.hotels?.length > 0 && (
                                        <p className="test-xs text-gray-600 font-[700] pb-2">
                                            Hotels
                                        </p>
                                    )}
                                    {suggestions?.hotels?.map((item) => (
                                        <div
                                            key={item?._id}
                                            className=" py-3  cursor-pointer capitalize text-darktext z-30 border-t text-sm "
                                            onClick={() => {
                                                setLocality(item?._id);
                                                setDatalist(!datalist);
                                                setValue(
                                                    `${item?.hotelName}, ${item?.cityName}, ${item.stateName}, ${item.countryName}`
                                                );
                                                dispatch(
                                                    addEnquiry({
                                                        ...enquiry,
                                                        locality: locality,
                                                    })
                                                );
                                                setSearchQuery({
                                                    id: item?._id,
                                                    suggestionType:
                                                        item?.suggestionType.toUpperCase(),
                                                });
                                                dispatch(
                                                    addEnquiry({
                                                        ...enquiry,
                                                        locality: locality,
                                                        suggestionType:
                                                            item?.suggestionType.toUpperCase(),
                                                    })
                                                );
                                                setSearchQuery({
                                                    id: item?._id,
                                                    suggestionType:
                                                        item?.suggestionType.toUpperCase(),
                                                });
                                                setIsHotel(true);
                                            }}
                                        >
                                            {!isLoading ? (
                                                <>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-lg">
                                                            <FaBed />
                                                        </span>
                                                        <span className="text-[15px] whitespace-nowrap">
                                                            {item?.hotelName}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 items-center text-[12px] pl-6">
                                                        <span className=" whitespace-nowrap">
                                                            {item?.cityName},
                                                        </span>
                                                        <span className=" whitespace-nowrap">
                                                            {item?.stateName},
                                                        </span>
                                                        <span className=" whitespace-nowrap ">
                                                            {item?.countryName}
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className=" w-full flex justify-center items-center">
                                                    <BtnLoader />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="">
                                    {suggestions?.cities?.length > 0 && (
                                        <p className="test-xs text-gray-600 font-[700] pb-2">
                                            Cities
                                        </p>
                                    )}
                                    {suggestions?.cities?.map((item) => (
                                        <div
                                            key={item?._id}
                                            className=" py-2  cursor-pointer capitalize text-darktext z-30 border-t text-sm "
                                            onClick={() => {
                                                setLocality(item?._id);
                                                setDatalist(!datalist);
                                                setValue(
                                                    `${item?.cityName}, ${item.stateName}, ${item.countryName}`
                                                );
                                                dispatch(
                                                    addEnquiry({
                                                        ...enquiry,
                                                        locality: locality,
                                                    })
                                                );
                                                setIsHotel(false);
                                                setSearchQuery({
                                                    id: item?._id,
                                                    suggestionType:
                                                        item?.suggestionType.toUpperCase(),
                                                });
                                            }}
                                        >
                                            {!isLoading ? (
                                                <>
                                                    <div className="">
                                                        <div className="flex gap-1">
                                                            <span className="text-lg">
                                                                <GoLocation />
                                                            </span>
                                                            <p className=" flex justify-between w-full">
                                                                <span className="text-[15px] whitespace-nowrap">
                                                                    {
                                                                        item?.cityName
                                                                    }
                                                                </span>
                                                                {item?.propertyCount ? (
                                                                    <span className="text-[12px] text-gray-400">
                                                                        (
                                                                        {
                                                                            item?.propertyCount
                                                                        }
                                                                        )
                                                                    </span>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 items-center text-[12px] pl-6">
                                                            <span className=" whitespace-nowrap">
                                                                {
                                                                    item?.stateName
                                                                }
                                                                ,
                                                            </span>
                                                            <span className=" whitespace-nowrap">
                                                                {
                                                                    item?.countryName
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className=" w-full flex justify-center items-center">
                                                    <BtnLoader />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="">
                                    {suggestions?.areas?.length > 0 && (
                                        <p className="test-xs text-gray-600 font-[700] pb-2">
                                            Areas
                                        </p>
                                    )}
                                    {suggestions?.areas?.map((item) => (
                                        <div
                                            key={item?._id}
                                            className=" py-2 cursor-pointer capitalize text-darktext z-30 border-t text-sm  "
                                        >
                                            {!isLoading ? (
                                                <>
                                                    <div
                                                        onClick={() => {
                                                            setLocality(
                                                                item?._id
                                                            );
                                                            setDatalist(
                                                                !datalist
                                                            );
                                                            setValue(
                                                                `${item.areaName},${item.cityName}, ${item.countryName}`
                                                            );
                                                            dispatch(
                                                                addEnquiry({
                                                                    ...enquiry,
                                                                    locality:
                                                                        locality,
                                                                    suggestionType:
                                                                        item?.suggestionType.toUpperCase(),
                                                                })
                                                            );
                                                            setSearchQuery({
                                                                id: item?._id,
                                                                suggestionType:
                                                                    item?.suggestionType.toUpperCase(),
                                                            });
                                                            setIsHotel(false);
                                                        }}
                                                        className=" py-3"
                                                    >
                                                        <div className="flex gap-1">
                                                            <span className="text-lg">
                                                                <GoLocation />
                                                            </span>
                                                            <p className=" flex justify-between w-full">
                                                                <span className="text-[15px] whitespace-nowrap">
                                                                    {
                                                                        item?.areaName
                                                                    }
                                                                </span>
                                                                {item?.propertyCount ? (
                                                                    <span className="text-[12px] text-gray-400">
                                                                        (
                                                                        {
                                                                            item?.propertyCount
                                                                        }
                                                                        )
                                                                    </span>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-wrap gap-1 text-[12px] pl-6">
                                                            <span className=" whitespace-nowrap">
                                                                {
                                                                    item?.countryName
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {item?.childSuggestions?.map?.(
                                                        (subItem) => (
                                                            <div
                                                                onClick={() => {
                                                                    setLocality(
                                                                        subItem?._id
                                                                    );
                                                                    setDatalist(
                                                                        !datalist
                                                                    );
                                                                    setValue(
                                                                        `${subItem?.cityName}, ${subItem.stateName}, ${subItem.countryName}`
                                                                    );
                                                                    dispatch(
                                                                        addEnquiry(
                                                                            {
                                                                                ...enquiry,
                                                                                locality:
                                                                                    locality,
                                                                            }
                                                                        )
                                                                    );
                                                                    setIsHotel(
                                                                        false
                                                                    );
                                                                    setSearchQuery(
                                                                        {
                                                                            id: item?._id,
                                                                            suggestionType:
                                                                                item?.suggestionType.toUpperCase(),
                                                                        }
                                                                    );
                                                                }}
                                                                className=" ml-5  border-t py-3"
                                                            >
                                                                <div className="flex gap-1 items-center ">
                                                                    <span className="text-lg">
                                                                        <GoLocation />
                                                                    </span>
                                                                    <span className="text-[15px] whitespace-nowrap">
                                                                        {
                                                                            subItem?.cityName
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-1 text-[12px] pl-6">
                                                                    <span className=" whitespace-nowrap">
                                                                        {
                                                                            subItem?.stateName
                                                                        }
                                                                        ,
                                                                    </span>
                                                                    <span className=" whitespace-nowrap">
                                                                        {
                                                                            subItem?.countryName
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </>
                                            ) : (
                                                <div className=" w-full flex justify-center items-center">
                                                    <BtnLoader />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (suggestions?.cities?.length < 1 &&
                              value.length > 3) ||
                          (suggestions?.states?.length < 1 &&
                              value.length > 3) ||
                          (suggestions?.hotels?.length < 1 &&
                              value.length > 3) ? (
                            <div className="">
                                <div className=" w-full flex justify-center items-center text-xs">
                                    No Query found with this data
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Datalist;
