import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { useSelector } from "react-redux";

import { PageLoader } from "../../components";
import axios from "../../axios";
import { PaymentServiceModal } from "../../features/Payment Services";

export default function PaymentServicesPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentServices, setPaymentServices] = useState([]);
    const [paymentServiceModal, setPaymentServiceModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedPaymentService, setSelectedPaymentService] = useState({});

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchPaymentServices = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get("/payment-services/all", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setPaymentServices(response.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const deletePaymentProcessor = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/payment-services/delete/${id}`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });

                const filteredServices = paymentServices.filter(
                    (paymentService) => {
                        return paymentService?._id !== id;
                    }
                );
                setPaymentServices(filteredServices);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPaymentServices();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Payment Services
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Payment Settings</span>
                    <span>{">"} </span>
                    <span>Services</span>
                </div>
            </div>

            {paymentServiceModal.isOpen && (
                <PaymentServiceModal
                    paymentServices={paymentServices}
                    selectedPaymentService={selectedPaymentService}
                    setPaymentServices={setPaymentServices}
                    paymentServiceModal={paymentServiceModal}
                    setPaymentServiceModal={setPaymentServiceModal}
                />
            )}

            {isLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">
                                All Payment Services
                            </h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setPaymentServiceModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add Payment Service
                            </button>
                        </div>
                        {paymentServices?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Payment Services found
                                </span>
                            </div>
                        ) : (
                            <div>
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Name
                                            </th>
                                            <th className="font-[500] p-3">
                                                Processor
                                            </th>
                                            <th className="font-[500] p-3">
                                                Client Id
                                            </th>
                                            <th className="font-[500] p-3">
                                                Processing Fee
                                            </th>
                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {paymentServices?.map(
                                            (paymentService, index) => {
                                                return (
                                                    <tr
                                                        key={index}
                                                        className="border-b border-tableBorderColor"
                                                    >
                                                        <td className="p-3">
                                                            {
                                                                paymentService?.name
                                                            }
                                                        </td>
                                                        <td className="p-3 capitalize">
                                                            {
                                                                paymentService?.paymentProcessor
                                                            }
                                                        </td>
                                                        <td className="p-3">
                                                            {
                                                                paymentService?.clientId
                                                            }
                                                        </td>
                                                        <td className="p-3">
                                                            {
                                                                paymentService?.processingFee
                                                            }
                                                            %
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex gap-[10px]">
                                                                <button
                                                                    className="h-auto bg-transparent text-red-500 text-xl"
                                                                    onClick={() =>
                                                                        deletePaymentProcessor(
                                                                            paymentService?._id
                                                                        )
                                                                    }
                                                                >
                                                                    <MdDelete />
                                                                </button>
                                                                <button
                                                                    className="h-auto bg-transparent text-green-500 text-xl"
                                                                    onClick={() => {
                                                                        setSelectedPaymentService(
                                                                            paymentService
                                                                        );
                                                                        setPaymentServiceModal(
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
