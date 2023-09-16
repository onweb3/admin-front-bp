import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import VisaApplicationTable from "../../features/Visa/components/VisaApplicationTable";
import { formatDate } from "../../utils";
import AddNationalityModal from "../../features/Visa/components/AddNationalityModal";
import { MdClose, MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import AddActivityPointModal from "../../features/Affiliate/components/AddActivityPointModal";
import { BsEyeFill, BsEyeSlash } from "react-icons/bs";
import { FiCheck } from "react-icons/fi";
import AffiliateRedeemRequestModal from "../../features/Affiliate/components/AfiiliateRedeemRequestModal";

export default function AffiliateRedeemRequestPage() {
    const [nationalities, setNationalities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalActivities: 0,
        searchQuery: "",
    });

    const [requests, setRequests] = useState([]);
    const [error, setError] = useState("");

    const [isModal, setIsModal] = useState(false);
    const [value, setValue] = useState("");
    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedActivity, setSelectedActivity] = useState({});

    const prevSearchParams = (e) => {
        let params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    };

    const handleChange = (e) => {
        let params = prevSearchParams();
        setSearchParams({
            ...params,
            [e.target.name]: e.target.value,
            skip: 0,
        });
    };

    const changeStatus = async ({ redeemId, value }) => {
        try {
            setIsModal(true);
            setValue(value);
        } catch (err) {}
    };

    const fetchRedeemRequest = async ({ skip, limit, searchQuery }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/affiliate/redeem/all?skip=${skip}&limit=${limit}&searchQuery=${searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );
            setRequests(response?.data?.redeemRequests);

            setFilters((prev) => {
                return {
                    ...prev,
                    totalRequests: response.data?.totalRequests,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setNationalities([]);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let skip =
            Number(searchParams.get("skip")) > 0
                ? Number(searchParams.get("skip")) - 1
                : 0;
        let limit =
            Number(searchParams.get("limit")) > 0
                ? Number(searchParams.get("limit"))
                : 10;
        let searchQuery = searchParams.get("searchQuery") || "";

        setFilters((prev) => {
            return { ...prev, skip, limit, searchQuery };
        });
        fetchRedeemRequest({ skip, limit, searchQuery });
    }, [searchParams]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    Afffiliate Redeem Request
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/affilliate" className="text-textColor">
                        Afffiliate
                    </Link>
                    <span>{">"} </span>

                    <span> Redeem </span>
                </div>
            </div>

            {/* {isModal && (
                <AddActivityPointModal
                    setIsModal={setIsModal}
                    selectedActivity={selectedActivity}
                    activities={activities}
                    setActivities={setActivities}
                />
            )} */}

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium capitalize">
                            Afffiliate Redeem Request{" "}
                        </h1>
                        <div className="flex items-center gap-[10px]">
                            <input
                                type="text"
                                placeholder="activity name..."
                                className="min-w-[200px]"
                                name="searchQuery"
                                onChange={handleChange}
                                value={filters.searchQuery || ""}
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <div>
                            <PageLoader />
                        </div>
                    ) : (
                        <>
                            {!requests || requests?.length < 1 ? (
                                <div className="p-6 flex flex-col items-center">
                                    <span className="text-sm text-sm text-grayColor block mt-[6px]">
                                        Oops.. No Requests Found
                                    </span>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                        <tr>
                                            <th className="font-[500] p-3">
                                                Index
                                            </th>
                                            <th className="font-[500] p-3">
                                                Transation Number
                                            </th>
                                            <th className="font-[500] p-3">
                                                Name
                                            </th>
                                            <th className="font-[500] p-3">
                                                Redeem Options
                                            </th>
                                            <th className="font-[500] p-3">
                                                Points
                                            </th>
                                            <th className="font-[500] p-3">
                                                Currency
                                            </th>
                                            <th className="font-[500] p-3">
                                                Fee Deduction
                                            </th>
                                            <th className="font-[500] p-3">
                                                Amount
                                            </th>
                                            <th className="font-[500] p-3">
                                                Reason
                                            </th>

                                            <th className="font-[500] p-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {requests?.map((request, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    className="border-b border-tableBorderColor"
                                                >
                                                    <td className="p-3 capitalize">
                                                        {index + 1}
                                                    </td>
                                                    <td className="p-3">
                                                        {request?.transactionNo}
                                                    </td>

                                                    <td className="p-3">
                                                        {request?.user.name}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {request?.redeemOption ||
                                                            0}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {request?.points || 0}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {request?.currency || 0}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {request?.feeDeduction ||
                                                            0}
                                                    </td>

                                                    <td className="p-3 capitalize">
                                                        {request?.amount.toFixed(
                                                            2
                                                        ) || 0}
                                                    </td>
                                                    <td className="p-3 capitalize">
                                                        {request?.reason ||
                                                            "N/A"}
                                                    </td>
                                                    {request?.status ===
                                                    "pending" ? (
                                                        <td className="p-3">
                                                            <div className="flex gap-[10px]">
                                                                <button
                                                                    className="h-auto bg-transparent text-green-500 text-lg"
                                                                    onClick={() =>
                                                                        changeStatus(
                                                                            {
                                                                                redeemId:
                                                                                    request?._id,
                                                                                value: "approved",
                                                                            }
                                                                        )
                                                                    }
                                                                >
                                                                    <FiCheck />
                                                                </button>

                                                                <button
                                                                    className="h-auto bg-transparent text-red-500 text-lg"
                                                                    onClick={() => {
                                                                        changeStatus(
                                                                            {
                                                                                redeemId:
                                                                                    request?._id,
                                                                                value: "cancelled",
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    <MdClose />
                                                                </button>

                                                                {isModal && (
                                                                    <AffiliateRedeemRequestModal
                                                                        setIsModal={
                                                                            setIsModal
                                                                        }
                                                                        redeemId={
                                                                            request?._id
                                                                        }
                                                                        value={
                                                                            value
                                                                        }
                                                                        setRequests={
                                                                            setRequests
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </td>
                                                    ) : (
                                                        <td className="p-3 capitalize">
                                                            {request?.status ||
                                                                "N/A"}
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}
                </div>
                <div className="p-4">
                    <Pagination
                        limit={filters?.limit}
                        skip={filters?.skip}
                        total={filters?.totalRequests}
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
                </div>
            </div>
        </div>
    );
}
