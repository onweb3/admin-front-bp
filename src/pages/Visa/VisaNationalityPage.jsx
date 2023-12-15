import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "../../axios";
import { PageLoader, Pagination } from "../../components";
import VisaApplicationTable from "../../features/Visa/components/VisaApplicationTable";
import { formatDate } from "../../utils";
import AddNationalityModal from "../../features/Visa/components/AddNationalityModal";
import { MdDelete } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";

export default function B2cVisaNationalityPage() {
    const [nationalities, setNationalities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        skip: 0,
        limit: 10,
        totalVisaNationalities: 0,
        searchQuery: "",
    });
    const [error, setError] = useState("");

    const [nationalityModal, setNationalityModal] = useState({
        isOpen: false,
        isEdit: false,
    });
    const { id } = useParams();
    const { jwtToken } = useSelector((state) => state.admin);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedNationality, setSelectedNationality] = useState({});

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

    const deleteNationality = async (nationalityId) => {
        try {
            const response = await axios.delete(
                `/visa/nationality/delete/${nationalityId}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            const filteredNationality = nationalities?.filter(
                (nationality, ind) => {
                    return nationality._id !== nationalityId;
                }
            );

            setNationalities(filteredNationality);
        } catch (err) {
            setError(
                err?.response?.data?.error ||
                    "Something went wrong! try again.."
            );
            // setErrorStatus(true);
        }
    };

    const fetchNationality = async ({ skip, limit, searchQuery }) => {
        try {
            setIsLoading(true);

            const response = await axios.get(
                `/visa/nationality/all/?requestedBy=${filters.requestedBy}&skip=${skip}&limit=${limit}&searchQuery=${searchQuery}`,
                {
                    headers: { authorization: `Bearer ${jwtToken}` },
                }
            );

            console.log(response.data, "response");

            setNationalities(response.data.visaNationalities);
            setFilters((prev) => {
                return {
                    ...prev,
                    totalVisaNationalities:
                        response.data?.totalVisaNationalities,
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
        fetchNationality({ skip, limit, searchQuery });
    }, [searchParams]);

    return (
        <div>
            <div className="bg-white flex items-center justify-between gap-[10px] px-6 shadow-sm border-t py-2">
                <h1 className="font-[600] text-[15px] uppercase">
                    B2c Nationality
                </h1>
                <div className="text-sm text-grayColor">
                    <Link to="/" className="text-textColor">
                        Dashboard{" "}
                    </Link>
                    <span>{">"} </span>
                    <Link to="/visa" className="text-textColor">
                        Visa{" "}
                    </Link>
                    <span>{">"} </span>

                    <span> B2c Nationality</span>
                </div>
            </div>

            {nationalityModal?.isOpen && (
                <AddNationalityModal
                    nationalityModal={nationalityModal}
                    setNationalityModal={setNationalityModal}
                    selectedNationality={selectedNationality}
                    nationalities={nationalities}
                    setNationalities={setNationalities}
                    fetchNationality={fetchNationality}
                />
            )}

            <div className="p-6">
                <div className="bg-white rounded shadow-sm">
                    <div className="flex items-center justify-between border-b border-dashed p-4">
                        <h1 className="font-medium capitalize">
                            B2c Nationality
                        </h1>{" "}
                        <div className="flex items-center gap-[15px]">
                            <form
                                action=""
                                className="flex items-center gap-[10px]"
                            >
                                <input
                                    type="text"
                                    name="searchQuery"
                                    value={filters.searchQuery || ""}
                                    onChange={handleChange}
                                    placeholder="Search here..."
                                />

                                <button className="px-5">Search</button>
                            </form>
                            <button
                                className="px-3"
                                onClick={() => {
                                    setNationalityModal({
                                        isOpen: true,
                                        isEdit: false,
                                    });
                                    // setSelectedTerminal({
                                    //     terminalCode: "",
                                    //     terminalName: "",
                                    //     access: [],
                                    // });
                                }}
                            >
                                + Add Nationality
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div>
                            <PageLoader />
                        </div>
                    ) : !nationalities || nationalities?.length < 1 ? (
                        <div className="p-6 flex flex-col items-center">
                            <span className="text-sm text-grayColor block mt-[6px]">
                                Oops.. No Nationalities Found
                            </span>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-[#f3f6f9] text-grayColor text-[14px] text-left">
                                <tr>
                                    <th className="font-[500] p-3">Index</th>
                                    <th className="font-[500] p-3">
                                        Country Name
                                    </th>
                                    {/* <th className="font-[500] p-3">
                                            Adult Cost
                                        </th>
                                        <th className="font-[500] p-3">
                                            Child Cost
                                        </th>
                                        <th className="font-[500] p-3">
                                            Adult Markup
                                        </th> */}
                                    <th className="font-[500] p-3">B2C Visa</th>{" "}
                                    <th className="font-[500] p-3">B2B Visa</th>{" "}
                                    <th className="font-[500] p-3">
                                        Quotation Visa
                                    </th>
                                    <th className="font-[500] p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {nationalities?.map((nationality, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="border-b border-tableBorderColor"
                                        >
                                            <td className="p-3 capitalize">
                                                {index + 1}
                                            </td>
                                            <td className="p-3">
                                                {
                                                    nationality?.nationality
                                                        .countryName
                                                }
                                            </td>
                                            <td className="p-3 capitalize">
                                                {nationality?.visas?.filter(
                                                    (visa) => {
                                                        return (
                                                            visa.createdFor ===
                                                                "b2c" &&
                                                            visa.isDeleted ===
                                                                false
                                                        );
                                                    }
                                                ).length || 0}
                                            </td>
                                            <td className="p-3 capitalize">
                                                {nationality?.visas?.filter(
                                                    (visa) => {
                                                        return (
                                                            visa.createdFor ===
                                                                "b2b" &&
                                                            visa.isDeleted ===
                                                                false
                                                        );
                                                    }
                                                ).length || 0}
                                            </td>
                                            <td className="p-3 capitalize">
                                                {nationality?.visas?.filter(
                                                    (visa) => {
                                                        return (
                                                            visa.createdFor ===
                                                                "quotation" &&
                                                            visa.isDeleted ===
                                                                false
                                                        );
                                                    }
                                                ).length || 0}
                                            </td>

                                            <td className="p-3">
                                                <div className="flex gap-[10px]">
                                                    <button
                                                        className="h-auto bg-transparent text-red-500 text-xl"
                                                        onClick={() =>
                                                            deleteNationality(
                                                                nationality?._id
                                                            )
                                                        }
                                                    >
                                                        <MdDelete />
                                                    </button>
                                                    <Link
                                                        to={`/visa/nationalities/${nationality._id}/edit`}
                                                    >
                                                        <button className="h-auto bg-transparent text-green-500 text-xl">
                                                            <BiEditAlt />
                                                        </button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="p-4">
                    <Pagination
                        limit={filters?.limit}
                        skip={filters?.skip}
                        total={filters?.totalVisaNationalities}
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
