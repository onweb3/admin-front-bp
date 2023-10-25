import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
export default function CreateFlightOrderPage() {
    const [data, setData] = useState({
        type: "",
        nationalityId: "",
        resellerId: "",
        visaTypeId: "",
        adultsCount: 0,
        childrenCount: 0,
    });
    const [airports, setAirports] = useState([]);
    const [resellers, setResellers] = useState([]);
    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchAirports = async () => {
        try {
            setIsLoading(true);

            const response = await axio.get(
                `/orders/a2a/list/all`,
                { date: data.date },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setAirports(response.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchResellers = async () => {
        try {
            const response = await axios.get(
                `/orders/attraction/list/resellers`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setResellers(response.data);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            // setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAirports();
        fetchResellers();
    }, []);
    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">Create Flight Order</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/order" className="text-textColor">
                        Orders{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Flight</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form
                        action=""
                        // onSubmit={handleSubmit}
                        className=""
                    >
                        {" "}
                        <div className="w-full p-5">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="">Type </label>{" "}
                                    <select
                                        name="type"
                                        value={data.type || ""}
                                        onChange={handleChange}
                                        id=""
                                        required
                                        className="capitalize"
                                    >
                                        <option value="" hidden>
                                            Select Type
                                        </option>
                                        <option value="">One Way</option>
                                        <option value="">Return</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">Class </label>{" "}
                                    <select
                                        name="class"
                                        value={data.class || ""}
                                        onChange={handleChange}
                                        id=""
                                        required
                                        className="capitalize"
                                    >
                                        <option value="" hidden>
                                            Select Class
                                        </option>
                                        <option value="">Business</option>
                                        <option value="">Economy</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">From </label>
                                </div>
                                <div>
                                    <label htmlFor="">To </label>
                                </div>
                                <div>
                                    <label htmlFor="">From Date </label>
                                </div>
                                <div>
                                    <label htmlFor="">To Date </label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
