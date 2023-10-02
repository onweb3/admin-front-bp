import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import {
    HotelAddFormButtons,
    HotelAmenityForm,
    HotelConfigurationForm,
    HotelContactInfoForm,
    HotelDescriptionForm,
    HotelDetailsForm,
    HotelMediaForm,
    HotelRestAndBarForm,
} from "../../features/AddHotel";
import { fetchInitialData, resetHotelForm } from "../../redux/slices/hotelFormSlice";

const sections = {
    "-details": "Details",
    "-configuration": "Configuration",
    "-description": "Description",
    "-amenities": "Amenities",
    "-rest-and-bar": "Restaurant & Bar",
    "-contact": "Contact Info",
    "-media": "Media",
};

export default function AddHotelPage() {
    const [selectedSection, setSelectedSection] = useState("-details");
    const [newImages, setNewImages] = useState([]);

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
        dispatch(fetchInitialData());
    }, []);

    useEffect(() => {
        return () => dispatch(resetHotelForm());
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Add Hotel</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels{" "}
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
                        <HotelDetailsForm selectedSection={selectedSection} />
                        <HotelConfigurationForm selectedSection={selectedSection} />
                        <HotelDescriptionForm selectedSection={selectedSection} />
                        <HotelAmenityForm selectedSection={selectedSection} />
                        <HotelMediaForm
                            selectedSection={selectedSection}
                            newImages={newImages}
                            setNewImages={setNewImages}
                        />
                        <HotelContactInfoForm selectedSection={selectedSection} />
                        <HotelRestAndBarForm selectedSection={selectedSection} />
                        <HotelAddFormButtons
                            newImages={newImages}
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
