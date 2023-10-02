import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { PageLoader, Pagination } from "../../components";
import {
    clearAllQuotationsData,
    clearQuotationsFilters,
    fetchQuotations,
    incOrDecQuotationsSkip,
    updateIsQuotationsLoading,
    updateQuotationsFilters,
    updateQuotationsSkip,
} from "../../redux/slices/quotationListSlice";
import formatDate from "../../utils/formatDate";

export default function QuotationsListPage() {
    const { filters, skip, limit, totalQuotations, quotations, isLoading } =
        useSelector((state) => state.quotationsList);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFilterChange = (e) => {
        dispatch(
            updateQuotationsFilters({
                name: e.target.name,
                value: e.target.value,
            })
        );
    };

    useEffect(() => {
        dispatch(updateIsQuotationsLoading(true));
        dispatch(fetchQuotations());
    }, [dispatch, skip, limit]);

    useEffect(() => {
        return () => {
            dispatch(clearAllQuotationsData());
        };
    }, []);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">Quotation</h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <span>Quotation</span>
                </div>
            </div>
            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium">All Quotation</h1>
                        <div className="flex items-end justify-end gap-[10px]">
                            <div>
                                <label htmlFor="">Status</label>
                                <select
                                    name="status"
                                    id=""
                                    value={filters?.status || ""}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="not-confirmed">
                                        Not Confirmed
                                    </option>
                                </select>
                            </div>
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

                            <button
                                className="px-3"
                                onClick={() => {
                                    dispatch(clearQuotationsFilters());
                                    dispatch(updateIsQuotationsLoading(true));
                                    dispatch(fetchQuotations());
                                }}
                            >
                                Clear
                            </button>
                            <button
                                className="px-3"
                                onClick={() => {
                                    dispatch(updateIsQuotationsLoading(true));
                                    dispatch(fetchQuotations());
                                }}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    {isLoading ? (
                        <PageLoader />
                    ) : quotations?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm  text-grayColor block mt-[6px]">
                                Oops.. No Quotation found
                            </span>
                        </div>
                    ) : (
                        <div>
                            <table className="w-full">
                                <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                    <tr>
                                        <th className="font-[500] p-3">
                                            Index
                                        </th>
                                        <th className="font-[500] p-3">
                                            Quotation Number
                                        </th>
                                        <th className="font-[500] p-3">Date</th>
                                        <th className="font-[500] p-3">
                                            Agent
                                        </th>
                                        <th className="font-[500] p-3">
                                            Created By
                                        </th>
                                        <th className="font-[500] p-3">
                                            Total Amendments
                                        </th>
                                        <th className="font-[500] p-3">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotations?.map((qtn, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white border-b hover:bg-gray-50 hover:cursor-pointer"
                                            onClick={() =>
                                                navigate(
                                                    `/quotations/${qtn.quotationNumber}`
                                                )
                                            }
                                        >
                                            <td className="py-3 px-[12px]">
                                                {index + 1}
                                            </td>
                                            <td className="py-3 px-[12px]">
                                                #{qtn?.quotationNumber}
                                            </td>
                                            <td className="py-3 px-[12px]">
                                                {formatDate(qtn?.updatedAt)}
                                            </td>
                                            <td className="py-3 px-[12px]">
                                                <div className="">
                                                    <span className="block font-medium">
                                                        {qtn?.reseller?.name}
                                                    </span>
                                                    <span className="block">
                                                        {qtn?.reseller?.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-[12px]">
                                                <div className="">
                                                    {qtn.admin ? (
                                                        <>
                                                            <span className="block">
                                                                {
                                                                    qtn?.admin
                                                                        ?.email
                                                                }
                                                            </span>
                                                            <span className="block">
                                                                admin
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="block font-medium">
                                                                {
                                                                    qtn
                                                                        ?.reseller
                                                                        ?.name
                                                                }
                                                            </span>
                                                            <span className="block">
                                                                {
                                                                    qtn
                                                                        ?.reseller
                                                                        ?.email
                                                                }
                                                            </span>
                                                            <span className="block">
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
                                                {qtn?.status === "confirmed"
                                                    ? "confirmed"
                                                    : "not-confirmed"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="p-4">
                                <Pagination
                                    total={totalQuotations}
                                    skip={skip}
                                    limit={limit}
                                    incOrDecSkip={(number) =>
                                        dispatch(incOrDecQuotationsSkip(number))
                                    }
                                    updateSkip={(skip) =>
                                        dispatch(updateQuotationsSkip(skip))
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
