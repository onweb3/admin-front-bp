import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import axios from "../../../axios";
import { RichTextEditor } from "../../../components";
import InputDropDown from "../../../components/InputDropDown";

export default function SingleAttractionItineraryItem({
    item,
    itemIndex,
    deleteItem,
    initialData,
    itineraryIndex,
    handleItineraryItemChange,
}) {
    const [selectedActivities, setSelectedActivites] = useState([]);
    const [customInput, setCustomInput] = useState(item?.isCustom);
    const custumInputRef = useRef();

    const [images, setImages] = useState([]);
    const { jwtToken } = useSelector((state) => state.admin);

    useEffect(() => {
        if (item?.attraction) {
            const filteredActivites = initialData.activities?.filter(
                (activity) => {
                    return activity?.attraction === item?.attraction;
                }
            );
            setSelectedActivites(filteredActivites);
        }
    }, [item.attraction, initialData.activities]);

    const handleToggleCustomInput = () => {
        custumInputRef.current.click();
        setCustomInput(!customInput);
        handleItineraryItemChange(
            { target: { name: "isCustom", value: !customInput } },
            itineraryIndex,
            itemIndex
        );
        if (customInput) {
            handleItineraryItemChange(
                { target: { name: "attractionTitle", value: null } },
                itineraryIndex,
                itemIndex
            );
        } else {
            handleItineraryItemChange(
                { target: { name: "attraction", value: null } },
                itineraryIndex,
                itemIndex
            );
        }
    };

    const handleAddImage = async (e) => {
        setImages([...images, e.target.files[0]]);
        var file = e.target.files[0];

        const fd = new FormData();
        fd.append("images", file);

        const response = await axios.post(
            `/attractions/itineraries/uploadImages`,
            fd,
            {
                headers: { authorization: `Bearer ${jwtToken}` },
            }
        );

        handleItineraryItemChange(
            { target: { name: "images", value: response?.data[0] } },
            itineraryIndex,
            itemIndex
        );
    };

    return (
        <div
            key={itemIndex}
            className="relative  flex items-end gap-[10px] mt-4 bg-[#f3f5f7] p-4 pt-6 rounded"
        >
            <div
                className=" flex gap-1 absolute top-0 left-4  cursor-pointer text-blue-500"
                onClick={handleToggleCustomInput}
            >
                <input
                    type="checkbox"
                    ref={custumInputRef}
                    className="pointer-events-none"
                    checked={item?.isCustom}
                />
                <div className="text-[16px]">Custom</div>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
                <div>
                    <label htmlFor="">Attraction</label>
                    <InputDropDown
                        title="Attractions"
                        placeholder="Enter Attraction"
                        name={customInput ? "attractionTitle" : "attraction"}
                        value={
                            customInput
                                ? item?.attractionTitle
                                : item?.attraction
                        }
                        isCustom={customInput}
                        setValue={(e) => {
                            handleItineraryItemChange(
                                e,
                                itineraryIndex,
                                itemIndex
                            );
                        }}
                        list={item?.isCustom ? [] : initialData?.attractions}
                    />
                </div>
                {/* <div>
                    <label htmlFor="">Activity</label>
                    <InputDropDown
                        title="Activities"
                        placeholder="Enter Activity"
                        name={customInput ? "activityTitle" : "activity"}
                        value={item.attraction || ""}
                        setValue={(e) => {
                            handleItineraryItemChange(
                                e,
                                itineraryIndex,
                                itemIndex
                            );
                        }}
                        list={
                            item?.isCustom
                                ? []
                                : selectedActivities.map((ele) => {
                                      return { ...ele, title: ele?.name };
                                  })
                        }
                    />
                </div> */}
                <div>
                    <label htmlFor="">Title</label>
                    <input
                        type="text"
                        placeholder="Enter sub title"
                        name="itineraryTitle"
                        value={item.itineraryTitle || ""}
                        onChange={(e) =>
                            handleItineraryItemChange(
                                e,
                                itineraryIndex,
                                itemIndex
                            )
                        }
                    />
                </div>
                {customInput && (
                    <div className="col-span-3">
                        <label htmlFor="">Images</label>
                        <input
                            className="cursor-pointer"
                            type="file"
                            placeholder="Choose Images"
                            name="images"
                            onChange={handleAddImage}
                        />
                    </div>
                )}
                <div className="col-span-3">
                    <label htmlFor="">Note</label>
                    <input
                        type="text"
                        placeholder="Enter Note"
                        name="note"
                        value={item.note || ""}
                        onChange={(e) =>
                            handleItineraryItemChange(
                                e,
                                itineraryIndex,
                                itemIndex
                            )
                        }
                    />
                </div>
                {customInput && (
                    <div className="col-span-3">
                        <label htmlFor="">Description</label>
                        {/* <input
                            type="text"
                            placeholder="Enter Description"
                            name="description"
                            value={item.description || ""}
                            onChange={(e) =>
                                handleItineraryItemChange(
                                    e,
                                    itineraryIndex,
                                    itemIndex
                                )
                            }
                        /> */}
                        <RichTextEditor
                            getValue={(value) => {
                                handleItineraryItemChange(
                                    { target: { name: "description", value } },
                                    itineraryIndex,
                                    itemIndex
                                );
                                // dispatch(
                                //     setData({ name: "highlights", value })
                                // );
                            }}
                            initialValue={item?.description || ""}
                        />
                    </div>
                )}
            </div>
            <button
                type="button"
                className="bg-[#f065481A] text-[#f06548] h-[40px] w-[40px] flex items-center justify-center text-lg"
                onClick={() => deleteItem(itineraryIndex, itemIndex)}
            >
                <MdDelete />
            </button>
        </div>
    );
}
