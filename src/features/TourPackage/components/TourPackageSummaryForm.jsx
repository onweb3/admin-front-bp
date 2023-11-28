import React from "react";

export default function TourPackageSummaryForm({ selectedSection }) {
    return (
        <div className={selectedSection === "summary" ? "block" : "hidden"}>
            TourPackageSummaryForm
        </div>
    );
}
