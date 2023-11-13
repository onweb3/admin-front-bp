import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { PageLoader, Pagination } from "../../components";
import axios from "../../axios";
import { formatDate } from "../../utils";

export default function ConfirmedQuotationsListPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [quotations, setQuotations] = useState([]);
    const [filters, setFilters] = useState({
        dateFrom: "",
        dateTo: "",
        quotationNumber: "",
        skip: 0,
        limit: 10,
        totalQuotations: 0,
    });

    const { jwtToken } = useSelector((state) => state.admin);
    const navigate = useNavigate();

    const handleFilterChange = (e) => {
        setFilters((prev) => {
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const fetchConfirmedQuotations = async ({ ...filters }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/quotations/confirmed/all?skip=${filters.skip}&limit=${filters.limit}&dateFrom=${filters.dateFrom}&dateTo=${filters.dateTo}&quotationNumber=${filters.quotationNumber}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setQuotations(response?.data?.quotations);
            setFilters((prev) => {
                return { ...prev, totalQuotations: response?.data?.totalQuotations };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const clearFilters = () => {
        setFilters((prev) => {
            return {
                ...prev,
                dateFrom: "",
                dateTo: "",
                quotationNumber: "",
                skip: 0,
                limit: 10,
                totalQuotations: 0,
            };
        });
        fetchConfirmedQuotations({
            dateFrom: "",
            dateTo: "",
            quotationNumber: "",
            skip: 0,
            limit: 10,
            totalQuotations: 0,
        });
    };

    useEffect(() => {
        fetchConfirmedQuotations({ ...filters });
    }, [filters.skip]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Confirmed Quotation</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Confirmed Quotations</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Confirmed Quotation</h1>
                        <form
                            className="flex items-end justify-end gap-[10px]"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (filters.skip === 0) {
                                    fetchConfirmedQuotations({ ...filters });
                                } else {
                                    setFilters((prev) => {
                                        return { ...prev, skip: 0 };
                                    });
                                }
                            }}
                        >
                            <div>
                                <label htmlFor="">From</label>
                                <input
                                    type="date"
                                    name="dateFrom"
                                    onChange={handleFilterChange}
                                    value={filters?.dateFrom || ""}
                                />
                            </div>
                            <div>
                                <label htmlFor="">To</label>
                                <input
                                    type="date"
                                    name="dateTo"
                                    onChange={handleFilterChange}
                                    value={filters?.dateTo || ""}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Quotation Number</label>
                                <input
                                    type="number"
                                    placeholder="Search here..."
                                    name="quotationNumber"
                                    value={filters?.quotationNumber || ""}
                                    onChange={handleFilterChange}
                                />
                            </div>
                            <button className="px-3">Search</button>
                            <button
                                className="px-3 bg-grayColor"
                                type="button"
                                onClick={clearFilters}
                            >
                                Clear
                            </button>
                        </form>
                    </div>

                    {isLoading ? (
                        <PageLoader />
                    ) : quotations?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm  text-grayColor block mt-[6px]">
                                Oops.. No Confirmed Quotation Found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">Quotation Number</th>
                                        <th className="font-[500] p-3">Last Updated</th>
                                        <th className="font-[500] p-3">Agent</th>
                                        <th className="font-[500] p-3">Created By</th>
                                        <th className="font-[500] p-3">Total Amendments</th>
                                        <th className="font-[500] p-3">Status</th>
                                        <th className="font-[500] p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {quotations?.map((qtn, index) => (
                                        <tr key={index} className="bg-white border-b">
                                            <td
                                                className="py-3 px-[12px] text-blue-500 underline"
                                                onClick={() =>
                                                    navigate(`/quotations/${qtn.quotationNumber}`)
                                                }
                                            >
                                                {qtn?.quotationNumber}
                                            </td>
                                            <td className="py-3 px-[12px]">
                                                {formatDate(qtn?.updatedAt, true)}
                                            </td>
                                            <td className="py-3 px-[12px]">
                                                {qtn?.reseller ? (
                                                    <div className="">
                                                        <span className="block font-medium capitalize">
                                                            {qtn?.reseller?.name}
                                                        </span>
                                                        <span className="block">
                                                            {qtn?.reseller?.email}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    "N/A"
                                                )}
                                            </td>
                                            <td className="py-3 px-[12px]">
                                                <div className="">
                                                    {qtn.admin ? (
                                                        <>
                                                            <span className="block">
                                                                {qtn?.admin?.email}
                                                            </span>
                                                            <span className="block capitalize">
                                                                admin
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="block font-medium capitalize">
                                                                {qtn?.reseller?.name}
                                                            </span>
                                                            <span className="block">
                                                                {qtn?.reseller?.email}
                                                            </span>
                                                            <span className="block capitalize">
                                                                reseller
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-[12px]">
                                                {qtn?.totalAmendments}
                                            </td>
                                            <td className="py-3 px-[12px]">
                                                <span
                                                    className={
                                                        "text-[12px] capitalize px-3 rounded py-[2px] font-medium " +
                                                        (qtn?.status === "confirmed"
                                                            ? "text-[#0ab39c] bg-[#0ab39c1A]"
                                                            : "bg-[#f7b84b1A] text-[#f7b84b]")
                                                    }
                                                >
                                                    {qtn?.status === "confirmed"
                                                        ? "confirmed"
                                                        : "not-confirmed"}
                                                </span>
                                            </td>
                                            <td
                                                className="p-3"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {qtn?.isVoucherCreated === true ? (
                                                    <Link
                                                        to={`/vouchers/v2/${qtn?.voucherId}`}
                                                        className="text-sm text-blue-500 underline"
                                                    >
                                                        View Voucher
                                                    </Link>
                                                ) : (
                                                    <Link to={`/vouchers/v2/add?qtn=${qtn?._id}`}>
                                                        <button className="px-3 bg-orange-500">
                                                            + Create Voucher
                                                        </button>
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="p-4">
                                <Pagination
                                    limit={filters?.limit}
                                    skip={filters?.skip}
                                    total={filters?.totalQuotations}
                                    incOrDecSkip={(number) =>
                                        setFilters((prev) => {
                                            return {
                                                ...prev,
                                                skip: prev.skip + number,
                                            };
                                        })
                                    }
                                    updateSkip={(skip) =>
                                        setFilters((prev) => {
                                            return { ...prev, skip };
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
