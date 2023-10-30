import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader, MultipleSelectDropdown } from "../../components";
import { formatDate } from "../../utils";

export default function AddGuidePage() {
    const [data, setData] = useState({
        name: "",
        duration: "",
    });

    const [pricing, setPricing] = useState([]);
    const [seasons, setSeasons] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const { jwtToken } = useSelector((state) => state.admin);
    const { countries } = useSelector((state) => state.general);
    const navigate = useNavigate();

    const fetchSeasons = async () => {
        try {
            const response = await axios.get(`/season/all`, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setSeasons(response.data.seasons);
        } catch (err) {}
    };

    useEffect(() => {
        fetchSeasons();
    }, []);

    const handleChange = (e) => {
        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleAccessChange = (selectedData) => {
        setData((prev) => {
            return { ...prev, access: selectedData };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setError("");

            await axios.post(
                "/attractions/guide/add",
                { ...data, pricing },
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            setIsLoading(false);
            navigate("/attractions/guide");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };
    const addNewRow = (e) => {
        e.preventDefault();
        setPricing((prev) => [
            ...prev,
            {
                fromDate: "",
                toDate: "",
                price: "",
            },
        ]);
    };

    const deleteRow = (e, index) => {
        e.preventDefault();

        setPricing((prev) => {
            // Create a copy of the previous array without the element at the specified index
            const updatedPricing = prev.filter((_, i) => i !== index);

            return updatedPricing;
        });
    };

    function formatDate(dateString) {
        console.log(dateString, "date string");
        const date = new Date(dateString);

        console.log(date, "date");
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        console.log(formattedDate, "formatted date");
        return formattedDate;
    }

    const handleTableChange = (e, index) => {
        try {
            console.log("Table changed", e.target, index);
            setPricing((prev) => {
                const updatedPricing = [...prev]; // Create a copy of the previous state array
                updatedPricing[index] = {
                    ...updatedPricing[index], // Create a copy of the object at the specified index
                    [e.target.name]: e.target.value, // Update the specific property with the new value
                };
                return updatedPricing; // Return the updated array as the new state
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleSeasonChange = (e, index) => {
        const selectedSeason = seasons.find(
            (season) => season._id.toString() === e.target.value.toString()
        );

        if (selectedSeason) {
            setPricing((prev) => {
                const updatedPricing = [...prev]; // Create a copy of the previous state array
                updatedPricing[index] = {
                    ...updatedPricing[index], // Create a copy of the object at the specified index
                    fromDate: formatDate(selectedSeason.fromDate),
                    toDate: formatDate(selectedSeason.toDate),
                };
                return updatedPricing; // Return the updated array as the new state
            });
        }

        // setData(selectedSeason._id);
    };
    console.log(pricing, "pricing");

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">Add Guide</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/attraction/guide" className="text-textColor">
                        Guide{" "}
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
                                <label htmlFor=""> Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter  name"
                                    name="name"
                                    value={data.name || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="">Duration</label>
                                <input
                                    type="text"
                                    placeholder="Enter Duration "
                                    name="duration"
                                    value={data.duration || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>{" "}
                        <div className="overflow-x-auto pt-10">
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px]">
                                    <tr>
                                        <th className="p-2 border w-[35px]">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    className="w-[25px] h-[25px] rounded-full bg-green-500"
                                                    onClick={(e) =>
                                                        addNewRow(e)
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </th>
                                        <th className="font-[500] p-2 border">
                                            Season
                                        </th>
                                        <th className="font-[500] p-2 border">
                                            From Date
                                        </th>
                                        <th className="font-[500] p-2 border">
                                            To Date
                                        </th>

                                        <th className="font-[500] p-2 border">
                                            Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {pricing.map((price, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-tableBorderColor"
                                        >
                                            <td className="p-2 border w-[35px] min-w-[35px]">
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        className="w-[25px] h-[25px] rounded-full bg-red-500"
                                                        onClick={(e) => {
                                                            deleteRow(e, index);
                                                        }}
                                                    >
                                                        -
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-2 border w-[35px] min-w-[35px]">
                                                <select
                                                    name="country"
                                                    value={data || ""}
                                                    onChange={(e) =>
                                                        handleSeasonChange(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                    id=""
                                                    // required
                                                    className="capitalize"
                                                >
                                                    <option value="" hidden>
                                                        Select Season
                                                    </option>
                                                    {seasons?.map(
                                                        (season, index) => {
                                                            return (
                                                                <option
                                                                    value={
                                                                        season?._id
                                                                    }
                                                                    key={index}
                                                                    className="capitalize"
                                                                >
                                                                    {
                                                                        season?.name
                                                                    }
                                                                </option>
                                                            );
                                                        }
                                                    )}
                                                </select>
                                            </td>

                                            <td className="border w-[140px] min-w-[140px]">
                                                <input
                                                    type="date"
                                                    name="fromDate"
                                                    value={
                                                        formatDate(
                                                            price?.fromDate
                                                        ) || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleTableChange(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                    className="h-[100%] px-2 border-0"
                                                />
                                            </td>
                                            <td className="border w-[140px] min-w-[140px]">
                                                <input
                                                    type="date"
                                                    name="toDate"
                                                    value={
                                                        formatDate(
                                                            price?.toDate
                                                        ) || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleTableChange(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                    className="h-[100%]  px-2  border-0"
                                                />
                                            </td>
                                            <td className="border w-[100px] min-w-[100px]">
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={price?.price}
                                                    onChange={(e) =>
                                                        handleTableChange(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                    className="h-[100%] arrow-hidden p-0 px-2 border-0"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                            <button className="w-[120px]">
                                {isLoading ? <BtnLoader /> : "Add Guide"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
