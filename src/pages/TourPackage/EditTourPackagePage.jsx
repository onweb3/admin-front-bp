import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";

import axios from "../../axios";
import {
    fetchTPackageInitialData,
    updateTourPackageFormAllData,
} from "../../redux/slices/tourPackageFormSlice";
import {
    TourPackageActivitiesForm,
    TourPackageDetailsForm,
    TourPackageEditFormButtons,
    TourPackageHotelForm,
    TourPackageSummaryForm,
    TourPackageTermsAndPolicyForm,
    TourPackageTransferForm,
} from "../../features/TourPackage";
import { PageLoader } from "../../components";
import { useImageChange } from "../../hooks";

const sections = {
    details: "Details",
    "terms-policy": "Validity and Policy",
    hotel: "Hotel",
    activities: "Activities",
    transfer: "Transfer",
    summary: "Summary",
};

export default function EditTourPackagePage() {
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState("details");

    const { tPackageId } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const dispatch = useDispatch();
    const {
        image: thumImg,
        handleImageChange: handleThumImgChange,
        error: thumImgError,
    } = useImageChange();

    const fetchTourPackage = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/tour-packages/single/${tPackageId}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            dispatch(updateTourPackageFormAllData(response.data));
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

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
        fetchTourPackage();
    }, []);

    useEffect(() => {
        dispatch(fetchTPackageInitialData());
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Edit Tour Package</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/tour-packages" className="text-textColor">
                        Tour Packages{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/tour-packages" className="text-textColor">
                        {tPackageId?.slice(0, 3)}...{tPackageId?.slice(-3)}{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
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
                            <TourPackageDetailsForm
                                selectedSection={selectedSection}
                                thumImg={thumImg}
                                handleThumImgChange={handleThumImgChange}
                                thumImgError={thumImgError}
                            />
                            <TourPackageTermsAndPolicyForm selectedSection={selectedSection} />
                            <TourPackageHotelForm selectedSection={selectedSection} />
                            <TourPackageActivitiesForm selectedSection={selectedSection} />
                            <TourPackageTransferForm selectedSection={selectedSection} />
                            <TourPackageSummaryForm
                                selectedSection={selectedSection}
                                thumImg={thumImg}
                            />
                            <TourPackageEditFormButtons
                                next={
                                    Object.keys(sections).indexOf(selectedSection) <
                                    Object.keys(sections).length - 1
                                }
                                goForward={goForward}
                                goBack={goBack}
                                prev={Object.keys(sections).indexOf(selectedSection) !== 0}
                                thumImg={thumImg}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
