import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { handleTourDataChange } from "../../../redux/slices/tourPackageFormSlice";
import { MultipleSelectDropdown, SelectDropdown } from "../../../components";
import { config } from "../../../constants";
import { MdDelete } from "react-icons/md";
import { isImageValid } from "../../../utils";

export default function TourPackageDetailsForm({
    selectedSection,
    newImages,
    setNewImages,
}) {
    const { data, tPackageThemes, thumbnail } = useSelector(
        (state) => state.tourPackageForm
    );
    const { countries, destinations } = useSelector((state) => state.general);

    const dispatch = useDispatch();

    const handleDataInpChange = (e) => {
        dispatch(
            handleTourDataChange({ name: e.target.name, value: e.target.value })
        );
    };

    const handleDropDownInpChange = ({ name, value }) => {
        dispatch(handleTourDataChange({ name: name, value: value }));
    };
    const handleImageChange = (e) => {
        for (let i = 0; i < e.target?.files?.length; i++) {
            if (isImageValid(e.target.files[i])) {
                setNewImages([...newImages, e.target.files[i]]);
            } else {
                alert("Upload png, jpg, jpeg or webp");
            }
        }
    };

    const removeNewImage = (index) => {
        const filteredImages = newImages?.filter((_, ind) => {
            return ind !== index;
        });
        setNewImages(filteredImages);
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
                        Static type has fixed price for all hotels, and dynamic
                        type each hotel can add different prices.
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
                            dispatch(
                                handleTourDataChange({
                                    name: "packageThemes",
                                    value: val,
                                })
                            );
                        }}
                        randomIndex={"packageThemes01"}
                    />
                </div>
                <div>
                    <label htmlFor="">Country</label>
                    <SelectDropdown
                        data={countries || []}
                        displayName="countryName"
                        valueName="_id"
                        placeholder="Select country"
                        selectedData={data?.country}
                        setSelectedData={(val) => {
                            handleDropDownInpChange({
                                name: "country",
                                value: val,
                            });
                        }}
                    />
                </div>
                <div>
                    <label htmlFor="">Destination</label>
                    <SelectDropdown
                        data={destinations || []}
                        displayName="name"
                        valueName="_id"
                        placeholder="Select destination"
                        selectedData={data?.destination}
                        setSelectedData={(val) => {
                            handleDropDownInpChange({
                                name: "destination",
                                value: val,
                            });
                        }}
                    />
                </div>
            </div>

            <div className="mt-4">
                <label htmlFor="">Images</label>
                <input type="file" onChange={handleImageChange} />
            </div>

            <div className="flex flex-wrap items-center gap-[1.5em] mt-5">
                {newImages?.map((image, index) => {
                    return (
                        <div
                            className="relative group w-[130px] aspect-video rounded overflow-hidden cursor-pointer"
                            key={index}
                            onClick={() => removeNewImage(index)}
                        >
                            <img
                                src={URL.createObjectURL(image)}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            <div className="hidden group-hover:flex absolute inset-0 bg-[#0005] text-xl items-center justify-center cursor-pointer text-red-500">
                                <MdDelete />
                            </div>
                        </div>
                    );
                })}
                {Array.isArray(data?.thumbnail) &&
                    data?.thumbnail?.map((image, index) => {
                        return (
                            <div
                                className="relative group w-[130px] aspect-video rounded overflow-hidden cursor-pointer"
                                key={index}
                                // onClick={() => dispatch(removeImage(index))}
                            >
                                <img
                                    src={config?.SERVER_URL + image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                                <div className="hidden group-hover:flex absolute inset-0 bg-[#0005] text-xl items-center justify-center cursor-pointer text-red-500">
                                    <MdDelete />
                                </div>
                            </div>
                        );
                    })}
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
