import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "../../axios";
import { BtnLoader } from "../../components";
import { useImageChange } from "../../hooks";

export default function EditExcursionPage() {
    const [data, setData] = useState({
        excursionName: "",
        description: "",
        excursionType: "transfer",
        price1: "",
        price2: "",
        price3: "",
        price4: "",
        price5: "",
        price6: "",
        price7: "",
        price8: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { id } = useParams();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setIsLoading(true);
            console.log("tokens", jwtToken);

            await axios.post(`/quotation/excursion/add`, data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            navigate("/admin/excursions");
        } catch (err) {
            setError(
                err?.response?.data?.error || "something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchExcursion = async () => {
        try {
            setIsLoading(true);

            const { data } = await axios.get(
                `/quotation/excursion/single/${id}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            console.log(data, "data");

            setData((prev) => {
                return {
                    ...prev,
                    excursionName: data?.excursionName,
                    description: data?.description,
                    excursionType: data?.excursionType || "sic",
                    price1:
                        data?.excursionType === "sic"
                            ? data?.sicPricing?.sicPrice
                            : data?.excursionType === "ticket"
                            ? data?.ticketPricing?.adultPrice
                            : data?.excursionType === "transfer"
                            ? data?.transferPricing?.sevenSeaterPrice
                            : data?.excursionType === "regular"
                            ? data?.regularPricing?.price
                            : "",
                    price2:
                        data?.excursionType === "sic"
                            ? data?.sicPricing?.sevenSeaterPrice
                            : data?.excursionType === "ticket"
                            ? data?.ticketPricing?.childPrice
                            : data?.excursionType === "transfer"
                            ? data?.transferPricing?.fourteenSeaterPrice
                            : "",
                    price3:
                        data?.excursionType === "transfer"
                            ? data?.transferPricing?.sicPrice
                            : data?.excursionType === "ticket"
                            ? data?.ticketPricing?.sicWithTicketAdultPrice
                            : "",
                    price4:
                        data?.excursionType === "ticket"
                            ? data?.ticketPricing?.sicWithTicketChildPrice
                            : "",
                    price5:
                        data?.excursionType === "ticket"
                            ? data?.ticketPricing
                                  ?.privateTransferSevenSeaterPriceAdult
                            : "",
                    price6:
                        data?.excursionType === "ticket"
                            ? data?.ticketPricing
                                  ?.privateTransferSevenSeaterPriceChild
                            : "",
                    price7:
                        data?.excursionType === "ticket"
                            ? data?.ticketPricing
                                  ?.privateTransferFourteenSeaterPriceAdult
                            : "",
                    price8:
                        data?.excursionType === "ticket"
                            ? data?.ticketPricing
                                  ?.privateTransferFourteenSeaterPriceChild
                            : "",
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchExcursion();
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px]">EDIT EXCURSION</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/airports" className="text-textColor">
                        Excursion{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Edit</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded p-6 shadow-sm">
                    <form action="" onSubmit={submitHandler}>
                        <div className="grid grid-cols-3 gap-4 mb-5">
                            <div>
                                <label htmlFor="">Excursion</label>
                                <input
                                    type="text"
                                    placeholder="Enter name "
                                    name="excursionName"
                                    value={data.excursionName || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="input-descriptions">
                                    Excursion Type
                                </label>
                                <select
                                    className="w-full"
                                    name="excursionType"
                                    value={data.excursionType}
                                    onChange={(e) => {
                                        setData((prev) => {
                                            return {
                                                ...prev,
                                                excursionType: e.target.value,
                                                price1: "",
                                                price2: "",
                                                price3: "",
                                            };
                                        });
                                    }}
                                    required
                                >
                                    <option value={"transfer"}>Transfer</option>
                                    <option value={"ticket"}>Ticket</option>
                                    {/* <option value={"regular"}>Regular</option> */}
                                </select>
                            </div>
                        </div>
                        <div className="descriptions mb-5">
                            <label htmlFor="input-descriptions">
                                Descriptions
                            </label>
                            <textarea
                                placeholder="Enter descriptions"
                                id="input-descriptions"
                                name="description"
                                value={data?.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-5">
                            <div className="price mb-5">
                                <label htmlFor="input-price">
                                    {data.excursionType === "ticket"
                                        ? "Adult"
                                        : data.excursionType === "transfer"
                                        ? "7 Seater"
                                        : "price"}
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter price"
                                    id="input-price"
                                    name="price1"
                                    value={data.price1}
                                    onChange={handleChange}
                                    required={data.excursionType !== "transfer"}
                                />
                            </div>

                            {data?.excursionType !== "regular" && (
                                <div className="price mb-5">
                                    <label htmlFor="input-price">
                                        {data.excursionType === "ticket"
                                            ? "child"
                                            : "14 Seater "}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter price"
                                        id="input-price"
                                        name="price2"
                                        value={data.price2}
                                        onChange={handleChange}
                                        required={
                                            data.excursionType !== "transfer"
                                        }
                                    />
                                </div>
                            )}

                            {(data.excursionType === "ticket" ||
                                data.excursionType === "transfer") && (
                                <div className="price mb-5">
                                    <label htmlFor="input-price">
                                        {data.excursionType === "ticket"
                                            ? "Sic With Ticket Adult"
                                            : "SIC"}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter price"
                                        id="input-price"
                                        name="price3"
                                        value={data.price3}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {data.excursionType === "ticket" && (
                                <>
                                    <div className="price mb-5">
                                        <label htmlFor="input-price">
                                            Sic With Ticket Child
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Enter price"
                                            id="input-price"
                                            name="price4"
                                            value={data.price4}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="price mb-5">
                                        <label htmlFor="input-price">
                                            Private Transfer 7 Seater Adult
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Enter price"
                                            id="input-price"
                                            name="price5"
                                            value={data.price5}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="price mb-5">
                                        <label htmlFor="input-price">
                                            Private Transfer 7 Seater Child
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Enter price"
                                            id="input-price"
                                            name="price6"
                                            value={data.price6}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="price mb-5">
                                        <label htmlFor="input-price">
                                            Private Transfer 14 Seater Adult
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Enter price"
                                            id="input-price"
                                            name="price7"
                                            value={data.price7}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="price mb-5">
                                        <label htmlFor="input-price">
                                            Private Transfer 14 Seater Child
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Enter price"
                                            id="input-price"
                                            name="price8"
                                            value={data.price8}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </>
                            )}
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
                                {isLoading ? <BtnLoader /> : "Add Transfer"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
