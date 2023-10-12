import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    BasicInfoForm,
    CancellationPolicyForm,
    ChildPolicyForm,
    InclusionsForm,
    MealMasterForm,
    OtherSupplementForm,
    RateMasterForm,
    TermsAndConditionForm,
    HotelContractAddFormButtons,
    ContractExcludedDatesForm,
} from "../../features/ContractUpsert";
import { fetchInitialData, resetContractForm } from "../../redux/slices/hotelContractSlice";
import { PageLoader } from "../../components";

const sections = {
    "basic-info": "Basic Info",
    "rate-master": "Rate Master",
    "meal-master": "Meal Master",
    "other-supplement": "Other Supplement",
    "child-policy": "Child Policy",
    // "child-meal-policy": "Child Meal Policy",
    "cancel-policy": "Cancellation Policy",
    "excluded-dates": "Excluded Dates",
    "-inclusion": "Inclusion",
    "-tac": "Terms And Conditions",
    // "contract-file": "Contract File",
};

export default function AddContractPage() {
    const [selectedSection, setSelectedSection] = useState("basic-info");

    const { isContractLoading } = useSelector((state) => state.hotelContractForm);
    const { id, contractGroupId } = useParams();
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
        dispatch(fetchInitialData({ id, contractGroupId }));
    }, []);

    useEffect(() => {
        return () => dispatch(resetContractForm());
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Add Contract</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/hotels" className="text-textColor">
                        Hotels
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </span>
                    <Link
                        to={`/hotels/${id}/contract-groups/${contractGroupId}/contracts`}
                        className="text-textColor"
                    >
                        Contract Groups{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {contractGroupId?.slice(0, 3)}...{contractGroupId?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Contracts </span>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>

            <div className="p-6 ">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Add Contract</h1>
                    </div>
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

                    {isContractLoading ? (
                        <PageLoader />
                    ) : (
                        <>
                            <div className={selectedSection === "basic-info" ? "block" : "hidden"}>
                                <BasicInfoForm />
                            </div>
                            <div className={selectedSection === "rate-master" ? "block" : "hidden"}>
                                <RateMasterForm />
                            </div>
                            <div className={selectedSection === "meal-master" ? "block" : "hidden"}>
                                <MealMasterForm />
                            </div>
                            <div
                                className={
                                    selectedSection === "other-supplement" ? "block" : "hidden"
                                }
                            >
                                <OtherSupplementForm />
                            </div>
                            <div
                                className={selectedSection === "child-policy" ? "block" : "hidden"}
                            >
                                <ChildPolicyForm />
                            </div>
                            {/* <div
                        className={
                            selectedSection === "child-meal-policy"
                                ? "block"
                                : "hidden"
                        }
                    >
                        <ChildMealPolicyForm />
                    </div> */}
                            <div
                                className={selectedSection === "cancel-policy" ? "block" : "hidden"}
                            >
                                <CancellationPolicyForm />
                            </div>
                            <div className={selectedSection === "-inclusion" ? "block" : "hidden"}>
                                <InclusionsForm />
                            </div>
                            <div className={selectedSection === "-tac" ? "block" : "hidden"}>
                                <TermsAndConditionForm />
                            </div>
                            <div
                                className={
                                    selectedSection === "excluded-dates" ? "block" : "hidden"
                                }
                            >
                                <ContractExcludedDatesForm />
                            </div>

                            <HotelContractAddFormButtons
                                next={
                                    Object.keys(sections).indexOf(selectedSection) <
                                    Object.keys(sections).length - 1
                                }
                                goForward={goForward}
                                goBack={goBack}
                                prev={Object.keys(sections).indexOf(selectedSection) !== 0}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
