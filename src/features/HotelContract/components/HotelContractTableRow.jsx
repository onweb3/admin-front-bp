import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { RxCopy } from "react-icons/rx";

import { formatDate } from "../../../utils";
import axios from "../../../axios";
import HotelContractCloneModal from "./HotelContractCloneModal";
import ContractGroupChangeModal from "./ContractGroupChangeModal";

export default function HotelContractTableRow({
    contract,
    setContracts,
    contracts,
    isAllContracts = false,
    contractGroups = [],
}) {
    const [isContractCloneModalOpen, setIsContractCloneModalOpen] =
        useState(false);
    const [isContractGroupChangeModalOpen, setIsContractGroupChangeModalOpen] =
        useState(false);

    const { jwtToken } = useSelector((state) => state.admin);

    const deleteContract = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/hotels/contracts/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredData = contracts.filter((data) => {
                    return data?._id !== id;
                });
                setContracts(filteredData);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const addNewContract = async (newContract) => {
        setContracts((prev) => {
            return [newContract, ...prev];
        });
    };

    const changeContractGroup = ({ contractId, contractGroup }) => {
        const tempContracts = contracts;
        const objIndex = tempContracts.findIndex(
            (item) => item._id === contractId
        );
        if (objIndex !== -1) {
            tempContracts[objIndex].contractGroup = contractGroup;
            setContracts(tempContracts);
        }
    };

    return (
        <tr className="border-b border-tableBorderColor">
            <td className="p-3">{formatDate(contract?.sellFrom)}</td>
            <td className="p-3">{formatDate(contract?.sellTo)}</td>
            <td className="p-3 capitalize">
                {contract?.basePlan?.boardName} (
                {contract?.basePlan?.boardShortName})
            </td>
            <td className="p-3  capitalize">
                {contract?.rateName}
                <span className="text-green-500">
                    {contract?.isSpecialRate === true && " - (Promotion)"}
                </span>
            </td>
            <td className="p-3">{contract?.rateCode}</td>
            <td className="p-3">{contract?.priority}</td>
            <td className="p-3">
                <div className="flex items-center gap-[10px]">
                    <span
                        className={
                            "block w-[10px] h-[10px] min-w-[10px] min-h-[10px] rounded-full " +
                            (contract?.status === "approved"
                                ? "bg-green-500"
                                : contract?.status == "pending-approval"
                                ? "bg-orange-500"
                                : contract?.status == "inactive"
                                ? "bg-gray-500"
                                : "bg-red-500")
                        }
                    ></span>
                    {contract?.status === "approved"
                        ? "Approved"
                        : contract?.status == "pending-approval"
                        ? "Pending Approval"
                        : contract?.status == "inactive"
                        ? "Inactive"
                        : "Not Approved"}
                </div>
            </td>
            {isAllContracts === false && (
                <td className="p-3">
                    <div className="flex gap-[12px]">
                        <button
                            className="h-auto bg-transparent text-red-500 text-xl flex items-center justify-center"
                            onClick={() => {
                                deleteContract(contract?._id);
                            }}
                        >
                            <MdDelete />
                        </button>
                        <Link to={`${contract?._id}/edit`}>
                            <button className="h-auto bg-transparent text-green-500 text-xl flex items-center justify-center">
                                <BiEditAlt />
                            </button>
                        </Link>
                        <button
                            className="h-auto bg-transparent text-blue-500 text-lg flex items-center justify-center"
                            onClick={() => {
                                setIsContractCloneModalOpen(true);
                            }}
                        >
                            <RxCopy />
                        </button>

                        {isContractCloneModalOpen && (
                            <HotelContractCloneModal
                                setIsContractCloneModalOpen={
                                    setIsContractCloneModalOpen
                                }
                                contractId={contract?._id}
                                addNewContract={addNewContract}
                            />
                        )}
                    </div>
                </td>
            )}
            {isAllContracts === true && (
                <td className="p-3">
                    <span>
                        {contract?.contractGroup
                            ? `${contract?.contractGroup?.contractName} (${contract?.contractGroup?.contractCode})`
                            : "N/A"}
                    </span>{" "}
                    <span
                        className="text-blue-500 underline cursor-pointer"
                        onClick={() => setIsContractGroupChangeModalOpen(true)}
                    >
                        Edit
                    </span>
                    {isContractGroupChangeModalOpen === true && (
                        <ContractGroupChangeModal
                            setIsContractGroupChangeModalOpen={
                                setIsContractGroupChangeModalOpen
                            }
                            contract={contract}
                            changeContractGroup={changeContractGroup}
                            contractGroups={contractGroups}
                        />
                    )}
                </td>
            )}
        </tr>
    );
}
