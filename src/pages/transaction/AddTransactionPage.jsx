import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useHandleClickOutside } from "../../hooks";

import axios from "../../axios";
import { BtnLoader, MultipleSelectDropdown } from "../../components";
import { useImageChange } from "../../hooks";
import { MdClose } from "react-icons/md";
import AddSingleSelectDropdown from "../../components/AddSingleSelectDropdown";
import AddAccountModal from "../../features/Transactions/components/AddAccountModal";
import AddTransactionCategoryModal from "../../features/Transactions/components/AddTransactionCategoryModal";

export default function AddTransactionPage({ setIsModal }) {
    const [data, setData] = useState({
        date: "",
        category: "",
        resellerId: "",
        account: "",
        resellerName: "",
        paymentProcessor: "",
        transactionType: "",
        amount: "",
        note: "",
        transactionNumber: "",
        transactionFor: "",
    });

    const categories = [
        { name: "a2a" },
        {
            name: "attraction",
        },
        { name: "flight" },
        { name: "visa" },
        { name: "insurance" },
    ];

    const paymentMethhods = ["cash-in-hand", "bank"];
    const transactionTypes = [
        "deposit",
        "withdraw",
        "deduct",
        "refund",
        "markup",
    ];

    const [transactionFor, setTransactionFor] = useState([
        { name: "b2b" },
        // { name: "b2c" },
        { name: "company" },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [transactionCategories, setTransactionCategories] = useState([]);

    const [error, setError] = useState("");
    const [apis, setApis] = useState([]);
    const [resellers, setResellers] = useState([]);
    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();
    const { image, handleImageChange, error: imageError } = useImageChange();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const wrapperRef = useRef();

    useHandleClickOutside(wrapperRef, () => setIsModal(false));

    const handleChange = (e) => {
        if (e.target.name === "transactionType") {
            setData((prev) => {
                return {
                    ...prev,
                    category: "",
                    resellerId: "",
                    resellerName: "",
                    paymentProcessor: "",
                    transactionType: "",
                    amount: "",
                    note: "",
                    transactionNumber: "",
                };
            });
        }

        setData((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsSubmitLoading(true);
            setError("");

            await axios.post("/transactions/add", data, {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setIsSubmitLoading(false);
            navigate("/transactions");
        } catch (err) {
            setError(
                err?.response?.data?.error || "Something went wrong, Try again"
            );
            setIsLoading(false);
        }
    };

    const fetchResellersData = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            setIsDropdownOpen(false);
            setSearchText(e.target.value);
            const response = await axios.get(
                `/quotations/inital/resellers?searchText=${e.target.value}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setResellers(response?.data.resellers);
            setIsDropdownOpen(true);
            setIsLoading(false);
        } catch (err) {
            setError(err?.response?.data);
            setIsLoading(false);
        }
    };

    const fetchCategoryData = async () => {
        try {
            setIsLoading(true);
            let response = await axios.get("/transactions/all/category", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setTransactionCategories(response?.data);
            setIsLoading(false);
        } catch (err) {
            setError(err?.response?.data);
            setIsLoading(false);
        }
    };

    const fetchAccountData = async () => {
        try {
            setIsLoading(true);
            let response = await axios.get("/transactions/all/account", {
                headers: { authorization: `Bearer ${jwtToken}` },
            });

            setAccounts(response?.data);

            setIsLoading(false);
        } catch (err) {
            setError(err?.response?.data);
            setIsLoading(false);
        }
    };

    const handleChangeReseller = ({ resellerId, resellerName }) => {
        try {
            setData((prev) => {
                return {
                    ...prev,
                    ["resellerId"]: resellerId,
                    ["resellerName"]: resellerName,
                };
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleSingleChange = ({ name, value }) => {
        try {
            setData((prev) => {
                return {
                    ...prev,
                    [name]: value,
                };
            });
        } catch (err) {}
    };
    useEffect(() => {
        fetchResellersData();
        fetchAccountData();
        fetchCategoryData();
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full bg-[#fff5] flex items-center justify-center z-20 ">
            <div
                ref={wrapperRef}
                className="bg-[#fff] w-full max-h-[90vh] max-w-[1000px]  shadow-[0_1rem_3rem_rgb(0_0_0_/_18%)] overflow-y-auto"
            >
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="font-medium mb-2">Add Transaction</h2>
                    <button
                        className="h-auto bg-transparent text-textColor text-xl"
                        onClick={() => setIsModal(false)}
                    >
                        <MdClose />
                    </button>
                </div>
                <div className="p-4">
                    <form action="" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="">
                                <label htmlFor="">Transaction Date</label>
                                <input
                                    type="date"
                                    placeholder="Enter Date"
                                    name="date"
                                    value={data.date || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>{" "}
                            <div>
                                <label htmlFor="">Transaction For</label>
                                <div className="">
                                    <AddSingleSelectDropdown
                                        data={transactionFor}
                                        setData={""}
                                        displayName={"name"}
                                        selectedData={data.transactionFor}
                                        setSelectedData={(value) =>
                                            handleSingleChange({
                                                name: "transactionFor",
                                                value: value,
                                            })
                                        }
                                        ComponentProp={AddAccountModal}
                                        valueName={"name"}
                                        randomIndex={"name"}
                                    />
                                </div>
                            </div>{" "}
                            {transactionFor === "company" ? (
                                <div>
                                    <label htmlFor="">Transaction Type</label>
                                    <select
                                        name="transactionType"
                                        value={data.transactionType || ""}
                                        onChange={handleChange}
                                        id=""
                                        required
                                        className="capitalize"
                                    >
                                        <option value="" hidden>
                                            Select Type
                                        </option>
                                        {transactionTypes?.map(
                                            (transactionType, index) => {
                                                return (
                                                    <option
                                                        value={transactionType}
                                                        key={index}
                                                    >
                                                        {transactionType}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="">Transaction Type</label>
                                    <select
                                        name="transactionType"
                                        value={data.transactionType || ""}
                                        onChange={handleChange}
                                        id=""
                                        required
                                        className="capitalize"
                                    >
                                        <option value="" hidden>
                                            Select Type
                                        </option>
                                        <option value="income">income</option>
                                        <option value="expense">expense</option>
                                    </select>
                                </div>
                            )}
                            <div>
                                <label htmlFor="">Payment Method</label>
                                <select
                                    name="paymentProcessor"
                                    value={data.paymentProcessor || ""}
                                    onChange={handleChange}
                                    id=""
                                    required
                                    className="capitalize"
                                >
                                    <option value="" hidden>
                                        Select Method
                                    </option>
                                    {paymentMethhods?.map((methods, index) => {
                                        return (
                                            <option value={methods} key={index}>
                                                {methods}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>{" "}
                            {data.transactionFor === "company" ? (
                                <div>
                                    <label htmlFor=""> Add Account</label>
                                    <div className="">
                                        <AddSingleSelectDropdown
                                            data={accounts}
                                            setData={setAccounts}
                                            displayName={"accountName"}
                                            selectedData={data.account}
                                            setSelectedData={(value) =>
                                                handleSingleChange({
                                                    name: "account",
                                                    value: value,
                                                })
                                            }
                                            ComponentProp={AddAccountModal}
                                            valueName={"_id"}
                                            randomIndex={"accountName"}
                                            isEdit={true}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="">
                                    <label htmlFor="">Choose Agent</label>
                                    <div className="relative w-[400px]">
                                        <>
                                            <input
                                                className=""
                                                type="string"
                                                value={data.resellerName || ""}
                                                onChange={(e) => {
                                                    fetchResellersData(e);
                                                    handleChangeReseller({
                                                        resellerName:
                                                            e.target.value,
                                                    });
                                                }}
                                                placeholder="Enter Company Name..."
                                            />

                                            {isDropdownOpen && (
                                                <div className="absolute top-[100%] left-0 right-0 bg-[#fff] max-h-[200px] overflow-y-auto shadow-lg">
                                                    {isLoading == false ? (
                                                        <>
                                                            {" "}
                                                            {resellers?.length <
                                                            1 ? (
                                                                <div className="flex items-center justify-center h-full gap-[10px] p-5">
                                                                    <span className="text-sm text-gray-500">
                                                                        No
                                                                        Company
                                                                        Found
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                resellers?.map(
                                                                    (
                                                                        reseller,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className={
                                                                                    "flex items-center gap-[10px] px-4 py-[7px] hover:bg-[#f6f6f6] cursor-pointer text-sm z-10" +
                                                                                    (data.resellerId ===
                                                                                    reseller?._id
                                                                                        ? "cursor-not-allowed"
                                                                                        : "cursor-pointer")
                                                                                }
                                                                                onClick={() => {
                                                                                    handleChangeReseller(
                                                                                        {
                                                                                            resellerId:
                                                                                                reseller._id,
                                                                                            resellerName:
                                                                                                reseller.companyName,
                                                                                        }
                                                                                    );

                                                                                    setIsDropdownOpen(
                                                                                        false
                                                                                    );
                                                                                    setSearchText(
                                                                                        reseller.companyName
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                <span className="leading-[22px]">
                                                                                    {
                                                                                        reseller?.companyName?.split(
                                                                                            "+"
                                                                                        )[0]
                                                                                    }{" "}
                                                                                    <span className="text-blue-500">
                                                                                        {reseller?.companyName?.split(
                                                                                            "+"
                                                                                        )[1] &&
                                                                                            "+ " +
                                                                                                reseller?.companyName?.split(
                                                                                                    "+"
                                                                                                )[1]}
                                                                                    </span>
                                                                                    <span className="capitalize text-gray-500">
                                                                                        {" "}
                                                                                        -{" "}
                                                                                        {
                                                                                            reseller?.agentCode
                                                                                        }{" "}
                                                                                        {
                                                                                            ""
                                                                                        }{" "}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )
                                                            )}
                                                        </>
                                                    ) : (
                                                        "Loading..."
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    </div>
                                </div>
                            )}
                            {data.transactionFor === "company" ? (
                                <div>
                                    <label htmlFor=""> Category</label>
                                    <div className="">
                                        <AddSingleSelectDropdown
                                            data={transactionCategories}
                                            setData={setTransactionCategories}
                                            displayName={"name"}
                                            selectedData={data.category}
                                            setSelectedData={(value) =>
                                                handleSingleChange({
                                                    name: "category",
                                                    value: value,
                                                })
                                            }
                                            ComponentProp={
                                                AddTransactionCategoryModal
                                            }
                                            valueName={"_id"}
                                            randomIndex={"name"}
                                            isEdit={true}
                                        />
                                    </div>
                                </div>
                            ) : (
                                data.transactionType !== "deposit" &&
                                data.transactionType !== "withdraw" &&
                                data.transactionFor !== "company" && (
                                    <div className="">
                                        <label htmlFor="">Category</label>
                                        <select
                                            name="category"
                                            value={data.category || ""}
                                            onChange={handleChange}
                                            id=""
                                            required
                                            className="capitalize"
                                        >
                                            <option value="" hidden>
                                                Select Category
                                            </option>
                                            {categories?.map(
                                                (category, index) => {
                                                    return (
                                                        <option
                                                            value={
                                                                category.name
                                                            }
                                                            key={index}
                                                        >
                                                            {category.name}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </div>
                                )
                            )}
                            <div className="">
                                <label htmlFor=""> Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={data?.amount || ""}
                                    onChange={handleChange}
                                />
                            </div>{" "}
                        </div>
                        <div className="">
                            <label htmlFor=""> Note</label>
                            <textarea
                                type="text"
                                name="note"
                                value={data?.note || ""}
                                onChange={handleChange}
                            />
                        </div>{" "}
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
                            <button className="w-[150px]">
                                {isSubmitLoading ? (
                                    <BtnLoader />
                                ) : (
                                    "Add Transaction"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
