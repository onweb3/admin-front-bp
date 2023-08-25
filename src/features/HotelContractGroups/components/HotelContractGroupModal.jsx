import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MdClose } from "react-icons/md";

import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader } from "../../../components";

export default function HotelContractGroupModal({
    contractGroupModal,
    setContractGroupModal,
    setSelectedContractGroup,
    hotelContractGroups,
    setHotelContractGroups,
}) {
    const [data, setData] = useState({
        contractCode:
            (contractGroupModal?.isEdit &&
                setSelectedContractGroup?.contractCode) ||
            "",
        contractName:
            (contractGroupModal?.isEdit &&
                setSelectedContractGroup?.contractName) ||
            "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams();
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setContractGroupModal({ isEdit: false, isOpen: false })
    );
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

            if (contractGroupModal?.isEdit) {
                const response = await axios.patch(
                    `/hotels/contract-groups/update/${setSelectedContractGroup?._id}`,
                    { ...data, hotel: id },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );

                const temp = hotelContractGroups;
                const contractGroupIndex = temp.findIndex((item) => {
                    return item._id === response.data._id;
                });
                if (contractGroupIndex !== -1) {
                    temp[contractGroupIndex] = response.data;
                    setHotelContractGroups(temp);
                }
            } else {
                const response = await axios.post(
                    "/hotels/contract-groups/add",
                    { ...data, hotel: id },
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                setHotelContractGroups((prev) => {
                    return [response.data, ...prev];
                });
            }
            setContractGroupModal({ isOpen: false, isEdit: false });
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
                        {contractGroupModal?.isEdit
                            ? "Update Contract Group"
                            : "Add Contract Group"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setContractGroupModal({
                                isOpen: false,
                                isEdit: false,
                            })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Contract Code</label>
                            <input
                                type="text"
                                placeholder="Ex: EXP001"
                                name="contractCode"
                                value={data.contractCode || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label htmlFor="">Contract Name</label>
                            <input
                                type="text"
                                placeholder="Ex: Summer contract"
                                name="contractName"
                                value={data.contractName || ""}
                                onChange={handleChange}
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
                                onClick={() =>
                                    setContractGroupModal({
                                        isOpen: false,
                                        isEdit: false,
                                    })
                                }
                            >
                                Cancel
                            </button>
                            <button className="w-[200px]">
                                {isLoading ? (
                                    <BtnLoader />
                                ) : contractGroupModal?.isEdit ? (
                                    "Update Contract Group"
                                ) : (
                                    "Add Contract Group"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
