import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

import axios from "../../axios";
import { EmailServicModal } from "../../features/EmailSettings";
import { PageLoader } from "../../components";

export default function EmailSettingsServicesPage() {
    const [emailServicesModal, setEmailServicesModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedEmailService, setSelectedEmailService] = useState({});
    const [emailServices, setEmailServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchEmailServices = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get("/email-services/all", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setEmailServices(response.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteEmailService = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/email-services/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                const filteredEmailServices = emailServices?.filter(
                    (emailService) => {
                        return emailService?._id !== id;
                    }
                );
                setEmailServices(filteredEmailServices);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchEmailServices();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Email Services
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/email-settings" className="text-textColor">
                        Email Settings{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Emails </span>
                </div>
            </div>

            {emailServicesModal?.isOpen && (
                <EmailServicModal
                    emailServicesModal={emailServicesModal}
                    setEmailServicesModal={setEmailServicesModal}
                    selectedEmailService={selectedEmailService}
                    emailServices={emailServices}
                    setEmailServices={setEmailServices}
                />
            )}

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Email Services</h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setEmailServicesModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add Email Service
                            </button>
                        </div>
                        {emailServices?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Email Services found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Provider
                                            </th>
                                            <th className="font-[500] p-3">
                                                Api key
                                            </th>
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {emailServices?.map(
                                            (emailService, index) => {
                                                return (
                                                    <tr
                                                        key={index}
                                                        className="border-b border-tableBorderColor"
                                                    >
                                                        <td className="p-3 capitalize">
                                                            {
                                                                emailService?.serviceProvider
                                                            }
                                                        </td>
                                                        <td className="p-3">
                                                            {
                                                                emailService?.apiKey
                                                            }
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex gap-[10px]">
                                                                <button
                                                                    className="h-auto bg-transparent text-red-500 text-xl"
                                                                    onClick={() =>
                                                                        deleteEmailService(
                                                                            emailService?._id
                                                                        )
                                                                    }
                                                                >
                                                                    <MdDelete />
                                                                </button>
                                                                <button
                                                                    className="h-auto bg-transparent text-green-500 text-xl"
                                                                    onClick={() => {
                                                                        setSelectedEmailService(
                                                                            emailService
                                                                        );
                                                                        setEmailServicesModal(
                                                                            {
                                                                                isOpen: true,
                                                                                isEdit: true,
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    <BiEditAlt />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
