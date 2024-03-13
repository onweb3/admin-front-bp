import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader, PageLoader, SelectDropdown } from "../../../components";

export default function WhatsappAddManagementModal({
    setIsModal,
    isModal,
    setWhatsappLists,
    whatsappLists,
    selectedManagement,
}) {
    const names = [
        { value: "attraction" },
        { value: "visa" },
        { value: "flights" },
        { value: "quotation" },
        { value: "insurance" },
        { value: "a2a" },
        { value: "hotel" },
    ];
    const [data, setData] = useState({
        name: (isModal?.isEdit && selectedManagement?.name) || "",
        phoneNumber: (isModal?.isEdit && selectedManagement?.phoneNumber) || "",
        phoneCode: (isModal?.isEdit && selectedManagement?.phoneCode) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [qrLoading, setQrLoading] = useState(false);
    const { countries } = useSelector((state) => state.general);
    const [qrCode, setQrCode] = useState("");
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setIsModal(false));
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            const response = await axios.post(
                "/whatsapp-managment/update",
                { ...data },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            let findIndex = await whatsappLists.findIndex(
                (whatsapp) => whatsapp.name === data.name
            );
            console.log(findIndex);

            if (findIndex !== -1) {
                // If the index is found
                setWhatsappLists((prev) => {
                    return prev.map((prevItem, index) => {
                        if (index === findIndex) {
                            return { ...prevItem, ...data }; // Update the found item with new data
                        }
                        return prevItem; // Return other items unchanged
                    });
                });
            } else {
                // If the index is not found, push new data
                setWhatsappLists((prev) => [...prev, response.data]);
            }
            console.log(findIndex);

            setIsLoading(false);
            console.log(findIndex);

            setIsModal({ isOpen: false, isEdit: false });
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Add Config</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => {
                            setIsModal({ isOpen: false, isEdit: false });
                        }}
                    >
                        <MdClose />
                    </button>
                </div>

                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <SelectDropdown
                            data={names}
                            valueName={"value"}
                            displayName={"value"}
                            placeholder="Select name"
                            selectedData={data.name || ""}
                            setSelectedData={(val) => {
                                setData((prevData) => ({
                                    ...prevData,
                                    ["name"]: val,
                                }));
                            }}
                            // bracketValue={"chainCode"}
                            // disabled={!isEditPermission}
                        />
                        <div className="mt-4">
                            <SelectDropdown
                                data={countries}
                                valueName={"phonecode"}
                                displayName={"phonecode"}
                                placeholder="Select phonecode"
                                selectedData={data.phoneCode || ""}
                                setSelectedData={(val) => {
                                    setData((prevData) => ({
                                        ...prevData,
                                        ["phoneCode"]: val,
                                    }));
                                }}
                                // bracketValue={"chainCode"}
                                // disabled={!isEditPermission}
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Phone Number </label>
                            <input
                                type="number"
                                value={data?.phoneNumber || ""}
                                name="phoneNumber"
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                            />
                        </div>
                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}

                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => {
                                    setIsModal({
                                        isOpen: false,
                                        isEdit: false,
                                    });
                                }}
                            >
                                Cancel
                            </button>
                            <button className="w-[160px]">
                                {isLoading ? <BtnLoader /> : "Update"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
