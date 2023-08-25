import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "../../components";
import {
    VisaCountrySingleRow,
    VisaTypeListSingleRow,
} from "../../features/Visa";

import axios from "../../axios";

function VisaAddPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [visaList, setVisaList] = useState([]);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalResellers: 0,
    });
    const [error, setError] = useState("");

    const { id } = useParams();
    const navigate = useNavigate();

    const { jwtToken } = useSelector((state) => state.admin);

    const [data, setData] = useState({
        visaName: "",
        visa: "",
        processingTimeFormat: "",
        processingTime: "",
        stayPeriodFormat: "",
        stayPeriod: "",
        validityTimeFormat: "",
        validity: "",
        entryType: "",
        tax: "",
        insurance: "",
        ageTo: "",
        ageFrom: "",
        visaPrice: "",
        purchaseCost: "",
    });

    const fetchVisaType = async () => {
        try {
            setIsLoading(true);

            if (id != null) {
                const response = await axios.get(`/visa/${id}/visa-type`, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });
                setData(response.data);
            }

            const response = await axios.get("/visa/all", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });
            setVisaList(response.data.visaList);
            setFilters((prev) => {
                return {
                    ...prev,
                    visaList: response.data?.visaList,
                };
            });

            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchVisaType();
    }, [filters.skip, filters.limit]);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id == null) {
                const response = await axios.post("/visa/add", data, {
                    headers: { authorization: `Bearer ${jwtToken}` },
                });
            } else {
                const {
                    _id,
                    isDeleted,
                    createdAt,
                    updatedAt,
                    __v,
                    ...dataToSend
                } = data;

                const response = await axios.patch(
                    `/visa/update/${id}/visa-type`,
                    dataToSend,
                    {
                        headers: { authorization: `Bearer ${jwtToken}` },
                    }
                );
            }

            navigate("/visa");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Visa</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/visa" className="text-textColor">
                        Visa{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>{id ? "Edit" : "Add"}</span>
                </div>
            </div>
            <div className="p-6">
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded shadow-sm">
                        <div className="flex items-center justify-between border-b border-dashed p-4">
                            <h1 className="font-medium">
                                {id ? "Edit Visa" : "Add Visa"}{" "}
                            </h1>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-3 gap-[20px]">
                                <div>
                                    <label htmlFor=""> Visa Title</label>
                                    <input
                                        type="text"
                                        name="visaName"
                                        value={data.visaName || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Destination</label>
                                    <select
                                        name="visa"
                                        value={data.visa || ""}
                                        onChange={handleChange}
                                        id=""
                                        className="capitalize"
                                        required
                                    >
                                        <option value="" hidden>
                                            Select Country
                                        </option>
                                        {visaList?.map((visaList, index) => {
                                            return (
                                                <option
                                                    value={visaList?._id}
                                                    key={index}
                                                >
                                                    {
                                                        visaList?.country
                                                            .countryName
                                                    }
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">
                                        processingTimeFormat
                                    </label>
                                    <select
                                        name="processingTimeFormat"
                                        id=""
                                        value={data.processingTimeFormat || ""}
                                        onChange={handleChange}
                                    >
                                        <option hidden>Select Entry</option>
                                        <option value="hours">Hours</option>
                                        <option value="days">Days</option>
                                        <option value="months">Months</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-[20px] mt-5">
                                <div>
                                    <label htmlFor="">processingTime</label>
                                    <input
                                        type="number"
                                        name="processingTime"
                                        onChange={handleChange}
                                        value={data.processingTime || ""}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">stayPeriodFormat</label>

                                    <select
                                        name="stayPeriodFormat"
                                        id=""
                                        value={data.stayPeriodFormat || ""}
                                        onChange={handleChange}
                                    >
                                        <option hidden>Select Entry</option>
                                        <option value="hours">Hours</option>
                                        <option value="days">Days</option>
                                        <option value="months">Months</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="">stayPeriod</label>
                                    <input
                                        type="number"
                                        name="stayPeriod"
                                        id=""
                                        onChange={handleChange}
                                        value={data.stayPeriod || ""}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-[20px] mt-5">
                                <div>
                                    <label htmlFor="">validityTimeFormat</label>

                                    <select
                                        name="validityTimeFormat"
                                        id=""
                                        value={data.validityTimeFormat || ""}
                                        onChange={handleChange}
                                    >
                                        <option hidden>Select Entry</option>
                                        <option value="hours">Hours</option>
                                        <option value="days">Days</option>
                                        <option value="months">Months</option>
                                    </select>
                                </div>
                                <>
                                    <div>
                                        <label htmlFor="">validity</label>
                                        <input
                                            name="validity"
                                            id=""
                                            type="number"
                                            onChange={handleChange}
                                            value={data.validity || ""}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="">Entry</label>
                                        <select
                                            name="entryType"
                                            id=""
                                            onChange={handleChange}
                                            value={data.entryType || ""}
                                        >
                                            <option hidden>Select Entry</option>
                                            <option value="single">
                                                Single
                                            </option>
                                            <option value="multiple">
                                                Multiple
                                            </option>
                                        </select>
                                    </div>
                                </>
                            </div>

                            <div className="grid grid-cols-3 gap-[20px] mt-5">
                                {/* <div>
                                    <label htmlFor="">TAX</label>
                                    <input
                                        type="number"
                                        name="tax"
                                        onChange={handleChange}
                                        value={data.tax || ""}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">insurance</label>
                                    <input
                                        type="number"
                                        name="insurance"
                                        onChange={handleChange}
                                        value={data.insurance || ""}
                                    />
                                </div> */}
                                {/* <div>
                  <label htmlFor="">Purchase Cost</label>
                  <input
                    type="number"
                    name="purchaseCost"
                    onChange={handleChange}
                    value={data.purchaseCost || ""}
                  />
                </div>
                <div>
                  <label htmlFor="">Visa Price</label>
                  <input
                    type="number"
                    name="visaPrice"
                    onChange={handleChange}
                    value={data.visaPrice || ""}
                  />
                </div> */}

                                <div>
                                    <label htmlFor="">Age From</label>
                                    <input
                                        type="number"
                                        name="ageFrom"
                                        onChange={handleChange}
                                        value={data.ageFrom || ""}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="">Age To</label>
                                    <input
                                        type="number"
                                        name="ageTo"
                                        onChange={handleChange}
                                        value={data.ageTo || ""}
                                    />
                                </div>

                                {/* <div className="flex items-center gap-[10px]">
                <input
                  type="checkbox"
                  className="w-[16px] h-[16px]"
                />
                <label htmlFor="" className="mb-0">
                  is Active
                </label>
              </div> */}
                                {/* <>
                <div>
                  <label htmlFor="">Stay Period</label>
                  <input
                    name="cancelBeforeTime"
                    id=""
                  />
                </div>
                <div>
                  <label htmlFor="">Processing Time</label>
                  <input
                    type="number"
                    name="cancellationFee"
                  />
                </div>
              </> */}
                            </div>
                            <div>
                                {/* <div className="my-5">
                <h1 className="text-[14px]">Descriptions</h1>
                <div className="mt-2">
                    <div className="border border-t-0">
                        <RichTextEditor
                            // getValue={(value) => {
                            //     dispatch(
                            //         setData({ name: "highlights", value })
                            //     );
                            // }}
                            // initialValue={data?.highlights || ""}
                        />
                    </div>
                </div>
            </div> */}
                                {error && (
                                    <span className="text-sm text-red-500 block mt-4">
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
                                        className="w-[100px] bg-primaryColor"
                                        type="submit"
                                    >
                                        {id ? "Edit" : "Add"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VisaAddPage;
