import React from "react";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "../../../axios";

function A2AIndexTable({ a2a, index, setResult, result }) {
    const { jwtToken } = useSelector((state) => state.admin);

    const deleteA2A = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/a2a/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                const filteredA2A = result.filter((item) => {
                    return item?._id !== id;
                });
                setResult(filteredA2A);
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <tr className="border-b border-tableBorderColor">
            <td className="p-3">{index + 1}</td>
            <td className="p-3 capitalize">
                {a2a?.airportFrom?.airportName +
                    ` (${a2a?.airportFrom?.iataCode})`}
            </td>
            <td className="p-3">
                {a2a?.airportTo?.airportName + ` (${a2a?.airportTo?.iataCode})`}
            </td>
            <td className="p-3">
                <div className="flex items-center gap-[10px]">
                    <button
                        className="h-auto bg-transparent text-red-500 text-xl"
                        onClick={() => deleteA2A(a2a?._id)}
                    >
                        <MdDelete />
                    </button>
                    <Link to={`/a2a/${a2a?._id}`}>
                        <button className="h-auto bg-transparent text-green-500 text-xl">
                            <BiEditAlt />
                        </button>
                    </Link>
                </div>
            </td>
        </tr>
    );
}

export default A2AIndexTable;
