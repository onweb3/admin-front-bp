import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { SelectDropdown } from "../../../components";
import { addTPackageItineraryItems } from "../../../redux/slices/tourPackageFormSlice";

export default function TourPackageActivityAddModal({ setIsItineraryModalOpen, itineraryIndex }) {
    const [activityData, setActivityData] = useState({
        activityId: "",
        activity: {},
        transferType: "",
        vehicleType: {},
        itineraryName: "",
        description: "",
        price: "",
    });

    const { activities } = useSelector((state) => state.tourPackageForm);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsItineraryModalOpen(false));
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setActivityData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium">Add Activity</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsItineraryModalOpen(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <div>
                        <label htmlFor="">Activity *</label>
                        <SelectDropdown
                            data={activities || []}
                            displayName="name"
                            valueName="_id"
                            selectedData={activityData.activityId}
                            setSelectedData={(val) => {
                                const activity = activities?.find((item) => {
                                    return item?._id === val;
                                });
                                setActivityData((prev) => {
                                    return {
                                        ...prev,
                                        activityId: val,
                                        itineraryName: activity?.name,
                                        activity,
                                        transferType: "",
                                        vehicleType: {},
                                        price: "",
                                    };
                                });
                            }}
                            placeholder="Select Activity"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Transfer Type *</label>
                        <select
                            name="transferType"
                            id=""
                            value={activityData.transferType}
                            onChange={handleChange}
                            disabled={!activityData.activity}
                        >
                            <option value="" hidden>
                                Select Transfer Type
                            </option>
                            {activityData.activity?.activityType === "normal" && (
                                <option value="ticket-only">Ticket Only</option>
                            )}
                            {activityData.activity?.isSharedTransferAvailable === true && (
                                <option value="shared">Shared</option>
                            )}
                            {activityData?.activity?.isPrivateTransferAvailable === true &&
                                activityData.activity?.privateTransfers?.length > 0 && (
                                    <option value="private">Private</option>
                                )}
                        </select>
                    </div>
                    {/* {activityData?.transferType === "private" && activityData?.activity && (
                        <div className="mt-4">
                            <label htmlFor="">Vehicle Type</label>
                            <div className="flex items-center flex-wrap gap-4">
                                {activityData?.activity?.privateTransfers?.map(
                                    (pvtTransfer, pvtTransferIndex) => {
                                        return (
                                            <div
                                                className="flex items-center gap-2"
                                                key={pvtTransferIndex}
                                            >
                                                <input
                                                    type="radio"
                                                    name="vehicleType"
                                                    id={"vehicleType" + pvtTransferIndex}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setActivityData((prev) => {
                                                                return {
                                                                    ...prev,
                                                                    vehicleTypeId: pvtTransfer?._id,
                                                                    vehicleType: pvtTransfer,
                                                                };
                                                            });
                                                        }
                                                    }}
                                                />
                                                <label
                                                    htmlFor={"vehicleType" + pvtTransferIndex}
                                                    className="mb-0 whitespace-nowrap"
                                                >
                                                    {pvtTransfer?.name}
                                                </label>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    )} */}
                    <div className="mt-4">
                        <label htmlFor="">Display Name *</label>
                        <input
                            type="text"
                            placeholder="Enter Display Name"
                            name="itineraryName"
                            value={activityData.itineraryName || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Description *</label>
                        <textarea
                            name="description"
                            id=""
                            placeholder="Enter description"
                            value={activityData.description || ""}
                            onChange={handleChange}
                            className="h-[130px]"
                        ></textarea>
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Price *</label>
                        <input
                            type="number"
                            placeholder="Enter price"
                            name="price"
                            value={activityData.price || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center justify-end mt-5">
                        <button
                            className="w-[140px]"
                            onClick={() => {
                                console.log(activityData);
                                dispatch(
                                    addTPackageItineraryItems({
                                        itineraryIndex,
                                        ...activityData,
                                    })
                                );
                                setIsItineraryModalOpen(false);
                            }}
                            disabled={
                                !activityData.activityId ||
                                !activityData.transferType ||
                                !activityData.price ||
                                !activityData.itineraryName ||
                                !activityData.description
                            }
                        >
                            Add Activity
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
