import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, MultipleSelectDropdown } from "../../components";
import QuotationTransferTable from "../../features/Attractions/components/QuotationTransferTable";
import TransferVehicleTable from "../../features/Transfer/TransferVehicleTable";
import { useImageChange } from "../../hooks";

export default function AddTransferPage() {
    const [data, setData] = useState({
        transferType: "group-group",
        transferTo: "",
        transferFromDatas: [],
        transferFrom: "",
        transferToDatas: [],
        sharedPrice: "",
        vehicles: [],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [groups, setGroups] = useState([]);
    const [airports, setAirports] = useState([]);

    const [vehicles, setVehicles] = useState([]);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name == "transferType") {
            setData((prev) => {
                return {
                    ...prev,
                    transferFrom: "",
                    transferToDatas: [],
                    [e.target.name]: e.target.value,
                };
            });
        }

        setData((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");
            console.log("called transfer");

            await axios.post(`/transfer/new`, data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsLoading(false);
            navigate("/transfers");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
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

    const fetchVehicles = async () => {
        try {
            const response = await axios.get(`/transfer/veh/all`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setVehicles(
                response.data.map((vh) => {
                    return {
                        ...vh,
                        price: 0,
                    };
                })
            );
            setData((prev) => ({
                ...prev,
                vehicles: response.data.map((veh) => {
                    return {
                        vehicle: veh._id,
                        price: 0,
                    };
                }),
            }));
        } catch (err) {
            console.log(err);
        }
    };

    const handleAccessChange = (selectedData, transferType) => {
        setData((prev) => {
            return { ...prev, [transferType]: selectedData };
        });
    };

    useEffect(() => {
        fetchData();
        fetchVehicles();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">ADD TRANSFER</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/airports" className="text-textColor">
                        Transfer{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="">Transfer Type</label>
                                <select
                                    name="transferType"
                                    value={data?.transferType || ""}
                                    onChange={handleChange}
                                    id=""
                                    required
                                    className="capitalize"
                                >
                                    <option value="group-group">
                                        Group-Group
                                    </option>
                                    <option value="group-airport">
                                        Group-Airport
                                    </option>

                                    <option value="airport-group">
                                        Airport-Group
                                    </option>
                                    {/* <option value="airport-airport">
                                        Airport-Airport
                                    </option> */}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="">Transfer From</label>
                                {data.transferType === "airport-group" ? (
                                    <select
                                        name="transferFrom"
                                        value={data?.transferFrom || ""}
                                        onChange={handleChange}
                                        id=""
                                        required
                                        className="capitalize"
                                    >
                                        <option value="" hidden>
                                            Transfer To
                                        </option>
                                        {airports?.map((airport, index) => (
                                            <option
                                                value={airport?._id}
                                                key={index}
                                            >
                                                {airport?.airportName}
                                            </option>
                                        ))}
                                    </select>
                                ) : data.transferType === "group-group" ||
                                  data.transferType === "group-airport" ? (
                                    <MultipleSelectDropdown
                                        data={groups}
                                        displayName={"name"}
                                        valueName={"_id"}
                                        selectedData={data?.transferFromDatas}
                                        setSelectedData={(selAccess) => {
                                            handleAccessChange(
                                                selAccess,
                                                "transferFromDatas"
                                            );
                                        }}
                                        randomIndex={"name" + 1}
                                    />
                                ) : (
                                    <MultipleSelectDropdown
                                        data={airports}
                                        displayName={"airportName"}
                                        valueName={"_id"}
                                        selectedData={data?.transferFromDatas}
                                        setSelectedData={(selAccess) => {
                                            handleAccessChange(
                                                selAccess,
                                                "transferFromDatas"
                                            );
                                        }}
                                        randomIndex={"name" + 2}
                                    />
                                )}

                                {/* ) : (
                                        places?.map((place, index) => {
                                            return (
                                                <option
                                                    value={place?._id}
                                                    key={index}
                                                >
                                                    {place?.cityName}
                                                </option>
                                            );
                                        })
                                    )}
                                </select> */}
                            </div>
                            <div>
                                <label htmlFor="">Transfer To</label>
                                {data.transferType === "airport-group" ? (
                                    <>
                                        <MultipleSelectDropdown
                                            data={groups}
                                            displayName={"name"}
                                            valueName={"_id"}
                                            selectedData={data?.transferToDatas}
                                            setSelectedData={(selAccess) => {
                                                handleAccessChange(
                                                    selAccess,
                                                    "transferToDatas"
                                                );
                                            }}
                                            randomIndex={"name" + 3}
                                        />
                                    </>
                                ) : data.transferType === "group-group" ? (
                                    <MultipleSelectDropdown
                                        data={groups}
                                        displayName={"name"}
                                        valueName={"_id"}
                                        selectedData={data?.transferToDatas}
                                        setSelectedData={(selAccess) => {
                                            handleAccessChange(
                                                selAccess,
                                                "transferToDatas"
                                            );
                                        }}
                                        randomIndex={"name" + 4}
                                    />
                                ) : data.transferType === "group-airport" ? (
                                    <select
                                        name="transferTo"
                                        value={data?.transferTo || ""}
                                        onChange={handleChange}
                                        id=""
                                        required
                                        className="capitalize"
                                    >
                                        <option value="" hidden>
                                            Transfer To
                                        </option>
                                        {airports?.map((airport, index) => (
                                            <option
                                                value={airport?._id}
                                                key={index}
                                            >
                                                {airport?.airportName}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <MultipleSelectDropdown
                                        data={airports}
                                        displayName={"airportName"}
                                        valueName={"_id"}
                                        selectedData={data?.transferToDatas}
                                        setSelectedData={(selAccess) => {
                                            handleAccessChange(
                                                selAccess,
                                                "transferToDatas"
                                            );
                                        }}
                                        randomIndex={"airportName" + 5}
                                    />
                                )}
                            </div>
                            {data.transferType === "group-group" && (
                                <div>
                                    <label htmlFor="">
                                        Shared Transfer Price
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter price "
                                        name="sharedPrice"
                                        value={data.sharedPrice || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </div>
                        <TransferVehicleTable
                            vehicles={vehicles}
                            setVehicles={setVehicles}
                            data={data}
                            setData={setData}
                        />

                        {error && (
                            <span className="text-sm block text-red-500 mt-2">
                                {error}
                            </span>
                        )}
                        <div className="mt-4 flex items-center justify-end gap-[12px]">
                            <button
                                className="bg-slate-300 text-textColor px-[15px]"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button className="w-[120px]">
                                {isLoading ? <BtnLoader /> : "Add Transfer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
