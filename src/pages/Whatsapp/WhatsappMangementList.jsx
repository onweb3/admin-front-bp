import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { config } from "../../constants";
import WhatsappAddModal from "../../features/Whatsapp/compnents/WhatsappAddModal";
import { AiFillEdit, AiOutlineLogout } from "react-icons/ai";
import WhatsappAddManagementModal from "../../features/Whatsapp/compnents/WhatsappAddManagment";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
export default function WhatsappManagmentListPage() {
    const [whatsappLists, setWhatsappLists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState("");
    const [selectedManagement, setSelectedManagement] = useState("");
    const [isModal, setIsModal] = useState({
        isOpen: false,
        isEdit: false,
    });

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchList = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/whatsapp-managment/all", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setWhatsappLists(response?.data);

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const statusChange = async (name, status) => {
        try {
            const isConfirm = window.confirm(
                "Are you sure want stop messaging?"
            );
            if (isConfirm) {
                let response = await axios.patch(
                    `/whatsapp-managment/status`,
                    { name, status },
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );

                let findIndex = await whatsappLists.findIndex(
                    (whatsapp) => whatsapp.name === name
                );
                console.log(findIndex);

                if (findIndex !== -1) {
                    // If the index is found
                    setWhatsappLists((prev) => {
                        return prev.map((prevItem, index) => {
                            if (index === findIndex) {
                                return { ...prevItem, status: status }; // Update the found item with new data
                            }
                            return prevItem; // Return other items unchanged
                        });
                    });
                }
            }
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Whatsapp Managment List
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Whatsapp</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Whatsapp Managment List</h1>
                        <div className="flex items-center gap-3">
                            <button
                                className="px-3"
                                onClick={() => {
                                    setIsModal({
                                        isOpen: true,
                                        isEdit: false,
                                    });
                                }}
                            >
                                + Add Management
                            </button>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : whatsappLists?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Whatsapp Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Name</th>
                                        <th className="font-[500] p-3">
                                            Phone Code
                                        </th>
                                        <th className="font-[500] p-3">
                                            Phone Number
                                        </th>{" "}
                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {whatsappLists?.map((whatsapp, index) => {
                                        console.log(whatsapp, "whatsapp");
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">
                                                    {whatsapp?.name}
                                                </td>
                                                <td className="p-3 uppercase">
                                                    {whatsapp?.phoneCode}
                                                </td>
                                                <td className="p-3 uppercase">
                                                    {whatsapp?.phoneNumber}
                                                </td>

                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        {whatsapp?.status ===
                                                        true ? (
                                                            <button
                                                                className="h-auto bg-transparent text-green-500 text-xl"
                                                                onClick={() => {
                                                                    statusChange(
                                                                        whatsapp?.name,
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <BsEyeFill />{" "}
                                                            </button>
                                                        ) : (
                                                            <button
                                                                className="h-auto bg-transparent text-red-500 text-xl"
                                                                onClick={() => {
                                                                    statusChange(
                                                                        whatsapp?.name,
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                <BsEyeSlashFill />{" "}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {error && (
                                <span className="text-sm block text-red-500 mt-2">
                                    {error}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {isModal.isOpen && (
                <WhatsappAddManagementModal
                    isModal={isModal}
                    setIsModal={setIsModal}
                    setWhatsappLists={setWhatsappLists}
                    whatsappLists={whatsappLists}
                    selectedManagement={selectedManagement}
                />
            )}
        </div>
    );
}
