import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { handleTourDataChange } from "../../../redux/slices/tourPackageFormSlice";
import { MultipleSelectDropdown } from "../../../components";
import { config } from "../../../constants";

export default function TourPackageDetailsForm({
    selectedSection,
    thumImg,
    handleThumImgChange,
    thumImgError,
}) {
    const { data, tPackageThemes } = useSelector((state) => state.tourPackageForm);
    const dispatch = useDispatch();

    const handleDataInpChange = (e) => {
        dispatch(handleTourDataChange({ name: e.target.name, value: e.target.value }));
    };

    return (
        <div className={selectedSection === "details" ? "block" : "hidden"}>
            <div className="grid grid-cols-4 gap-4">
                <div>
                    <label htmlFor="">Package Type *</label>
                    <select
                        name="packageType"
                        value={data?.packageType || ""}
                        onChange={handleDataInpChange}
                    >
                        <option value="" hidden>
                            Select Package Type
                        </option>
                        <option value="static">Static</option>
                        <option value="dynamic">Dynamic</option>
                    </select>
                    <span className="text-sm block mt-2 text-grayColor">
                        Static type has fixed price for all hotels, and dynamic type each hotel can
                        add different prices.
                    </span>
                </div>
                <div>
                    <label htmlFor="">Package Name *</label>
                    <input
                        type="text"
                        placeholder="Enter package name"
                        name="packageName"
                        value={data.packageName || ""}
                        onChange={handleDataInpChange}
                    />
                </div>
                <div>
                    <label htmlFor="">No Of Days *</label>
                    <input
                        type="number"
                        placeholder="Enter no of days"
                        name="noOfDays"
                        value={data.noOfDays || ""}
                        onChange={handleDataInpChange}
                    />
                </div>
                <div>
                    <label htmlFor="">Package Themes *</label>
                    <MultipleSelectDropdown
                        displayName={"themeName"}
                        data={tPackageThemes || []}
                        valueName={"_id"}
                        selectedData={data?.packageThemes}
                        setSelectedData={(val) => {
                            dispatch(handleTourDataChange({ name: "packageThemes", value: val }));
                        }}
                        randomIndex={"packageThemes01"}
                    />
                </div>
            </div>
            <div className="mt-4">
                <label htmlFor="">Thumbnail *</label>
                <input type="file" onChange={handleThumImgChange} />
                {(thumImg || data?.thumbnail) && (
                    <div className="w-[100px] max-h-[100px] rounded overflow-hidden mt-2">
                        <img
                            src={
                                thumImg
                                    ? URL.createObjectURL(thumImg)
                                    : config.SERVER_URL + data?.thumbnail
                            }
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                {thumImgError && (
                    <span className="text-sm text-red-500 block mt-1">{thumImgError}</span>
                )}
            </div>
            <div className="mt-4">
                <label htmlFor="">Overview *</label>
                <textarea
                    name="overveiw"
                    value={data?.overveiw || ""}
                    onChange={handleDataInpChange}
                    placeholder="Enter tour package overview"
                    className="h-[150px]"
                ></textarea>
            </div>
        </div>
    );
}
