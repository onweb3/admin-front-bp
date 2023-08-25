import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";

import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";
import { addDriver, updateDriver } from "../../../redux/slices/generalSlice";

export default function AddDriverModal({
    driverModal,
    setDriverModal,
    selectedDriver,
}) {
    const [data, setData] = useState({
        driverName: (driverModal?.isEdit && selectedDriver?.driverName) || "",
        phoneNumber: (driverModal?.isEdit && selectedDriver?.phoneNumber) || "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setDriverModal({ isEdit: false, isOpen: false })
    );
    const { jwtToken } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

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

            if (driverModal?.isEdit) {
                const response = await axios.patch(
                    `/drivers/update/${selectedDriver?._id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                dispatch(updateDriver(response.data));
            } else {
                const response = await axios.post("/drivers/add", data, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                dispatch(addDriver(response.data));
            }
            setDriverModal({ isOpen: false, isEdit: false });
        } catch (err) {
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
                    <h2 className="font-medium mb-2">
                        {driverModal?.isEdit ? "Update Driver" : "Add Driver"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setDriverModal({ isOpen: false, isEdit: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Driver Name</label>
                            <input
                                type="text"
                                placeholder="Ex: John Deo"
                                name="driverName"
                                value={data.driverName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Phone Number</label>
                            <input
                                type="text"
                                placeholder="Enter Phone Number"
                                name="phoneNumber"
                                value={data.phoneNumber || ""}
                                onChange={handleChange}
                                required
                            />
                            <span className="block text-sm mt-2 text-grayColor">
                                Include country code with mobile number
                            </span>
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
                                onClick={() =>
                                    setDriverModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[150px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : driverModal?.isEdit ? (
                                    "Update Driver"
                                ) : (
                                    "Add Driver"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
