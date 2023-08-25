import React, { useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import AddPrivateTransferModal from "./AddPrivateTransferModal";

export default function ActivityPrivateTransfersSection({
    privateTransfers,
    setPrivateTransfers,
}) {
    const [addPvtTranferModal, setAddPvtTransferModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedTransfer, setSelectedTransfer] = useState({});

    const addNewPvtTransfer = (data) => {
        privateTransfers.push(data);
    };

    const updatePvtTransfer = (data, index) => {
        const objIndex = privateTransfers?.findIndex((_, tIndex) => {
            return index === tIndex;
        });
        const temp = privateTransfers;
        temp[objIndex] = data;
        setPrivateTransfers(temp);
    };

    const removePvtTransfer = (index) => {
        const filteredPvtTransfers = privateTransfers?.filter((_, tIndex) => {
            return index !== tIndex;
        });
        setPrivateTransfers(filteredPvtTransfers);
    };

    return (
        <div className="mt-2">
            <div
                className={
                    "flex items-center mb-4 " +
                    (privateTransfers?.length > 0 ? "justify-end" : "justify-start")
                }
            >
                <button
                    type="button"
                    className="bg-orange-500 px-3"
                    onClick={() =>
                        setAddPvtTransferModal({ isOpen: true, isEdit: false })
                    }
                >
                    + Add PVT Transfer
                </button>
                {addPvtTranferModal.isOpen && (
                    <AddPrivateTransferModal
                        setAddPvtTransferModal={setAddPvtTransferModal}
                        addPvtTranferModal={addPvtTranferModal}
                        selectedTransfer={selectedTransfer}
                        addNewPvtTransfer={addNewPvtTransfer}
                        updatePvtTransfer={updatePvtTransfer}
                    />
                )}
            </div>
            {privateTransfers?.length > 0 && (
                <div>
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                            <tr>
                                <th className="font-[500] p-3">Name</th>
                                <th className="font-[500] p-3">Max Capacity</th>
                                <th className="font-[500] p-3">Price</th>
                                <th className="font-[500] p-3">Cost</th>
                                <th className="font-[500] p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {privateTransfers?.map((transfer, index) => {
                                return (
                                    <tr
                                        key={index}
                                        className="border-b border-tableBorderColor"
                                    >
                                        <td className="p-3">
                                            {transfer?.name}
                                        </td>
                                        <td className="p-3">
                                            {transfer?.maxCapacity}
                                        </td>
                                        <td className="p-3">
                                            {transfer?.price} AED
                                        </td>
                                        <td className="p-3">
                                            {transfer?.cost} AED
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-[10px]">
                                                <button
                                                    className="h-auto bg-transparent text-red-500 text-xl"
                                                    onClick={() =>
                                                        removePvtTransfer(index)
                                                    }
                                                    type="button"
                                                >
                                                    <MdDelete />
                                                </button>
                                                <button
                                                    className="h-auto bg-transparent text-green-500 text-xl"
                                                    onClick={() => {
                                                        setSelectedTransfer(
                                                            transfer
                                                        );
                                                        setAddPvtTransferModal({
                                                            isEdit: true,
                                                            isOpen: true,
                                                            editIndex: index,
                                                        });
                                                    }}
                                                    type="button"
                                                >
                                                    <BiEditAlt />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
