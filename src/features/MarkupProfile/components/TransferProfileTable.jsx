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
// import BookingsOrdersSingleRow from "./BookingsOrdersSingleRow";

export default function TransferProfileTable({ type }) {
    const [transfers, setTransfers] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const { profileId, marketId } = useParams();
    const { id } = useParams();
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalTransfer: 0,
        transferType: "group-group",
        transferFrom: "",
        transferTo: "",
    });
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);

    const [groups, setGroups] = useState([]);
    const [airports, setAirports] = useState([]);
    const [areas, setAreas] = useState([]);
    const [isModal, setIsModal] = useState(false);

    const handleChange = (e) => {
        console.log(e.target.value, "value");
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchTransferInitialData = async () => {
        try {
            setIsPageLoading(true);

            if (type === "market") {
                if (marketId) {
                    const response = await axios.get(
                        `/market/get-all-transfer/${marketId}?skip=${filters.skip}&limit=${filters.limit}&transferFrom=${filters.transferFrom}&transferTo=${filters.transferTo}&transferType=${filters.transferType}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setTransfers(response.data.transfers);

                    setFilters((prev) => {
                        {
                            return {
                                ...prev,
                                totalTransfer: response?.data?.totalTransfer,
                            };
                        }
                    });
                } else {
                    const response = await axios.get(
                        `/market/b2b/get-all-transfer/${id}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setTransfers(response.data.transfers);
                    setFilters((prev) => {
                        {
                            return {
                                ...prev,
                                totalTransfer: response?.data?.totalTransfer,
                            };
                        }
                    });
                }
            } else {
                if (profileId) {
                    const response = await axios.get(
                        `/profile/get-all-transfer/${profileId}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setTransfers(response.data.transfers);

                    setFilters((prev) => {
                        {
                            return {
                                ...prev,
                                totalTransfer: response?.data?.totalTransfer,
                            };
                        }
                    });
                } else {
                    const response = await axios.get(
                        `/profile/b2b/get-all-transfer/${id}`,
                        {
                            headers: { authorization: `Bearer ${jwtToken}` },
                        }
                    );

                    setTransfers(response.data.transfers);

                    setFilters((prev) => {
                        {
                            return {
                                ...prev,
                                totalTransfer: response?.data?.totalTransfer,
                            };
                        }
                    });
                }
            }

            // const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}`;

            setIsPageLoading(false);
        } catch (err) {
            setTransfers([]);

            console.log(err);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`/transfer/places-airports`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setGroups(response.data.groups);
            setAirports(response.data.airports);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchAreas = async () => {
        try {
            const response = await axios.get(`/group-area/area`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            console.log(response, "response");
            setAreas(response.data.areas);
        } catch (err) {
            console.log(err);
        }
    };

    const clearFilters = () => {
        setFilters((prev) => {
            return {
                ...prev,
                skip: 0,
                limit: 10,
                totalTransfer: 0,
                transferType: "",
                transferFrom: "",
                transferTo: "",
            };
        });

        fetchTransferInitialData({
            skip: 0,
            limit: 10,
            totalTransfer: 0,
            transferType: "group-group",
            transferFrom: "",
            transferTo: "",
        });
    };

    useEffect(() => {
        fetchTransferInitialData();
    }, [filters.skip, filters.limit]);

    useEffect(() => {
        fetchData();
        fetchAreas();
    }, []);
    return (
        <div>
            <div className="overflow-x-auto">
                <div className="flex justify-end items-center w-full">
                    <button
                        className="w-[150px] flex gap-2 items-center p-4"
                        onClick={(e) => {
                            setIsModal(true);
                        }}
                    >
                        <BiEditAlt />
                        Edit Markup
                    </button>
                </div>
                <div className="flex items-center gap-[15px] justify-start pb-10">
                    <form
                        action=""
                        onSubmit={(e) => {
                            e.preventDefault();
                            fetchTransferInitialData({ ...filters });
                        }}
                        className="flex items-center gap-[10px] "
                    >
                        <div className="col-span-2">
                            <label htmlFor="">Transfer Type</label>
                            <div>
                                <select
                                    name="transferType"
                                    id=""
                                    value={filters?.transferType || ""}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="group-group">
                                        Group - Group
                                    </option>
                                    <option value="group-airport">
                                        Group - Airport
                                    </option>
                                    <option value="airport-group">
                                        Airport - Group
                                    </option>
                                    <option value="airport-airport">
                                        Airport - Airport
                                    </option>
                                    <option value="area-area">
                                        Area - Area
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div div className="col-span-2">
                            <div>
                                <label htmlFor=""> Transfer From</label>

                                <select
                                    name="transferFrom"
                                    value={filters?.transferFrom || ""}
                                    onChange={handleChange}
                                    id=""
                                    // required
                                    className="capitalize"
                                >
                                    <option value="">Select</option>
                                    {(filters.transferType ===
                                        "airport-airport" ||
                                        filters.transferType ===
                                            "airport-group") &&
                                        airports?.map((airport, index) => {
                                            return (
                                                <>
                                                    <option
                                                        value={airport?._id}
                                                        key={index}
                                                    >
                                                        {airport?.airportName}
                                                    </option>
                                                </>
                                            );
                                        })}

                                    {(filters.transferType ===
                                        "group-airport" ||
                                        filters.transferType ===
                                            "group-group") &&
                                        groups?.map((group, index) => {
                                            return (
                                                <option
                                                    value={group?._id}
                                                    key={index}
                                                >
                                                    {group?.name}
                                                </option>
                                            );
                                        })}

                                    {filters.transferType === "area-area" &&
                                        areas?.map((group, index) => {
                                            return (
                                                <>
                                                    <option
                                                        value={group?._id}
                                                        key={index}
                                                    >
                                                        {group?.areaName}
                                                    </option>
                                                </>
                                            );
                                        })}
                                </select>
                            </div>
                        </div>
                        <div div className="col-span-2">
                            <div>
                                <label htmlFor=""> Transfer To</label>

                                <select
                                    name="transferTo"
                                    value={filters?.transferTo || ""}
                                    onChange={handleChange}
                                    id=""
                                    // required
                                    className="capitalize"
                                >
                                    <option value="">Select</option>
                                    {(filters.transferType ===
                                        "airport-airport" ||
                                        filters.transferType ===
                                            "group-airport") &&
                                        airports?.map((airport, index) => {
                                            return (
                                                <>
                                                    <option
                                                        value={airport?._id}
                                                        key={index}
                                                    >
                                                        {airport?.airportName}
                                                    </option>
                                                </>
                                            );
                                        })}

                                    {(filters.transferType ===
                                        "airport-group" ||
                                        filters.transferType ===
                                            "group-group") &&
                                        groups?.map((group, index) => {
                                            return (
                                                <>
                                                    <option
                                                        value={group?._id}
                                                        key={index}
                                                    >
                                                        {group?.name}
                                                    </option>
                                                </>
                                            );
                                        })}

                                    {filters.transferType === "area-area" &&
                                        areas?.map((group, index) => {
                                            return (
                                                <>
                                                    <option
                                                        value={group?._id}
                                                        key={index}
                                                    >
                                                        {group?.areaName}
                                                    </option>
                                                </>
                                            );
                                        })}
                                </select>
                            </div>
                        </div>
                        <button className="px-5 mt-6 ">Search</button>
                        <button
                            className="bg-slate-200 text-textColor px-5 mt-6 "
                            onClick={clearFilters}
                            type="button"
                        >
                            Clear
                        </button>
                    </form>
                </div>
                {isPageLoading ? (
                    <PageLoader />
                ) : transfers?.length < 1 ? (
                    <div className="p-6 flex flex-col items-center">
                        <span className="text-sm text-grayColor block mt-[6px]">
                            Oops.. No transfer found
                        </span>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                            <tr>
                                <th className="font-[500] p-3">Index</th>
                                <th className="font-[500] p-3">
                                    Transfer From{" "}
                                </th>
                                <th className="font-[500] p-3">Transfer To </th>

                                <th className="font-[500] p-3">Edit</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {transfers?.map((transfer, index) => {
                                return (
                                    <TransferProfileRow
                                        key={transfer.transferId}
                                        index={index}
                                        transfer={transfer}
                                        type={type}
                                        setTransfers={setTransfers}

                                        // section={section}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
            {isModal && (
                <TransferMarkupModal
                    setIsModal={setIsModal}
                    type={type}
                    setTransfers={setTransfers}
                    single={false}
                />
            )}

            <div className="p-4">
                <Pagination
                    limit={filters?.limit}
                    skip={filters?.skip}
                    total={filters?.totalTransfer}
                    incOrDecSkip={(number) =>
                        setFilters((prev) => {
                            return {
                                ...prev,
                                skip: prev.skip + number,
                            };
                        })
                    }
                    updateSkip={(skip) =>
                        setFilters((prev) => {
                            return { ...prev, skip };
                        })
                    }
                />
            </div>
        </div>
    );
}
