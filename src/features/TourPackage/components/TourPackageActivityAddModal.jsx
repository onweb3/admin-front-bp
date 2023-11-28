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
        itineraryName: "",
        description: "",
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
                        <label htmlFor="">Activity</label>
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
                                    };
                                });
                            }}
                            placeholder="Select Activity"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Display Name</label>
                        <input
                            type="text"
                            placeholder="Enter Display Name"
                            name="itineraryName"
                            value={activityData.itineraryName || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Display Name</label>
                        <textarea
                            name="description"
                            id=""
                            placeholder="Enter description"
                            value={activityData.description || ""}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-end mt-5">
                        <button
                            className="w-[140px]"
                            onClick={() => {
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
