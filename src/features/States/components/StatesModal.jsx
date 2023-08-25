import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";
import { useParams } from "react-router-dom";

export default function StatesModal({
    statesModal,
    setStatesModal,
    selectedState,
    addNewState,
    updateStateInfo,
}) {
    const [data, setData] = useState({
        stateName: (statesModal?.isEdit && selectedState?.stateName) || "",
        stateCode: (statesModal?.isEdit && selectedState?.stateCode) || "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setStatesModal({ isEdit: false, isOpen: false })
    );
    const { countryId } = useParams();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            if (statesModal?.isEdit) {
                const response = await axios.patch(
                    `/states/update/${selectedState?._id}`,
                    { ...data, country: countryId },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                updateStateInfo(response?.data);
            } else {
                const response = await axios.post(
                    "/states/add",
                    { ...data, country: countryId },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                addNewState(response?.data);
            }
            setIsLoading(false);
            setStatesModal({ isOpen: false, isEdit: false });
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
                className="bg-[#fff] w-full max-h-[90vh] rounded max-w-[500px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">
                        {statesModal?.isEdit ? "Update State" : "Add State"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setStatesModal({
                                isOpen: false,
                                isEdit: false,
                            })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <form className="p-4" onSubmit={handleSubmit}>
                    <div className="">
                        <label htmlFor="">State Name *</label>
                        <input
                            type="text"
                            name="stateName"
                            value={data.stateName || ""}
                            onChange={handleChange}
                            placeholder="Ex: Dubai"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">State Code *</label>
                        <input
                            type="text"
                            name="stateCode"
                            value={data.stateCode || ""}
                            onChange={handleChange}
                            placeholder="Ex: DU"
                            required
                        />
                    </div>
                    {error && (
                        <span className="block mt-2 text-sm text-red-500">
                            {error}
                        </span>
                    )}
                    <div className="flex items-center justify-end mt-5">
                        <button className="w-[160px]" disabled={isLoading}>
                            {isLoading ? (
                                <BtnLoader />
                            ) : statesModal?.isEdit ? (
                                "Update State"
                            ) : (
                                "Add State"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
