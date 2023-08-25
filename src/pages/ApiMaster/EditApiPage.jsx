import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { BtnLoader, PageLoader } from "../../components";

export default function EditApiPage() {
    const [data, setData] = useState({
        apiCode: "",
        apiName: "",
        demoUrl: "",
        demoAgentId: "",
        demoUsername: "",
        demoPassword: "",
        liveUrl: "",
        liveAgentId: "",
        liveUsername: "",
        livePassword: "",
        runningMode: "",
        type: "",
        active: "active",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPageLoading, setIsPageLoading] = useState(true);

    const navigate = useNavigate();
    const { jwtToken } = useSelector((state) => state.admin);
    const { id } = useParams();

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);

            await axios.patch(
                `/api-master/update/${id}`,
                {
                    ...data,
                    isActive: data.active === "active",
                    active: undefined,
                },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate("/api-master");
        } catch (err) {
            setError(err?.response?.data?.error || "Something went wrong, Try again");
            setIsLoading(false);
        }
    };

    const fetchApi = async () => {
        try {
            setIsPageLoading(true);

            const response = await axios.get(`/api-master/single/${id}`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            const {
                apiCode,
                apiName,
                demoUrl,
                demoAgentId,
                demoUsername,
                demoPassword,
                liveUrl,
                liveAgentId,
                liveUsername,
                livePassword,
                runningMode,
                type,
                isActive,
            } = response.data;

            setData((prev) => {
                return {
                    ...prev,
                    apiCode,
                    apiName,
                    demoUrl,
                    demoAgentId,
                    demoUsername,
                    demoPassword,
                    liveUrl,
                    liveAgentId,
                    liveUsername,
                    livePassword,
                    runningMode,
                    type,
                    active: isActive === true ? "active" : "not-active",
                };
            });
            setIsPageLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchApi();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">EDIT API</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/api-master" className="text-textColor">
                        Api Master{" "}
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
                <div className="p-6">
                    <div className="bg-white rounded p-6 shadow-sm">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="">API Code</label>
                                    <input
                                        type="text"
                                        placeholder="Enter API Code"
                                        name="apiCode"
                                        value={data.apiCode || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">API Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter API Name"
                                        name="apiName"
                                        value={data.apiName || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Type</label>
                                    <select
                                        name="type"
                                        value={data.type || ""}
                                        onChange={handleChange}
                                        id=""
                                        required
                                    >
                                        <option value="" hidden>
                                            Select Type
                                        </option>
                                        <option value="attraction">Attraction</option>
                                        <option value="visa">Visa</option>
                                        <option value="flight">Flight</option>
                                        <option value="hotel">Hotel</option>
                                    </select>
                                </div>
                                <div className="col-span-3">
                                    <label htmlFor="">Demo URL</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Demo URL"
                                        name="demoUrl"
                                        value={data.demoUrl || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Demo Agent Id</label>
                                    <input
                                        type="text"
                                        placeholder="Enter agent id"
                                        name="demoAgentId"
                                        value={data.demoAgentId || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Demo Username / Api key</label>
                                    <input
                                        type="text"
                                        placeholder="Enter demo username / Api key"
                                        name="demoUsername"
                                        value={data.demoUsername || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Demo Password / Secret</label>
                                    <input
                                        type="password"
                                        placeholder="********"
                                        name="demoPassword"
                                        value={data.demoPassword || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label htmlFor="">Live URL</label>
                                    <input
                                        type="text"
                                        placeholder="Enter live URL"
                                        name="liveUrl"
                                        value={data.liveUrl || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Live Agent Id</label>
                                    <input
                                        type="text"
                                        placeholder="Enter agent id"
                                        name="liveAgentId"
                                        value={data.liveAgentId || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Live Username / Api key</label>
                                    <input
                                        type="text"
                                        placeholder="Enter live username"
                                        name="liveUsername"
                                        value={data.liveUsername || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Live Password / Secret</label>
                                    <input
                                        type="password"
                                        placeholder="********"
                                        name="livePassword"
                                        value={data.livePassword || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Running Mode</label>
                                    <select
                                        name="runningMode"
                                        value={data.runningMode || ""}
                                        onChange={handleChange}
                                        id=""
                                        required
                                    >
                                        <option value="" hidden>
                                            Select Running Mode
                                        </option>
                                        <option value="live">Live</option>
                                        <option value="demo">Demo</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">Active</label>
                                    <select
                                        name="active"
                                        value={data.active || ""}
                                        onChange={handleChange}
                                        id=""
                                        required
                                    >
                                        <option value="active">Active</option>
                                        <option value="not-active">Not Active</option>
                                    </select>
                                </div>
                            </div>
                            {error && (
                                <span className="text-sm block text-red-500 mt-2">{error}</span>
                            )}
                            <div className="mt-4 flex items-center justify-end gap-[12px]">
                                <button
                                    className="bg-slate-300 text-textColor px-[15px]"
                                    type="button"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>
                                <button className="w-[100px]">
                                    {isLoading ? <BtnLoader /> : "Edit API"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
