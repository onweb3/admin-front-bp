import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { BtnLoader, PageLoader, Pagination } from "../../components";
import { A2AIndexTable, AddA2AModal } from "../../features/A2A";
import axios from "../../axios";
import A2aMarkupRow from "../../features/A2A/components/A2aMarkupRow";

function AddA2APage() {
    const [profiles, setProfiles] = useState([]);
    const [markupUpdate, setMarkupUpdate] = useState([]);
    const [section, setSection] = useState("a2a");
    const [airportFrom, setAirportFrom] = useState("");
    const [airportTo, setAirportTo] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState([]);
    const [airports, setAirports] = useState([]);
    const navigate = useNavigate();

    const { jwtToken } = useSelector((state) => state.admin);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);

            const response = await axios.post(
                "/a2a/add",
                { airportFrom, airportTo, markupUpdate },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setResult([response?.data?.data, ...result]);
            setIsLoading(false);
            navigate(-1);
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.error);
            setIsLoading(false);
        }
    };

    const handleSectionChange = (e, value) => {
        e.preventDefault();
        setSection(value);
    };

    const fetchAirports = async () => {
        try {
            const response = await axios.get("/a2a/airports/all", {
                headers: { Authorization: `Bearer ${jwtToken}` },
            });
            console.log(response.data);
            setAirports(response.data?.airports);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAirports();
    }, []);

    const fetchProfiles = async () => {
        try {
            console.log("fetching resellers");
            setIsLoading(true);

            const response = await axios.get(`/profile/get-all-profiles`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            console.log(response.data, "data");

            setProfiles((prevProfile) => [
                ...prevProfile,

                ...response.data?.map((data) => {
                    return {
                        ...data,
                        markupType: "flat",
                        markup: 0,
                    };
                }),
            ]);

            setMarkupUpdate(
                () =>
                    response.data?.map((data) => {
                        return {
                            profileId: data._id,
                            markupType: "flat",
                            markup: 0,
                        };
                    }) || []
            );

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);
    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Add A2A</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Add A2A</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">Add A2A</h1>
                        {/* <div className="flex items-center gap-[15px]">
                            <form
                                action=""
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    fetchA2A({ ...filters });
                                    let params = prevSearchParams();
                                    setSearchParams({
                                        ...params,
                                        search: filters.searchInput,
                                        skip: 0,
                                    });
                                }}
                                className="flex items-center gap-[10px]"
                            >
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    value={filters.searchInput || ""}
                                    onChange={(e) =>
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                searchInput: e.target.value,
                                            };
                                        })
                                    }
                                />
                                <button className="px-5">Search</button>
                            </form>
                           
                        </div> */}
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : profiles?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm  text-grayColor block mt-[6px]">
                                Oops.. No Profile found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-[13px] px-4 border-b border-b-dahsed">
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
                                        (section === "markup"
                                            ? "border-b border-b-orange-500"
                                            : "")
                                    }
                                    onClick={(e) => {
                                        handleSectionChange(e, "markup");
                                    }}
                                >
                                    Markup
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="p-4 space-y-2"
                            >
                                {" "}
                                <div
                                    className={` ${
                                        section === "a2a" ? "" : "hidden"
                                    }`}
                                >
                                    <div
                                        className="grid grid-cols-3 items-end gap-5 pt-10
                            "
                                    >
                                        <div>
                                            <label htmlFor="">
                                                {" "}
                                                Airport From *
                                            </label>
                                            <select
                                                value={airportFrom || ""}
                                                onChange={(e) =>
                                                    setAirportFrom(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option hidden>
                                                    Select airport
                                                </option>
                                                {airports?.map((item) => (
                                                    <option
                                                        key={item?._id}
                                                        value={item?._id}
                                                    >
                                                        {item?.airportName +
                                                            ` (${item?.iataCode}) `}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="">
                                                {" "}
                                                Airport To *
                                            </label>
                                            <select
                                                value={airportTo || ""}
                                                onChange={(e) =>
                                                    setAirportTo(e.target.value)
                                                }
                                            >
                                                <option hidden>
                                                    Select airport
                                                </option>
                                                {airports?.map((item) => (
                                                    <option
                                                        key={item?._id}
                                                        value={item?._id}
                                                    >
                                                        {item?.airportName +
                                                            ` (${item?.iataCode}) `}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={` ${
                                        section === "markup" ? "" : "hidden"
                                    }`}
                                >
                                    <table className="w-full">
                                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                            <tr>
                                                <th className="font-[500] p-3">
                                                    Index
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Profile Name
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Markup Type
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Markup
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="text-sm ">
                                            {profiles?.map((profile, index) => {
                                                return (
                                                    <A2aMarkupRow
                                                        index={index}
                                                        profile={profile}
                                                        markupUpdate={
                                                            markupUpdate
                                                        }
                                                        setMarkupUpdate={
                                                            setMarkupUpdate
                                                        }
                                                        // section={section}
                                                    />
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {error && (
                                    <p className="text-[12px] text-red-500 text-right">
                                        {error}
                                    </p>
                                )}
                                <div className="flex items-center justify-end mt-6">
                                    <button
                                        className="px-3 bg-primaryColor"
                                        type="submit"
                                    >
                                        {isLoading ? <BtnLoader /> : "Add A2A"}
                                    </button>
                                </div>
                            </form>

                            {/* <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalA2aList}
                                    incOrDecSkip={(number) => {
                                        let params = prevSearchParams();
                                        setSearchParams({
                                            ...params,
                                            skip: filters.skip + number + 1,
                                        });
                                    }}
                                    updateSkip={(skip) => {
                                        let params = prevSearchParams();
                                        setSearchParams({
                                            ...params,
                                            skip: skip + 1,
                                        });
                                    }}
                                />
                            </div> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddA2APage;
