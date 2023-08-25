import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { BtnLoader } from "../../../components";
import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";

export default function AccommodationTypeModal({
    setAccTypeModal,
    selectedAccType,
    accTypeModal,
    updateAccType,
    addAccType,
}) {
    const [data, setData] = useState({
        accommodationTypeCode:
            (accTypeModal?.isEdit && selectedAccType?.accommodationTypeCode) ||
            "",
        accommodationTypeName:
            (accTypeModal?.isEdit && selectedAccType?.accommodationTypeName) ||
            "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setAccTypeModal({ isEdit: false, isOpen: false })
    );
    const navigate = useNavigate();
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

            if (accTypeModal?.isEdit) {
                const response = await axios.patch(
                    `/hotels/accommodation-types/update/${selectedAccType?._id}`,
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                updateAccType(response.data);
            } else {
                const response = await axios.post(
                    "/hotels/accommodation-types/add",
                    data,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                addAccType(response.data);
            }
            setAccTypeModal({ isOpen: false, isEdit: false });
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
                        {accTypeModal?.isEdit
                            ? "Update Accommodation Type"
                            : "Add Accommodation Type"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setAccTypeModal({ isOpen: false, isEdit: false })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Accommodation Type Code</label>
                            <input
                                type="text"
                                placeholder="Ex: H"
                                name="accommodationTypeCode"
                                value={data.accommodationTypeCode || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Accommodation Type Name</label>
                            <input
                                type="text"
                                placeholder="Ex: Hotel"
                                name="accommodationTypeName"
                                value={data.accommodationTypeName || ""}
                                onChange={handleChange}
                                required
                            ></input>
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
                                    setAccTypeModal({
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
                                ) : accTypeModal?.isEdit ? (
                                    "Update"
                                ) : (
                                    "Add"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
