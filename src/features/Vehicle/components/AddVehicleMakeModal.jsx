import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import { BtnLoader } from "../../../components";
import axios from "../../../axios";

export default function AddVehicleMakeModal({
    vehicleMakeModal,
    setVehicleMakeModal,
    selectedVehicleMake,
    addVehicleMake,
    updateVehicleMake,
}) {
    const [data, setData] = useState({
        companyName: (vehicleMakeModal?.isEdit && selectedVehicleMake?.companyName) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () => setVehicleMakeModal({ isEdit: false, isOpen: false }));
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            if (vehicleMakeModal?.isEdit) {
                const response = await axios.patch(
                    `/transfers/vehicles/makes/update/${selectedVehicleMake?._id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateVehicleMake(response.data);
            } else {
                const response = await axios.post("/transfers/vehicles/makes/add", data, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                addVehicleMake(response.data);
            }
            setVehicleMakeModal({ isOpen: false, isEdit: false });
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
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
                    <h2 className="font-medium">
                        {vehicleMakeModal?.isEdit ? "Update Vehicle Make" : "Add Vehicle Make"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setVehicleMakeModal({ isOpen: false, isEdit: false })}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Company Name</label>
                            <input
                                type="text"
                                placeholder="Ex: Luxury"
                                name="companyName"
                                value={data.companyName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {error && <span className="text-sm block text-red-500 mt-2">{error}</span>}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() =>
                                    setVehicleMakeModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[180px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : vehicleMakeModal?.isEdit ? (
                                    "Update Vehicle Make"
                                ) : (
                                    "Add Vehicle Make"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
