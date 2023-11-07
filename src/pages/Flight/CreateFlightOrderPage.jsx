import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axios";
import { BtnLoader, SelectDropdown } from "../../components";
import axioss from "axios";
import FlightAvailabiltyModal from "../../features/Flight/components/FlightAvailabilityModal";
import { handleDataChange } from "../../redux/slices/FlightOrderSlice";

export default function CreateFlightOrderPage() {
    const [data, setData] = useState({
        noOfAdults: "",
        noOfChildren: "",
        noOfInfants: "",
        type: "",
        travelClass: "",
        resellerId: "",
        returnDate: "",
        departureDate: "",
        from: "",
        to: "",
    });
    const [isAvailablityModal, setIsAvailabilityModal] = useState(false);
    const [flightResults, setFlightResults] = useState([]);
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { jwtToken } = useSelector((state) => state.admin);

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

            const response = await axioss.get(
                `https://raw.githubusercontent.com/mwgg/Airports/master/airports.json`
            );

            const data = Object.values(response?.data)?.filter((ele) => {
                if (ele?.iata?.length > 0 && ele?.iata) {
                    return ele;
                }
            });

            await setAirports(data);
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

    const handleSingleChange = ({ name, value }) => {
        try {
            if (name === "date") {
                setData();
            }

            setData((prev) => {
                return {
                    ...prev,
                    [name]: value,
                };
            });
        } catch (err) {}
    };

    useEffect(() => {
        fetchAirports();
        fetchResellers();
    }, []);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const formData = {
                noOfAdults: data.noOfAdults,
                noOfChildren: data.noOfChildren || 0,
                noOfInfants: data.noOfInfants || 0,
                type: data.type,
                trips: [
                    {
                        from: data.from,
                        to: data.to,
                        departureDate: data?.departureDate,
                        returnDate: data?.returnDate,
                    },
                ],
                travelClass: data.travelClass,
            };

            const response = await axios.post(
                `/orders/flight/search/availability/${data.resellerId}`,
                formData,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            dispatch(
                handleDataChange({
                    name: "totalAncillariesPax",
                    value: data.noOfAdults + data.noOfChildren,
                })
            );

            if (response.data) {
                setFlightResults(response.data.flightResult);
                setIsAvailabilityModal(true);
            }
            setIsLoading(false);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    console.log(flightResults, "flightResults");
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
                                        <option value="oneway">One Way</option>
                                        <option value="return">Return</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">Class </label>{" "}
                                    <select
                                        name="travelClass"
                                        value={data.travelClass || ""}
                                        onChange={handleChange}
                                        id=""
                                        required
                                        className="capitalize"
                                    >
                                        <option value="" hidden>
                                            Select Class
                                        </option>
                                        <option value="buisness">
                                            Business
                                        </option>
                                        <option value="economy">Economy</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor=""> Reseller</label>
                                    <div className="">
                                        <SelectDropdown
                                            data={resellers}
                                            setData={setResellers}
                                            displayName={"companyName"}
                                            selectedData={data.resellerId}
                                            setSelectedData={(value) =>
                                                handleSingleChange({
                                                    name: "resellerId",
                                                    value: value,
                                                })
                                            }
                                            valueName={"_id"}
                                            randomIndex={"companyName"}
                                            disabled={false}
                                            addNewButton={false}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="">From </label>
                                    <div className="">
                                        <SelectDropdown
                                            data={airports}
                                            setData={setAirports}
                                            displayName={"name"}
                                            selectedData={data?.from}
                                            setSelectedData={(value) =>
                                                handleSingleChange({
                                                    name: "from",
                                                    value: value,
                                                })
                                            }
                                            valueName={"iata"}
                                            randomIndex={"name"}
                                            disabled={false}
                                            addNewButton={false}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="">To </label>
                                    <div className="">
                                        <SelectDropdown
                                            data={airports}
                                            setData={setAirports}
                                            displayName={"name"}
                                            selectedData={data?.to}
                                            setSelectedData={(value) =>
                                                handleSingleChange({
                                                    name: "to",
                                                    value: value,
                                                })
                                            }
                                            valueName={"iata"}
                                            randomIndex={"name"}
                                            disabled={false}
                                            addNewButton={false}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="">Departure Date </label>
                                    <input
                                        type="date"
                                        name="departureDate"
                                        value={data.departureDate || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Return Date </label>
                                    <input
                                        type="date"
                                        name="returnDate"
                                        value={data.returnDate || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="">Adult Count </label>
                                        <select
                                            name="noOfAdults"
                                            value={data.noOfAdults || ""}
                                            onChange={handleChange}
                                            id=""
                                            required
                                            className="capitalize"
                                        >
                                            <option value="" hidden>
                                                Select Number
                                            </option>
                                            {numbers?.map((number, index) => {
                                                return (
                                                    <option
                                                        value={number}
                                                        key={index}
                                                        className="capitalize"
                                                    >
                                                        {number}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="">
                                            Children Count{" "}
                                        </label>
                                        <select
                                            name="noOfChildren"
                                            value={data.noOfChildren || ""}
                                            onChange={handleChange}
                                            id=""
                                            className="capitalize"
                                        >
                                            <option value="" hidden>
                                                Select Number
                                            </option>
                                            {numbers?.map((number, index) => {
                                                return (
                                                    <option
                                                        value={number}
                                                        key={index}
                                                        className="capitalize"
                                                    >
                                                        {number}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="">Infant Count </label>
                                        <select
                                            name="noOfInfants"
                                            value={data.noOfInfants || ""}
                                            onChange={handleChange}
                                            id=""
                                            className="capitalize"
                                        >
                                            <option value="" hidden>
                                                Select Number
                                            </option>
                                            {numbers?.map((number, index) => {
                                                return (
                                                    <option
                                                        value={number}
                                                        key={index}
                                                        className="capitalize"
                                                    >
                                                        {number}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>{" "}
                            {error && (
                                <span className="text-sm block text-red-500 mt-2">
                                    {error}
                                </span>
                            )}
                            <div className="mt-4 flex items-center justify-end gap-[12px]">
                                <button
                                    className="w-[130px]"
                                    onClick={handleSubmit}
                                >
                                    {isLoading ? <BtnLoader /> : "Submit"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {isAvailablityModal && (
                <FlightAvailabiltyModal
                    flightResults={flightResults}
                    setIsAvailabilityModal={setIsAvailabilityModal}
                    setFlightResults={setFlightResults}
                />
            )}
        </div>
    );
}
