import React, { useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { useHandleClickOutside } from "../../../hooks";
import axios from "../../../axios";
import { BtnLoader, MultipleSelectDropdown } from "../../../components";

export default function TerminalModal({
    terminalModal,
    setTerminalModal,
    selectedTerminal,
    data,
    setData,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [terminalData, setTerminalData] = useState({
        terminalCode: selectedTerminal?.terminal?.terminalCode || "",
        terminalName: selectedTerminal?.terminal?.terminalName || "",
        access: selectedTerminal?.terminal?.access || [],
    });

    const [accessArray, setAccessArray] = useState([
        { name: "attraction" },
        { name: "flight" },
        { name: "a2a" },
        { name: "quotation" },
        { name: "visa" },
        { name: "hotel" },
    ]);

    const handleChange = (e) => {
        console.log(terminalData, "terminaldata");
        setTerminalData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleAccessChange = (selectedData) => {
        setTerminalData((prev) => {
            return { ...prev, access: selectedData };
        });
    };

    const { jwtToken } = useSelector((state) => state.admin);
    const wrapperRef = useRef();
    useHandleClickOutside(wrapperRef, () =>
        setTerminalModal({ isEdit: false, isOpen: false })
    );
    const { id } = useParams();

    console.log(terminalModal, data, selectedTerminal, "terminalModal");
    const handleSubmit = async (e, terminalId) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            console.log(terminalData, selectedTerminal, "termin");

            console.log("called add");

            const response = await axios.patch(
                `/airports/update/terminal/${id}`,
                {
                    data: terminalModal?.isEdit ? terminalData : terminalData,
                    isEdit: terminalModal?.isEdit,
                    terminalId: selectedTerminal?.terminal?._id,
                    access: selectedTerminal?.access,
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setData(response.data.terminals);
            setTerminalData({
                terminalCode: "",
                terminalName: "",
                access: [],
            });

            // if (terminalModal.isEdit) {
            //     setData((prev) => {
            //         const newData = [...prev];
            //         newData[selectedTerminal.index] = terminalData;
            //         return newData;
            //     });
            // } else {
            //     await setData((prev) => {
            //         return [...prev, terminalData];
            //     });
            // }

            setIsLoading(false);
            setTerminalModal({ isOpen: false, isEdit: false });
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
                        {terminalModal?.isEdit
                            ? "Update Terminal"
                            : "Add Terminal"}
                    </h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() =>
                            setTerminalModal({
                                isOpen: false,
                                isEdit: false,
                            })
                        }
                    >
                        <MdClose />
                    </button>
                </div>
                <form className="p-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="">Terminal Name *</label>
                        <input
                            type="text"
                            name="terminalName"
                            value={terminalData.terminalName || ""}
                            onChange={handleChange}
                            placeholder="Ex: Terminal 1"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="">Terminal Code *</label>
                        <input
                            type="text"
                            name="terminalCode"
                            value={terminalData.terminalCode || ""}
                            onChange={handleChange}
                            placeholder="Ex: T1"
                            required
                        />
                    </div>
                    <div className="pt-5">
                        <MultipleSelectDropdown
                            data={accessArray}
                            displayName={"name"}
                            valueName={"name"}
                            selectedData={terminalData?.access}
                            setSelectedData={(selAccess) => {
                                handleAccessChange(selAccess);
                            }}
                            randomIndex={"access"}
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
                            ) : terminalModal?.isEdit ? (
                                "Update Terminal"
                            ) : (
                                "Add Terminal"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
