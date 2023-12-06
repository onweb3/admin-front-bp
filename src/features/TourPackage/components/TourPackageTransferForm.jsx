import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { handleTourDataChange } from "../../../redux/slices/tourPackageFormSlice";

export default function TourPackageTransferForm({ selectedSection }) {
    const { data } = useSelector((state) => state.tourPackageForm);

    const dispatch = useDispatch();

    const handleDataInpChange = (e) => {
        dispatch(handleTourDataChange({ name: e.target.name, value: e.target.value }));
    };

    const handleChkChange = (e) => {
        dispatch(handleTourDataChange({ name: e.target.name, value: e.target.checked }));
    };

    return (
        <div className={selectedSection === "transfer" ? "block" : "hidden"}>
            <div className="grid grid-cols-4 gap-4">
                <div>
                    <div className="flex items-center gap-2 w-max mb-2">
                        <input
                            type="checkbox"
                            name="isAirportTransfer"
                            id="isAirportTransfer"
                            checked={data?.isAirportTransfer || false}
                            onChange={handleChkChange}
                        />
                        <label htmlFor="isAirportTransfer" className="whitespace-nowrap mb-0">
                            Aiport Transfer Included?
                        </label>
                    </div>
                    {data?.isAirportTransfer === true && (
                        <>
                            <label htmlFor="">Airport Transfer Price *</label>
                            <input
                                type="text"
                                name="airportTransferPrice"
                                placeholder="Enter Aiport Transfer Price"
                                value={data?.airportTransferPrice || ""}
                                onChange={handleDataInpChange}
                            />
                        </>
                    )}
                </div>
                <div>
                    <div className="flex items-center gap-2 w-max mb-2">
                        <input
                            type="checkbox"
                            name="isInterHotelTransfer"
                            id="isInterHotelTransfer"
                            checked={data?.isInterHotelTransfer || false}
                            onChange={handleChkChange}
                        />
                        <label htmlFor="isInterHotelTransfer" className="whitespace-nowrap mb-0">
                            Inter Hotel Transfer Included?
                        </label>
                    </div>
                    {data?.isInterHotelTransfer === true && (
                        <>
                            <label htmlFor="">Inter Hotel Transfer Price *</label>
                            <input
                                type="text"
                                name="interHotelPrice"
                                placeholder="Enter Inter Hotel Transfer Price"
                                value={data?.interHotelPrice || ""}
                                onChange={handleDataInpChange}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
