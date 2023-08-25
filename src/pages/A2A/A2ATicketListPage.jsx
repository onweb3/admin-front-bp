import React, { useEffect } from "react";
import { useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import { A2ATicketMarkupModal } from "../../features/A2A";
import { formatDate, priceConversion } from "../../utils";
import { config } from "../../constants";

function A2ATicketListPage() {
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState([]);
    const [a2aId, setA2AId] = useState("");
    const [isMarkupModalView, setIsMarkupModalView] = useState(false);
    const [markup, setMarkup] = useState({
        markup: "",
        markuptype: "",
    });
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        onwardDate: "",
        searchInput: "",
        totalA2aTicketList: 0,
    });

    const [searchParams, setSearchParams] = useSearchParams();

    const prevSearchParams = (e) => {
        let params = {};
        for (let [key, value] of searchParams.entries()) {
            params[key] = value;
        }
        return params;
    };

    const clearFilters = () => {
        setFilters((prev) => {
            return {
                ...prev,
                skip: 0,
                limit: 10,
                onwardDate: "",
                searchInput: "",
                totalA2aTicketList: 0,
            };
        });
        fetchTickets({
            skip: 0,
            limit: 10,
            onwardDate: "",
            searchInput: "",
        });
    };

    const onModalClick = (e, id) => {
        e.preventDefault();
        setIsMarkupModalView(true);
        setA2AId(id);
    };

    const { jwtToken } = useSelector((state) => state.admin);
    const { selectedCurrency } = useSelector((state) => state.general);

    const fetchTickets = async ({ skip, limit, onwardDate, searchInput }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/a2a/ticket/all/${params.id}?skip=${skip}&limit=${limit}&onwardDate=${onwardDate}&searchInput=${searchInput}`,
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );
            setResult(response.data?.a2aTicketList);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalA2aTicketList: response?.data?.totalA2aTicketList,
                };
            });
            setIsLoading(false);
        } catch (err) {
            console.log(err);
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
        let searchInput = searchParams.get("search") || "";
        let onwardDate = searchParams.get("onwardDate") || "";

        setFilters((prev) => {
            return { ...prev, skip, limit, searchInput, onwardDate };
        });
        fetchTickets({ skip, limit, searchInput, onwardDate });
    }, [searchParams]);

    const deleteTicket = async (id) => {
        try {
            const isConfirm = window.confirm("Are you sure to delete?");
            if (isConfirm) {
                await axios.delete(`/a2a/ticket/delete/${id}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                const filteredTicket = result.filter((item) => {
                    return item?._id !== id;
                });
                setResult(filteredTicket);
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <>
            <div>
                <div>
                    <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                        <h1 className="font-[600] text-[15px] uppercase">
                            A2A
                        </h1>
                        <div className="text-sm text-grayColor">
                            <Link to="/" className="text-textColor">
                                Dashboard{" "}
                            </Link>
                            <span>{">"} </span>
                            <Link to="/a2a" className="text-textColor">
                                A2A{" "}
                            </Link>
                            <span>{">"} </span>
                            <span>
                                {params.id?.slice(0, 3)}...
                                {params.id?.slice(-3)}{" "}
                            </span>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="bg-white rounded shadow-sm">
                            <div className="flex items-center justify-between border-b border-dashed p-4">
                                <h1 className="font-medium">
                                    {result[0]?.airportToName} {""}-{""}
                                    {result[0]?.airportFromName}{" "}
                                </h1>
                                <div>
                                    <button
                                        className="w-[160px] bg-orange-500"
                                        onClick={() =>
                                            navigate(`/a2a/${params.id}/add`)
                                        }
                                    >
                                        + Add Ticket
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-[15px] justify-start p-6">
                                <form
                                    action=""
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        fetchTickets({ ...filters });
                                        let params = prevSearchParams();
                                        setSearchParams({
                                            ...params,
                                            search: filters.searchInput,
                                            onwardDate: filters.onwardDate,
                                            skip: 0,
                                        });
                                    }}
                                    className="flex items-center gap-[10px] "
                                >
                                    <div className="col-span-2">
                                        <label htmlFor="">PNR Number</label>
                                        <input
                                            type="text"
                                            placeholder="Search here..."
                                            value={filters.searchInput || ""}
                                            onChange={(e) =>
                                                setFilters((prev) => {
                                                    return {
                                                        ...prev,
                                                        searchInput:
                                                            e.target.value,
                                                    };
                                                })
                                            }
                                        />
                                    </div>
                                    <div div className="col-span-2">
                                        <label htmlFor="">Onward Date</label>
                                        <input
                                            type="date"
                                            placeholder="PNR Number..."
                                            value={filters.onwardDate || ""}
                                            onChange={(e) =>
                                                setFilters((prev) => {
                                                    return {
                                                        ...prev,
                                                        onwardDate:
                                                            e.target.value,
                                                    };
                                                })
                                            }
                                        />
                                    </div>
                                    <button className="px-5 mt-6 ">
                                        Search
                                    </button>
                                    <button
                                        className="bg-slate-200 text-textColor px-5 mt-6 "
                                        onClick={clearFilters}
                                        type="button"
                                    >
                                        Clear
                                    </button>
                                </form>
                            </div>
                            {isLoading ? (
                                <PageLoader />
                            ) : result?.length < 1 ? (
                                <div className="p-6 flex flex-col items-center">
                                    <span className="text-sm  text-grayColor block mt-[6px]">
                                        Oops.. No A2A found
                                    </span>
                                </div>
                            ) : (
                                <div>
                                    <table className="w-full">
                                        <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                            <tr>
                                                <th className="font-[500] p-3">
                                                    #
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Onward Airline
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Return Airline
                                                </th>
                                                <th className="font-[500] p-3">
                                                    PNR Number
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Seats Left
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Total Seats
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Markup
                                                </th>
                                                <th className="font-[500] p-3">
                                                    price
                                                </th>
                                                <th className="font-[500] p-3">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm text-textColor">
                                            {result?.map((item, index) => (
                                                <tr>
                                                    <td className="p-3">
                                                        {index + 1}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-2 items-center">
                                                            <div className="w-10 h-10">
                                                                <img
                                                                    src={
                                                                        config.SERVER_URL +
                                                                        item?.airlineOnwardLogo
                                                                    }
                                                                    alt=""
                                                                    className="object-contain w-full h-full"
                                                                />
                                                            </div>
                                                            <div className="">
                                                                <p className="">
                                                                    {`${item?.airlineOnward} (${item?.airlineOnwardNo})`}
                                                                </p>
                                                                <p className="flex gap-3">
                                                                    <span className="text-xs">
                                                                        {formatDate(
                                                                            item?.onwardDate
                                                                        )}
                                                                    </span>
                                                                    <span className="text-xs">
                                                                        {`${item?.takeOffTimeOnward} - ${item?.landingTimeOnward}`}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex gap-2 items-center">
                                                            <div className="w-10 h-10">
                                                                <img
                                                                    src={
                                                                        config.SERVER_URL +
                                                                        item?.airlineReturnLogo
                                                                    }
                                                                    alt=""
                                                                    className="object-contain w-full h-full"
                                                                />
                                                            </div>
                                                            <div className="">
                                                                <p className="">
                                                                    {`${item?.airlineReturn} (${item?.airlineReturnNo})`}
                                                                </p>
                                                                <p className="flex gap-3">
                                                                    <span className="text-xs">
                                                                        {formatDate(
                                                                            item?.returnDate
                                                                        )}
                                                                    </span>
                                                                    <span className="text-xs">
                                                                        {`${item?.takeOffTimeReturn} - ${item?.landingTimeReturn}`}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        {item?.pnrNo}
                                                    </td>
                                                    <td className="p-3">
                                                        {item?.availableSeats}
                                                    </td>
                                                    <td className="p-3">
                                                        {item?.totalSeats}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-[10px]">
                                                            <p>
                                                                {item?.markup
                                                                    ?.markup
                                                                    ? item
                                                                          ?.markup
                                                                          ?.markup +
                                                                      (item
                                                                          ?.markup
                                                                          ?.markupType ===
                                                                      "percentage"
                                                                          ? "%"
                                                                          : " AED")
                                                                    : "N/A"}
                                                            </p>
                                                            <div
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    onModalClick(
                                                                        e,
                                                                        item._id
                                                                    );
                                                                }}
                                                            >
                                                                <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                    <BiEditAlt />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-3">
                                                        {priceConversion(
                                                            item?.price,
                                                            selectedCurrency,
                                                            true
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        {" "}
                                                        <td className="p-3">
                                                            <div className="flex items-center gap-[10px]">
                                                                <Link
                                                                    to={`quota/${item?._id}`}
                                                                >
                                                                    <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                        <AiFillEye />
                                                                    </button>
                                                                </Link>
                                                                <button
                                                                    className="h-auto bg-transparent text-red-500 text-xl"
                                                                    onClick={() =>
                                                                        deleteTicket(
                                                                            item?._id
                                                                        )
                                                                    }
                                                                >
                                                                    <MdDelete />
                                                                </button>
                                                                <Link
                                                                    to={`/a2a/${params.id}/edit/${item?._id}`}
                                                                >
                                                                    <button className="h-auto bg-transparent text-green-500 text-xl">
                                                                        <BiEditAlt />
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </td>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="p-4">
                                        <Pagination
                                            limit={filters?.limit}
                                            skip={filters?.skip}
                                            total={filters?.totalA2aTicketList}
                                            incOrDecSkip={(number) => {
                                                let params = prevSearchParams();
                                                setSearchParams({
                                                    ...params,
                                                    skip:
                                                        filters.skip +
                                                        number +
                                                        1,
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
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isMarkupModalView && (
                <A2ATicketMarkupModal
                    setIsMarkupModalView={setIsMarkupModalView}
                    setMarkup={setMarkup}
                    markup={markup}
                    a2aTicketId={a2aId}
                />
            )}
        </>
    );
}

export default A2ATicketListPage;
