import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SiYourtraveldottv } from "react-icons/si";
import {
    fetchAttractionInitialData,
    fetchVisaInitialData,
} from "../../redux/slices/markupProfileFormSlice";

import axios from "../../axios";
import { BtnLoader, PageLoader, RichTextEditor } from "../../components";
import AttractionProfileListTable from "../../features/MarkupProfile/components/AttractionProfileListTable";
import VisaProfileListTable from "../../features/MarkupProfile/components/VisaProfileListTable";
import A2aProfileListTable from "../../features/MarkupProfile/components/A2aProfileListTable";
import HotelStarCategoryTable from "../../features/MarkupProfile/components/HotelStarCategoryTable";
import QuotationProfileTable from "../../features/MarkupProfile/components/QuotationProfileTable";

export default function AddMarkupProfilePage() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
    });

    const [initalAttractionList, setInitalAttractionList] = useState([]);
    const [initalVisaTypeList, setIntialVisaTypeList] = useState([]);
    const [initalA2aTypeList, setIntialA2aTypeList] = useState([]);
    const [initalHotelList, setInitalHotelList] = useState([]);

    const [attractionList, setAttractionList] = useState([]);
    const [visaTypeList, setVisaTypeList] = useState([]);
    const [a2aTypeList, setA2aTypeList] = useState([]);
    const [hotelList, setHotelList] = useState([]);

    const [activity, setActivity] = useState([]);
    const [visa, setVisa] = useState([]);
    const [a2a, setA2a] = useState([]);
    const [roomType, setRoomType] = useState([]);
    const [quotation, setQuotation] = useState({
        hotelMarkupType: "flat",
        hotelMarkup: 0,
        landmarkMarkupType: "flat",
        landmarkMarkup: 0,
        visaMarkupType: "flat",
        visaMarkup: 0,
    });

    const [section, setSection] = useState("attraction");

    const { id } = useParams();
    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);
    const [filter, setFilter] = useState({
        attractionName: "",
    });

    const handleSectionChange = (e, value) => {
        e.preventDefault();
        setSection(value);
    };

    const handleFilter = (e, value) => {
        e.preventDefault();

        if (value === "attraction") {
            const regex = new RegExp(e.target.value, "i");
            setAttractionList(
                attractionList.filter((attraction) =>
                    regex.test(attraction.name)
                )
            );
        }

        if (value === "clear") {
            setAttractionList((previous) => {
                const updatedList = initalAttractionList.map((attr) => {
                    const matchingAttr = previous.find(
                        (prevAttr) =>
                            prevAttr._id.toString() === attr._id.toString()
                    );
                    if (matchingAttr) {
                        return matchingAttr;
                    } else {
                        return attr;
                    }
                });
                return updatedList;
            });
            setFilter({
                attractionName: "",
            });
        }

        setFilter((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleChange = (e) => {
        setFormData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchAttractionInitialData = async () => {
        try {
            setIsPageLoading(true);
            const response = await axios.get(
                "/profile/get-all-attraction-activities",
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const updatedAttractionList = response.data.map((data) => {
                return {
                    ...data,
                    activities: data.activities.map((activity) => {
                        return {
                            ...activity,
                            markupType: "flat",
                            markup: 0,
                        };
                    }),
                };
            });

            setAttractionList(updatedAttractionList);

            const updatedActivityList = response.data.flatMap((data) => {
                return data.activities.map((activity) => {
                    return {
                        activity: activity._id,
                        markupType: "flat",
                        markup: 0,
                    };
                });
            });

            setActivity(updatedActivityList);

            setIsPageLoading(false);

            setInitalAttractionList(updatedAttractionList);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchVisaInitialData = async () => {
        try {
            setIsPageLoading(true);
            // const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}`;
            const response = await axios.get("/profile/get-all-visatype", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            // setVisaTypeList(response.data);
            setVisaTypeList((prevVisa) => [
                ...prevVisa,
                ...response.data.map((data) => {
                    return {
                        ...data,
                        markupType: "flat",
                        markup: 0,
                    };
                }),
            ]);

            setVisa(() => {
                return response.data.map((data) => {
                    return {
                        visa: data._id,
                        markupType: "flat",
                        markup: 0,
                    };
                });
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchA2aInitialData = async () => {
        try {
            setIsPageLoading(true);
            // const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}`;
            const response = await axios.get("/profile/get-all-a2atype", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setA2aTypeList((prevA2a) => [
                ...prevA2a,
                ...response.data.map((data) => {
                    return {
                        ...data,
                        markupType: "flat",
                        markup: 0,
                    };
                }),
            ]);

            setA2a(() => {
                return response.data.map((data) => {
                    return {
                        atoa: data._id,
                        markupType: "flat",
                        markup: 0,
                    };
                });
            });

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchHotelInitialData = async () => {
        try {
            setIsPageLoading(true);
            // const searchQuery = `skip=${filters?.skip}&limit=${filters.limit}`;
            const response = await axios.get("/profile/get-all-hotel", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            // console.log(response.data, "hotel data");

            setHotelList(response.data);

            setRoomType(() => {
                return response?.data
                    .map((data) => {
                        return data?.hotel.flatMap((hotel) => {
                            return hotel?.roomType.map((roomType) => {
                                return {
                                    roomTypeId: roomType.roomTypeId,
                                    markupType: roomType.markupType,
                                    markup: roomType.markup,
                                    markupTypeApi: roomType.markupTypeApi,
                                    markupApi: roomType.markupApi,
                                    roomName: roomType.roomName,
                                };
                            });
                        });
                    })
                    .flat();
            });

            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAttractionInitialData();
        fetchVisaInitialData();
        fetchA2aInitialData();
        fetchHotelInitialData();
    }, []);

    const onHandleSubmit = async (e) => {
        try {
            e.preventDefault();

            setIsLoading(true);

            const data = {
                name: formData.name,
                activities: activity,
                visa,
                atoA: a2a,
                hotel: roomType,
                quotation,
            };

            const response = await axios.post("/profile/add-profile", data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            console.log(response);

            setIsLoading(false);
            navigate(`/markup/profile`);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (attractionList && attractionList.length > 0) {
            console.log("calll");
            setInitalAttractionList(attractionList);
        }
    }, []);

    console.log(quotation, "quotation");

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Add Profile
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/markup/profile" className="text-textColor">
                        Profile{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>
                        {/* {id?.slice(0, 3)}...{id?.slice(-3)}{" "} */}
                    </span>
                    <span>{">"} </span>
                    <Link
                        // to={`/attractions/${id}/edit`}
                        className="text-textColor"
                    >
                        Add{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Profile</span>
                    <span>{">"} </span>
                    <span>Add</span>
                </div>
            </div>

            {isPageLoading ? (
                <PageLoader />
            ) : (
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="text-base font-medium flex items-center gap-[10px]">
                                <SiYourtraveldottv /> Add Markup Profile
                            </h1>
                            <div className="flex items-center gap-[10px]">
                                <button
                                    className={
                                        section === "attraction"
                                            ? "p-2"
                                            : "hidden"
                                    }
                                    onClick={(e) => handleFilter(e, "clear")}
                                >
                                    Clear
                                </button>
                                {/* <input
                                    type="text"
                                    placeholder="hotel name..."
                                    className={
                                        section === "hotel"
                                            ? "min-w-[200px]"
                                            : "hidden"
                                    }
                                    name="companyName"
                                />
                                <input
                                    type="text"
                                    placeholder="a2a name..."
                                    className={
                                        section === "a2a"
                                            ? "min-w-[200px]"
                                            : "hidden"
                                    }
                                    name="companyName"
                                    // onChange={handleChange}
                                    // value={filters.companyName || ""}
                                />
                                <input
                                    type="text"
                                    placeholder="visa name..."
                                    className={
                                        section === "visa"
                                            ? "min-w-[200px]"
                                            : "hidden"
                                    }
                                    name="visaName"
                                    onChange={(e) => {
                                        handleFilter(e, "visa");
                                    }}
                                    value={filter.visaName || ""}
                                /> */}
                                <input
                                    type="text"
                                    placeholder="attraction name..."
                                    className={
                                        section === "attraction"
                                            ? "min-w-[200px]"
                                            : "hidden"
                                    }
                                    name="attractionName"
                                    onChange={(e) => {
                                        handleFilter(e, "attraction");
                                    }}
                                    value={filter.attractionName || ""}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 items-end gap-5 pt-10">
                            <div>
                                <label htmlFor="">Name</label>
                                <input
                                    type="text"
                                    // placeholder="Ex: "
                                    name="name"
                                    value={formData.name || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Category</label>
                                <input
                                    type="text"
                                    // placeholder="Ex: Pearl Heli Tour (12 Mins. Ride)"
                                    name="category"
                                    value={formData.category || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "attraction"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "attraction");
                                }}
                            >
                                Attraction
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "visa"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "visa");
                                }}
                            >
                                Visa
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "hotel"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "hotel");
                                }}
                            >
                                Hotel
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "a2a"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "a2a");
                                }}
                            >
                                A2a
                            </button>
                            <button
                                className={
                                    "px-2 py-4 h-auto bg-transparent text-primaryColor font-medium rounded-none " +
                                    (section === "quotation"
                                        ? "border-b border-b-orange-500"
                                        : "")
                                }
                                onClick={(e) => {
                                    handleSectionChange(e, "quotation");
                                }}
                            >
                                Quotation
                            </button>
                        </div>

                        <div
                            className={
                                section === "attraction"
                                    ? "block pt-10"
                                    : "hidden"
                            }
                        >
                            {" "}
                            <AttractionProfileListTable
                                attractionList={attractionList}
                                setAttractionList={setAttractionList}
                                activity={activity}
                                setActivity={setActivity}
                                setInitalAttractionList={
                                    setInitalAttractionList
                                }
                            />
                        </div>
                        <div
                            className={
                                section === "visa" ? "block pt-10" : "hidden"
                            }
                        >
                            {" "}
                            <VisaProfileListTable
                                visaTypeList={visaTypeList}
                                visa={visa}
                                setVisa={setVisa}
                            />
                        </div>
                        <div
                            className={
                                section === "a2a" ? "block pt-10" : "hidden"
                            }
                        >
                            {" "}
                            <A2aProfileListTable
                                a2aTypeList={a2aTypeList}
                                a2a={a2a}
                                setA2a={setA2a}
                            />
                        </div>
                        <div
                            className={
                                section === "hotel" ? "block pt-10" : "hidden"
                            }
                        >
                            {" "}
                            <HotelStarCategoryTable
                                hotelLists={hotelList}
                                roomType={roomType}
                                setRoomType={setRoomType}
                                setHotelList={setHotelList}
                            />
                        </div>
                        <div
                            className={
                                section === "quotation"
                                    ? "block pt-10"
                                    : "hidden"
                            }
                        >
                            {" "}
                            <QuotationProfileTable
                                quotation={quotation}
                                setQuotation={setQuotation}
                            />
                        </div>
                        {/* <div className="pt-10">
                                <AttractionProfileListTable
                                    attractionList={attractionList}
                                />
                            </div> */}

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
                            <button
                                className="w-[150px]"
                                onClick={onHandleSubmit}
                            >
                                {isLoading ? <BtnLoader /> : "Save Profile"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
