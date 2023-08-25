import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { BtnLoader, PageLoader } from "../../components";
import { SingleAttractionItineraryForm } from "../../features/AttractionItinerary/";
import SingleAttractionItineraryLiveView from "./SingleAttractionItineraryLiveView";

export default function EditAttractionItineraryPage() {
    const [data, setData] = useState({
        agentName: "",
        agentEmail: "",
        agentMobileNumber: "",
        queryDetails: "",
        referenceNo: "",
        itineraries: [
            {
                items: [
                    {
                        isCustom: false,
                        attraction: "",
                        attractionTitle: "",
                        itineraryTitle: "",
                        description: "",
                        note: "",
                        images: [],
                    },
                ],
            },
        ],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [initialData, setIntitialData] = useState({
        attractions: [],
        activities: [],
    });
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const addDay = () => {
        setData((prev) => {
            return {
                ...prev,
                itineraries: [
                    ...prev.itineraries,
                    {
                        items: [
                            {
                                isCustom: false,
                                attraction: "",
                                attractionTitle: "",
                                itineraryTitle: "",
                                description: "",
                                note: "",
                                images: [],
                            },
                        ],
                    },
                ],
            };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const requestBody = { ...data };

            await axios.patch(
                `/attractions/itineraries/update/${id}`,
                requestBody,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate("/attractions/itineraries");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };
    const fetchItineraryData = async () => {
        try {
            const response = await axios.get(
                `/attractions/itineraries/single/${id}/non-populated`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            const {
                agentName,
                agentEmail,
                agentMobileNumber,
                queryDetails,
                referenceNo,
                itineraries,
            } = response.data;
            setData((prev) => {
                return {
                    ...prev,
                    agentName,
                    agentEmail,
                    agentMobileNumber,
                    queryDetails,
                    referenceNo,
                    itineraries,
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchInititalData = async () => {
        try {
            const response = await axios.get(
                `/attractions/activities/names/all`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setIntitialData((prev) => {
                return {
                    ...prev,
                    attractions: response.data?.attractions,
                    activities: response?.data?.activities,
                };
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchItineraryData();
        fetchInititalData();
    }, []);

    // useEffect(() => {
    //     fetchInititalData();
    // }, []);

    const handleDeleteImage = (itineraryIndex, itemIndex, index) => {
        let tempItineraries = data.itineraries;

        tempItineraries[itineraryIndex].items[itemIndex].images =
            tempItineraries[itineraryIndex].items[itemIndex]?.images?.filter(
                (ele, i) => {
                    return i !== index;
                }
            );

        setData((prev) => {
            return { ...prev, itineraries: tempItineraries };
        });
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Attraction Itinerary
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/attractions" className="text-textColor">
                        Attractions{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/itineraries" className="text-textColor">
                        Itineraries{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {id?.slice(0, 3)}...{id?.slice(-3)}{" "}
                    </span>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6 ">
                    <div className="bg-white rounded p-6 shadow-sm grid grid-cols-2 gap-6">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="">Query Details</label>
                                    <input
                                        type="text"
                                        placeholder="Enter query details"
                                        name="queryDetails"
                                        value={data.queryDetails || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Reference Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter reference number"
                                        name="referenceNo"
                                        value={data.referenceNo || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Agent Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter agent name"
                                        name="agentName"
                                        value={data.agentName || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Enter agent email id"
                                        name="agentEmail"
                                        value={data.agentEmail || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Mobile Number</label>
                                    <input
                                        type="text"
                                        placeholder="Enter agent mobile number"
                                        name="agentMobileNumber"
                                        value={data.agentMobileNumber || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            {data?.itineraries?.map(
                                (itinerary, itineraryIndex) => {
                                    return (
                                        <SingleAttractionItineraryForm
                                            key={itineraryIndex}
                                            itinerary={itinerary}
                                            data={data}
                                            setData={setData}
                                            itineraryIndex={itineraryIndex}
                                            initialData={initialData}
                                        />
                                    );
                                }
                            )}
                            <div className="flex items-center justify-center mt-5">
                                <button
                                    className="text-[#0ab39c] bg-[#0ab39c1A] px-3 mx-auto"
                                    onClick={addDay}
                                    type="button"
                                >
                                    + Add Day
                                </button>
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
                                <button className="w-[160px]">
                                    {isLoading ? (
                                        <BtnLoader />
                                    ) : (
                                        "Update Itinerary"
                                    )}
                                </button>
                            </div>
                        </form>
                        <SingleAttractionItineraryLiveView
                            data={data}
                            handleDeleteImage={handleDeleteImage}
                            initialData={initialData}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
