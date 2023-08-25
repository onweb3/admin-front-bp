import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { BtnLoader, RichTextEditor } from "../../components";

function A2AEditTicketPage() {
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isAirlineLoading, setIsAirlineLoading] = useState(false);
    const [airlines, setAirlines] = useState([]);
    const [ticket, setTicket] = useState({});
    const [error, setError] = useState("");

    const [data, setData] = useState({
        airlineOnward: "",
        airlineReturn: "",
        airlineOnwardNo: "",
        airlineReturnNo: "",
        onwardDate: "",
        onwardDurationHr: 0,
        onwardDurationMin: 0,
        returnDurationHr: 0,
        returnDurationMin: 0,
        returnDate: "",
        takeOffTimeOnward: "",
        takeOffTimeReturn: "",
        landingTimeOnward: "",
        landingTimeReturn: "",
        price: "",
        totalSeats: "",
        pnrNo: "",
        termsAndCond: "",
        cancellationTime: "",
        note: "",
        infantPrice: 0,
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const { jwtToken } = useSelector((state) => state.admin);

    const fetchAirlines = async (e) => {
        try {
            setIsAirlineLoading(true);

            const response = await axios.get("/airlines/all", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            setIsAirlineLoading(false);
            setAirlines(response?.data?.airlines);
        } catch (err) {
            setError(err?.response?.data?.error);
            setIsAirlineLoading(false);
        }
    };

    const fetchTicket = async (e) => {
        try {
            setIsAirlineLoading(true);

            const response = await axios.get(
                `/a2a/ticket/single/${params.ticketId}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setIsAirlineLoading(false);
            setTicket(response?.data);

            setData({
                airlineOnward: response?.data?.airlineOnward,
                airlineReturn: response?.data?.airlineReturn,
                airlineOnwardNo: response?.data?.airlineOnwardNo,
                airlineReturnNo: response?.data?.airlineReturnNo,
                onwardDate: response?.data?.onwardDate?.slice(0, 10),
                onwardDurationHr: response?.data?.onwardDurationHr,
                onwardDurationMin: response?.data?.onwardDurationMin,
                returnDurationHr: response?.data?.returnDurationHr,
                returnDurationMin: response?.data?.returnDurationMin,
                returnDate: response?.data?.returnDate?.slice(0, 10),
                takeOffTimeOnward: response?.data?.takeOffTimeOnward,
                takeOffTimeReturn: response?.data?.takeOffTimeReturn,
                landingTimeOnward: response?.data?.landingTimeOnward,
                landingTimeReturn: response?.data?.landingTimeReturn,
                price: response?.data?.price,
                totalSeats: response?.data?.totalSeats,
                pnrNo: response?.data?.pnrNo,
                termsAndCond: response?.data?.termsAndCond,
                note: response?.data?.note,
                cancellationTime: response?.data?.cancellationTime,
                infantPrice: response?.data?.infantPrice,
            });
        } catch (err) {
            setError(err?.response?.data?.error);
            setIsAirlineLoading(false);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, []);

    useEffect(() => {
        fetchAirlines();
    }, []);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);

            await axios.patch(
                `/a2a/ticket/update/${params.ticketId}`,
                {
                    a2aReference: params.id,
                    ...data,
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setIsLoading(false);
            navigate(`/a2a/${params.id}`);
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.error);
            setIsLoading(false);
        }
    };
    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">EDIT TICKET</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/a2a" className="text-textColor">
                        A2A{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to={`/a2a/${params.id}`} className="text-textColor">
                        Tickets{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>EDIT</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="">
                                    {" "}
                                    Airline Name (Onward) *
                                </label>
                                <select
                                    type="text"
                                    name="airlineOnward"
                                    value={data?.airlineOnward || ""}
                                    onChange={handleChange}
                                >
                                    <option hidden>Select Airline</option>
                                    {airlines?.map((item) => (
                                        <option
                                            key={item?._id}
                                            value={item?._id}
                                        >
                                            {isAirlineLoading ? (
                                                <BtnLoader />
                                            ) : (
                                                item?.airlineName
                                            )}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="">
                                    {" "}
                                    Airline Number(Onward) *
                                </label>
                                <input
                                    type="text"
                                    name="airlineOnwardNo"
                                    value={data?.airlineOnwardNo || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor=""> Onward Date *</label>
                                <input
                                    type="date"
                                    name="onwardDate"
                                    value={data?.onwardDate || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">
                                    {" "}
                                    Take Off Time (Onward) *
                                </label>
                                <input
                                    type="time"
                                    name="takeOffTimeOnward"
                                    value={data?.takeOffTimeOnward || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="">
                                    {" "}
                                    Landing Time (Onward) *
                                </label>
                                <input
                                    type="time"
                                    name="landingTimeOnward"
                                    value={data?.landingTimeOnward || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">
                                    {" "}
                                    Onward Duration (Hour) *
                                </label>
                                <input
                                    type="number"
                                    name="onwardDurationHr"
                                    value={data?.onwardDurationHr || 0}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">
                                    {" "}
                                    Onward Duration (Minute) *
                                </label>
                                <input
                                    type="number"
                                    name="onwardDurationMin"
                                    value={data?.onwardDurationMin || 0}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">
                                    {" "}
                                    Airline Name (Return) *
                                </label>
                                <select
                                    type="text"
                                    name="airlineReturn"
                                    value={data?.airlineReturn || ""}
                                    onChange={handleChange}
                                >
                                    <option hidden>Select Airline</option>
                                    {airlines?.map((item) => (
                                        <option
                                            key={item?._id}
                                            value={item?._id}
                                        >
                                            {isAirlineLoading ? (
                                                <BtnLoader />
                                            ) : (
                                                item?.airlineName
                                            )}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="">
                                    {" "}
                                    Airline Number(Return) *
                                </label>
                                <input
                                    type="text"
                                    name="airlineReturnNo"
                                    value={data?.airlineReturnNo || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor=""> Return Date *</label>
                                <input
                                    type="date"
                                    name="returnDate"
                                    value={data?.returnDate || ""}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="">
                                    {" "}
                                    Take Off Time (Return) *
                                </label>
                                <input
                                    type="time"
                                    name="takeOffTimeReturn"
                                    value={data?.takeOffTimeReturn}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">
                                    {" "}
                                    Landing Time (Return) *
                                </label>
                                <input
                                    type="time"
                                    name="landingTimeReturn"
                                    value={data?.landingTimeReturn || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">
                                    {" "}
                                    Return Duration (Hour) *
                                </label>
                                <input
                                    type="number"
                                    name="returnDurationHr"
                                    value={data?.returnDurationHr || 0}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">
                                    {" "}
                                    Return Duration (Minute) *
                                </label>
                                <input
                                    type="number"
                                    name="returnDurationMin"
                                    value={data?.returnDurationMin || 0}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor=""> Price *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={data?.price || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Infant Price *</label>
                                <input
                                    type="number"
                                    name="infantPrice"
                                    value={data?.infantPrice || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor=""> Total Seats *</label>
                                <input
                                    type="number"
                                    name="totalSeats"
                                    value={data?.totalSeats || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor=""> PNR Number *</label>
                                <input
                                    type="text"
                                    name="pnrNo"
                                    value={data?.pnrNo || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor=""> Cancellation TIme *</label>
                                <input
                                    type="number"
                                    name="cancellationTime"
                                    value={data?.cancellationTime || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="block ">
                            <div className="mt-4">
                                <label htmlFor=""> Terms and Condition *</label>
                                <div className="mt-2">
                                    <div className="border border-t-0">
                                        <RichTextEditor
                                            getValue={(value) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        termsAndCond: value,
                                                    };
                                                });
                                            }}
                                            initialValue={
                                                data?.termsAndCond || ""
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label htmlFor=""> Note *</label>
                                <div className="mt-2">
                                    <div className="border border-t-0">
                                        <RichTextEditor
                                            getValue={(value) => {
                                                setData((prev) => {
                                                    return {
                                                        ...prev,
                                                        note: value,
                                                    };
                                                });
                                            }}
                                            initialValue={data?.note || ""}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

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
                            <button className="w-[130px]">
                                {isLoading ? <BtnLoader /> : "Update Ticket"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default A2AEditTicketPage;
