import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader } from "../../components";
import QuotationTransferTable from "../../features/Attractions/components/QuotationTransferTable";
import TransferVehicleTable from "../../features/Transfer/TransferVehicleTable";

export default function EditTransferPage() {
    const [data, setData] = useState({
        transferType: "group-group",
        transferFrom: "",
        transferTo: "",
        sharedPrice: "",
        vehicles: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [groups, setGroup] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [airports, setAirports] = useState([]);

    const { id } = useParams();

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name == "transferType") {
            setData((prev) => {
                return {
                    ...prev,
                    transferFrom: "",
                    transferTo: "",
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

            await axios.patch(`/transfer/update/${id}`, data, {
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
            setGroup(response.data.groups);
            setAirports(response.data.airports);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchTransfer = async () => {
        try {
            const response = await axios.get(`/transfer/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setData((prev) => ({
                ...prev,
                transferFrom: response.data.transferFrom,
                transferType: response.data.transferType,
                transferTo: response.data.transferTo,
                sharedPrice: response?.data?.sharedPrice,
                vehicles: response.data.vehicleType.map((veh) => {
                    return {
                        vehicle: veh.vehicle,
                        price: veh.price,
                    };
                }),
            }));
            // setPlaces(response.data);
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
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTransfer();
        fetchData();
        fetchVehicles();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">EDIT TRANSFER</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/transfers" className="text-textColor">
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
                                </select>
                            </div>
                            <div>
                                <label htmlFor="">Transfer From</label>
                                <select
                                    name="transferFrom"
                                    value={data?.transferFrom || ""}
                                    onChange={handleChange}
                                    id=""
                                    required
                                    className="capitalize"
                                >
                                    <option value="" hidden>
                                        Transfer From
                                    </option>
                                    {data.transferType === "airport-airport" ||
                                    data.transferType === "airport-group"
                                        ? airports?.map((airport, index) => {
                                              return (
                                                  <option
                                                      value={airport?._id}
                                                      key={index}
                                                  >
                                                      {airport?.airportName}
                                                  </option>
                                              );
                                          })
                                        : groups?.map((place, index) => {
                                              return (
                                                  <option
                                                      value={place?._id}
                                                      key={index}
                                                  >
                                                      {place?.name}
                                                  </option>
                                              );
                                          })}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="">Transfer To</label>
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
                                    {data.transferType === "airport-airport" ||
                                    data.transferType === "group-airport"
                                        ? airports?.map((airport, index) => {
                                              return (
                                                  <option
                                                      value={airport?._id}
                                                      key={index}
                                                  >
                                                      {airport?.airportName}
                                                  </option>
                                              );
                                          })
                                        : groups?.map((place, index) => {
                                              return (
                                                  <option
                                                      value={place?._id}
                                                      key={index}
                                                  >
                                                      {place?.name}
                                                  </option>
                                              );
                                          })}
                                </select>
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
                                        required
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
                                {isLoading ? <BtnLoader /> : "Edit Transfer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
