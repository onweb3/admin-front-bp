import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";

import { PageLoader } from "../../components";
import TerminalModal from "../../features/Airport/components/TerminalModal";
import axios from "../../axios";

export default function TerminalPage() {
    const [terminalModal, setTerminalModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [airportData, setAirportData] = useState({});
    const [selectedTerminal, setSelectedTerminal] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);

    const { id } = useParams();

    const { jwtToken } = useSelector((state) => state.admin);

    const delTerminal = async (terminalId) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(
                    `/airports/terminal/${id}/delete/${terminalId}`,
                    {
                        headers: { Authorization: `Bearer ${jwtToken}` },
                    }
                );
                const filteredTerminals = data.filter((item) => {
                    return item._id != terminalId;
                });

                setData(filteredTerminals);
            }
        } catch (err) {
            console.log(err);
        }
    };

    console.log(data, "data");

    const fetchTerminal = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/airports/terminal/${id}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setData(response.data.airport.terminals);
            setAirportData(response.data.airport);

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTerminal();
    }, []);

    console.log(airportData, "airportData");

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Terminals</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/airports" className="text-textColor">
                        Airport{" "}
                    </Link>
                    <span>Terminals</span>
                </div>
            </div>

            {terminalModal?.isOpen && (
                <TerminalModal
                    terminalModal={terminalModal}
                    setTerminalModal={setTerminalModal}
                    selectedTerminal={selectedTerminal}
                    // addNewTerminal={addNewTerminal}
                    data={data}
                    setData={setData}
                />
            )}

            {isLoading ? (
                <div>
                    <PageLoader />
                </div>
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium capitalize">
                                Terminals - {airportData.airportName}
                            </h1>
                            <button
                                className="px-3"
                                onClick={() => {
                                    setTerminalModal({
                                        isOpen: true,
                                        isEdit: false,
                                    });
                                    setSelectedTerminal({
                                        terminalCode: "",
                                        terminalName: "",
                                        access: [],
                                    });
                                }}
                            >
                                + Add Terminal
                            </button>
                        </div>
                        {!data || data?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                    Oops.. No Terminal Found
                                </span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Terminal Code
                                        </th>
                                        <th className="font-[500] p-3">
                                            Terminal Name
                                        </th>
                                        <th className="font-[500] p-3">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {data?.map((terminal, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3">
                                                    {terminal?.terminalCode}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {terminal?.terminalName}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() =>
                                                                delTerminal(
                                                                    terminal?._id
                                                                )
                                                            }
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <button
                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                            onClick={() => {
                                                                setSelectedTerminal(
                                                                    {
                                                                        terminal,
                                                                        index,
                                                                    }
                                                                );
                                                                setTerminalModal(
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
