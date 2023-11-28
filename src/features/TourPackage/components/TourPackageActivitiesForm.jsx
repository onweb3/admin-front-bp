import React from "react";
import { useSelector } from "react-redux";

import TourPackageActivitiesRow from "./TourPackageActivitiesRow";

export default function TourPackageActivitiesForm({ selectedSection }) {
    const { itineraries } = useSelector((state) => state.tourPackageForm);

    return (
        <div className={selectedSection === "activities" ? "block" : "hidden"}>
            {itineraries?.length < 1 ? (
                <span className="text-sm font-medium text-grayColor">
                    Select number of days first..!
                </span>
            ) : (
                itineraries?.map((itinerary, itineraryIndex) => {
                    return (
                        <TourPackageActivitiesRow
                            key={itineraryIndex}
                            itinerary={itinerary}
                            itineraryIndex={itineraryIndex}
                        />
                    );
                })
            )}
        </div>
    );
}
