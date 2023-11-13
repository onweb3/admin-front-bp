import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import { formatDate } from "../../../utils";
import AddVoucherV2TourTableRow from "./AddVoucherV2TourTableRow";

export default function AddVoucherV2TourTable({ tourData, setTourData }) {
    const handleDragEnd = ({ destination, source }) => {
        if (!destination) {
            return;
        }

        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            return;
        }

        let sourceObjIndex = tourData.findIndex((item) => item.date === source.droppableId);
        let destObjIndex = tourData.findIndex((item) => item.date === destination.droppableId);
        const itemCopy = { ...tourData[sourceObjIndex].tourItems[source.index] };

        setTourData((prev) => {
            prev = [...prev];
            // Remove from previous items array
            prev[sourceObjIndex].tourItems.splice(source.index, 1);

            // Adding to new items array location
            prev[destObjIndex].tourItems.splice(destination.index, 0, itemCopy);

            return prev;
        });
    };

    const handleChange = (e, tourDayIndex, tourItemIndex) => {
        const tempTourData = tourData;
        tempTourData[tourDayIndex].tourItems[tourItemIndex][e.target.name] = e.target.value;
        setTourData(JSON.parse(JSON.stringify(tempTourData)));
    };

    const addExtraRow = (tourDayIndex) => {
        const tempTourData = tourData;
        tempTourData[tourDayIndex].tourItems.push({
            randId: "RANDID" + (Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000) + Date.now(),
            tourName: "",
            tourType: "regular",
            date: "",
            pickupFrom: "",
            pickupTimeFrom: "",
            pickupTimeTo: "",
            returnTimeFrom: "",
        });
        setTourData(JSON.parse(JSON.stringify(tempTourData)));
    };

    const deleteExtraRow = (tourDayIndex, tourItemIndex) => {
        setTourData((prev) => {
            const updatedTourData = [...prev];
            updatedTourData[tourDayIndex].tourItems.splice(tourItemIndex, 1);
            return updatedTourData;
        });
    };

    return (
        <div className="mt-8">
            <h2 className="font-medium mb-2">Tours Itinerary</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
                {tourData?.map((tour, tourDayIndex) => {
                    return (
                        <div key={tourDayIndex} className="mb-6 last:mb-0">
                            <h4 className="font-medium text-sm mb-2">
                                Day {tourDayIndex + 1} ({formatDate(tour?.date)})
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                                        <tr>
                                            <th className="p-2 border w-[35px]">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        className="w-[25px] h-[25px] rounded-full bg-green-500"
                                                        onClick={() => addExtraRow(tourDayIndex)}
                                                        type="button"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </th>
                                            <th className="font-[500] p-2 border">Tour Name</th>
                                            <th className="font-[500] p-2 border">Tour Type</th>
                                            <th className="font-[500] p-2 border">Pickup From</th>
                                            <th className="font-[500] p-2 border">
                                                Pickup Time From
                                            </th>
                                            <th className="font-[500] p-2 border">
                                                Pickup Time To
                                            </th>
                                            <th className="font-[500] p-2 border">Return Time</th>
                                        </tr>
                                    </thead>
                                    <Droppable droppableId={tour?.date}>
                                        {(provided, snapshot) => {
                                            return (
                                                <tbody
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className="text-sm"
                                                >
                                                    {tour?.tourItems?.map(
                                                        (tourItem, tourItemIndex) => {
                                                            return (
                                                                <Draggable
                                                                    key={tourItem?._id ||
                                                                        tourItem?.randId}
                                                                    index={tourItemIndex}
                                                                    draggableId={
                                                                        tourItem?._id ||
                                                                        tourItem?.randId
                                                                    }
                                                                >
                                                                    {(provided, snapshot) => {
                                                                        return (
                                                                            <tr
                                                                                ref={
                                                                                    provided.innerRef
                                                                                }
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                className="bg-white border-b border-tableBorderColor"
                                                                            >
                                                                                <AddVoucherV2TourTableRow
                                                                                    tourItem={
                                                                                        tourItem
                                                                                    }
                                                                                    handleChange={
                                                                                        handleChange
                                                                                    }
                                                                                    tourDayIndex={
                                                                                        tourDayIndex
                                                                                    }
                                                                                    tourItemIndex={
                                                                                        tourItemIndex
                                                                                    }
                                                                                    deleteExtraRow={
                                                                                        deleteExtraRow
                                                                                    }
                                                                                />
                                                                            </tr>
                                                                        );
                                                                    }}
                                                                </Draggable>
                                                            );
                                                        }
                                                    )}
                                                    {provided.placeholder}
                                                </tbody>
                                            );
                                        }}
                                    </Droppable>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </DragDropContext>
        </div>
    );
}
