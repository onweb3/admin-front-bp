import React from "react";
import TourTableRow from "./TourTableRow";

export default function TourTable({
    addExtraRow,
    deleteExtraRow,
    tourData,
    handleExtraDataChange,
    activities,
}) {
    const handleChange = (e, index) => {
        handleExtraDataChange({
            index,
            name: e.target.name,
            value: e.target.value,
        });
    };

    return (
        <div className="mt-4">
            <h2 className="font-medium mb-2 underline">Tours Itinerary</h2>
            <div className="">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                        <tr>
                            <th className="p-2 border w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-[25px] h-[25px] rounded-full bg-green-500"
                                        onClick={addExtraRow}
                                        type="button"
                                    >
                                        +
                                    </button>
                                </div>
                            </th>
                            <th className="font-[500] p-2 border">Tour Name</th>
                            <th className="font-[500] p-2 border">Date</th>
                            <th className="font-[500] p-2 border">
                                PickupFrom
                            </th>
                            <th className="font-[500] p-2 border">
                                Pickup Time From
                            </th>
                            <th className="font-[500] p-2 border">
                                Pickup Time To
                            </th>
                            <th className="font-[500] p-2 border">
                                Return Time
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {tourData.map((tourData, index) => (
                            <TourTableRow
                                tourData={tourData}
                                key={index}
                                index={index}
                                deleteExtraRow={deleteExtraRow}
                                handleChange={handleChange}
                                activities={activities}
                                handleExtraDataChange={handleExtraDataChange}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
