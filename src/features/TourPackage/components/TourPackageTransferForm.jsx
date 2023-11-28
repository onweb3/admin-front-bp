import React from "react";

export default function TourPackageTransferForm({ selectedSection }) {
    return (
        <div className={selectedSection === "transfer" ? "block" : "hidden"}>
            TourPackageTransferForm
        </div>
    );
}
