import React from "react";
import SingleAttractionItineraryItem from "./SingleAttractionItineraryItem";

export default function SingleAttractionItineraryForm({
    itinerary,
    data,
    setData,
    itineraryIndex,
    initialData,
}) {
    const handleItineraryItemChange = (e, itineraryIndex, itemIndex) => {
        let tempItineraries = data.itineraries;

        if (e.target.name === "images") {
            tempItineraries[itineraryIndex].items[itemIndex][e.target.name] = [
                ...tempItineraries?.[itineraryIndex]?.items[itemIndex]?.[
                    e.target.name
                ],
                e.target.value,
            ];
        } else {
            tempItineraries[itineraryIndex].items[itemIndex][e.target.name] =
                e.target.value;
        }
        setData((prev) => {
            return { ...prev, itineraries: tempItineraries };
        });
    };

    const deleteDay = (index) => {
        const filteredItineraries = data.itineraries?.filter((_, itIndex) => {
            return index !== itIndex;
        });
        setData((prev) => {
            return { ...prev, itineraries: filteredItineraries };
        });
    };

    const addItem = (itineraryIndex) => {
        const tempItineraries = data.itineraries;
        tempItineraries[itineraryIndex].items?.push({
            isCustom: false,
            attraction: "",
            attractionTitle: "",
            itineraryTitle: "",
            description: "",
            note: "",
            images: [],
        });
        setData((prev) => {
            return {
                ...prev,
                itineraries: tempItineraries,
            };
        });
    };

    const deleteItem = (itineraryIndex, itemIndex) => {
        let tempItineraries = data.itineraries;
        const filteredItems = tempItineraries[itineraryIndex]?.items?.filter(
            (_, index) => {
                return index !== itemIndex;
            }
        );
        tempItineraries[itineraryIndex].items = filteredItems;

        setData((prev) => {
            return { ...prev, itineraries: tempItineraries };
        });
    };

    console.log(data);

    return (
        <div className="mt-8">
            <div className="flex items-center justify-center">
                <span className="block w-full h-full border border-dashed"></span>
                <span className="whitespace-nowrap font-[600] text-lg px-4">
                    Day {itineraryIndex + 1}
                </span>
                <span className="block w-full h-full border border-dashed"></span>
            </div>
            {itinerary?.items?.map((item, itemIndex) => {
                return (
                    <SingleAttractionItineraryItem
                        key={itemIndex}
                        item={item}
                        itemIndex={itemIndex}
                        handleItineraryItemChange={handleItineraryItemChange}
                        itineraryIndex={itineraryIndex}
                        initialData={initialData}
                        deleteItem={deleteItem}
                    />
                );
            })}
            <div className="flex items-center gap-[15px] text-sm mt-2">
                <span
                    className="text-green-500 cursor-pointer underline"
                    onClick={() => addItem(itineraryIndex)}
                >
                    Add Item
                </span>
                <span
                    className="text-red-500 cursor-pointer underline"
                    onClick={() => deleteDay(itineraryIndex)}
                >
                    Delete Day
                </span>
            </div>
            <span
                className={
                    "w-full h-full border border-dashed mt-6 " +
                    (data.itineraries?.length === itineraryIndex + 1
                        ? "block"
                        : "hidden")
                }
            ></span>
        </div>
    );
}
