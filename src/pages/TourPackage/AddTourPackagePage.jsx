import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import TourPackageDetailsForm from "../../features/TourPackage/components/TourPackageDetailsForm";
import {
    TourPackageActivitiesForm,
    TourPackageHotelForm,
    TourPackageSummaryForm,
    TourPackageTransferForm,
    TourPackageAddFormButtons,
} from "../../features/TourPackage";
import { useDispatch } from "react-redux";
import { fetchTPackageInitialData } from "../../redux/slices/tourPackageFormSlice";

const sections = {
    details: "Details",
    hotel: "Hotel",
    activities: "Activities",
    transfer: "Transfer",
    summary: "Summary",
};

export default function AddTourPackagePage() {
    const [selectedSection, setSelectedSection] = useState("details");

    const dispatch = useDispatch();

    const goForward = () => {
        if (Object.keys(sections).indexOf(selectedSection) < Object.keys(sections).length - 1) {
            setSelectedSection(
                Object.keys(sections)[Object.keys(sections).indexOf(selectedSection) + 1]
            );
        }
    };

    const goBack = () => {
        if (Object.keys(sections).indexOf(selectedSection) > 0) {
            setSelectedSection(
                Object.keys(sections)[Object.keys(sections).indexOf(selectedSection) - 1]
            );
        }
    };

    useEffect(() => {
        dispatch(fetchTPackageInitialData());
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Add Tour Package</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/tour-packages" className="text-textColor">
                        Tour Packages{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="p-4">
                        <ul className="dir-btn">
                            {Object.keys(sections)?.map((section, index) => {
                                return (
                                    <li
                                        key={index}
                                        className={selectedSection === section ? "active" : ""}
                                        onClick={() => {
                                            setSelectedSection(section);
                                        }}
                                    >
                                        <span>{sections[section]}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="p-4">
                        <TourPackageDetailsForm selectedSection={selectedSection} />
                        <TourPackageHotelForm selectedSection={selectedSection} />
                        <TourPackageActivitiesForm selectedSection={selectedSection} />
                        <TourPackageTransferForm selectedSection={selectedSection} />
                        <TourPackageSummaryForm selectedSection={selectedSection} />
                        <TourPackageAddFormButtons
                            next={
                                Object.keys(sections).indexOf(selectedSection) <
                                Object.keys(sections).length - 1
                            }
                            goForward={goForward}
                            goBack={goBack}
                            prev={Object.keys(sections).indexOf(selectedSection) !== 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
