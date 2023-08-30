import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "../../components";
import {
    VisaCountrySingleRow,
    VisaTypeListSingleRow,
} from "../../features/Visa";

import axios from "../../axios";

export default function AddVisaTypeNationalityPage({ selectedVisaType }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [visas, setVisas] = useState([]);
    const navigate = useNavigate();

    const [data, setData] = useState({
        visaId: selectedVisaType?.visaId || "",
        visaName: selectedVisaType?.visaName || "",
        adultCost: selectedVisaType?.adultCost || "",
        adultPrice: selectedVisaType?.adultPrice || "",
        childCost: selectedVisaType?.childCost || "",
        childPrice: selectedVisaType?.childPrice || "",
    });

    const fetchVisaTypes = async () => {
        try {
            setError("");

            const response = await axios.get(
                `/visa/nationality/visa-type/list`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setVisas(response.data.visas);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
        }
    };

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const { jwtToken } = useSelector((state) => state.admin);

    const { id, section } = useParams();

    const handleSubmit = async (e, terminalId) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            const { adultPrice, childPrice, adultCost, childCost, visaId } =
                data;

            const response = await axios.patch(
                `/visa/nationality/add`,
                {
                    adultPrice,
                    childPrice,
                    adultCost,
                    childCost,
                    visaType: visaId,
                    nationality: id,
                    section,
                },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate(`/visa/nationalities/${id}/edit`);
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVisaTypes();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Add {section} Visa Type
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/visa" className="text-textColor">
                        Nationality{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/visa" className="text-textColor">
                        VisaType{" "}
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
                                Add {section} Visa Type
                            </h1>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-3 gap-[20px]">
                                <div className="mt-4">
                                    <label htmlFor="">Visa Types</label>
                                    <select
                                        name="visaId"
                                        value={data.visaId || ""}
                                        onChange={handleChange}
                                    >
                                        <option hidden>Select Visa</option>
                                        {visas?.map((visa, index) => {
                                            return (
                                                <option
                                                    value={visa?._id}
                                                    key={index}
                                                >
                                                    {visa?.visaName} -{" "}
                                                    {visa?.visa?.name}
                                                </option>
                                            );
                                        })}{" "}
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="">Adult Price *</label>
                                    <input
                                        type="number"
                                        value={data.adultPrice || ""}
                                        name="adultPrice"
                                        onChange={handleChange}
                                        placeholder="Enter Adult Price"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="">Child Price </label>
                                    <input
                                        type="number"
                                        value={data.childPrice || ""}
                                        name="childPrice"
                                        onChange={handleChange}
                                        placeholder="Enter Child Price"
                                        required
                                    />
                                </div>{" "}
                                <div className="mt-4">
                                    <label htmlFor="">Adult Cost</label>
                                    <input
                                        type="number"
                                        value={data.adultCost || ""}
                                        name="adultCost"
                                        onChange={handleChange}
                                        placeholder="Enter Adult Cost"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="">Child Cost *</label>
                                    <input
                                        type="number"
                                        value={data.childCost || ""}
                                        name="childCost"
                                        onChange={handleChange}
                                        placeholder="Enter Child Cost"
                                        required
                                    />
                                </div>
                            </div>
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
                                    {"Add"}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
