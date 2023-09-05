import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";

import axios from "../../axios";
import { addState, deleteState, updateState } from "../../redux/slices/generalSlice";
import { PageLoader } from "../../components";
import { StatesModal } from "../../features/States";

export default function StatesPage() {
    const [statesModal, setStatesModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const [selectedState, setSelectedState] = useState({});
    const [data, setData] = useState({ states: [], country: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [filteredStates, setFilteredStates] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);
    const { countryId } = useParams();
    const dispatch = useDispatch();

    const delState = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/states/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                dispatch(deleteState(id));
                const filteredStates = data.states?.filter((item) => {
                    return item?._id !== id;
                });
                setData((prev) => {
                    return { ...prev, states: filteredStates };
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const fetchStates = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`/states/country/${countryId}`, {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });

            setData((prev) => {
                return {
                    ...prev,
                    states: response.data?.states,
                    country: response?.data?.country,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const addNewState = (newState) => {
        dispatch(addState(newState));
        setData((prev) => {
            return { ...prev, states: [newState, ...prev.states] };
        });
    };

    const updateStateInfo = (state) => {
        dispatch(updateState(state));
        const tempStates = data.states;
        const objIndex = tempStates.findIndex((item) => {
            return item?._id === state._id;
        });
        if (objIndex !== -1) {
            tempStates[objIndex] = state;
            setData((prev) => {
                return { ...prev, states: tempStates };
            });
        }
    };

    useEffect(() => {
        const tempFilteredStates = data.states?.filter((item) => {
            return (
                item?.stateName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                item?.stateCode?.toLowerCase()?.includes(searchQuery?.toLowerCase())
            );
        });
        setFilteredStates(tempFilteredStates);
    }, [data.states, searchQuery]);

    useEffect(() => {
        fetchStates();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">States</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/countries" className="text-textColor">
                        Countries{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {countryId?.slice(0, 3)}...{countryId?.slice(-3)}
                    </span>
                    <span>{">"} </span>
                    <span>States</span>
                </div>
            </div>

            {statesModal?.isOpen && (
                <StatesModal
                    statesModal={statesModal}
                    setStatesModal={setStatesModal}
                    selectedState={selectedState}
                    addNewState={addNewState}
                    updateStateInfo={updateStateInfo}
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
                                All States - ({data?.country?.countryName})
                            </h1>
                            <div className="flex items-center gap-[10px]">
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    className="min-w-[200px]"
                                    name="searchQuery"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    value={searchQuery || ""}
                                />
                                <button
                                    className="w-[150px]"
                                    onClick={() =>
                                        setStatesModal({
                                            isOpen: true,
                                            isEdit: false,
                                        })
                                    }
                                >
                                    + Add State
                                </button>
                            </div>
                        </div>
                        {!filteredStates || filteredStates?.length < 1 ? (
                            <div className="p-6 flex flex-col items-center">
                                <span className="text-sm text-grayColor block mt-[6px]">
                                    Oops.. No States Found
                                </span>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Code</th>
                                        <th className="font-[500] p-3">Name</th>
                                        <th className="font-[500] p-3">Cities</th>
                                        <th className="font-[500] p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {filteredStates?.map((state, index) => {
                                        return (
                                            <tr
                                                key={index}
                                                className="border-b border-tableBorderColor"
                                            >
                                                <td className="p-3 uppercase">
                                                    {state?.stateCode}
                                                </td>
                                                <td className="p-3 capitalize">
                                                    {state?.stateName}
                                                </td>
                                                <td className="p-3">
                                                    <Link to={`${state?._id}/cities`}>
                                                        <button className="h-auto bg-transparent text-[#333] text-xl">
                                                            <AiFillEye />
                                                        </button>
                                                    </Link>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-[10px]">
                                                        <button
                                                            className="h-auto bg-transparent text-red-500 text-xl"
                                                            onClick={() => delState(state?._id)}
                                                        >
                                                            <MdDelete />
                                                        </button>
                                                        <button
                                                            className="h-auto bg-transparent text-green-500 text-xl"
                                                            onClick={() => {
                                                                setSelectedState(state);
                                                                setStatesModal({
                                                                    isOpen: true,
                                                                    isEdit: true,
                                                                });
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
