import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import TransferVehcieTable from "./TransferVehicleTable";
import { PageLoader } from "../../../components";
import TransferMarkupModal from "./TransferMarkupModal";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function TransferProfileRow({
    transfer,
    setTransfer,
    index,
    type,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [vehicles, setVehicles] = useState([]);

    const { id } = useParams();

    const [isPageLoading, setIsPageLoading] = useState(false);
    const { profileId, marketId } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchTransferInitialData = async () => {
        try {
            setIsPageLoading(true);
            console.log(type, "type");
            if (type === "market") {
                if (marketId) {
                    const response = await axios.get(
                        `/market/get-all-vehicle/${marketId}/${transfer?.transferId}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setVehicles(response.data);
                }
            }

            // const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}`;

            setIsPageLoading(false);
        } catch (err) {
            // setTransfers([]);

            console.log(err);
        }
    };

    useEffect(() => {
        if (dropdownVisible) {
            fetchTransferInitialData();
        }
    }, [dropdownVisible]);
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (type === "market") {
    //         if (marketId) {
    //             const response = await axios.post(
    //                 `/market/update-transfer-profile/${marketId}`,
    //                 formData,
    //                 {
    //                     headers: { authorization: `Bearer ${jwtToken}` },
    //                 }
    //             );
    //             setIsModalOpen(false);
    //         } else {
    //             const response = await axios.post(
    //                 `/market/b2b/update-transfer-profile/${id}`,
    //                 formData,
    //                 {
    //                     headers: { authorization: `Bearer ${jwtToken}` },
    //                 }
    //             );
    //             setIsModalOpen(false);
    //         }
    //     } else {
    //         if (profileId) {
    //             const response = await axios.post(
    //                 `/profile/update-transfer-profile/${profileId}`,
    //                 formData,
    //                 {
    //                     headers: { authorization: `Bearer ${jwtToken}` },
    //                 }
    //             );
    //             setIsModalOpen(false);
    //         } else {
    //             const response = await axios.post(
    //                 `/profile/b2b/update-transfer-profile/${id}`,
    //                 formData,
    //                 {
    //                     headers: { authorization: `Bearer ${jwtToken}` },
    //                 }
    //             );
    //             setIsModalOpen(false);
    //         }
    //     }

    //     setTransfers((prev) => {
    //         return prev.map((transfer) => {
    //             if (
    //                 transfer?.transferId?.toString() ===
    //                 formData?.transferId?.toString()
    //             ) {
    //                 return {
    //                     ...transfer,
    //                     markupType: formData?.markupType,
    //                     markup: formData?.markup,
    //                     isEdit: true,
    //                 };
    //             } else {
    //                 return transfer;
    //             }
    //         });
    //     });

    //     // setData(formData);
    // };
    return (
        <>
            <tr
                className={
                    "border-b border-tableBorderColor transition-all cursor-pointer hover:bg-[#f3f6f9] "
                }
                onClick={() => {
                    setDropdownVisible(!dropdownVisible);
                    // fetchRoomTypes();
                }}
            >
                {" "}
                <td className="p-3 "> {index + 1} </td>
                <td className="p-3 "> {transfer?.transferFrom} </td>
                <td className="p-3 "> {transfer?.transferTo} </td>
                <td className="p-3" onClick={() => setIsModalOpen(true)}>
                    <button className="w-[50px]">Edit </button>
                </td>
            </tr>
            <tr>
                <td colSpan={7}>
                    <div className={`w-full`}>
                        <table
                            className={`w-full border shadow-lg
                     ${
                         dropdownVisible && isModalOpen === false
                             ? ""
                             : " hidden "
                     }
                    `}
                        >
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left w-full"></thead>
                            <tbody>
                                {isPageLoading ? (
                                    <PageLoader />
                                ) : vehicles?.length < 1 ? (
                                    <div className="p-6 flex flex-col items-center">
                                        <span className="text-sm text-grayColor block mt-[6px]">
                                            Oops.. No vehicles found
                                        </span>
                                    </div>
                                ) : (
                                    <TransferVehcieTable
                                        transferId={transfer?.transferId}
                                        type={type}
                                        setVehicles={setVehicles}
                                        vehicles={vehicles}
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>

            {isModalOpen && (
                <TransferMarkupModal
                    setIsModal={setIsModalOpen}
                    transferId={transfer?.transferId}
                    setVehicles={setVehicles}
                    type={type}
                />
            )}
        </>
    );
}
