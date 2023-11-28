import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../axios";
import { PageLoader, Pagination } from "../../../components";
import FlightProfileRow from "./FlightProfileRow";
import InsuranceProfileRow from "./InsuranceProfileRow";
import TransferProfileRow from "./TransferProfileRow";
import TransferMarkupModal from "./TransferMarkupModal";
import { BiEditAlt } from "react-icons/bi";
import TransferVehcieRow from "./TransferVehicleRow";
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function TransferVehcieTable({
    transferId,
    type,
    setVehicles,
    vehicles,
}) {
    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                        <tr>
                            <th className="font-[500] p-3">Vehicle Name </th>
                            <th className="font-[500] p-3">Markup</th>
                            <th className="font-[500] p-3">Markup Type</th>

                            <th className="font-[500] p-3">Edit</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {vehicles?.map((vehicle, index) => {
                            return (
                                <TransferVehcieRow
                                    key={vehicle}
                                    index={index}
                                    transferId={transferId}
                                    vehicle={vehicle}
                                    type={type}
                                    setVehicles={setVehicles}

                                    // section={section}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
