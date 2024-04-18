import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

import { AddDestinationModal } from "../../features/Countries";
import axios from "../../axios";
import { deleteDestination } from "../../redux/slices/generalSlice";
import { PageLoader } from "../../components";
import { config } from "../../constants";

export default function DestinationsPage() {
    const [destinationModal, setDestinationModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedDestination, setSelectedDestination] = useState({});

    const { destinations, isGeneralLoading } = useSelector(
        (state) => state.general
    );
    const { jwtToken } = useSelector((state) => state.admin);
    const dispatch = useDispatch();

    const delDestination = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/destinations/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                dispatch(deleteDestination(id));
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Destinations
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Destinations</span>
                </div>
            </div>

            {destinationModal?.isOpen && (
                <AddDestinationModal
                    destinationModal={destinationModal}
                    setDestinationModal={setDestinationModal}
                    selectedDestination={selectedDestination}
                />
            )}

            {isGeneralLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">All Destinations</h1>
                            <button
                                className="px-3"
                                onClick={() =>
                                    setDestinationModal({
                                        isOpen: true,
                                        isEdit: false,
                                    })
                                }
                            >
                                + Add Destination
                            </button>
                        </div>
                        {!destinations || destinations?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Destinations Found
                                </span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Code</th>
                                        <th className="font-[500] p-3">Name</th>
                                        <th className="font-[500] p-3">
                                            Country
                                        </th>
                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {destinations?.map((destination, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3 capitalize">
                                                    {destination?.code || "N/A"}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    <div className="flex items-center gap-[10px]">
                                                        <img
                                                            src={
                                                                import.meta.env
                                                                    .VITE_SERVER_URL +
                                                                destination?.image
                                                            }
                                                            alt=""
                                                            className="w-[70px] max-h-[50px] rounded"
                                                        />
                                                        <span>
                                                            {destination?.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3 capitalize">
                                                    <div className="flex items-center gap-[10px]">
                                                        <img
                                                            src={
                                                                destination
                                                                    ?.country
                                                                    ?.flag
                                                            }
                                                            alt=""
                                                            className="w-[30px]"
                                                        />
                                                        <span>
                                                            {
                                                                destination
                                                                    ?.country
                                                                    ?.countryName
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                delDestination(
                                                                    destination?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <button
                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                            onClick={() => {
                                                                setSelectedDestination(
                                                                    destination
                                                                );
                                                                setDestinationModal(
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
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
