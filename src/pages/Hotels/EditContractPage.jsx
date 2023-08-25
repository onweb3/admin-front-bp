import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    BasicInfoForm,
    CancellationPolicyForm,
    ChildMealPolicyForm,
    ChildPolicyForm,
    HotelContractEditButtons,
    InclusionsForm,
    MealMasterForm,
    OtherSupplementForm,
    RateMasterForm,
    TermsAndConditionForm,
} from "../../features/ContractUpsert";
import {
    approveHotelContract,
    fetchInitialDataWithContract,
    resetContractForm,
} from "../../redux/slices/hotelContractSlice";
import { BtnLoader, PageLoader } from "../../components";
import axios from "../../axios";
import { hasPermission } from "../../utils";
import { FiCheck } from "react-icons/fi";
import { MdClose } from "react-icons/md";

const sections = {
    "basic-info": "Basic Info",
    "rate-master": "Rate Master",
    "meal-master": "Meal Master",
    "other-supplement": "Other Supplement",
    "child-policy": "Child Policy",
    // "child-meal-policy": "Child Meal Policy",
    "cancel-policy": "Cancellation Policy",
    "-inclusion": "Inclusion",
    "-tac": "Terms And Conditions",
    // "contract-file": "Contract File",
};

export default function EditContractPage() {
    const [selectedSection, setSelectedSection] = useState("basic-info");
    const [isApprovalLoading, setIsApprovalLoading] = useState(false);

    const { isContractLoading, contractStatus } = useSelector((state) => state.hotelContractForm);
    const { jwtToken, admin } = useSelector((state) => state.admin);
    const { id, contractId, contractGroupId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const approveContract = async (isApproved) => {
        try {
            let isConfirm;
            if (isApproved === true) {
                isConfirm = window.confirm(
                    "Before approving a contract please make sure all data and prices are correct?"
                );
            } else {
                isConfirm = window.confirm("Are you sure to cancel this contract's approval?");
            }
            if (isConfirm) {
                setIsApprovalLoading(true);
                const response = await axios.patch(
                    `/hotels/contracts/approve/${contractId}`,
                    { isApproved },
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
                dispatch(approveHotelContract(response?.data?.status));
                setIsApprovalLoading(false);
                navigate(`/hotels/${id}/contract-groups/${contractGroupId}/contracts`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        dispatch(fetchInitialDataWithContract({ id, contractId, contractGroupId }));
    }, []);

    useEffect(() => {
        return () => dispatch(resetContractForm());
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Edit Contract</h1>
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
                    <span>{">"} </span>
                    <Link
                        to={`/hotels/${id}/contract-groups/${contractGroupId}/contracts`}
                        className="text-textColor"
                    >
                        Contract Groups{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {contractGroupId?.slice(0, 3)}...
                        {contractGroupId?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Contracts </span>
                    <span>{">"} </span>
                    <span>
                        {contractId?.slice(0, 3)}...
                        {contractId?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Edit </span>
                </div>
            </div>

            <div className="p-6 ">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Edit Contract</h1>
                        {!isContractLoading &&
                            hasPermission({
                                roles: admin?.roles,
                                name: "contracts",
                                permission: "approve",
                            }) &&
                            (contractStatus === "approved" ? (
                                <span className="text-sm text-green-500 font-medium">
                                    &#x2713; Contract Approved
                                </span>
                            ) : contractStatus === "not-approved" ? (
                                <span className="text-sm text-red-500 font-medium">
                                    &#x2713; Contract Not Approved
                                </span>
                            ) : contractStatus === "inactive" ? (
                                <span className="text-sm text-red-500 font-medium">
                                    &#x2713; Contract Not Active
                                </span>
                            ) : isContractLoading ? (
                                <span className="text-sm font-medium">Loading...</span>
                            ) : (
                                <div className="flex items-center justify-end gap-[10px]">
                                    <button
                                        className="bg-green-500 flex items-center gap-2 justify-center px-3 disabled:cursor-not-allowed"
                                        onClick={() => approveContract(true)}
                                        disabled={isApprovalLoading}
                                    >
                                        <FiCheck /> Approve
                                    </button>
                                    <button
                                        className="bg-red-500 flex items-center justify-center gap-2 px-3 disabled:cursor-not-allowed"
                                        onClick={() => approveContract(false)}
                                        disabled={isApprovalLoading}
                                    >
                                        <MdClose /> Cancel
                                    </button>
                                </div>
                            ))}
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

                            <HotelContractEditButtons
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
