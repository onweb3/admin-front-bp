import React from "react";
import { useSelector } from "react-redux";

import { SelectDropdown } from "../../../components";

export default function MultiContactForm({
    data,
    addItem,
    removeItem,
    handleChange,
    isEditPermission = true,
}) {
    return (
        <div className="">
            <table className="w-full">
                <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                    <tr>
                        {isEditPermission && (
                            <th className="p-2 border w-[35px]">
                                <div className="flex items-center justify-center">
                                    <button
                                        className="w-[25px] h-[25px] rounded-full bg-green-500"
                                        onClick={addItem}
                                    >
                                        +
                                    </button>
                                </div>
                            </th>
                        )}
                        <th className="font-[500] p-2 border">Name</th>
                        <th className="font-[500] p-2 border">Position</th>
                        <th className="font-[500] p-2 border">Email</th>
                        <th className="font-[500] p-2 border">Country</th>
                        <th className="font-[500] p-2 border">Phone Number</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {data.map((item, index) => (
                        <SingleMultiContactTableRow
                            key={index}
                            item={item}
                            removeItem={removeItem}
                            index={index}
                            handleChange={handleChange}
                            isEditPermission={isEditPermission}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const SingleMultiContactTableRow = ({ index, item, removeItem, handleChange, isEditPermission }) => {
    const { countries } = useSelector((state) => state.general);

    const handleInpChange = (e, index) => {
        handleChange({ index, name: e.target.name, value: e.target.value });
    };

    return (
        <tr className="border-b border-tableBorderColor">
            {isEditPermission && (
                <td className="p-2 border w-[35px] min-w-[35px]">
                    <div className="flex items-center justify-center">
                        <button
                            className="w-[25px] h-[25px] rounded-full bg-red-500"
                            onClick={() => {
                                removeItem(index);
                            }}
                        >
                            -
                        </button>
                    </div>
                </td>
            )}
            <td className="border">
                <input
                    type="text"
                    name="name"
                    value={item?.name || ""}
                    onChange={(e) => handleInpChange(e, index)}
                    className="h-[100%]  px-2 border-0"
                    placeholder="Ex: John Smith"
                    disabled={!isEditPermission}
                />
            </td>
            <td className="border">
                <input
                    type="text"
                    name="position"
                    value={item?.position || ""}
                    onChange={(e) => handleInpChange(e, index)}
                    className="h-[100%]  px-2 border-0"
                    placeholder="Ex: Manager"
                    disabled={!isEditPermission}
                />
            </td>
            <td className="border">
                <input
                    type="email"
                    name="email"
                    value={item?.email || ""}
                    onChange={(e) => handleInpChange(e, index)}
                    className="h-[100%]  px-2 border-0"
                    placeholder="Ex: demo@gmail.com"
                    disabled={!isEditPermission}
                />
            </td>
            <td className="border w-[250px] min-w-[250px]">
                <SelectDropdown
                    data={countries}
                    valueName={"_id"}
                    displayName={"countryName"}
                    placeholder="Select Country"
                    selectedData={item?.country || ""}
                    setSelectedData={(val) => {
                        handleChange({ index, name: "country", value: val });
                    }}
                    disabled={!isEditPermission}
                />
            </td>
            <td className="border">
                <input
                    type="text"
                    name="phoneNumber"
                    value={item?.phoneNumber || ""}
                    onChange={(e) => handleInpChange(e, index)}
                    className="h-[100%]  px-2 border-0 arrow-hidden"
                    placeholder="Ex: +971 9859345"
                    disabled={!isEditPermission}
                />
            </td>
        </tr>
    );
};
